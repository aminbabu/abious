import { Injectable } from '@nestjs/common';
import { ServicesRepository } from '../repositories/services.repository.js';
import type {
  CreateServiceDto,
  UpdateServiceDto,
} from '../dtos/service.dto.js';
import type { Service } from '../entities/service.entity.js';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async getActiveServices(): Promise<Service[]> {
    return this.servicesRepository.findAllActive();
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
