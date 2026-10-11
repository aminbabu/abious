import { Injectable, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../../../db/index.js';
import type { PlatformOverviewReport, ReportFilterDto } from '../dtos/report.dto.js';

@Injectable()
export class ReportService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async getOverview(_filter?: ReportFilterDto): Promise<PlatformOverviewReport> {
    try {
      // Query table counts with safe fallbacks if some tables haven't been migrated yet
      const safeCount = async (tableName: string): Promise<number> => {
        try {
          const res = await this.db.execute(sql.raw(`SELECT count(*) as count FROM "${tableName}"`));
          return parseInt(String(res.rows[0]?.count ?? '0'), 10);
        } catch {
          return 0;
        }
      };

      const safeCountUnread = async (): Promise<number> => {
        try {
          const res = await this.db.execute(
            sql.raw(`SELECT count(*) as count FROM "contact_inquiries" WHERE is_read = false`),
          );
          return parseInt(String(res.rows[0]?.count ?? '0'), 10);
        } catch {
          return 0;
        }
      };

      const [inquiriesTotal, inquiriesUnread, usersTotal, caseStudiesTotal, servicesTotal, testimonialsTotal, experiencesTotal, postsTotal] =
        await Promise.all([
          safeCount('contact_inquiries'),
          safeCountUnread(),
          safeCount('user'),
          safeCount('case_studies'),
          safeCount('services'),
          safeCount('testimonials'),
          safeCount('experiences'),
          safeCount('blog_posts'),
        ]);

      return {
        timestamp: new Date().toISOString(),
        inquiries: {
          total: inquiriesTotal,
          unread: inquiriesUnread,
        },
        content: {
          caseStudies: caseStudiesTotal,
          services: servicesTotal,
          testimonials: testimonialsTotal,
          experiences: experiencesTotal,
          posts: postsTotal,
        },
        users: {
          total: usersTotal,
        },
      };
    } catch {
      return {
        timestamp: new Date().toISOString(),
        inquiries: { total: 0, unread: 0 },
        content: { caseStudies: 0, services: 0, testimonials: 0, experiences: 0, posts: 0 },
        users: { total: 0 },
      };
    }
  }
}
