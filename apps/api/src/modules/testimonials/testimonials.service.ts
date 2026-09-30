import { Injectable } from '@nestjs/common';
import matter from 'gray-matter';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Testimonial {
  id: string;
  data: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  body: string;
}

@Injectable()
export class TestimonialsService {
  private contentDir = resolve(__dirname, '../../../content/testimonials');

  async findAll(): Promise<Testimonial[]> {
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
          data: {
            name: data.name ?? '',
            role: data.role ?? '',
            company: data.company ?? '',
            avatar: data.avatar ?? '',
          },
          body: content,
        });
      }

      return items;
    } catch {
      return [];
    }
  }
}
