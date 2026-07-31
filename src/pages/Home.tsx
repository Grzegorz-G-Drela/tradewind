import { useState } from "react";
import VesselList from "../components/VesselList";

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
        <div>
            <h1>Home</h1>

            <input
                type="text"
                placeholder="Search by MMSI"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button onClick={() => setSortField(sortField === 'name' ? 'mmsi' : 'name')}>
                Sort by: {sortField}
            </button>

            <button onClick={toggleSort}>
                Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>

            <label>
                <input
                    type="checkbox"
                    checked={nameOnly}
                    onChange={(e) => setNameOnly(e.target.checked)}
                />
                Has name only
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={imoOnly}
                    onChange={(e) => setImoOnly(e.target.checked)}
                />
                Has IMO only
            </label>

            <label>
                <input
                    type='checkbox'
                    checked={hasFlag}
                    onChange={(e) => setHasFlag(e.target.checked)}
                />
                Has Flag
            </label>

            <VesselList
                sortField={sortField}
                searchTerm={searchTerm}
                sortOrder={sortOrder}
                nameOnly={nameOnly}
                imoOnly={imoOnly}
            />
        </div>
    );
}

export default Home;