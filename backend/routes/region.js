import express from 'express';
import { connectAIS } from '../adapters/aisstream.js';
import { REGIONS } from '../regions.js';

const router = express.Router();

router.post('/', (req, res) => {
    const { region } = req.body;
    const regionData = REGIONS[region];

    if (!regionData) {
        return res.status(400).json({ error: 'Unknown region'});
    }

    connectAIS(regionData.boundingBox);
    res.json({ success: true });
});

export default router;