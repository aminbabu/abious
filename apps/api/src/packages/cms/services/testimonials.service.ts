import { Injectable } from '@nestjs/common';
import matter from 'gray-matter';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TestimonialsRepository } from '../repositories/testimonials.repository.js';
import type { CreateTestimonialDto, UpdateTestimonialDto } from '../dtos/testimonial.dto.js';
import type { Testimonial } from '../entities/testimonial.entity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Injectable()
export class TestimonialsService {
  private contentDir = resolve(__dirname, '../../../../content/testimonials');

  constructor(private readonly testimonialsRepository: TestimonialsRepository) {}

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    try {
      const items = await this.testimonialsRepository.findAllPublished();
      if (items.length > 0) return items;
    } catch {
      // Fallback to markdown files
    }
    return this.loadMarkdownTestimonials();
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

  private async loadMarkdownTestimonials(): Promise<Testimonial[]> {
    try {
      const files = await readdir(this.contentDir);
      const markdownFiles = files.filter(
        (file) => file.endsWith('.md') && !file.startsWith('_'),
      );

      const items: Testimonial[] = [];
      for (const file of markdownFiles) {
        const fullPath = resolve(this.contentDir, file);
        const fileContent = await readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContent);
        const id = file.replace(/\.md$/, '');

        items.push({
          id,
          name: data.name ?? '',
          role: data.role ?? '',
          company: data.company ?? '',
          avatar: data.avatar ?? '',
          body: content,
          rating: data.rating ?? 5,
          isPublished: true,
          sortOrder: 0,
          createdAt: new Date(),
        });
      }
      return items;
    } catch {
      return [];
    }
  }
}
