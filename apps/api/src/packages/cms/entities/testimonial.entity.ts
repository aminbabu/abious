import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const testimonials = sqliteTable('testimonials', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  company: text('company').notNull(),
  avatar: text('avatar').notNull(),
  body: text('body').notNull(),
  rating: integer('rating').default(5).notNull(),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
