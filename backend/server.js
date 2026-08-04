import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import vesselsRouter from './routes/vessels.js';
import portsRouter from './routes/ports.js';
import tradeFlowsRoutes from './routes/tradeFlows.js';
import './adapters/aisstream.js';
import regionRouter from './routes/region.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/vessels', vesselsRouter);
app.use('/api/ports', portsRouter);
app.use('/api/trade-flows', tradeFlowsRoutes);
app.use('/api/region', regionRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

