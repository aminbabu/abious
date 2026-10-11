import { Injectable, Inject } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import {
  contactInquiries,
  type ContactInquiry,
  type NewContactInquiry,
} from '../entities/contact.entity.js';

@Injectable()
export class ContactRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async create(data: NewContactInquiry): Promise<ContactInquiry> {
    const inserted = await this.db
      .insert(contactInquiries)
      .values(data)
      .returning();
    return inserted[0];
  }

  async findAll(): Promise<ContactInquiry[]> {
    return this.db
      .select()
      .from(contactInquiries)
      .orderBy(desc(contactInquiries.createdAt));
  }

  async markAsRead(id: string): Promise<ContactInquiry | null> {
    const updated = await this.db
      .update(contactInquiries)
      .set({ isRead: true })
      .where(eq(contactInquiries.id, id))
      .returning();
    return updated[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(contactInquiries)
      .where(eq(contactInquiries.id, id))
      .returning();
    return deleted.length > 0;
  }
}
