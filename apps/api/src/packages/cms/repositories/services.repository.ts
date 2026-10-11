import { Injectable, Inject } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import { services, type NewService, type Service } from '../entities/service.entity.js';

@Injectable()
export class ServicesRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async findAllActive(): Promise<Service[]> {
    return this.db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.sortOrder));
  }

  async findAll(): Promise<Service[]> {
    return this.db.select().from(services).orderBy(asc(services.sortOrder));
  }

  async create(data: NewService): Promise<Service> {
    const inserted = await this.db.insert(services).values(data).returning();
    return inserted[0];
  }

  async update(id: string, data: Partial<NewService>): Promise<Service | null> {
    const updated = await this.db
      .update(services)
      .set(data)
      .where(eq(services.id, id))
      .returning();
    return updated[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(services)
      .where(eq(services.id, id))
      .returning();
    return deleted.length > 0;
  }
}
