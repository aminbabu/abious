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
  const defaultServices = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Web Application Development',
      description:
        'Building high-performance, reactive, and accessible web apps using modern frameworks like SolidStart, Next.js, React, and TypeScript.',
      icon: 'RiBusinessWindowLine',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      title: 'API & Microservices Architecture',
      description:
        'Crafting resilient, secure, and horizontally scalable backends with NestJS, Node.js, PostgreSQL, Redis, Drizzle ORM, and Docker.',
      icon: 'RiBusinessLinksLine',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      title: 'CMS & Headless Architecture',
      description:
        'Engineering custom content management pipelines, headless CMS integrations (Strapi, Payload, eZ Publish), and WordPress architectures.',
      icon: 'RiEditorSlashCommands',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      title: 'Performance & Security Audits',
      description:
        'Comprehensive profiling for Core Web Vitals, SSR latency, database index optimization, zero-trust auth hardening, and accessibility.',
      icon: 'RiDevelopmentBugLine',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      title: 'DevOps & Cloud Orchestration',
      description:
        'Automating continuous integration, Dockerized container deployment, DDEV local development environments, and cloud infrastructure.',
      icon: 'RiSystemServerLine',
      sortOrder: 5,
      isActive: true,
    },
    {
      id: '66666666-6666-6666-6666-666666666666',
      title: 'UI/UX Design Systems & Motion',
      description:
        'Transforming complex brand identities into modular component libraries with TailwindCSS, smooth micro-interactions, and accessible UX.',
      icon: 'RiDesignPaletteLine',
      sortOrder: 6,
      isActive: true,
    },
  ];

  for (const s of defaultServices) {
    await db.insert(services).values(s).onConflictDoNothing();
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
      title: 'Junior Software Engineer',
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
      title: 'Senior Full-Stack Developer',
      startDate: '2023-08-01',
      endDate: null,
      type: 'Remote / Freelance',
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
      title: 'Web Application Engineer',
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
      title: 'Frontend UI/UX Developer',
      startDate: '2022-03-01',
      endDate: '2022-06-30',
      type: 'Full-time',
      sortOrder: 1,
    });
  }

  // 3. Seed Testimonials
  console.log('Seeding rich testimonials...');
  const testimonialsDir = resolve(__dirname, '../../content/testimonials');

  try {
    const files = await readdir(testimonialsDir);
    for (const file of files.filter((f) => f.endsWith('.md'))) {
      const fullPath = resolve(testimonialsDir, file);
      const fileContent = await readFile(fullPath, 'utf8');
      const { data, content } = matter(fileContent);
      const id = file.replace(/\.md$/, '');

      await db
        .insert(testimonials)
        .values({
          id,
          name: data.name ?? 'Client',
          role: data.role ?? '',
          company: data.company ?? '',
          avatar: data.avatar ?? '/images/testimonials/default.png',
          body: content.trim(),
          rating: data.rating ?? 5,
          isPublished: true,
          sortOrder: 0,
        })
        .onConflictDoNothing();
    }
  } catch {
    // ignore
  }

  const defaultTestimonials = [
    {
      id: 'graham-brookins',
      name: 'Graham Brookins',
      role: 'Founder & CEO',
      company: '7x Technologies',
      avatar: '/images/testimonials/graham-brookins.jpeg',
      body: 'Amin blends design and development, creating user-centric solutions that balance aesthetics and functionality. His innovative approach ensures seamless experiences, exceeding expectations with technical precision and creative excellence to deliver lasting value in every project.',
      rating: 5,
      isPublished: true,
      sortOrder: 1,
    },
    {
      id: 'mohammad-kais-rayhan',
      name: 'Mohammad Kais Rayhan',
      role: 'Lead UI/UX Designer',
      company: 'Notionhive Bangladesh',
      avatar: '/images/testimonials/mohammad-kais-rayhan.jpeg',
      body: 'Working with Amin Babu was extremely smooth. As a UI/UX designer dealing with developers, translation can be challenging, but Amin effortlessly catches the depth of imagination and intent behind design systems. Really an amazing journey with him.',
      rating: 5,
      isPublished: true,
      sortOrder: 2,
    },
    {
      id: 'sarah-jenkins',
      name: 'Sarah Jenkins',
      role: 'Head of Product',
      company: 'Beacon Studio Global',
      avatar: '/images/testimonials/default.png',
      body: 'Amin transformed our internal dashboard from a sluggish legacy portal into an ultra-responsive SolidJS experience. His code quality, architectural foresight, and documentation standards made onboarding our team completely frictionless.',
      rating: 5,
      isPublished: true,
      sortOrder: 3,
    },
    {
      id: 'tariq-al-mansoor',
      name: 'Tariq Al-Mansoor',
      role: 'Technical Director',
      company: 'Peninsula Logistics',
      avatar: '/images/testimonials/default.png',
      body: 'Exceptional full-stack delivery! The NestJS microservices architecture Amin architected handled our high-throughput warehouse dispatch pipelines without breaking a sweat. Delivered on time and exceeding benchmarks.',
      rating: 5,
      isPublished: true,
      sortOrder: 4,
    },
    {
      id: 'elena-rostova',
      name: 'Elena Rostova',
      role: 'Engineering Manager',
      company: 'Universalyst Art Collective',
      avatar: '/images/testimonials/default.png',
      body: 'Amin took over our stalled API integration mid-project and delivered miracles within weeks. His grasp of reactive states, WebSocket events, and clean domain isolation rescued our launch timeline completely.',
      rating: 5,
      isPublished: true,
      sortOrder: 5,
    },
    {
      id: 'marcus-vance',
      name: 'Marcus Vance',
      role: 'VP of Engineering',
      company: 'Axentec Labs',
      avatar: '/images/testimonials/default.png',
      body: 'Consistently one of the sharpest engineers we have collaborated with. From zero-downtime Drizzle database migrations to pixel-perfect tailwind interfaces, Amin operates at top-tier staff engineer level.',
      rating: 5,
      isPublished: true,
      sortOrder: 6,
    },
  ];

  for (const item of defaultTestimonials) {
    await db.insert(testimonials).values(item).onConflictDoNothing();
  }

  // 4. Seed Case Studies
  console.log('Seeding rich case studies...');
  const caseStudiesDir = resolve(__dirname, '../../content/case-studies');

  try {
    const files = await readdir(caseStudiesDir);
    for (const file of files.filter((f) => f.endsWith('.md'))) {
      const fullPath = resolve(caseStudiesDir, file);
      const fileContent = await readFile(fullPath, 'utf8');
      const { data, content } = matter(fileContent);
      const id = file.replace(/\.md$/, '');

      await db
        .insert(caseStudies)
        .values({
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
        })
        .onConflictDoNothing();
    }
  } catch (err) {
    console.warn('Could not read case studies content directory:', err);
  }

  const additionalCaseStudies = [
    {
      id: 'axentec-enterprise-portal',
      title: 'Axentec Enterprise Cloud Portal',
      description:
        'Unified cloud observability, resource provisioning, and billing analytics dashboard for high-compliance enterprise teams.',
      banner: '/images/case-studies/axentec.png',
      type: 'Cloud SaaS',
      liveUrl: 'https://axentec.com',
      stack: ['SolidJS', 'NestJS', 'PostgreSQL', 'TailwindCSS', 'Redis', 'Docker'],
      body: `## Architectural Overview\n\nAxentec required a high-density control center allowing multi-tenant administrators to inspect compute usage, manage user privileges, and trigger audit reports in real time.\n\n### Core Engineering Highlights\n- **Sub-50ms query responses** through PostgreSQL partition keys and Drizzle ORM query optimizations.\n- **Fine-grained RBAC** with session-level cryptographic audit trails.\n- **Reactive charts & metrics** rendered with zero layout thrashing.\n\n### Outcome\nScaled to over 100 enterprise accounts with 99.99% uptime and zero critical vulnerability findings during SOC2 Type II audit.`,
      isPublished: true,
      sortOrder: 4,
    },
    {
      id: 'beacon-health-analytics',
      title: 'Beacon Real-Time Health Analytics',
      description:
        'HIPAA-compliant telemetry and patient workflow management system built for regional clinic networks.',
      banner: '/images/case-studies/beacon.png',
      type: 'Healthcare Web App',
      liveUrl: 'https://beaconhealth.io',
      stack: ['TypeScript', 'NextJS', 'NestJS', 'PostgreSQL', 'WebSockets', 'TailwindCSS'],
      body: `## Mission & Challenges\n\nBeacon required an end-to-end overhaul of patient intake and real-time triage status updates across 14 hospital branches.\n\n### Solutions Implemented\n- **End-to-End Type Safety**: Shared schema contracts between frontend router and backend microservices.\n- **Real-Time Synchronisation**: WebSocket push channels streaming patient priority changes without polling.\n- **High-contrast UI Design**: Fully accessible design conforming to WCAG 2.1 AA standards for clinical tablets.`,
      isPublished: true,
      sortOrder: 5,
    },
    {
      id: 'peninsula-hospitality-suite',
      title: 'The Peninsula Booking & Concierge Engine',
      description:
        'High-touch digital concierge and reservations engine with multi-currency checkout and automated guest messaging.',
      banner: '/images/case-studies/peninsula.png',
      type: 'E-Commerce & Hospitality',
      liveUrl: 'https://peninsula.com',
      stack: ['SolidStart', 'NestJS', 'Stripe', 'TailwindCSS', 'PostgreSQL', 'SplideJS'],
      body: `## Project Vision\n\nDesigned to elevate guest engagement for luxury accommodations, this engine combines dynamic package pricing, personalized itineraries, and instant payments.\n\n### Technical Milestones\n- **Sub-second SSR Hydration**: Achieved 98+ Lighthouse mobile performance scores.\n- **Idempotent Stripe Webhooks**: Zero dropped transactions during peak seasonal booking waves.\n- **Multi-lingual localized experience**: Full i18n support for international clientele.`,
      isPublished: true,
      sortOrder: 6,
    },
    {
      id: 'notionhive-digital-marketplace',
      title: 'Notionhive Digital Assets Marketplace',
      description:
        'A high-performance creator marketplace enabling designers and studios to monetize digital templates, icons, and 3D kits.',
      banner: '/images/case-studies/notionhive-marketplace.png',
      type: 'Creator Marketplace',
      liveUrl: 'https://notionhive.com',
      stack: ['React', 'NextJS', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'AWS S3'],
      body: `## Platform Architecture\n\nA modern multi-vendor marketplace featuring instant preview rendering, automated zip packaging, and seller revenue distribution.\n\n### Key Deliverables\n- **S3 Presigned Asset Pipelines**: Fast, secure digital file delivery.\n- **Comprehensive Creator Dashboard**: Real-time sales analytics and payout history.\n- **Optimized Algolia Search**: Millisecond search and tag facet filtering.`,
      isPublished: true,
      sortOrder: 7,
    },
    {
      id: 'garbageman-waste-logistics',
      title: 'GarbageMan Smart Waste Recycling Logistics',
      description:
        'IoT-enabled route planning, collection tracking, and carbon offset reporting platform for municipal recycling.',
      banner: '/images/case-studies/garbageman.png',
      type: 'Logistics IoT Platform',
      liveUrl: 'https://garbageman.com.bd',
      stack: ['Vue.js', 'NestJS', 'PostgreSQL', 'Leaflet Maps', 'TailwindCSS'],
      body: `## Sustainable Impact\n\nDigitized commercial recycling collections across metropolitan zones, optimizing truck routing and quantifying environmental impact.\n\n### Technical Features\n- **Dynamic Route Optimization**: Calculated real-time fuel-efficient routes for municipal fleets.\n- **Carbon Ledger**: Verified certificate generation for corporate ESG compliance.\n- **Driver Mobile Companion**: Offline-first collection logging and signature capture.`,
      isPublished: true,
      sortOrder: 8,
    },
  ];

  for (const item of additionalCaseStudies) {
    await db.insert(caseStudies).values(item).onConflictDoNothing();
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

  // 6. Seed Categories & Diverse Blog Posts for Pagination & Filtering Testing
  console.log('Seeding rich blog categories and articles...');
  
  // Create or retrieve categories
  const categoriesList = [
    {
      slug: 'engineering',
      name: 'Engineering & Architecture',
      description: 'Systems architecture, performance engineering, and full-stack platforms.',
    },
    {
      slug: 'frontend',
      name: 'Frontend & UI',
      description: 'Reactive frameworks, modern CSS, animations, and Core Web Vitals.',
    },
    {
      slug: 'backend',
      name: 'Backend & Databases',
      description: 'Scalable APIs, distributed systems, Drizzle ORM, and PostgreSQL tuning.',
    },
    {
      slug: 'devops',
      name: 'DevOps & Tooling',
      description: 'Docker workflows, CI/CD automation, monorepos, and local environments.',
    },
  ];

  for (const cat of categoriesList) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  const allCategories = await db.select().from(categories);
  const catMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  const sampleBlogPosts = [
    {
      slug: 'building-modern-web-architectures-solidjs-nestjs',
      title: 'Building Modern Web Architectures with SolidJS and NestJS',
      summary:
        'A comprehensive exploration of modular monorepos, autonomous NestJS domains, and ultra-fast SolidStart fine-grained reactivity.',
      content: `## The Modern Reactive Web Stack

Building high-performance applications demands thoughtful decoupling between domain models and client user experiences. In this architecture, we combine the ultra-lightweight client reactivity of SolidJS with an enterprise NestJS API platform.

### Key Pillars
- **Reactivity without Virtual DOM overhead**: Solid's compiled signals bypass VDOM diffing entirely.
- **Autonomous domain packages**: Isolate business logic into testable units.
- **Type-safe data pipelines**: End-to-end TypeScript contracts from Drizzle schema to frontend router loaders.

### Fine-Grained Reactivity in Practice
Unlike component-level re-renderers, Solid components run **once**. Signals trigger pinpoint DOM surgical updates:

\`\`\`typescript
const [count, setCount] = createSignal(0);
// Only this text node updates when signal triggers:
<h1>Count: {count()}</h1>
\`\`\`

This delivers near-instant Time to Interactive (TTI) and zero hydration thrashing on low-end mobile devices.`,
      categoryId: catMap.get('engineering'),
      tags: ['SolidJS', 'NestJS', 'Architecture', 'TypeScript'],
      readTimeMinutes: 5,
      isDraft: false,
      publishedAt: new Date('2026-03-01T10:00:00Z'),
    },
    {
      slug: 'why-solidjs-fine-grained-reactivity-wins-core-web-vitals',
      title: 'Why SolidJS Fine-Grained Reactivity Wins Core Web Vitals',
      summary:
        'How eliminating the virtual DOM completely eradicates Interaction to Next Paint (INP) bottlenecks and maximizes Lighthouse scores.',
      content: `## The INP Dilemma in Modern Single Page Apps

Interaction to Next Paint (INP) measures how quickly an application responds to user input during its entire lifecycle. With conventional Virtual DOM trees, large component hierarchies cause perceptible main-thread pauses during complex state changes.

### Zero-VDOM Architecture
Solid compiles JSX directly into native DOM creation and subscription calls:

1. **Compilation Step**: JSX tags turn into \`template()\` clones.
2. **Subscription Step**: Signals bind directly to specific DOM text or attribute setters.
3. **Execution Step**: When a state changes, only the bound callback executes.

### Real-World Lighthouse Benchmarks
Across real-world tests on 3G simulated devices, SolidStart consistently scores:
- **LCP (Largest Contentful Paint)**: < 0.8s
- **INP (Interaction to Next Paint)**: < 16ms
- **CLS (Cumulative Layout Shift)**: 0.000`,
      categoryId: catMap.get('frontend'),
      tags: ['SolidJS', 'Performance', 'Web Vitals', 'Frontend'],
      readTimeMinutes: 4,
      isDraft: false,
      publishedAt: new Date('2026-03-08T12:00:00Z'),
    },
    {
      slug: 'scaling-nestjs-monorepos-drizzle-orm-postgresql',
      title: 'Scaling NestJS Monorepos with Drizzle ORM and PostgreSQL',
      summary:
        'Practical patterns for zero-downtime database migrations, connection pool tuning, and clean domain isolation in enterprise backends.',
      content: `## Why Drizzle ORM Replaces Heavier ORMs

Object-Relational Mappers (ORMs) often obscure the SQL queries they generate, leading to N+1 query surprises and memory ballooning under load. Drizzle ORM treats SQL as a first-class citizen while maintaining complete TypeScript type safety.

### Architecture Highlights
- **Schema as Single Source of Truth**: Define column constraints, foreign keys, and indexes in code.
- **Predictable SQL Queries**: If you know SQL, you already know Drizzle.
- **Ultra-light footprint**: No code-generation daemons or heavy query engine binaries.

### Connection Pool Configuration
When running NestJS behind horizontal replicas, always configure pooling sensibly:

\`\`\`typescript
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
\`\`\`

Combine this with connection multiplexers like PgBouncer for production stability.`,
      categoryId: catMap.get('backend'),
      tags: ['NestJS', 'PostgreSQL', 'DrizzleORM', 'Databases'],
      readTimeMinutes: 6,
      isDraft: false,
      publishedAt: new Date('2026-03-15T09:30:00Z'),
    },
    {
      slug: 'mastering-ddev-docker-local-development',
      title: 'Mastering DDEV & Docker for Instant Local Full-Stack Environments',
      summary:
        'Eliminating "it works on my machine" issues by standardizing local databases, NodeJS runtimes, and HTTPS certificates with DDEV.',
      content: `## The Modern Local Development Environment

Setting up multiple services—PostgreSQL, Redis, Node, mail traps, and valid local SSL certificates—can take hours of onboarding time. DDEV wraps Docker in an intuitive, performant abstraction.

### Why DDEV for Monorepos?
- **Automatic HTTPS certificates** trusted by all local browsers and curl.
- **Port isolation**: No port collision between multiple ongoing client projects.
- **Built-in database tooling**: Instant snapshots (\`ddev snapshot\`), restores, and HeidiSQL / TablePlus integrations.

### Daily Workflow Cheat Sheet
\`\`\`bash
# Start your full containerized environment:
ddev start

# Execute monorepo scripts inside isolated environment:
ddev exec pnpm build
ddev exec pnpm --filter api db:seed
\`\`\`

Standardizing on DDEV ensures deterministic developer onboarding across macOS, Linux, and Windows WSL2.`,
      categoryId: catMap.get('devops'),
      tags: ['Docker', 'DDEV', 'DevOps', 'Tooling'],
      readTimeMinutes: 4,
      isDraft: false,
      publishedAt: new Date('2026-03-22T14:15:00Z'),
    },
    {
      slug: 'type-safe-validation-valibot-vs-zod',
      title: 'Why Valibot is Replacing Zod in Bundle-Conscious Applications',
      summary:
        'A deep dive into modular schema validation: saving 90% bundle size with Valibot tree-shaking while keeping full type inference.',
      content: `## The Hidden Cost of Monolithic Validation Libraries

In modern web development, schema validation libraries like Zod are ubiquitous. However, standard Zod imports include the entire validation engine in your client bundle—costing 40KB+ minified before adding any application code.

### The Tree-Shakeable Paradigm
Valibot designs every validator as an independent, tree-shakeable function:

\`\`\`typescript
import * as v from 'valibot';

export const ContactSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty('Name is required')),
  email: v.pipe(v.string(), v.email('Invalid email address')),
  message: v.pipe(v.string(), v.minLength(10)),
});
\`\`\`

If your form only uses strings and emails, your production bundle only ships those two validators!

### Benchmarks
- **Zod Baseline**: ~50 KB gzipped bundle impact.
- **Valibot**: ~1.5 KB to 3 KB for typical forms.
- **Validation Execution Speed**: 1.5x - 2x faster in high-throughput parsing loops.`,
      categoryId: catMap.get('frontend'),
      tags: ['Valibot', 'TypeScript', 'Validation', 'Performance'],
      readTimeMinutes: 4,
      isDraft: false,
      publishedAt: new Date('2026-03-29T11:00:00Z'),
    },
    {
      slug: 'design-systems-with-tailwind-css-tokens',
      title: 'Architecting Accessible Design Systems with CSS Variables and Tailwind',
      summary:
        'Constructing scalable semantic color palettes, dashed borders, dark modes, and fluid typography tokens without arbitrary class bloat.',
      content: `## Designing for Longevity

A design system should be an investment that accelerates product iteration, not a maintenance burden. By pairing Tailwind CSS utility classes with native CSS Custom Properties, we achieve instant theme adaptability.

### CSS Custom Properties Foundation
Define semantic tokens in your global stylesheet:

\`\`\`css
:root {
  --background: oklch(0.98 0.005 240);
  --foreground: oklch(0.15 0.02 240);
  --primary: oklch(0.65 0.22 142);
  --border: oklch(0.88 0.01 240);
}

.dark {
  --background: oklch(0.12 0.01 240);
  --foreground: oklch(0.96 0.005 240);
}
\`\`\`

### Accessibility Best Practices
- **Contrast Ratios**: Verify 4.5:1 ratio for standard text and 3:1 for interactive controls.
- **Focus Indicators**: Never disable outline without providing high-visibility focus rings.
- **Subtle Micro-Animations**: Respect \`prefers-reduced-motion\` for all layout transitions.`,
      categoryId: catMap.get('frontend'),
      tags: ['TailwindCSS', 'DesignSystems', 'CSS', 'Accessibility'],
      readTimeMinutes: 5,
      isDraft: false,
      publishedAt: new Date('2026-04-02T16:00:00Z'),
    },
    {
      slug: 'zero-trust-authentication-better-auth',
      title: 'Implementing Modern Zero-Trust Auth with Better-Auth & NestJS',
      summary:
        'Secure session handling, OAuth providers, cryptographic token verification, and granular admin route guards in production.',
      content: `## Modern Authentication Needs

Traditional JWT architectures often fall prey to revoked token vulnerabilities and complex refresh token rotation races. Better-Auth provides a comprehensive, secure-by-default session engine that integrates cleanly across monorepo boundaries.

### Security Guarantees
- **HttpOnly Secure Cookies**: Immune to malicious XSS token extraction.
- **Database-Backed Sessions**: Instant revocation upon suspicious activity.
- **OAuth Social Login Support**: Standardized Google and GitHub authentication flows.

### Guarding Routes in NestJS
With NestJS guards, user verification is declarative and type-safe:

\`\`\`typescript
@UseGuards(BetterAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: UserSession) {
  return this.usersService.findById(user.id);
}
\`\`\`

This delivers enterprise-grade protection with minimal boilerplate.`,
      categoryId: catMap.get('backend'),
      tags: ['Security', 'BetterAuth', 'NestJS', 'Authentication'],
      readTimeMinutes: 6,
      isDraft: false,
      publishedAt: new Date('2026-04-07T08:45:00Z'),
    },
    {
      slug: 'automating-ci-cd-github-actions-docker-monorepo',
      title: 'Automating Monorepo CI/CD with Turborepo and GitHub Actions',
      summary:
        'Speeding up pull request builds by 85% using remote caching, parallel linting, and automated container image builds.',
      content: `## The Monorepo Testing Challenge

As your monorepo expands to include multiple frontends, API services, and shared packages, testing every workspace on every commit quickly becomes an unsustainable bottleneck.

### Smarter CI with Pipeline Filtering
Rather than building every package, leverage workspace filtering:

\`\`\`bash
# Lint and test only packages modified in the current branch:
pnpm --filter ...[origin/main] lint
pnpm --filter ...[origin/main] test
\`\`\`

### GitHub Actions Cache Optimizations
1. **Pnpm Store Caching**: Save 60+ seconds on dependency resolution.
2. **Docker Layer Caching**: Reuse intermediate layers for unchanged backend code.
3. **Artifact Publishing**: Streamline preview releases with branch-specific tags.`,
      categoryId: catMap.get('devops'),
      tags: ['CI/CD', 'GitHubActions', 'Monorepo', 'DevOps'],
      readTimeMinutes: 5,
      isDraft: false,
      publishedAt: new Date('2026-04-10T13:20:00Z'),
    },
  ];

  for (const post of sampleBlogPosts) {
    await db.insert(blogPosts).values(post).onConflictDoNothing();
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
