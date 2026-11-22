import { randomUUID } from 'node:crypto';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const contactInquiries = sqliteTable(
  'contact_inquiries',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject'),
    message: text('message').notNull(),
    isRead: integer('is_read', { mode: 'boolean' }).default(false).notNull(),
    ipAddress: text('ip_address'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_contact_inquiries_is_read').on(table.isRead),
    index('idx_contact_inquiries_created_at').on(table.createdAt),
  ],
);

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type NewContactInquiry = typeof contactInquiries.$inferInsert;
