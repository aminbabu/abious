import { randomUUID } from 'node:crypto';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const experiences = sqliteTable('experiences', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  company: text('company').notNull(),
  location: text('location').notNull(),
  logo: text('logo').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const experiencePositions = sqliteTable('experience_positions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  experienceId: text('experience_id')
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
