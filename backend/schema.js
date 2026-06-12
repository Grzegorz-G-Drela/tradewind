const { pgTable, serial, varchar, integer, decimal, timestamp, text } = require('drizzle-orm/pg-core')

const vessels = pgTable('vessels', {
  id: serial('id').primaryKey(),
  mmsi: varchar('mmsi', { length: 9 }).notNull(),
  name: varchar('name', { length: 255 }),
  imo: varchar('imo', { length: 10 }),
  vessel_type: varchar('vessel_type', { length: 100 }),
  flag: varchar('flag', { length: 3 }),
  length: integer('length'),
  width: integer('width')
})