import { useState } from "react";
import VesselList from "../components/VesselList";

function Home() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            <h1>Home</h1>
            <input
                type="text"
                placeholder="Search by MMSI"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <VesselList searchTerm={searchTerm} />
        </div>
    );
}

export default Home;