import VesselsMap from '../components/VesselMap';

function Map() {
    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Map</h1>
            <VesselsMap />
        </div>
    )
}

export default Map;