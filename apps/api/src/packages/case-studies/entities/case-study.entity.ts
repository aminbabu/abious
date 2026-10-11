import { pgTable, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';

export const caseStudies = pgTable(
  'case_studies',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    banner: text('banner').notNull(),
    type: text('type').notNull(),
    liveUrl: text('live_url'),
    stack: jsonb('stack').$type<string[]>().default([]).notNull(),
    body: text('body').notNull(),
    isPublished: boolean('is_published').default(true).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_case_studies_type').on(table.type),
    index('idx_case_studies_published').on(table.isPublished),
  ],
);

export type CaseStudyEntity = typeof caseStudies.$inferSelect;
export type NewCaseStudyEntity = typeof caseStudies.$inferInsert;
