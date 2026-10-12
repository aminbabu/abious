import { Injectable } from '@nestjs/common';
import {
  ExperienceRepository,
  type FullExperience,
} from '../repositories/experience.repository.js';
import type { CreateExperienceDto } from '../dtos/experience.dto.js';

const defaultExperiences: FullExperience[] = [
  {
    id: 'exp-1',
    company: 'JB Connect Ltd',
    location: 'Banani, Dhaka',
    logo: '/images/experience/jbc.svg',
    sortOrder: 1,
    createdAt: new Date(),
    positions: [
      {
        id: 'pos-1',
        experienceId: 'exp-1',
        title: 'Junior Engineer',
        startDate: '2025-11-03',
        endDate: null,
        type: 'Full-time',
        sortOrder: 1,
      },
    ],
  },
  {
    id: 'exp-2',
    company: '7x',
    location: 'Tukwila, Washington',
    logo: '/images/experience/7x.png',
    sortOrder: 2,
    createdAt: new Date(),
    positions: [
      {
        id: 'pos-2',
        experienceId: 'exp-2',
        title: 'MERN-Stack Developer',
        startDate: '2023-08-01',
        endDate: null,
        type: 'Freelance',
        sortOrder: 1,
      },
    ],
  },
  {
    id: 'exp-3',
    company: 'Notionhive',
    location: 'Uttara, Dhaka',
    logo: '/images/experience/notionhive.png',
    sortOrder: 3,
    createdAt: new Date(),
    positions: [
      {
        id: 'pos-3',
        experienceId: 'exp-3',
        title: 'Web Developer',
        startDate: '2023-07-01',
        endDate: '2024-11-30',
        type: 'Full-time',
        sortOrder: 1,
      },
    ],
  },
  {
    id: 'exp-4',
    company: 'Expert IT Solution',
    location: 'Kallianpur, Dhaka',
    logo: '/images/experience/expert.png',
    sortOrder: 4,
    createdAt: new Date(),
    positions: [
      {
        id: 'pos-4',
        experienceId: 'exp-4',
        title: 'Web Designer',
        startDate: '2022-03-01',
        endDate: '2022-06-30',
        type: 'Full-time',
        sortOrder: 1,
      },
    ],
  },
];

@Injectable()
export class ExperienceService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async getAllExperience(): Promise<FullExperience[]> {
    try {
      const items = await this.experienceRepository.findAll();
      if (items.length > 0) return items;
    } catch {
      // Fallback
    }
    return defaultExperiences;
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
