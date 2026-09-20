ALTER TABLE "vessels" ALTER COLUMN "flag" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "ports" ALTER COLUMN "locode" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ports" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "ports" ALTER COLUMN "country" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "vessels" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vessels" ADD COLUMN IF NOT EXISTS "region" varchar(20);--> statement-breakpoint
ALTER TABLE "trade_flows" ADD COLUMN "reporter_code" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "trade_flows" ADD COLUMN "partner_code" integer NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_positions_vessel_time" ON "vessel_positions" USING btree ("vessel_id","timestamp" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "trade_flows" DROP COLUMN "reporter_country";--> statement-breakpoint
ALTER TABLE "trade_flows" DROP COLUMN "partner_country";