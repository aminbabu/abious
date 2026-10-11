import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

export const experiences = pgTable('experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  company: text('company').notNull(),
  location: text('location').notNull(),
  logo: text('logo').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const experiencePositions = pgTable('experience_positions', {
  id: uuid('id').defaultRandom().primaryKey(),
  experienceId: uuid('experience_id')
    .notNull()
    .references(() => experiences.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'), // null represents 'present'
  type: text('type').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
export type ExperiencePosition = typeof experiencePositions.$inferSelect;
export type NewExperiencePosition = typeof experiencePositions.$inferInsert;
