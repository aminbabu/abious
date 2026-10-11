import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import { siteSettings, type SiteSetting } from '../entities/settings.entity.js';

@Injectable()
export class SettingsRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async get(key: string): Promise<SiteSetting | null> {
    const rows = await this.db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    return rows[0] ?? null;
  }

  async getAll(): Promise<SiteSetting[]> {
    return this.db.select().from(siteSettings);
  }

  async set(key: string, value: Record<string, any>): Promise<SiteSetting> {
    const updated = await this.db
      .insert(siteSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    return updated[0];
  }
}
