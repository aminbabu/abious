import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const caseStudies = sqliteTable(
  'case_studies',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    banner: text('banner').notNull(),
    type: text('type').notNull(),
    liveUrl: text('live_url'),
    stack: text('stack', { mode: 'json' }).$type<string[]>().default([]).notNull(),
    body: text('body').notNull(),
    isPublished: integer('is_published', { mode: 'boolean' }).default(true).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_case_studies_type').on(table.type),
    index('idx_case_studies_published').on(table.isPublished),
  ],
);

export type CaseStudyEntity = typeof caseStudies.$inferSelect;
export type NewCaseStudyEntity = typeof caseStudies.$inferInsert;
