import { db } from '../db.js';
import { vessels, vessel_positions } from '../schema.js';
import { eq } from 'drizzle-orm';
import WebSocket from 'ws';
import { getFlagFromMmsi } from '../flagLookup.js';
import mockAisMessages from '../mock-ais-messages.js';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
// the tool that checks "is this point inside this shape"
import { point, polygon } from '@turf/helpers';
// point() = turn a lat/lng into something Turf understands. polygon() = turn a list of corners into a shape
import { REGIONS } from '../regions.js';
// pulls in your region boxes, including the new preciseArea

const require = createRequire(import.meta.url);
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

// end of imports

const channelPolygon = polygon([REGIONS['english-channel'].preciseArea]);
// takes the 13 corner points from regions.js and turns them into an actual shape Turf can check against

function getRealRegion(lat, lng) {
    const inChannel = booleanPointInPolygon(point([lng, lat]), channelPolygon);
    return inChannel ? 'english-channel' : 'outside-region';
}

let ws;
let currentRegion;

const USE_MOCK = process.env.USE_MOCK === 'true';

const lastWriteTime = new Map();
const THROTTLE_MS = 60 * 1000;

function trimmedName(rawName) {
    if (rawName === null) return null;

    const trimmed = rawName.trim();
    return trimmed === "" ? null : trimmed;
}

async function findOrCreateVessel(name, mmsi, lat, lng) {
    let region;

    if (lat !== undefined && lng !== undefined) {
        region = getRealRegion(lat, lng);
    } else {
        region = 'unknown';
    }

    const existing = await db.select().from(vessels).where(eq(vessels.mmsi, String(mmsi)));

    if (existing.length > 0) {
        await db.update(vessels)
            .set({ region })
            .where(eq(vessels.mmsi, String(mmsi)));
        return existing[0].id;
    }

    await db.insert(vessels).values({
        name: trimmedName(name),
        mmsi: String(mmsi),
        flag: getFlagFromMmsi(mmsi),
        region,
    });
    const created = await db.select().from(vessels).where(eq(vessels.mmsi, String(mmsi)));
    return created[0].id;
}

function connectAIS(boundingBox, regionName) {
    currentRegion = regionName;
    if (ws) ws.close();

    if (!USE_MOCK) {
        ws = new WebSocket('wss://stream.aisstream.io/v0/stream');
        ws.on('open', () => {
            const subscriptionMessage = {
                APIKey: process.env.AISSTREAM_API_KEY,
                BoundingBoxes: [boundingBox],
            };
            ws.send(JSON.stringify(subscriptionMessage));
            console.log('Connected and subscribed to AIS stream');
        });
    } else {
        const { EventEmitter } = require('events');
        ws = new EventEmitter();
    }

    const seen = new Set();

    ws.on('message', async (data) => {
        // message handler
        const aisMessage = JSON.parse(data);

        if (aisMessage.MessageType === 'PositionReport') {
            const positionData = {
                mmsi: aisMessage.MetaData.MMSI,
                latitude: aisMessage.Message.PositionReport.Latitude,
                longitude: aisMessage.Message.PositionReport.Longitude,
                sog: aisMessage.Message.PositionReport.Sog,
                cog: aisMessage.Message.PositionReport.Cog,
                timestamp: aisMessage.MetaData.time_utc,
            };

            const now = Date.now();
            const lastWrite = lastWriteTime.get(positionData.mmsi);

            if (lastWrite && now - lastWrite < THROTTLE_MS) return;

            lastWriteTime.set(positionData.mmsi, now);

            const vesselId = await findOrCreateVessel(null, positionData.mmsi, positionData.latitude, positionData.longitude);

            await db.insert(vessel_positions).values({
                vessel_id: vesselId,
                lat: positionData.latitude,
                lon: positionData.longitude,
                speed: positionData.sog,
                heading: Math.round(positionData.cog),
                timestamp: USE_MOCK ?
                    new Date() :
                    new Date(positionData.timestamp),
            });

            console.log(`Saved position for MMSI ${positionData.mmsi}`);

        } else if (aisMessage.MessageType === 'ShipStaticData') {
            const staticData = {
                name: trimmedName(aisMessage.MetaData.ShipName),
                mmsi: aisMessage.MetaData.MMSI,
                imo: aisMessage.Message.ShipStaticData.ImoNumber,
                vessel_type: aisMessage.Message.ShipStaticData.Type,
                length: aisMessage.Message.ShipStaticData.Dimension.A +
                    aisMessage.Message.ShipStaticData.Dimension.B,
                width: aisMessage.Message.ShipStaticData.Dimension.C +
                    aisMessage.Message.ShipStaticData.Dimension.D
            };

            const vesselId = await findOrCreateVessel(staticData.name, staticData.mmsi);
            await db.update(vessels).set({
                name: staticData.name,
                mmsi: String(staticData.mmsi),
                imo: String(staticData.imo),
                vessel_type: String(staticData.vessel_type),
                length: staticData.length,
                width: staticData.width,
            })
                .where(eq(vessels.mmsi, String(staticData.mmsi)));
            console.log(`Updated static data for MMSI ${staticData.mmsi}`);
        };
    });

    if (!USE_MOCK) {
        ws.on('error', (err) => {
            console.error('WebSocket error:', err.message);
        });
    }

    ws.on('close', () => {
        console.log('Connection closed');
    });

    if (USE_MOCK) {
        for (const message of mockAisMessages) {
            const data = Buffer.from(JSON.stringify(message));
            ws.emit('message', data);
        }
    }
}

connectAIS([[48.0, -5.0], [52.0, 5.0]], 'english-channel');

export { connectAIS };