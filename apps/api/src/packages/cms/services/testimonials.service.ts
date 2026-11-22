import { Injectable } from '@nestjs/common';
import { TestimonialsRepository } from '../repositories/testimonials.repository.js';
import type {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from '../dtos/testimonial.dto.js';
import type { Testimonial } from '../entities/testimonial.entity.js';

@Injectable()
export class TestimonialsService {
  constructor(
    private readonly testimonialsRepository: TestimonialsRepository,
  ) {}

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return this.testimonialsRepository.findAllPublished();
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return this.testimonialsRepository.findAll();
  }

  async createTestimonial(dto: CreateTestimonialDto) {
    return this.testimonialsRepository.create(dto);
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    return this.testimonialsRepository.update(id, dto);
  }

  async deleteTestimonial(id: string) {
    return this.testimonialsRepository.delete(id);
  }
}
