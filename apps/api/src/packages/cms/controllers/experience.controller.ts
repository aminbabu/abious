import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { ExperienceService } from '../services/experience.service.js';
import { CreateExperienceDto } from '../dtos/experience.dto.js';

@Controller('api/experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  @AllowAnonymous()
  async getAll() {
    return this.experienceService.getAllExperience();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() body: CreateExperienceDto) {
    return this.experienceService.createExperience(body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.experienceService.deleteExperience(id);
  }
}
