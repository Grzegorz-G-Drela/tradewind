import { useState } from "react";
import VesselList from "../components/VesselList";

function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

            <button onClick={toggleSort}>
                Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>

            <VesselList searchTerm={searchTerm} sortOrder={sortOrder} />
        </div>
    );
}

export default Home;