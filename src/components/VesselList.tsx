import { useState, useEffect } from "react";

function VesselList() {
    const [vessels, setVessels] = useState([]);
    const [loading, setLodaing] = useState(true);

    useEffect(() => {
        fetch('api/vessels')
            .then(res => res.json())
            .then(data => {
                setVessels(data);
                setLoading(false);
            });
    }, []);

    return <div>Vessel count: {vessels.length}</div>;
}

export default VesselList;