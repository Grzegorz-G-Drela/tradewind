import express from 'express';
import { connectAIS } from '../adapters/aisstream.js';
import { REGIONS } from '../regions.js';

const router = express.Router();

router.post('/', (req, res) => {
    const { region } = req.body;
    const chosenRegion = REGIONS[region];

    if (!chosenRegion) {
        return res.status(400).json({ error: 'Unknown region'});
    }

    connectAIS(chosenRegion.boundingBox, region);
    res.json({ success: true });
});

export default router;