-- Migration: 0001_create_cms_tables

CREATE TABLE IF NOT EXISTS "services" (
  "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" INTEGER NOT NULL DEFAULT 1,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS "experiences" (
  "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  "company" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "logo" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS "experience_positions" (
  "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  "experience_id" TEXT NOT NULL REFERENCES "experiences"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "start_date" TEXT NOT NULL,
  "end_date" TEXT, -- NULL represents 'present'
  "type" TEXT NOT NULL, -- 'Full-time' | 'Freelance' | 'Contract'
  "sort_order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "avatar" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "is_published" INTEGER NOT NULL DEFAULT 1,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
