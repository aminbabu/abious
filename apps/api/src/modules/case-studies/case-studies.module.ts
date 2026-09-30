import { Module } from '@nestjs/common';
import { CaseStudiesController } from './case-studies.controller.js';
import { CaseStudiesService } from './case-studies.service.js';

@Module({
  controllers: [CaseStudiesController],
  providers: [CaseStudiesService],
  exports: [CaseStudiesService],
})
export class CaseStudiesModule {}
