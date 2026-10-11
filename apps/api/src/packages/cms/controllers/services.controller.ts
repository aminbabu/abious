import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { ServicesService } from '../services/services.service.js';
import { CreateServiceDto, UpdateServiceDto } from '../dtos/service.dto.js';

@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @AllowAnonymous()
  async getActive() {
    return this.servicesService.getActiveServices();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAll() {
    return this.servicesService.getAllServices();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() body: CreateServiceDto) {
    return this.servicesService.createService(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() body: UpdateServiceDto) {
    return this.servicesService.updateService(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}
