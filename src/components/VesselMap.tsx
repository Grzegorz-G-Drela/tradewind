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

function VesselsMap() {
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markers = useRef<maplibregl.Marker[]>([]);

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
        map.current = new maplibregl.Map({
            container: mapContainer.current!,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [0.0, 50.0],
            zoom: 4,
        });
    }, []);

    useEffect(() => {
        console.log(vessels[0]);
        
        markers.current.forEach(m => m.remove());
        markers.current = [];

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

            markers.current.push(newMarker);

            console.log(typeof vessel.speed);
        });
    }, [vessels]);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

export default VesselsMap;

