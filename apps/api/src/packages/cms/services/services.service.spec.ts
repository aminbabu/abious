import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServicesService } from './services.service.js';
import { ServicesRepository } from '../repositories/services.repository.js';

describe('ServicesService', () => {
  let service: ServicesService;
  let repo: ServicesRepository;

  beforeEach(() => {
    repo = {
      findAllActive: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as ServicesRepository;
    service = new ServicesService(repo);
  });

  it('should return default services when database is empty', async () => {
    vi.spyOn(repo, 'findAllActive').mockResolvedValue([]);
    const items = await service.getActiveServices();
    expect(items.length).toBe(4);
    expect(items[0].title).toBe('Web Development');
  });

  it('should return database services when available', async () => {
    const custom = [
      {
        id: '123',
        title: 'Custom Service',
        description: 'Custom Desc',
        icon: 'RiCustom',
        sortOrder: 1,
        isActive: true,
        createdAt: new Date(),
      },
    ];
    vi.spyOn(repo, 'findAllActive').mockResolvedValue(custom);
    const items = await service.getActiveServices();
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Custom Service');
  });
});
