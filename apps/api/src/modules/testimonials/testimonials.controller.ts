import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { TestimonialsService } from './testimonials.service.js';

@Controller('api/testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @AllowAnonymous()
  async findAll() {
    return this.testimonialsService.findAll();
  }
}
