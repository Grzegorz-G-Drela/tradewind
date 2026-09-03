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

            if (isDocking) {
                customMarker = document.createElement("div");
                customMarker.style.backgroundColor = 'red';
                customMarker.style.width = '8px';
                customMarker.style.height = '8px';
                customMarker.style.borderRadius = '50%';
            }

            else {
                customMarker = document.createElement("div");
                customMarker.innerHTML = `
                <svg width="20" height="20" style="transform: rotate(${vesselDirection}deg)">
                    <polygon points="10,2 14,16 10,12 6,16" fill="blue" />
                </svg>
                `;
            }

            const newMarker = new maplibregl.Marker({ element: customMarker })
                .setLngLat([vessel.lng, vessel.lat])
                .setPopup(new maplibregl.Popup().setText(vessel.name))
                .addTo(map.current!);

            vesselMarkers.current.push(newMarker);

            console.log(typeof vessel.speed);
        });
    }, [vessels]);

    useEffect(() => {
        portMarkers.current.forEach(m => m.remove());
        portMarkers.current = [];

        ports.forEach((port) => {
            const customMarker = document.createElement("div");
            customMarker.style.backgroundColor = 'yellow';
            customMarker.style.width = '8px';
            customMarker.style.height = '8px';
            customMarker.style.borderRadius = '50%';

            const newMarker = new maplibregl.Marker({ element: customMarker })
                .setLngLat([port.lon, port.lat])
                .setPopup(new maplibregl.Popup().setText(port.name))
                .addTo(map.current!);

            portMarkers.current.push(newMarker);
        });
    }, [ports]);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

export default VesselsMap;

