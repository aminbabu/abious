import { Injectable, Inject } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import {
  testimonials,
  type NewTestimonial,
  type Testimonial,
} from '../entities/testimonial.entity.js';

@Injectable()
export class TestimonialsRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async findAllPublished(): Promise<Testimonial[]> {
    return this.db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(asc(testimonials.sortOrder));
  }

  async findAll(): Promise<Testimonial[]> {
    return this.db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
  }

  async findById(id: string): Promise<Testimonial | null> {
    const rows = await this.db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async create(data: NewTestimonial): Promise<Testimonial> {
    const inserted = await this.db.insert(testimonials).values(data).returning();
    return inserted[0];
  }

  async update(id: string, data: Partial<NewTestimonial>): Promise<Testimonial | null> {
    const updated = await this.db
      .update(testimonials)
      .set(data)
      .where(eq(testimonials.id, id))
      .returning();
    return updated[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();
    return deleted.length > 0;
  }
}
