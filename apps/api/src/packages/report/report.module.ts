import { Module, DynamicModule } from '@nestjs/common';
import { ReportService } from './services/report.service.js';
import { ReportController } from './controllers/report.controller.js';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {
  static forRoot(): DynamicModule {
    return {
      module: ReportModule,
      controllers: [ReportController],
      providers: [ReportService],
      exports: [ReportService],
    };
  }
}
