import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { SettingsService } from '../services/settings.service.js';
import { UpdateSettingDto } from '../dtos/settings.dto.js';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  @AllowAnonymous()
  async getPublic() {
    return this.settingsService.getPublicSettings();
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAll() {
    return this.settingsService.getAllSettings();
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(@Body() body: UpdateSettingDto) {
    return this.settingsService.updateSetting(body.key, body.value);
  }
}
