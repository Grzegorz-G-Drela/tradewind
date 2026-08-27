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
        <div className="h-screen flex overflow-hidden">

            <div className="p-4 w-1/3 max-w-120 flex overflow-hidden">

                <div className="flex flex-col flex-1 gap-4 overflow-hidden">
                    <div>
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
                    </div>

                    <div className="flex-1 overflow-y-auto">
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
            </div>

            <div className="flex-1">
                <VesselMap/>
            </div>
            
        </div>
    );
}

export default Home;