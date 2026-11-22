import { randomUUID } from 'node:crypto';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const services = sqliteTable('services', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
