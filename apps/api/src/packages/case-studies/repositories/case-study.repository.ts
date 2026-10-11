import { Injectable, Inject } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import {
  caseStudies,
  type CaseStudyEntity,
  type NewCaseStudyEntity,
} from '../entities/case-study.entity.js';

@Injectable()
export class CaseStudyRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async findAllPublished(): Promise<CaseStudyEntity[]> {
    return this.db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.isPublished, true))
      .orderBy(asc(caseStudies.sortOrder));
  }

  async findAll(): Promise<CaseStudyEntity[]> {
    return this.db.select().from(caseStudies).orderBy(asc(caseStudies.sortOrder));
  }

  async findById(id: string): Promise<CaseStudyEntity | null> {
    const rows = await this.db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async create(data: NewCaseStudyEntity): Promise<CaseStudyEntity> {
    const inserted = await this.db.insert(caseStudies).values(data).returning();
    return inserted[0];
  }

  async update(
    id: string,
    data: Partial<NewCaseStudyEntity>,
  ): Promise<CaseStudyEntity | null> {
    const updated = await this.db
      .update(caseStudies)
      .set(data)
      .where(eq(caseStudies.id, id))
      .returning();
    return updated[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(caseStudies)
      .where(eq(caseStudies.id, id))
      .returning();
    return deleted.length > 0;
  }
}
