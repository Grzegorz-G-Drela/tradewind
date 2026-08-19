import { useState } from "react";
import VesselList from "../components/VesselList";
import VesselMap from "../components/VesselMap";

function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortField, setSortField] = useState<'name' | 'mmsi'>('name');
    const [nameOnly, setNameOnly] = useState<boolean>(false);
    const [imoOnly, setImoOnly] = useState<boolean>(false);
    const [hasFlag, setHasFlag] = useState(false);

    function toggleSort() {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Home</h1>

            <input
                type="text"
                placeholder="Search by MMSI"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded p-2"
            />

            <div className="flex gap-2">
                <button
                    onClick={() => setSortField(sortField === 'name' ? 'mmsi' : 'name')}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    Sort by: {sortField}
                </button>

                <button
                    onClick={toggleSort}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                </button>
            </div>

            <div className="flex gap-4">
                <label className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        checked={nameOnly}
                        onChange={(e) => setNameOnly(e.target.checked)}
                    />
                    Has name only
                </label>

                <label className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        checked={imoOnly}
                        onChange={(e) => setImoOnly(e.target.checked)}
                    />
                    Has IMO only
                </label>

                <label className="flex items-center gap-1">
                    <input
                        type='checkbox'
                        checked={hasFlag}
                        onChange={(e) => setHasFlag(e.target.checked)}
                    />
                    Has Flag
                </label>
            </div>

            <div>
                <VesselList
                    sortField={sortField}
                    searchTerm={searchTerm}
                    sortOrder={sortOrder}
                    nameOnly={nameOnly}
                    imoOnly={imoOnly}
                    hasFlag={hasFlag}
                />

                <VesselMap
                    
                />
            </div>
        </div>
    );
}

export default Home;