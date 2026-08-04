import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './adapters/aisstream.js';

// grabs the actual router built into js file
// and gives is a variable name (vesselsRouter, portsRouter, etc.) that points at it
import vesselsRouter from './routes/vessels.js';
import portsRouter from './routes/ports.js';
import tradeFlowsRouter from './routes/tradeFlows.js';
import regionRouter from './routes/region.js';

const app = express(); // app IS the Express server
app.use(cors());
app.use(express.json());

// the registration:
// Express server keeps an internal route list (array of objects)
// app.use() is the function that .push() an entry into that list
app.use('/api/vessels', vesselsRouter);
app.use('/api/ports', portsRouter);
app.use('/api/trade-flows', tradeFlowsRouter);
app.use('/api/region', regionRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

