import { Module, DynamicModule, Global } from '@nestjs/common';
import { AuditRepository } from './repositories/audit.repository.js';
import { AuditService } from './services/audit.service.js';
import { AuditController } from './controllers/audit.controller.js';

@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditRepository, AuditService],
  exports: [AuditService, AuditRepository],
})
export class AuditModule {
  static forRoot(): DynamicModule {
    return {
      module: AuditModule,
      controllers: [AuditController],
      providers: [AuditRepository, AuditService],
      exports: [AuditService, AuditRepository],
    };
  }
}
