import { Injectable, Inject } from '@nestjs/common';
import { desc, eq, and } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import {
  blogPosts,
  type BlogPost,
  type NewBlogPost,
} from '../entities/blog.entity.js';

@Injectable()
export class BlogRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async findAllPublished(): Promise<BlogPost[]> {
    return this.db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isDraft, false))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async findAll(): Promise<BlogPost[]> {
    return this.db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const rows = await this.db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isDraft, false)))
      .limit(1);
    return rows[0] ?? null;
  }

  async create(data: NewBlogPost): Promise<BlogPost> {
    const inserted = await this.db.insert(blogPosts).values(data).returning();
    return inserted[0];
  }

  async update(id: string, data: Partial<NewBlogPost>): Promise<BlogPost | null> {
    const updated = await this.db
      .update(blogPosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning();
    return deleted.length > 0;
  }
}
