import { useEffect, useRef, useState } from "react";
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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
    const zoomLevel = useRef(1);

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
                const size = 8 * Math.pow(1.2, zoomLevel.current / 2);
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
                customMarker = document.createElement("div");
                customMarker.innerHTML = `
                <svg width="20" height="20" style="transform: rotate(${vesselDirection}deg)">
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
        });
    }, []);

    useEffect(() => {
        portMarkers.current.forEach(m => m.remove());
        portMarkers.current = [];

        ports.forEach((port) => {
            const outerMarker = document.createElement("div");

            const customMarker = document.createElement("div");
            customMarker.style.backgroundColor = '#b8860b';
            customMarker.style.width = '6px';
            customMarker.style.height = '6px';
            customMarker.style.borderRadius = '50%';
            customMarker.style.cursor = 'pointer';
            customMarker.style.opacity = '0.7';

            outerMarker.appendChild(customMarker);

            const newMarker = new maplibregl.Marker({ element: outerMarker })
                .setLngLat([port.lon, port.lat])
                .setPopup(new maplibregl.Popup().setText(port.name))
                .addTo(map.current!);

            portMarkers.current.push(newMarker);
        });
    }, [ports]);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

export default VesselsMap;

