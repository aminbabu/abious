import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsService } from './settings.service.js';
import { SettingsRepository } from '../repositories/settings.repository.js';

describe('SettingsService', () => {
  let service: SettingsService;
  let repo: SettingsRepository;

  beforeEach(() => {
    repo = {
      get: vi.fn(),
      getAll: vi.fn(),
      set: vi.fn(),
    } as unknown as SettingsRepository;
    service = new SettingsService(repo);
  });

  it('should return default public settings when none stored in database', async () => {
    vi.spyOn(repo, 'get').mockResolvedValue(null);
    const settings = await service.getPublicSettings();
    expect(settings).toBeDefined();
    expect(settings.siteName).toBe('Amin Babu');
    expect(settings.email).toBe('amin.babu.bd@gmail.com');
  });

  it('should return merged public settings when stored in database', async () => {
    vi.spyOn(repo, 'get').mockResolvedValue({
      key: 'public',
      value: { siteName: 'Custom Babu' },
      updatedAt: new Date(),
    });
    const settings = await service.getPublicSettings();
    expect(settings.siteName).toBe('Custom Babu');
    expect(settings.email).toBe('amin.babu.bd@gmail.com');
  });
});
