-- Migration: 0001_create_contact_tables

CREATE TABLE IF NOT EXISTS "contact_inquiries" (
  "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "is_read" INTEGER NOT NULL DEFAULT 0,
  "ip_address" TEXT,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX IF NOT EXISTS "idx_contact_inquiries_is_read" ON "contact_inquiries"("is_read");
CREATE INDEX IF NOT EXISTS "idx_contact_inquiries_created_at" ON "contact_inquiries"("created_at" DESC);
