import express from 'express';
import { REGIONS } from '../regions.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(REGIONS);
})

export default router;