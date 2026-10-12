import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestimonialsService } from './testimonials.service.js';
import { TestimonialsRepository } from '../repositories/testimonials.repository.js';
import type { Testimonial } from '../entities/testimonial.entity.js';

describe('TestimonialsService', () => {
  let service: TestimonialsService;
  let repo: TestimonialsRepository;

  beforeEach(() => {
    repo = {
      findAllPublished: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as TestimonialsRepository;
    service = new TestimonialsService(repo);
  });

  it('should return database testimonials when available', async () => {
    const mockTestimonials: Testimonial[] = [
      {
        id: 'test-1',
        name: 'Jane Doe',
        role: 'VP of Product',
        company: 'Vanguard',
        avatar: '/images/avatar.jpg',
        body: 'Incredible work on the web application architecture!',
        rating: 5,
        isPublished: true,
        sortOrder: 1,
        createdAt: new Date(),
      },
    ];

    vi.spyOn(repo, 'findAllPublished').mockResolvedValue(mockTestimonials);

    const items = await service.getPublishedTestimonials();
    expect(items.length).toBe(1);
    expect(items[0].name).toBe('Jane Doe');
    expect(items[0].company).toBe('Vanguard');
  });

  it('should create testimonial through repository', async () => {
    const dto = {
      name: 'John Smith',
      role: 'CTO',
      company: 'Tech Corp',
      avatar: '/avatar.png',
      body: 'Highly skilled developer.',
      rating: 5,
      isPublished: true,
      sortOrder: 0,
    };

    vi.spyOn(repo, 'create').mockResolvedValue({
      id: 'john-smith',
      ...dto,
      createdAt: new Date(),
    } as Testimonial);

    const created = await service.createTestimonial(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(created.id).toBe('john-smith');
  });
});
