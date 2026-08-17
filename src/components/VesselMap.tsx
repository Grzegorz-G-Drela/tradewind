import { useEffect, useRef, useState } from "react";
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Vessel = {
    name: string,
    mmsi: string,
    lat: number,
    lng: number,
}

function VesselsMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [vessels, setVessels] = useState<Vessel[]>([]);

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
        const map = new maplibregl.Map({
            container: mapContainer.current!,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [0.0, 50.0],
            zoom: 4.5,
        });

        vessels.forEach((vessel) => {
            const customMarker = document.createElement("div");
            customMarker.style.backgroundColor = 'red';
            customMarker.style.width = '4px';
            customMarker.style.height = '4px';
            customMarker.style.borderRadius = '50%';

            new maplibregl.Marker({ element: customMarker })
                .setLngLat([vessel.lng, vessel.lat])
                .setPopup(new maplibregl.Popup().setText(vessel.name))
                .addTo(map);
        });

        return () => map.remove();
    }, [vessels]);

    return <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />;
}

export default VesselsMap;

