import express from 'express';
import { db } from '../db.js';
import { vessel_positions, vessels } from '../schema.js';
import { desc, eq, and, gte } from 'drizzle-orm';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        // cutoff - time limit
        const cutoff = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes cutoff
        const region = req.query.region;
        const allVessels = await db
            .selectDistinctOn([vessels.id], {
                name: vessels.name,
                mmsi: vessels.mmsi,
                lat: vessel_positions.lat,
                lng: vessel_positions.lon,
            })
            .from(vessels)
            .innerJoin(vessel_positions, eq(vessels.id, vessel_positions.vessel_id))
            .where(and( // combine 2 conditions together
                eq(vessels.region, String(region)), // equals
                gte(vessel_positions.timestamp, cutoff) // gte - greater than or equal to
            ))
            .orderBy(vessels.id, desc(vessel_positions.timestamp));
        res.json(allVessels);
    } catch (error) {
        console.error('Error fetching vessels:', error.message);
        res.status(500).json({ error: 'Failed to fetch vessels' });
    }
});

router.get('/last-updated', async (req, res) => {
    try {
        const result = await db
            .select({ lastSeen: vessel_positions.timestamp })
            .from(vessel_positions)
            .orderBy(desc(vessel_positions.timestamp))
            .limit(1);
        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching last update:', error.message);
        res.status(500).json({ error: 'Failed to fetch last update' });
    }
});

export default router;