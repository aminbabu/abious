import { Injectable } from '@nestjs/common';
import matter from 'gray-matter';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface CaseStudy {
  id: string;
  slug: string;
  data: {
    title: string;
    description: string;
    banner: string;
    type: string;
    liveURL?: string;
    stack: string[];
    createdAt: string;
  };
  body: string;
}

@Injectable()
export class CaseStudiesService {
  private contentDir = resolve(__dirname, '../../../content/case-studies');

  async findAll(): Promise<CaseStudy[]> {
    try {
      const files = await readdir(this.contentDir);
      const markdownFiles = files.filter(
        (file) => file.endsWith('.md') && !file.startsWith('_'),
      );

      const items: CaseStudy[] = [];
      for (const file of markdownFiles) {
        const fullPath = resolve(this.contentDir, file);
        const fileContent = await readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContent);
        const id = file.replace(/\.md$/, '');

        items.push({
          id,
          slug: id,
          data: {
            title: data.title ?? '',
            description: data.description ?? '',
            banner: data.banner ?? '',
            type: data.type ?? '',
            liveURL: data.liveURL,
            stack: Array.isArray(data.stack) ? data.stack : [],
            createdAt: data.createdAt ? String(data.createdAt) : '',
          },
          body: content,
        });
      }

      return items;
    } catch {
      return [];
    }
  }

  async findOne(id: string): Promise<CaseStudy | null> {
    const all = await this.findAll();
    return all.find((item) => item.id === id || item.slug === id) ?? null;
  }
}
