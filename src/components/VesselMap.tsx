import { useEffect, useRef, useState } from "react";
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(workerUrl);

type Vessel = {
    name: string,
    mmsi: string,
    lat: number,
    lng: number,
    speed: number,
    heading: number,
}

type Port = {
    locode: string,
    name: string,
    country: string,
    lat: number,
    lon: number,
}

function VesselsMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    const [vessels, setVessels] = useState<Vessel[]>([]);
    const vesselMarkers = useRef<maplibregl.Marker[]>([]);

    const [ports, setPorts] = useState<Port[]>([]);
    const portMarkers = useRef<maplibregl.Marker[]>([]);

    const [zoomState, setZoomState] = useState(4);
    const zoomLevel = useRef(1);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [triangleLoaded, setTriangleLoaded] = useState(false);

    let region = 'english-channel';

    useEffect(() => {
        function loadVessels() {
            fetch(`/api/vessels?region=${region}`)
                .then(res => res.json())
                .then(data => {
                    setVessels(data);
                });
        }
        const intervalId = setInterval(loadVessels, 3000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        fetch('/api/ports')
            .then(res => res.json())
            .then(data => setPorts(data));
    }, []);

    useEffect(() => {
        map.current = new maplibregl.Map({
            container: mapContainer.current!,
            style: 'https://tiles.openfreemap.org/styles/positron',
            center: [0.0, 50.0],
            zoom: 4,
        });

        map.current.on('load', () => {
            console.log('map is ready');
            setMapLoaded(true);
        });
    }, []);

    useEffect(() => {
        console.log(vessels[0]);

        vesselMarkers.current.forEach(m => m.remove());
        vesselMarkers.current = [];

        vessels.forEach((vessel) => {
            let customMarker;
            const isDocking = vessel.speed < 1;
            const vesselDirection = vessel.heading;
            const outerMarker = document.createElement("div");

            if (isDocking) {
                const size = 5 * Math.pow(1.2, zoomLevel.current / 2);
                customMarker = document.createElement("div");
                customMarker.style.backgroundColor = '#c0392b';
                customMarker.style.width = `${size}px`;
                customMarker.style.height = `${size}px`;
                customMarker.style.borderRadius = '50%';
                customMarker.style.cursor = 'pointer';
                customMarker.style.opacity = '0.6';

                outerMarker.appendChild(customMarker);
            }

            else {
                const size = 20 * Math.pow(1.2, zoomLevel.current / 2);
                customMarker = document.createElement("div");
                customMarker.innerHTML = `
                <svg width="${size}" height="${size}" viewBox="0 0 20 20" style="transform: rotate(${vesselDirection}deg)">
                    <polygon points="10,2 14,16 10,12 6,16" fill="#2c5f8a" />
                </svg>
                `;
                customMarker.style.cursor = 'pointer';
                customMarker.style.opacity = '0.6';

                outerMarker.appendChild(customMarker);
            }

            const newMarker = new maplibregl.Marker({ element: outerMarker })
                .setLngLat([vessel.lng, vessel.lat])
                .setPopup(new maplibregl.Popup().setText(vessel.name))
                .addTo(map.current!);

            vesselMarkers.current.push(newMarker);

            console.log(typeof vessel.speed);
        });
    }, [vessels]);

    useEffect(() => {
        if (!map.current) return;
        const mapInstance = map.current;

        mapInstance.on('zoom', () => {
            zoomLevel.current = mapInstance.getZoom();
            setZoomState(mapInstance.getZoom());
        });
    }, []);

    useEffect(() => {
        if (!map.current || !map.current.loaded() || !triangleLoaded) return;

        portMarkers.current.forEach(m => m.remove());
        portMarkers.current = [];

        const portsGeoJSON = {
            type: 'FeatureCollection',
            features: ports.map((port) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [port.lon, port.lat]
                },
                properties: { name: port.name }
            }))
        }

        if (!map.current!.getSource('ports-source')) {
            map.current!.addSource('ports-source', {
                type: 'geojson',
                data: portsGeoJSON
            });

            map.current!.addLayer({
                id: 'ports-layer',
                type: 'symbol',
                source: 'ports-source',
                layout: {
                    'icon-image': 'port-triangle',
                    'icon-size': 0.5
                }
            });
        } else {
            const source = map.current!.getSource('ports-source') as maplibregl.GeoJSONSource;
            source.setData(portsGeoJSON);
        }
    }, [ports, zoomState, mapLoaded, triangleLoaded]);

    useEffect(() => {
        if (!map.current) return;

        const triangleSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <polygon points="10,2 18,18 2,18" fill="black" opacity="0.6"/>
        </svg>`;

        const img = new Image(20, 20);
        img.onload = () => {
            if (!map.current!.hasImage('port-triangle')) {
                map.current!.addImage('port-triangle', img);
            }
            setTriangleLoaded(true);
        };
        img.src = `data:image/svg+xml;base64,${btoa(triangleSVG)}`;
    }, []);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

export default VesselsMap;

