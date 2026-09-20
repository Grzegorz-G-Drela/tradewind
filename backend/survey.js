import WebSocket from "ws";
import 'dotenv/config';

const cells = new Map();
const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

ws.on('open', () => {
    ws.send(JSON.stringify({
        APIKey: process.env.AISSTREAM_API_KEY,
        BoundingBoxes: [[[-90, -180], [90, 180]]],
        FilterMessageTypes: ['PositionReport'],
    }));
});

ws.on('message', (raw) => {
    const p = JSON.parse(raw).Message?.PositionReport;
    if (!p) return;
    const key = `${Math.floor(p.Latitude / 2) * 2},${Math.floor(p.Longitude / 2) * 2}`;
    if (!cells.has(key)) cells.set(key, new Set());
    cells.get(key).add(p.UserID);
});

setInterval(() => {
    const top = [...cells]
        .map(([cell, ids]) => [cell, ids.size])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25);
    console.table(top);

    const nz = [...cells].filter(([cell]) => {
        const [lat, lon] = cell.split(',').map(Number);
        return lat >= -52 && lat <= -32 && lon >= 164 && lon < 180;
    });
    console.log('NZ', nz.map(([c, ids]) => [c, ids.size]));
}, 60_000);