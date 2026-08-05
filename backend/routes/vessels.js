import express from 'express';
import { db } from '../db.js';
import { vessels } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const region = req.query.region;
        const allVessels = await db.select().from(vessels).where(eq(vessels.region, String(region)));
        res.json(allVessels);
    } catch (error) {
        console.error('Error fetching vessels:', error.message);
        res.status(500).json({ error: 'Failed to fetch vessels' });
    }
});

export default router;