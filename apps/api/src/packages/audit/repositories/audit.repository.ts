import { Injectable, Inject } from '@nestjs/common';
import { and, desc, eq, SQL } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import { auditLogs, type NewAuditLog } from '../entities/audit.entity.js';
import { AuditLogQueryDto } from '../dtos/audit.dto.js';

@Injectable()
export class AuditRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async create(data: NewAuditLog) {
    const inserted = await this.db.insert(auditLogs).values(data).returning();
    return inserted[0];
  }

  async find(query: AuditLogQueryDto) {
    const conditions: SQL[] = [];
    if (query.entityType) {
      conditions.push(eq(auditLogs.entityType, query.entityType));
    }
    if (query.actorId) {
      conditions.push(eq(auditLogs.actorId, query.actorId));
    }
    if (query.action) {
      conditions.push(eq(auditLogs.action, query.action));
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const baseQuery = this.db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    if (conditions.length > 0) {
      return baseQuery.where(and(...conditions));
    }

    return baseQuery;
  }
}
