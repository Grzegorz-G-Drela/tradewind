import VesselList from "../components/VesselList";
import VesselMap from "../components/VesselMap";
import VesselControls from "../components/VesselControls";
import { useState } from "react";


function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortField, setSortField] = useState<'name' | 'mmsi'>('name');
    const [nameOnly, setNameOnly] = useState<boolean>(false);
    const [imoOnly, setImoOnly] = useState<boolean>(false);
    const [hasFlag, setHasFlag] = useState(false);

    return (
        <div className="h-screen">
            <div className="flex h-screen max-w-8xl space-y-4">
                <div className="p-4 w-1/3 max-w-120">
                    <h1 className="pb-4 text-2xl font-bold">Home</h1>
                    <div className="h-screen gap-4">
                        <VesselControls
                            sortField={sortField}
                            searchTerm={searchTerm}
                            sortOrder={sortOrder}
                            nameOnly={nameOnly}
                            imoOnly={imoOnly}
                            hasFlag={hasFlag}

                            setSearchTerm={setSearchTerm}
                            setSortOrder={setSortOrder}
                            setSortField={setSortField}
                            setNameOnly={setNameOnly}
                            setImoOnly={setImoOnly}
                            setHasFlag={setHasFlag}
                        />
                        <VesselList
                            sortField={sortField}
                            searchTerm={searchTerm}
                            sortOrder={sortOrder}
                            nameOnly={nameOnly}
                            imoOnly={imoOnly}
                            hasFlag={hasFlag}
                        />
                    </div>
                </div>

                <div className="h-screen w-2/3 max-w-80%">
                    <VesselMap

                    />
                </div>
            </div>
        </div>
    );
}

export default Home;