import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExperienceService } from './experience.service.js';
import { ExperienceRepository, type FullExperience } from '../repositories/experience.repository.js';

describe('ExperienceService', () => {
  let service: ExperienceService;
  let repo: ExperienceRepository;

  beforeEach(() => {
    repo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as ExperienceRepository;
    service = new ExperienceService(repo);
  });

  it('should return fallback experiences when database returns empty array', async () => {
    vi.spyOn(repo, 'findAll').mockResolvedValue([]);
    const items = await service.getAllExperience();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].company).toBe('JB Connect Ltd');
  });

  it('should return database experience items when available', async () => {
    const mockItems: FullExperience[] = [
      {
        id: 'exp-custom',
        company: 'Custom Tech Corp',
        location: 'San Francisco, CA',
        logo: '/images/custom.png',
        sortOrder: 1,
        createdAt: new Date(),
        positions: [
          {
            id: 'pos-custom',
            experienceId: 'exp-custom',
            title: 'Staff Engineer',
            startDate: '2024-01-01',
            endDate: null,
            type: 'Full-time',
            sortOrder: 1,
          },
        ],
      },
    ];

    vi.spyOn(repo, 'findAll').mockResolvedValue(mockItems);
    const items = await service.getAllExperience();
    expect(items.length).toBe(1);
    expect(items[0].company).toBe('Custom Tech Corp');
    expect(items[0].positions[0].title).toBe('Staff Engineer');
  });

  it('should delegate create experience to repository', async () => {
    const dto = {
      company: 'Acme Inc',
      location: 'Remote',
      logo: '/logo.svg',
      positions: [
        {
          title: 'Lead Architect',
          startDate: '2025-01-01',
          type: 'Contract',
        },
      ],
    };

    vi.spyOn(repo, 'create').mockResolvedValue({
      id: 'new-id',
      ...dto,
      sortOrder: 0,
      createdAt: new Date(),
      positions: [],
    } as FullExperience);

    const created = await service.createExperience(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(created.id).toBe('new-id');
  });
});
