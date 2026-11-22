-- Migration: 0001_create_audit_tables
CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  "actor_id" TEXT,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT,
  "old_values" TEXT,
  "new_values" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX IF NOT EXISTS "idx_audit_logs_entity" ON "audit_logs"("entity_type", "entity_id");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_actor" ON "audit_logs"("actor_id");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_created_at" ON "audit_logs"("created_at" DESC);
