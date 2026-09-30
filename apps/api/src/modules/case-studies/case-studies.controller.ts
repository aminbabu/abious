import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CaseStudiesService } from './case-studies.service.js';

@Controller('api/case-studies')
export class CaseStudiesController {
  constructor(private readonly caseStudiesService: CaseStudiesService) {}

  @Get()
  @AllowAnonymous()
  async findAll() {
    return this.caseStudiesService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  async findOne(@Param('id') id: string) {
    const item = await this.caseStudiesService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Case study with id '${id}' not found`);
    }
    return item;
  }
}
