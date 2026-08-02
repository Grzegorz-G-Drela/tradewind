import { useState, useEffect } from "react";

interface Vessel {
    id: number;
    mmsi: string;
    name: string | null;
    imo: string | null;
    flag: string | null;
}

function VesselList({ searchTerm, sortOrder, sortField, nameOnly, imoOnly, hasFlag }: {
    searchTerm: string;
    sortOrder: 'asc' | 'desc';
    sortField: 'name' | 'mmsi';
    nameOnly: boolean;
    imoOnly: boolean;
    hasFlag: boolean;
}) {
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState('english-channel');

    useEffect(() => {
        function loadVessels() {
            fetch('/api/vessels')
                .then(res => res.json())
                .then(data => {
                    setVessels(data);
                    setLoading(false);
                });
        }

        loadVessels();

        const intervalId = setInterval(loadVessels, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const sorted = [...vessels].sort((a, b) => {
        let result: number;
        if (sortField === 'mmsi') {
            result = a.mmsi.localeCompare(b.mmsi);
        } else if (a.name === b.name) {
            result = a.mmsi.localeCompare(b.mmsi);
        } else {
            result = (a.name ?? '').localeCompare(b.name ?? '');
        }
        return sortOrder === 'asc' ? result : -result;
    });

    return (
        <div>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value={"english-channel"}>English Channel</option>
                <option value={"malacca"}>Singapore / Malacca Strait</option>
                <option value={"hormuz"}>Strait of Hormuz</option>
                <option value={"suez"}>Suez Canal</option>
                <option value={"dover"}>Dover Strait</option>
            </select>
            {loading ? (
                <p>Loading vessels...</p>
            ) : (
                <>
                    <p>Vessel count : {vessels.length}</p>
                    <ul>
                        {sorted
                            .filter((vessel) => vessel.mmsi.includes(searchTerm))
                            .filter((vessel) => !nameOnly || vessel.name !== null)
                            .filter((vessel) => !imoOnly || vessel.imo !== null)
                            .filter((vessel) => !hasFlag || vessel.flag !== null)
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