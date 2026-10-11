import { Injectable } from '@nestjs/common';
import { ServicesRepository } from '../repositories/services.repository.js';
import type { CreateServiceDto, UpdateServiceDto } from '../dtos/service.dto.js';
import type { Service } from '../entities/service.entity.js';

const defaultServices: Service[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Web Development',
    description:
      'Building high-performance, scalable websites and web applications using modern frameworks like Next.js, React, and Vue.',
    icon: 'RiBusinessWindowLine',
    sortOrder: 1,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'API & Backend Development',
    description:
      'Crafting secure, scalable, and efficient APIs and backend solutions using NestJS, Node.js, PostgreSQL, MySQL, Firebase, Supabase, and Laravel.',
    icon: 'RiBusinessLinksLine',
    sortOrder: 2,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'WordPress & Webflow Solutions',
    description:
      'Custom WordPress themes, plugins, and Webflow-powered websites tailored for seamless performance and design.',
    icon: 'RiEditorSlashCommands',
    sortOrder: 3,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Debugging & Support',
    description:
      'Identifying and resolving issues to ensure optimal performance, security, and a flawless user experience.',
    icon: 'RiDevelopmentBugLine',
    sortOrder: 4,
    isActive: true,
    createdAt: new Date(),
  },
];

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async getActiveServices(): Promise<Service[]> {
    try {
      const items = await this.servicesRepository.findAllActive();
      if (items.length > 0) return items;
    } catch {
      // Fallback
    }
    return defaultServices;
  }

  async getAllServices(): Promise<Service[]> {
    return this.servicesRepository.findAll();
  }

  async createService(dto: CreateServiceDto) {
    return this.servicesRepository.create(dto);
  }

  async updateService(id: string, dto: UpdateServiceDto) {
    return this.servicesRepository.update(id, dto);
  }

  async deleteService(id: string) {
    return this.servicesRepository.delete(id);
  }
}
