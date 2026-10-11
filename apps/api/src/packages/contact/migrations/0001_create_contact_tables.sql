-- Migration: 0001_create_contact_tables

CREATE TABLE IF NOT EXISTS "contact_inquiries" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "is_read" BOOLEAN NOT NULL DEFAULT FALSE,
  "ip_address" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_contact_inquiries_is_read" ON "contact_inquiries"("is_read");
CREATE INDEX IF NOT EXISTS "idx_contact_inquiries_created_at" ON "contact_inquiries"("created_at" DESC);
