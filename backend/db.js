import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

dotenv.config({ path: new URL('./.env', import.meta.url).pathname });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

export { db };