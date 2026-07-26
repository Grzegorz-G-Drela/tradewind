const midToFlag = { // mid = maritime identification digits (first 3 digits of the mmsi number)
    228: 'France',
    210: 'Cyprus',
    219: 'Denmark',
    235: 'United Kingdom',
    236: 'Gibraltar',
    244: 'Netherlands',
    247: 'Italy',
    255: 'Madeira',
    256: 'Malta',
    257: 'Norway',
    259: 'Norway',
    261: 'Poland',
    266: 'Sweden',
    269: 'Switzerland',
    271: 'Turkey',
    308: 'Bahamas',
    310: 'Bermuda',
    314: 'Bermuda', // UK overseas territories share ranges
    338: 'USA',
    341: 'Panama',
    352: 'Panama',
    353: 'Panama',
    354: 'Panama',
    356: 'Panama',
    357: 'Panama',
    370: 'Panama',
    371: 'Panama',
    372: 'Panama',
    373: 'Panama',
    374: 'Panama',
    477: 'Hong Kong',
    563: 'Singapore',
    636: 'Liberia',
};

function getFlagFromMmsi(mmsi) {
    const mid = mmsi.toString().slice(0, 3);
    return midToFlag[mid] || 'Unknown';
}

export default midToFlag;
export { midToFlag, getFlagFromMmsi };