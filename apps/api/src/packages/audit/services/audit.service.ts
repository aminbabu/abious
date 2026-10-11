import { Injectable, Logger } from '@nestjs/common';
import { AuditRepository } from '../repositories/audit.repository.js';
import { AuditLogQueryDto } from '../dtos/audit.dto.js';
import type { NewAuditLog } from '../entities/audit.entity.js';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly auditRepository: AuditRepository) {}

  async log(entry: NewAuditLog) {
    try {
      return await this.auditRepository.create(entry);
    } catch (err) {
      this.logger.error('Failed to write audit log', err instanceof Error ? err.stack : err);
      return null;
    }
  }

  async getLogs(query: AuditLogQueryDto) {
    return this.auditRepository.find(query);
  }
}
