ALTER TABLE "vessels" ADD COLUMN "callsign" varchar(10);--> statement-breakpoint
ALTER TABLE "vessels" ADD COLUMN "destination" varchar(30);--> statement-breakpoint
ALTER TABLE "vessels" ADD COLUMN "draught" real;