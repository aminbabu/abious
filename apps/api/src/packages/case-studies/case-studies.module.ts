import { Module, DynamicModule } from '@nestjs/common';
import { CaseStudyRepository } from './repositories/case-study.repository.js';
import { CaseStudyService } from './services/case-study.service.js';
import { CaseStudiesController } from './controllers/case-studies.controller.js';

@Module({
  controllers: [CaseStudiesController],
  providers: [CaseStudyRepository, CaseStudyService],
  exports: [CaseStudyService, CaseStudyRepository],
})
export class CaseStudiesModule {
  static forRoot(): DynamicModule {
    return {
      module: CaseStudiesModule,
      controllers: [CaseStudiesController],
      providers: [CaseStudyRepository, CaseStudyService],
      exports: [CaseStudyService, CaseStudyRepository],
    };
  }
}
