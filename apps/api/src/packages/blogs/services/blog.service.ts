import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from '../repositories/blog.repository.js';
import type {
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from '../dtos/blog.dto.js';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async getPublishedPosts() {
    return this.blogRepository.findAllPublished();
  }

  async getAllPosts() {
    return this.blogRepository.findAll();
  }

  async getPostBySlug(slug: string) {
    const post = await this.blogRepository.findBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Blog post with slug '${slug}' not found`);
    }
    return post;
  }

  async createPost(dto: CreateBlogPostDto, authorId?: string) {
    const readTimeMinutes = this.calculateReadTime(dto.content);
    return this.blogRepository.create({
      slug: dto.slug,
      title: dto.title,
      summary: dto.summary,
      content: dto.content,
      coverImage: dto.coverImage || null,
      categoryId: dto.categoryId || null,
      tags: dto.tags || [],
      readTimeMinutes,
      isDraft: dto.isDraft ?? false,
      authorId: authorId || null,
    });
  }

  async updatePost(id: string, dto: UpdateBlogPostDto) {
    const patch: Record<string, any> = { ...dto };
    if (dto.content) {
      patch.readTimeMinutes = this.calculateReadTime(dto.content);
    }
    return this.blogRepository.update(id, patch);
  }

  async deletePost(id: string) {
    return this.blogRepository.delete(id);
  }

  async generateRssFeed(): Promise<string> {
    const posts = await this.blogRepository.findAllPublished();
    const siteUrl = process.env.CLIENT_URL || 'https://abious.com';

    const itemsXml = posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.summary}]]></description>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
    </item>`,
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Amin Babu Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Insights on full stack engineering, architecture, and technology.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/api/blogs/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;
  }

  private calculateReadTime(text: string): number {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }
}
