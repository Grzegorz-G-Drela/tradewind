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

const vessel_positions = pgTable('vessel_positions', {
    id: serial('id').primaryKey(),
    vessel_id: integer('vessel_id').references(() => vessels.id).notNull(),
    lat: decimal('lat', { precision: 9, scale: 6 }).notNull(),
    lon: decimal('lon', { precision: 9, scale: 6 }).notNull(),
    speed: decimal('speed', {precision: 5, scale: 2 }),
    heading: integer('heading'),
    timestamp: timestamp('timestamp').notNull()
})

const ports = pgTable('ports', {
    id: serial('id').primaryKey(),
    locode: varchar('locode', { length: 5 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    country: varchar('country', { length: 2 }).notNull(),
    lat: decimal('lat', { precision: 9, scale: 6 }),
    lon: decimal('lon', { precision: 9, scale: 6 })
})

const port_calls = pgTable('port_calls', {
    id: serial('id').primaryKey(),
    vessel_id: integer('vessel_id').references(() => vessels.id).notNull(),
    port_id: integer('port_id').references(() => ports.id).notNull(),
    arrived_at: timestamp('arrived_at').notNull(),
    departed_at: timestamp('departed_at')
})

const trade_flows = pgTable('trade_flows', {
    id: serial('id').primaryKey(),
    reporter_country: varchar('reporter_country', { length : 2 }).notNull(),
    partner_country: varchar('partner_country', { length : 2 }).notNull(),
    commodity_code: varchar('commodity_code', {length: 10 }).notNull(),
    trade_value_usd: decimal('trade_value_usd', { precision: 20, scale: 2 }),
    year: integer('year').notNull(),
    flow_type: varchar('flow_type', { length: 10 }).notNull()
})

module.exports = { vessels, vessel_positions, ports, port_calls, trade_flows}