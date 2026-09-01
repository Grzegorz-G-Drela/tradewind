import { parse } from 'csv-parse/sync';
import fs from 'fs';
import { db } from './db.js';
import { ports } from './schema.js';

const fileContent = fs.readFileSync('./UpdatedPub150.csv', 'utf-8');

const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
});

for (const row of records) {
    console.log(JSON.stringify(row['UN/LOCODE']));
    await db.insert(ports).values({
        locode: row['UN/LOCODE'].trim().replace(' ', '').replace(/"/g, '') || null,
        name: row['Main Port Name'],
        country: row['Country Code'],
        lat: Number(row['Latitude']),
        lon: Number(row['Longitude']),
    });
}

console.log(`Seeded ${records.length} ports`);