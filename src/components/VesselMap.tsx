import { useEffect, useRef, useState } from "react";
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { RegionKey } from '../types';

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

interface Region {
    name: string;
    boundingBox: [[number, number], [number, number]];
    preciseArea: [number, number][];
}


function VesselsMap({ region, setRegion }: {
    region: RegionKey;
    setRegion: (region: RegionKey) => void;
}) {

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [ports, setPorts] = useState<Port[]>([]);

    const [regionsData, setRegionsData] = useState<Record<string, Region> | null>(null);

    const zoomLevel = useRef(1);
    const [zoomState, setZoomState] = useState(4);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [portIconsLoaded, setPortIconsLoaded] = useState(false);
    const [dockingVesselsLoaded, setDockingVesselsLoaded] = useState(false);
    const [movingVesselsLoaded, setMovingVesselsLoaded] = useState(false);



    useEffect(() => {
        function loadVessels() {
            fetch(`/api/vessels?region=${region}`)
                .then(res => res.json())
                .then(data => {
                    setVessels(data);
                });
        }
        loadVessels();
        const intervalId = setInterval(loadVessels, 3000);
        return () => clearInterval(intervalId);
    }, [region]);

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

        map.current.on('load', async () => {
            console.log('map is ready');
            setMapLoaded(true);

            const res = await fetch('/api/region');
            const regions = await res.json() as Record<string, Region>;
            setRegionsData(regions);

            const borderGeoJSON = {
                type: 'FeatureCollection',
                features: Object.entries(regions).map(([key, r]) => ({
                    type: 'Feature',
                    properties: { name: r.name, key },
                    geometry: { type: 'Polygon', coordinates: [r.preciseArea] },
                })),
            };

            if (!map.current!.getSource('region-borders')) {
                map.current!.addSource('region-borders', { type: 'geojson', data: borderGeoJSON });

                map.current!.addLayer({
                    id: 'region-borders-line',
                    type: 'line',
                    source: 'region-borders',
                    paint: {
                        'line-color': '#2F4F4F',
                        'line-width': 2,
                        'line-dasharray': [3, 2],
                    },
                });

                map.current!.addLayer({
                    id: 'region-borders-fill',
                    type: 'fill',
                    source: 'region-borders',
                    paint: {
                        'fill-color': '#2F4F4F',
                        'fill-opacity': 0,
                    }
                }, 'region-borders-line');

                map.current!.on('mouseenter', 'region-borders-fill', () => {
                    map.current!.getCanvas().style.cursor = 'pointer';
                });
                map.current!.on('mouseleave', 'region-borders-fill', () => {
                    map.current!.getCanvas().style.cursor = '';
                });
                map.current!.on('click', 'region-borders-fill', (e) => {
                    const feature = e.features![0];
                    const key = feature.properties!.key as string;
                    setRegion(key as RegionKey)
                });
            }
        });
    }, []);

    useEffect(() => {
        if (!map.current || !mapLoaded || !regionsData) return;

        const selected = regionsData[region];
        if (!selected) return;

        const bounds = selected.preciseArea.reduce(
            (b, coord) => b.extend(coord as [number, number]),
            new maplibregl.LngLatBounds(selected.preciseArea[0], selected.preciseArea[0])
        );

        map.current.fitBounds(bounds, { padding: 40, duration: 1000 });
    }, [region, regionsData, mapLoaded ]);

    useEffect(() => {
        if (!map.current || !mapLoaded || !dockingVesselsLoaded || !movingVesselsLoaded) return;

        const vesselsGeoJSON = {
            type: 'FeatureCollection',
            features: vessels.map((vessel) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [vessel.lng, vessel.lat]
                },
                properties: {
                    name: vessel.name,
                    heading: vessel.heading,
                    speed: vessel.speed,
                    status: vessel.speed < 1 ? 'docking' : 'moving',
                },
            }))
        };

        if (!map.current!.getSource('vessels-source')) {
            map.current!.addSource('vessels-source', {
                type: 'geojson',
                data: vesselsGeoJSON
            });

            map.current!.addLayer({
                id: 'vessels-layer',
                type: 'symbol',
                source: 'vessels-source',
                layout: {
                    'icon-image': ['match', ['get', 'status'],
                        'docking', 'docking-icon',
                        'moving', 'moving-icon',
                        'moving-icon'],
                    'icon-size': 0.5,
                    'icon-rotate': ['get', 'heading'],
                    'icon-rotation-alignment': 'map',
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                }
            });

            map.current.on('mouseenter', 'vessels-layer', () => {
                map.current!.getCanvas().style.cursor = 'pointer';
            });
            map.current.on('mouseleave', 'vessels-layer', () => {
                map.current!.getCanvas().style.cursor = '';
            });
            map.current.on('click', 'vessels-layer', (e) => {
                const feature = e.features![0];
                new maplibregl.Popup()
                    .setLngLat(feature.geometry.coordinates as [number, number])
                    .setHTML(
                        `<strong>${feature.properties.name}</strong>
                        <br>Heading: ${feature.properties.heading}&deg;
                        <br>Speed: ${feature.properties.speed} knots
                        <br>Status: ${feature.properties.speed < 1 ? 'Stationary' : 'Moving'}`)
                    .addTo(map.current!);
            });
        } else {
            const source = map.current!.getSource('vessels-source') as maplibregl.GeoJSONSource;
            source.setData(vesselsGeoJSON);
        }
    }, [vessels, mapLoaded, dockingVesselsLoaded, movingVesselsLoaded]);

    useEffect(() => {
        if (!map.current) return;

        const dockingSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <circle cx="10" cy="10" r="6" fill="red" opacity="0.8"/>
        </svg>`;
        const img = new Image(20, 20);
        img.onload = () => {
            if (!map.current!.hasImage('docking-icon')) {
                map.current!.addImage('docking-icon', img);
            }
            setDockingVesselsLoaded(true);
        };
        img.src = `data:image/svg+xml;base64,${btoa(dockingSVG)}`;
    }, []);

    useEffect(() => {
        if (!map.current) return;

        const movingSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <polygon points="10,2 16,18 10,14 4,18" fill="blue" opacity="0.8"/>
        </svg>`;

        const img = new Image(20, 20);
        img.onload = () => {
            if (!map.current!.hasImage('moving-icon')) {
                map.current!.addImage('moving-icon', img);
            }
            setMovingVesselsLoaded(true);
        };
        img.src = `data:image/svg+xml;base64,${btoa(movingSVG)}`;
    }, []);

    useEffect(() => {
        if (!map.current) return;
        const mapInstance = map.current;

        mapInstance.on('zoom', () => {
            zoomLevel.current = mapInstance.getZoom();
            setZoomState(mapInstance.getZoom());
        });
    }, []);

    useEffect(() => {
        if (!map.current || !mapLoaded || !portIconsLoaded) return;

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
                    'icon-size': 0.5,
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                }
            });

            map.current.on('mouseenter', 'ports-layer', () => {
                map.current!.getCanvas().style.cursor = 'pointer';
            });
            map.current.on('mouseleave', 'ports-layer', () => {
                map.current!.getCanvas().style.cursor = '';
            });
            map.current.on('click', 'ports-layer', (e) => {
                const feature = e.features![0];
                new maplibregl.Popup()
                    .setLngLat(feature.geometry.coordinates as [number, number])
                    .setHTML(`<strong>${feature.properties.name}</strong>`)
                    .addTo(map.current!);
            });
        } else {
            const source = map.current!.getSource('ports-source') as maplibregl.GeoJSONSource;
            source.setData(portsGeoJSON);
        }
    }, [ports, zoomState, mapLoaded, portIconsLoaded]);

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
            setPortIconsLoaded(true);
        };
        img.src = `data:image/svg+xml;base64,${btoa(triangleSVG)}`;
    }, []);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

export default VesselsMap;

