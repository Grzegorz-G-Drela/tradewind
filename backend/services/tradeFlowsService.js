import { eq, and } from 'drizzle-orm';
import { db } from '../db.js';
import { trade_flows } from '../schema.js';
import { fetchTradeFlows } from '../adapters/comtrade.js';

export async function getTradeFlows(reportCode, period) {
    const existing = await db.select().from(trade_flows).where(
        and(
            eq(trade_flows.reporter_country, reporterCode),
            eq(trade_flows.year, period)
        )
    );

    if(existing.length > 0) return existing;

    const fresh = await fetchTradeFlows(reporterCode, period);

    for (const row of fresh) {
        await db.insert(trade_flows).values(row);
    }

    return fresh;
}

