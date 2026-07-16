import express from 'express';
import { db } from '../db.js';
import { vessels } from '../schema.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const allVessels = await db.select().from(vessels);
        res.json(allVessels);
    } catch (error) {
        console.error('Error fetching vessels:', error.message);
        res.status(500).json({ error: 'Failed to fetch vessels' });
    }
});

export default router;