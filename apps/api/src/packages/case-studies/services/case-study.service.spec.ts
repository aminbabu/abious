import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CaseStudyService } from './case-study.service.js';
import { CaseStudyRepository } from '../repositories/case-study.repository.js';
import type { CaseStudyEntity } from '../entities/case-study.entity.js';

describe('CaseStudyService', () => {
  let service: CaseStudyService;
  let repo: CaseStudyRepository;

  beforeEach(() => {
    repo = {
      findAllPublished: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CaseStudyRepository;
    service = new CaseStudyService(repo);
  });

  it('should return database case studies when available', async () => {
    const mockEntities: CaseStudyEntity[] = [
      {
        id: 'test-case-study',
        title: 'Test Case Study',
        description: 'Test description',
        banner: '/images/test.png',
        type: 'Web App',
        liveUrl: 'https://example.com',
        stack: ['SolidJS', 'NestJS'],
        body: '## Detailed Case Study Body',
        isPublished: true,
        sortOrder: 1,
        createdAt: new Date('2026-01-01'),
      },
    ];

    vi.spyOn(repo, 'findAllPublished').mockResolvedValue(mockEntities);

    const result = await service.findAll();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('test-case-study');
    expect(result[0].data.title).toBe('Test Case Study');
    expect(result[0].data.type).toBe('Web App');
    expect(result[0].data.stack).toEqual(['SolidJS', 'NestJS']);
  });

  it('should find related case studies filtering out the current item', async () => {
    const mockEntities: CaseStudyEntity[] = [
      {
        id: 'current-cs',
        title: 'Current CS',
        description: 'Desc',
        banner: '/b1.png',
        type: 'Web App',
        liveUrl: null,
        stack: [],
        body: 'Body',
        isPublished: true,
        sortOrder: 1,
        createdAt: new Date(),
      },
      {
        id: 'related-same-type',
        title: 'Related 1',
        description: 'Desc',
        banner: '/b2.png',
        type: 'Web App',
        liveUrl: null,
        stack: [],
        body: 'Body',
        isPublished: true,
        sortOrder: 2,
        createdAt: new Date(),
      },
      {
        id: 'related-other-type',
        title: 'Related 2',
        description: 'Desc',
        banner: '/b3.png',
        type: 'Website',
        liveUrl: null,
        stack: [],
        body: 'Body',
        isPublished: true,
        sortOrder: 3,
        createdAt: new Date(),
      },
    ];

    vi.spyOn(repo, 'findAllPublished').mockResolvedValue(mockEntities);

    const related = await service.findRelated('current-cs', 'Web App');
    expect(related.length).toBe(2);
    expect(related.some((item) => item.id === 'current-cs')).toBe(false);
    expect(related[0].id).toBe('related-same-type');
  });

  it('should create a case study through the repository', async () => {
    const createDto = {
      id: 'new-study',
      title: 'New Study',
      description: 'Desc',
      banner: '/banner.png',
      type: 'Mobile App',
      liveUrl: 'https://live.app',
      stack: ['Flutter'],
      body: '# Content',
      isPublished: true,
      sortOrder: 0,
    };

    vi.spyOn(repo, 'create').mockResolvedValue({
      ...createDto,
      createdAt: new Date(),
    } as CaseStudyEntity);

    const created = await service.create(createDto);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'new-study',
        title: 'New Study',
      }),
    );
    expect(created.id).toBe('new-study');
  });
});
