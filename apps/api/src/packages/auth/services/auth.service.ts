import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import { users } from '../entities/auth.entity.js';

@Injectable()
export class AuthService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async getUserById(id: string) {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!result.length) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return result[0];
  }

  async updateUserRole(userId: string, role: string) {
    const updated = await this.db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updated.length) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }
    return updated[0];
  }
}
