import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { AuditService } from '../services/audit.service.js';
import { AuditLogQueryDto } from '../dtos/audit.dto.js';

@Controller('api/admin/audit-logs')
@UseGuards(RolesGuard)
@Roles('admin')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getAuditLogs(@Query() query: AuditLogQueryDto) {
    return this.auditService.getLogs(query);
  }
}
