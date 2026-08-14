import { useEffect, useRef, useState } from "react";
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Vessel = {
    name: string,
    lat: number,
    lng: number,
}

function VesselsMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [vessels, setVessels] = useState<Vessel[]>([]);

    let region = 'english-channel';
    
    useEffect(() => {
        fetch(`/api/vessels?region=${region}`)
            .then(res => res.json())
            .then(data => {
                setVessels(data);
            });
    }, []);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainer.current!,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [23.9, 45.0],
            zoom: 4,
        });

        vessels.forEach((vessel) => {
            const customMarker = document.createElement("div");
            customMarker.style.backgroundColor = 'red';
            customMarker.style.width = '14px';
            customMarker.style.height = '14px';
            customMarker.style.borderRadius = '50%';

            new maplibregl.Marker({ element: customMarker })
                .setLngLat([vessel.lng, vessel.lat])
                .setPopup(new maplibregl.Popup().setText(vessel.name))
                .addTo(map);
        });

        return () => map.remove();
    }, []);

    return <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />;
}

export default VesselsMap;

