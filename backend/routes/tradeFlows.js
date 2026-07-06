import express from 'express';
import { getTradeFlows } from '../services/tradeFlowsService.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
    const { reporterCode, period } = req.query;
    const data = await getTradeFlows(reporterCode, period);
    res.json(data);
});

export default router;

