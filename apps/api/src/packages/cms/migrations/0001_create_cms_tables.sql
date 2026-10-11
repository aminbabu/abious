-- Migration: 0001_create_cms_tables

CREATE TABLE IF NOT EXISTS "services" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "experiences" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "company" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "logo" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "experience_positions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "experience_id" UUID NOT NULL REFERENCES "experiences"("id") ON DELETE CASCADE,
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
  "is_published" BOOLEAN NOT NULL DEFAULT TRUE,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
