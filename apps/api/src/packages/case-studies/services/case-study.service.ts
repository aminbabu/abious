import { Injectable } from '@nestjs/common';
import { CaseStudyRepository } from '../repositories/case-study.repository.js';
import type {
  CreateCaseStudyDto,
  UpdateCaseStudyDto,
} from '../dtos/case-study.dto.js';

export interface CaseStudyResponse {
  id: string;
  slug: string;
  data: {
    title: string;
    description: string;
    banner: string;
    type: string;
    liveURL?: string;
    stack: string[];
    createdAt: string;
  };
  body: string;
}

@Injectable()
export class CaseStudyService {
  constructor(private readonly caseStudyRepository: CaseStudyRepository) {}

  async findAll(): Promise<CaseStudyResponse[]> {
    const dbItems = await this.caseStudyRepository.findAllPublished();
    return dbItems.map((item) => ({
      id: item.id,
      slug: item.id,
      data: {
        title: item.title,
        description: item.description,
        banner: item.banner,
        type: item.type,
        liveURL: item.liveUrl ?? undefined,
        stack: item.stack,
        createdAt: item.createdAt.toISOString(),
      },
      body: item.body,
    }));
  }

  async findOne(id: string): Promise<CaseStudyResponse | null> {
    const all = await this.findAll();
    return all.find((item) => item.id === id || item.slug === id) ?? null;
  }

  async findRelated(id: string, type?: string): Promise<CaseStudyResponse[]> {
    const all = await this.findAll();
    const otherItems = all.filter((item) => item.id !== id && item.slug !== id);
    const normalizedType = type?.toLowerCase().trim();

    if (!normalizedType) {
      return otherItems.slice(0, 6);
    }

    const sameType = otherItems.filter(
      (item) => item.data.type?.toLowerCase().trim() === normalizedType,
    );
    const diffType = otherItems.filter(
      (item) => item.data.type?.toLowerCase().trim() !== normalizedType,
    );

    return [...sameType, ...diffType].slice(0, 6);
  }

  async create(dto: CreateCaseStudyDto) {
    return this.caseStudyRepository.create({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      banner: dto.banner,
      type: dto.type,
      liveUrl: dto.liveUrl || null,
      stack: dto.stack,
      body: dto.body,
      isPublished: dto.isPublished ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
  }

  async update(id: string, dto: UpdateCaseStudyDto) {
    return this.caseStudyRepository.update(id, dto);
  }

  async delete(id: string) {
    return this.caseStudyRepository.delete(id);
  }
}
