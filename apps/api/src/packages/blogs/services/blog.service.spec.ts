import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlogService } from './blog.service.js';
import { BlogRepository } from '../repositories/blog.repository.js';

describe('BlogService', () => {
  let service: BlogService;
  let repo: BlogRepository;

  beforeEach(() => {
    repo = {
      findAllPublished: vi.fn(),
      findAll: vi.fn(),
      findBySlug: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as BlogRepository;
    service = new BlogService(repo);
  });

  it('should calculate read time and create post', async () => {
    const postData = {
      slug: 'hello-world',
      title: 'Hello World',
      summary: 'Short summary',
      content: 'Word '.repeat(450), // 450 words = ~3 min read
    };

    vi.spyOn(repo, 'create').mockImplementation(async (data: any) => ({
      ...data,
      id: 'blog-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.createPost(postData);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'hello-world',
        readTimeMinutes: 3,
      }),
    );
    expect(result.id).toBe('blog-1');
  });

  it('should generate valid RSS XML feed', async () => {
    vi.spyOn(repo, 'findAllPublished').mockResolvedValue([
      {
        id: '1',
        slug: 'test-post',
        title: 'Test Post',
        summary: 'Test summary',
        content: 'Content',
        coverImage: null,
        categoryId: null,
        tags: [],
        readTimeMinutes: 2,
        isDraft: false,
        publishedAt: new Date('2026-01-01T00:00:00Z'),
        authorId: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
      },
    ]);

    const rss = await service.generateRssFeed();
    expect(rss).toContain('<rss version="2.0"');
    expect(rss).toContain('<title><![CDATA[Test Post]]></title>');
    expect(rss).toContain('/blog/test-post</link>');
  });
});
