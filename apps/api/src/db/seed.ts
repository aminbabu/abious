import { pool, db } from './index.js';
import { services } from '../packages/cms/entities/service.entity.js';
import { experiences, experiencePositions } from '../packages/cms/entities/experience.entity.js';
import { testimonials } from '../packages/cms/entities/testimonial.entity.js';
import { caseStudies } from '../packages/case-studies/entities/case-study.entity.js';
import { siteSettings } from '../packages/settings/entities/settings.entity.js';
import { categories, blogPosts } from '../packages/blogs/entities/blog.entity.js';
import matter from 'gray-matter';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Services
  const existingServices = await db.select().from(services);
  if (existingServices.length === 0) {
    console.log('Seeding default services...');
    await db.insert(services).values([
      {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'Web Development',
        description:
          'Building high-performance, scalable websites and web applications using modern frameworks like Next.js, React, and Vue.',
        icon: 'RiBusinessWindowLine',
        sortOrder: 1,
        isActive: true,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        title: 'API & Backend Development',
        description:
          'Crafting secure, scalable, and efficient APIs and backend solutions using NestJS, Node.js, PostgreSQL, MySQL, Firebase, Supabase, and Laravel.',
        icon: 'RiBusinessLinksLine',
        sortOrder: 2,
        isActive: true,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        title: 'WordPress & Webflow Solutions',
        description:
          'Custom WordPress themes, plugins, and Webflow-powered websites tailored for seamless performance and design.',
        icon: 'RiEditorSlashCommands',
        sortOrder: 3,
        isActive: true,
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        title: 'Debugging & Support',
        description:
          'Identifying and resolving issues to ensure optimal performance, security, and a flawless user experience.',
        icon: 'RiDevelopmentBugLine',
        sortOrder: 4,
        isActive: true,
      },
    ]);
  }

  // 2. Seed Experiences & Positions
  const existingExp = await db.select().from(experiences);
  if (existingExp.length === 0) {
    console.log('Seeding career experiences...');
    const exp1 = await db
      .insert(experiences)
      .values({
        company: 'JB Connect Ltd',
        location: 'Banani, Dhaka',
        logo: '/images/experience/jbc.svg',
        sortOrder: 1,
      })
      .returning();

    await db.insert(experiencePositions).values({
      experienceId: exp1[0].id,
      title: 'Junior Engineer',
      startDate: '2025-11-03',
      endDate: null,
      type: 'Full-time',
      sortOrder: 1,
    });

    const exp2 = await db
      .insert(experiences)
      .values({
        company: '7x',
        location: 'Tukwila, Washington',
        logo: '/images/experience/7x.png',
        sortOrder: 2,
      })
      .returning();

    await db.insert(experiencePositions).values({
      experienceId: exp2[0].id,
      title: 'MERN-Stack Developer',
      startDate: '2023-08-01',
      endDate: null,
      type: 'Freelance',
      sortOrder: 1,
    });

    const exp3 = await db
      .insert(experiences)
      .values({
        company: 'Notionhive',
        location: 'Uttara, Dhaka',
        logo: '/images/experience/notionhive.png',
        sortOrder: 3,
      })
      .returning();

    await db.insert(experiencePositions).values({
      experienceId: exp3[0].id,
      title: 'Web Developer',
      startDate: '2023-07-01',
      endDate: '2024-11-30',
      type: 'Full-time',
      sortOrder: 1,
    });

    const exp4 = await db
      .insert(experiences)
      .values({
        company: 'Expert IT Solution',
        location: 'Kallianpur, Dhaka',
        logo: '/images/experience/expert.png',
        sortOrder: 4,
      })
      .returning();

    await db.insert(experiencePositions).values({
      experienceId: exp4[0].id,
      title: 'Web Designer',
      startDate: '2022-03-01',
      endDate: '2022-06-30',
      type: 'Full-time',
      sortOrder: 1,
    });
  }

  // 3. Seed Testimonials from content/testimonials or defaults
  const existingTestimonials = await db.select().from(testimonials);
  if (existingTestimonials.length === 0) {
    console.log('Seeding testimonials...');
    const testimonialsDir = resolve(__dirname, '../../content/testimonials');
    let loaded = false;

    try {
      const files = await readdir(testimonialsDir);
      for (const file of files.filter((f) => f.endsWith('.md'))) {
        const fullPath = resolve(testimonialsDir, file);
        const fileContent = await readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContent);
        const id = file.replace(/\.md$/, '');

        await db.insert(testimonials).values({
          id,
          name: data.name ?? 'Client',
          role: data.role ?? '',
          company: data.company ?? '',
          avatar: data.avatar ?? '/images/testimonials/default.png',
          body: content.trim(),
          rating: data.rating ?? 5,
          isPublished: true,
          sortOrder: 0,
        });
        loaded = true;
      }
    } catch {
      // ignore
    }

    if (!loaded) {
      await db.insert(testimonials).values([
        {
          id: 'graham-brookins',
          name: 'Graham Brookins',
          role: 'Founder & CEO',
          company: '7X',
          avatar: '/images/testimonials/graham-brookins.jpeg',
          body: 'Amin blends design and development, creating user-centric solutions that balance aesthetics and functionality. His innovative approach ensures seamless experiences, exceeding expectations with technical precision and creative excellence to deliver lasting value in every project.',
          rating: 5,
          isPublished: true,
          sortOrder: 1,
        },
        {
          id: 'mohammad-kais-rayhan',
          name: 'Mohammad Kais Rayhan',
          role: 'UI/UX Designer',
          company: 'Notionhive Bangladesh',
          avatar: '/images/testimonials/mohammad-kais-rayhan.jpeg',
          body: 'Working with Amin Babu was extremely smooth. Me as a UI UX designer dealing with developers is a challenging thing but then there comes Amin Babu who can easily catch the depth of imagination and flow how a designer can think. Really an amazing journey with him.',
          rating: 5,
          isPublished: true,
          sortOrder: 2,
        },
      ]);
    }
  }

  // 4. Seed Case Studies from content/case-studies
  const existingCaseStudies = await db.select().from(caseStudies);
  if (existingCaseStudies.length === 0) {
    console.log('Seeding case studies...');
    const caseStudiesDir = resolve(__dirname, '../../content/case-studies');
    try {
      const files = await readdir(caseStudiesDir);
      for (const file of files.filter((f) => f.endsWith('.md'))) {
        const fullPath = resolve(caseStudiesDir, file);
        const fileContent = await readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContent);
        const id = file.replace(/\.md$/, '');

        await db.insert(caseStudies).values({
          id,
          title: data.title ?? '',
          description: data.description ?? '',
          banner: data.banner ?? '',
          type: data.type ?? 'Web App',
          liveUrl: data.liveURL ?? null,
          stack: Array.isArray(data.stack) ? data.stack : [],
          body: content.trim(),
          isPublished: true,
          sortOrder: 0,
        });
      }
    } catch (err) {
      console.warn('Could not read case studies content directory:', err);
    }
  }

  // 5. Seed Site Settings
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length === 0) {
    console.log('Seeding site settings...');
    await db.insert(siteSettings).values([
      {
        key: 'general',
        value: {
          siteName: 'Amin Babu',
          tagline: 'Staff Software Architect & Full-Stack Engineer',
          contactEmail: 'contact@aminbabu.com',
        },
      },
      {
        key: 'seo',
        value: {
          metaTitle: 'Amin Babu — Software Architect & Full-Stack Engineer',
          metaDescription:
            'Personal portfolio, engineering insights, and production case studies by Amin Babu.',
          keywords: ['Full-Stack', 'NestJS', 'SolidJS', 'TypeScript', 'Software Architect'],
        },
      },
      {
        key: 'social',
        value: {
          github: 'https://github.com/aminbabu',
          linkedin: 'https://linkedin.com/in/aminbabu',
          twitter: 'https://twitter.com/aminbabu',
        },
      },
    ]);
  }

  // 6. Seed Sample Category & Welcome Blog Post
  const existingPosts = await db.select().from(blogPosts);
  if (existingPosts.length === 0) {
    console.log('Seeding sample blog post...');
    const cat = await db
      .insert(categories)
      .values({
        slug: 'engineering',
        name: 'Engineering',
        description: 'Systems architecture, performance, and full-stack development.',
      })
      .returning();

    await db.insert(blogPosts).values({
      slug: 'welcome-to-abious',
      title: 'Building Modern Web Architectures with SolidJS and NestJS',
      summary:
        'A comprehensive exploration of modular monorepos, autonomous NestJS domains, and ultra-fast SolidStart reactivity.',
      content: `## The Modern Web Stack

Building high performance applications demands thoughtful decoupling between domain models and client user experiences. In this architecture, we combine the ultra-lightweight client reactivity of SolidJS with an enterprise NestJS API platform.

### Key Pillars
- **Reactivity without Virtual DOM overhead**
- **Autonomous domain packages**
- **Type-safe data pipelines**
`,
      categoryId: cat[0].id,
      tags: ['SolidJS', 'NestJS', 'Architecture', 'TypeScript'],
      readTimeMinutes: 3,
      isDraft: false,
    });
  }

  console.log('✅ Database seeding finished successfully.');
}

if (process.argv.includes('--run')) {
  seedDatabase()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Seeder failed:', err);
      await pool.end();
      process.exit(1);
    });
}
