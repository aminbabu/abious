import { Injectable } from '@nestjs/common';
import { SettingsRepository } from '../repositories/settings.repository.js';
import type { PublicSiteSettings } from '../dtos/settings.dto.js';

const defaultPublicSettings: PublicSiteSettings = {
  siteName: 'Amin Babu',
  siteTitle: 'Amin Babu - Full Stack Web Developer & Tech Enthusiast',
  bio: 'Expert in crafting responsive web and mobile applications using JavaScript, Next.js, NestJS, MERN stack, PHP, Laravel, WordPress, Webflow, and more — delivering seamless and high-performance user experiences across platforms.',
  email: 'amin.babu.bd@gmail.com',
  phone: '+8801621990178',
  resumeUrl: '/resume/Resume - Amin Babu.pdf',
  calcomLink: 'aminbabu/30min',
  socials: [
    { id: 'github', title: 'GitHub', url: 'https://github.com/aminbabu' },
    { id: 'linkedin', title: 'LinkedIn', url: 'https://www.linkedin.com/in/aminbabu' },
  ],
};

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async getPublicSettings(): Promise<PublicSiteSettings> {
    try {
      const setting = await this.settingsRepository.get('public');
      if (setting && setting.value) {
        return {
          ...defaultPublicSettings,
          ...(setting.value as Partial<PublicSiteSettings>),
        };
      }
    } catch {
      // Fallback to default presets if table hasn't migrated yet
    }
    return defaultPublicSettings;
  }

  async updateSetting(key: string, value: Record<string, any>) {
    return this.settingsRepository.set(key, value);
  }

  async getAllSettings() {
    return this.settingsRepository.getAll();
  }
}
