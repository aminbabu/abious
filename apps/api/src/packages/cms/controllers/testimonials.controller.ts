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
import { TestimonialsService } from '../services/testimonials.service.js';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from '../dtos/testimonial.dto.js';

@Controller('api/testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @AllowAnonymous()
  async getPublished() {
    return this.testimonialsService.getPublishedTestimonials();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAll() {
    return this.testimonialsService.getAllTestimonials();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() body: CreateTestimonialDto) {
    return this.testimonialsService.createTestimonial(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.updateTestimonial(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.testimonialsService.deleteTestimonial(id);
  }
}
