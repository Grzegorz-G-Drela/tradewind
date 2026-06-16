import dotenv from 'dotenv';
dotenv.config();
import WebSocket from 'ws';

const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

ws.on('open', () => {
    const subscriptionMessage = {
        APIKey: process.env.AISSTREAM_API_KEY,
        BoundingBoxes: [[[49.9, 1.4], [51.1, 2.0]]]
    };
    ws.send(JSON.stringify(subscriptionMessage));
    console.log('Connected and subscribed to AIS stream')
});

ws.on('message', (data) => {
    const aisMessage = JSON.parse(data);
    console.log(aisMessage);
})

ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
});

ws.on('close', () => {
     console.log('Connection closed');
});

