type RegionKey =
    'english-channel' |
    'malacca' |
    'new-zealand' |
    'tokyo-bay' |
    'hong-kong' |
    'vancouver';

type Vessel = {
    id: number,
    mmsi: string,
    name: string | null,
    imo: string | null,
    flag: string | null,
    lat: number,
    lng: number,
    speed: number,
    heading: number,
}

export type { RegionKey, Vessel };