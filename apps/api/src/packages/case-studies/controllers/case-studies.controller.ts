import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { CaseStudyService } from '../services/case-study.service.js';
import {
  CreateCaseStudyDto,
  UpdateCaseStudyDto,
} from '../dtos/case-study.dto.js';

@Controller('api/case-studies')
export class CaseStudiesController {
  constructor(private readonly caseStudyService: CaseStudyService) {}

  @Get()
  @AllowAnonymous()
  async findAll() {
    return this.caseStudyService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  async findOne(@Param('id') id: string) {
    const item = await this.caseStudyService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Case study with id '${id}' not found`);
    }
    return item;
  }

  @Get(':id/:type/related')
  @AllowAnonymous()
  async findRelated(
    @Param('id') id: string,
    @Param('type') type: string,
  ) {
    return this.caseStudyService.findRelated(id, type);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() body: CreateCaseStudyDto) {
    return this.caseStudyService.create(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCaseStudyDto,
  ) {
    return this.caseStudyService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.caseStudyService.delete(id);
  }
}
