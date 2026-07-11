import fetch from 'node-fetch';
import 'dotenv/config';

async function fetchTradeFlows(reporterCode, period) {
    const url = `https://comtradeapi.un.org/data/v1/get/C/A/HS?reporterCode=${reporterCode}&period=${period}&partnerCode=0&cmdCode=TOTAL&flowCode=M,X&motCode=2100`;

    const response = await fetch(url, {
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.COMTRADE_API_KEY
        }
    });
    const data = await response.json();

    return data;
}

export { fetchTradeFlows };

console.log('Key loaded:', process.env.COMTRADE_API_KEY ? 'yes' : 'no');
