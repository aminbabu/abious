import { randomUUID } from 'node:crypto';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const auditLogs = sqliteTable(
  'audit_logs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    actorId: text('actor_id'),
    action: text('action').notNull(), // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
    entityType: text('entity_type').notNull(), // 'CaseStudy', 'Setting', 'Service', etc.
    entityId: text('entity_id'),
    oldValues: text('old_values', { mode: 'json' }),
    newValues: text('new_values', { mode: 'json' }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_audit_logs_entity').on(table.entityType, table.entityId),
    index('idx_audit_logs_actor').on(table.actorId),
    index('idx_audit_logs_created_at').on(table.createdAt),
  ],
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
