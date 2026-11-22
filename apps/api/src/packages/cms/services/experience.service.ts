import { Injectable } from '@nestjs/common';
import {
  ExperienceRepository,
  type FullExperience,
} from '../repositories/experience.repository.js';
import type { CreateExperienceDto } from '../dtos/experience.dto.js';

@Injectable()
export class ExperienceService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async getAllExperience(): Promise<FullExperience[]> {
    return this.experienceRepository.findAll();
  }

  async createExperience(dto: CreateExperienceDto) {
    return this.experienceRepository.create(dto);
  }

  async updateExperience(id: string, dto: CreateExperienceDto) {
    return this.experienceRepository.update(id, dto);
  }

  async deleteExperience(id: string) {
    return this.experienceRepository.delete(id);
  }
}
