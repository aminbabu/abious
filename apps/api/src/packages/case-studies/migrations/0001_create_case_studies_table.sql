-- Migration: 0001_create_case_studies_table

CREATE TABLE IF NOT EXISTS "case_studies" (
  "id" TEXT PRIMARY KEY, -- Slug identifier e.g. 'exponential-cms'
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "banner" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "live_url" TEXT,
  "stack" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "body" TEXT NOT NULL,
  "is_published" BOOLEAN NOT NULL DEFAULT TRUE,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_case_studies_type" ON "case_studies"("type");
CREATE INDEX IF NOT EXISTS "idx_case_studies_published" ON "case_studies"("is_published");
