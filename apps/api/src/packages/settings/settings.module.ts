import { Module, DynamicModule } from '@nestjs/common';
import { SettingsRepository } from './repositories/settings.repository.js';
import { SettingsService } from './services/settings.service.js';
import { SettingsController } from './controllers/settings.controller.js';

@Module({
  controllers: [SettingsController],
  providers: [SettingsRepository, SettingsService],
  exports: [SettingsService, SettingsRepository],
})
export class SettingsModule {
  static forRoot(): DynamicModule {
    return {
      module: SettingsModule,
      controllers: [SettingsController],
      providers: [SettingsRepository, SettingsService],
      exports: [SettingsService, SettingsRepository],
    };
  }
}
