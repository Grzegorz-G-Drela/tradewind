import { useState, useEffect } from "react";

interface Vessel {
    id: number;
    mmsi: string;
    name: string | null;
    imo: string | null;
}

function VesselList() {
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('api/vessels')
            .then(res => res.json())
            .then(data => {
                setVessels(data);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <p>Vessel count : {vessels.length}</p>
            <ul>
                {vessels.map((vessel) => (
                    <li key={vessel.id}>
                        {vessel.name} - {vessel.mmsi}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VesselList;