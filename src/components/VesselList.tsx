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
            fetch(`/api/vessels?region=${region}`)
                .then(res => res.json())
                .then(data => {
                    setVessels(data);
                    setLoading(false);
                });
        }
        loadVessels();
        const intervalId = setInterval(loadVessels, 3000);
        return () => clearInterval(intervalId);
    }, [region]);

    async function handleRegionChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newRegion = e.target.value;
        setRegion(newRegion);

        await fetch('/api/region', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ region: newRegion }),
        });
    }

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
        <div className="p-4 space-y-4">
            <select
                value={region}
                onChange={handleRegionChange}
                className="border border-gray-300 rounded p-2"
            >
                <option value={"english-channel"}>English Channel</option>
                <option value={"malacca"}>Singapore / Malacca Strait</option>
                <option value={"hormuz"}>Strait of Hormuz</option>
                <option value={"hormuz-wide"}>Strait of Hormuz WIDE</option>
                <option value={"suez"}>Suez Canal</option>
                <option value={"dover"}>Dover Strait</option>
            </select>
            {loading ? (
                <p className="text-gray-500">Loading vessels...</p>
            ) : (
                <>
                    <p className="text-gray-600 font-medium">Vessel count : {vessels.length}</p>
                    <ul className="space-y-2">
                        {sorted
                            .filter((vessel) => vessel.mmsi.includes(searchTerm))
                            .filter((vessel) => !nameOnly || vessel.name !== null)
                            .filter((vessel) => !imoOnly || vessel.imo !== null)
                            .filter((vessel) => !hasFlag || vessel.flag !== null)
                            .map((vessel) => (
                                <li
                                    key={vessel.id}
                                    className="p-2 border border-gray-200 rounded"
                                >
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