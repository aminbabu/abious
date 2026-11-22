import { randomUUID } from 'node:crypto';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const tags = sqliteTable('tags', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
});

export const blogPosts = sqliteTable(
  'blog_posts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    content: text('content').notNull(),
    coverImage: text('cover_image'),
    categoryId: text('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    tags: text('tags', { mode: 'json' }).$type<string[]>().default([]).notNull(),
    readTimeMinutes: integer('read_time_minutes').default(3).notNull(),
    isDraft: integer('is_draft', { mode: 'boolean' }).default(false).notNull(),
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    authorId: text('author_id'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('idx_blog_posts_slug').on(table.slug),
    index('idx_blog_posts_published').on(table.isDraft, table.publishedAt),
  ],
);

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Tag = typeof tags.$inferSelect;
