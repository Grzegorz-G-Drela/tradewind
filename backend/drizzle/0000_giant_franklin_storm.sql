CREATE TABLE "vessels" (
	"id" serial PRIMARY KEY NOT NULL,
	"mmsi" varchar(9) NOT NULL,
	"name" varchar(255),
	"imo" varchar(10),
	"vessel_type" varchar(100),
	"flag" varchar(3),
	"length" integer,
	"width" integer
);
--> statement-breakpoint
CREATE TABLE "vessel_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"vessel_id" integer NOT NULL,
	"lat" numeric(9, 6) NOT NULL,
	"lon" numeric(9, 6) NOT NULL,
	"speed" numeric(5, 2),
	"heading" integer,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ports" (
	"id" serial PRIMARY KEY NOT NULL,
	"locode" varchar(5) NOT NULL,
	"name" varchar(255) NOT NULL,
	"country" varchar(2) NOT NULL,
	"lat" numeric(9, 6),
	"lon" numeric(9, 6)
);
--> statement-breakpoint
CREATE TABLE "port_calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"vessel_id" integer NOT NULL,
	"port_id" integer NOT NULL,
	"arrived_at" timestamp NOT NULL,
	"departed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "trade_flows" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporter_country" varchar(2) NOT NULL,
	"partner_country" varchar(2) NOT NULL,
	"commodity_code" varchar(10) NOT NULL,
	"trade_value_usd" numeric(20, 2),
	"year" integer NOT NULL,
	"flow_type" varchar(10) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vessel_positions" ADD CONSTRAINT "vessel_positions_vessel_id_vessels_id_fk" FOREIGN KEY ("vessel_id") REFERENCES "public"."vessels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "port_calls" ADD CONSTRAINT "port_calls_vessel_id_vessels_id_fk" FOREIGN KEY ("vessel_id") REFERENCES "public"."vessels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "port_calls" ADD CONSTRAINT "port_calls_port_id_ports_id_fk" FOREIGN KEY ("port_id") REFERENCES "public"."ports"("id") ON DELETE no action ON UPDATE no action;