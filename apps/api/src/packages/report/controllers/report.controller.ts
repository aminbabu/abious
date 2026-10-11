import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { ReportService } from '../services/report.service.js';
import { ReportFilterDto } from '../dtos/report.dto.js';

@Controller('api/admin/reports')
@UseGuards(RolesGuard)
@Roles('admin')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('overview')
  async getOverview(@Query() filter: ReportFilterDto) {
    return this.reportService.getOverview(filter);
  }
}
