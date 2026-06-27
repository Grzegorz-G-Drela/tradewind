import { db } from '../db.js';
import { vessels, vessel_positions } from '../schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });
import WebSocket from 'ws';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const USE_MOCK = process.env.USE_MOCK === 'true';

const mockMessages = USE_MOCK
    ? require('../mock-ais-messages.cjs')
    : [];

let ws;
if (!USE_MOCK) {
    ws = new WebSocket('wss://stream.aisstream.io/v0/stream');
}

const lastWriteTime = new Map();
const THROTTLE_MS = 60 * 1000;

async function findOrCreateVessel(mmsi) {
    const existing = await db.select().from(vessels).where(eq(vessels.mmsi, String(mmsi)));

    if (existing.length > 0) {
        return existing[0].id;
    }

    await db.insert(vessels).values({ mmsi: String(mmsi) });
    const created = await db.select().from(vessels).where(eq(vessels.mmsi, String(mmsi)));
    return created[0].id;
}

if (!USE_MOCK) {
    ws.on('open', () => {
        const subscriptionMessage = {
            APIKey: process.env.AISSTREAM_API_KEY,
            BoundingBoxes: [[[48.0, -5.0], [52.0, 5.0]]]
        };
        ws.send(JSON.stringify(subscriptionMessage));
        console.log('Connected and subscribed to AIS stream');
    });
}

if (USE_MOCK) {
    const { EventEmitter } = await import('events');
    ws = new EventEmitter();
}

ws.on('message', async (data) => {
    // console.log('Message received');
    const aisMessage = JSON.parse(data);

    if (aisMessage.MessageType !== 'PositionReport') return;

    const position = {
        mmsi: aisMessage.MetaData.MMSI,
        latitude: aisMessage.Message.PositionReport.Latitude,
        longitude: aisMessage.Message.PositionReport.Longitude,
        sog: aisMessage.Message.PositionReport.Sog,
        cog: aisMessage.Message.PositionReport.Cog,
        timestamp: aisMessage.MetaData.time_utc,
    };

    const now = Date.now();
    const lastWrite = lastWriteTime.get(position.mmsi);

    if (lastWrite && now - lastWrite < THROTTLE_MS) {
        return;
    }

    lastWriteTime.set(position.mmsi, now);

    const vesselId = await findOrCreateVessel(position.mmsi);

    await db.insert(vessel_positions).values({
        vessel_id: vesselId,
        lat: position.latitude,
        lon: position.longitude,
        speed: position.sog,
        heading: Math.round(position.cog),
        timestamp: new Date(position.timestamp),
    });

    console.log(`Saved position for MMSI ${position.mmsi}`);
});

if (!USE_MOCK) {
    ws.on('error', (err) => {
        console.error('WebSocket error:', err.message);
    });
}

if (!USE_MOCK) {
    ws.on('close', () => {
        console.log('Connection closed');
    });
}

if (USE_MOCK) {
    for (const message of mockMessages) {
        const data = Buffer.from(JSON.stringify(message));
        ws.emit('message', data);
    }
}
