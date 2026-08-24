
function VesselControls({ sortField, searchTerm, sortOrder, nameOnly, imoOnly, hasFlag, setSearchTerm, setSortOrder, setSortField, setNameOnly, setImoOnly, setHasFlag }: {
    searchTerm: string;
    sortOrder: 'asc' | 'desc';
    sortField: 'name' | 'mmsi';
    nameOnly: boolean;
    imoOnly: boolean;
    hasFlag: boolean;
    setSearchTerm: Function;
    setSortOrder: Function;
    setSortField: Function;
    setNameOnly: Function;
    setImoOnly: Function;
    setHasFlag: Function;
}) {

    function toggleSort() {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }
    return (
        <div>
            <input
                type="text"
                placeholder="Search by MMSI"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 border border-gray-300 rounded p-2"
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

            <div className="p-2">
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
        </div>
    )
}

export default VesselControls;