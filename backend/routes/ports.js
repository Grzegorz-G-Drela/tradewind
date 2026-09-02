import express from 'express';
import { db } from '../db.js';
import { ports } from '../schema.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const allPorts = await db.select().from(ports);
        res.json(allPorts);
    } catch (error) {
        console.error('Error fetching ports', error.message);
        res.status(500).json({ error: 'Failed to fetch ports' });
    }});

export default router;