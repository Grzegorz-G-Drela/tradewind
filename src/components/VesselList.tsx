import { useState, useEffect } from "react";

interface Vessel {
    id: number;
    mmsi: string;
    name: string | null;
    imo: string | null;
}

function VesselList({ searchTerm, sortOrder, sortField }: { searchTerm: string; sortOrder: 'asc' | 'desc'; sortField: 'name' | 'mmsi' }) {
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/vessels')
            .then(res => res.json())
            .then(data => {
                setVessels(data);
                setLoading(false);
            });
    }, []);

    const sorted = [...vessels].sort((a, b) => {
        let result: number;
        if (sortField === 'mmsi') {
            result = a.mmsi.localeCompare(b.mmsi);
        } else {
            result = (a.name ?? '').localeCompare(b.name ?? '');
        }
        return sortOrder === 'asc' ? result : -result;
    });

    return (
        <div>
            {loading ? (
                <p>Loading vessels...</p>
            ) : (
                <>
                    <p>Vessel count : {vessels.length}</p>
                    <ul>
                        {sorted
                        .filter((vessel) => vessel.mmsi.includes(searchTerm))
                        .map((vessel) => (
                            <li key={vessel.id}>
                                {vessel.name} - {vessel.mmsi}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default VesselList;