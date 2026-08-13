import { useEffect, useRef } from "react";
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';


const vessels = [
    { name: 'shit1', lat: 45.0, lng: 23.9 },
    { name: 'shit2', lat: 42.7, lng: 23.7 },
];

function VesselsMap() {
    const mapContainer = useRef<HTMLDivElement>(null);

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

