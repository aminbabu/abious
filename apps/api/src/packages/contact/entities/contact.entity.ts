import { pgTable, text, timestamp, boolean, uuid, index } from 'drizzle-orm/pg-core';

export const contactInquiries = pgTable(
  'contact_inquiries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject'),
    message: text('message').notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    ipAddress: text('ip_address'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_contact_inquiries_is_read').on(table.isRead),
    index('idx_contact_inquiries_created_at').on(table.createdAt),
  ],
);

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type NewContactInquiry = typeof contactInquiries.$inferInsert;
