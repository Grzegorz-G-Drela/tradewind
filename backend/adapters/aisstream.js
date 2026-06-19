import { db } from '../db.js';
import { vessels, vessel_positions } from '../schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });
import WebSocket from 'ws';

const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

async function findOrCreateVessel(mmsi) {
    const existing = await db.select().from(vessels).where(eq(vessels.mmsi, String(mmsi)));

    if (existing.length > 0) {
        return existing[0].id;
    }

    await db.insert(vessels).values({ mmsi: String(mmsi) });
    const created = await db.select().from(vessels).where(eq(vessels.mmsi, String(mmsi)));
    return created[0].id;
}

ws.on('open', () => {
    const subscriptionMessage = {
        APIKey: process.env.AISSTREAM_API_KEY,
        BoundingBoxes: [[[49.9, 1.4], [51.1, 2.0]]]
    };
    ws.send(JSON.stringify(subscriptionMessage));
    console.log('Connected and subscribed to AIS stream')
});

ws.on('message', async (data) => {
    const aisMessage = JSON.parse(data);

    if (aisMessage.MessageType !== 'PositionReport') return;

    const position = {
        mmsi: aisMessage.MetaData.MMSI,
        latitude: aisMessage.Message.PositionReport.Latitude,
        longitude: aisMessage.Message.PositionReport.Longitude,
        sog: aisMessage.Message.PositionReport.Sog,
        cog: aisMessage.Message.PositionReport.Cog,
        timestamp: aisMessage.MetaData.time_utc,
    }

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

ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
});

ws.on('close', () => {
     console.log('Connection closed');
});

