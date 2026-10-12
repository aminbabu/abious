import { Module, DynamicModule } from '@nestjs/common';
import { ServicesRepository } from './repositories/services.repository.js';
import { ExperienceRepository } from './repositories/experience.repository.js';
import { TestimonialsRepository } from './repositories/testimonials.repository.js';
import { ServicesService } from './services/services.service.js';
import { ExperienceService } from './services/experience.service.js';
import { TestimonialsService } from './services/testimonials.service.js';
import { ServicesController } from './controllers/services.controller.js';
import { ExperienceController } from './controllers/experience.controller.js';
import { TestimonialsController } from './controllers/testimonials.controller.js';
import { UploadController } from './controllers/upload.controller.js';

@Module({
  controllers: [
    ServicesController,
    ExperienceController,
    TestimonialsController,
    UploadController,
  ],
  providers: [
    ServicesRepository,
    ExperienceRepository,
    TestimonialsRepository,
    ServicesService,
    ExperienceService,
    TestimonialsService,
  ],
  exports: [
    ServicesService,
    ExperienceService,
    TestimonialsService,
    ServicesRepository,
    ExperienceRepository,
    TestimonialsRepository,
  ],
})
export class CmsModule {
  static forRoot(): DynamicModule {
    return {
      module: CmsModule,
      controllers: [
        ServicesController,
        ExperienceController,
        TestimonialsController,
        UploadController,
      ],
      providers: [
        ServicesRepository,
        ExperienceRepository,
        TestimonialsRepository,
        ServicesService,
        ExperienceService,
        TestimonialsService,
      ],
      exports: [
        ServicesService,
        ExperienceService,
        TestimonialsService,
        ServicesRepository,
        ExperienceRepository,
        TestimonialsRepository,
      ],
    };
  }
}
