-- Migration: 0001_create_settings_table
CREATE TABLE IF NOT EXISTS "site_settings" (
  "key" TEXT PRIMARY KEY,
  "value" JSONB NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed initial default public settings
INSERT INTO "site_settings" ("key", "value") VALUES
(
  'public',
  '{
    "siteName": "Amin Babu",
    "siteTitle": "Amin Babu - Full Stack Web Developer & Tech Enthusiast",
    "bio": "Expert in crafting responsive web and mobile applications using JavaScript, Next.js, NestJS, MERN stack, PHP, Laravel, WordPress, Webflow, and more — delivering seamless and high-performance user experiences across platforms.",
    "email": "amin.babu.bd@gmail.com",
    "phone": "+8801621990178",
    "resumeUrl": "/resume/Resume - Amin Babu.pdf",
    "calcomLink": "aminbabu/30min",
    "socials": [
      { "id": "github", "title": "GitHub", "url": "https://github.com/aminbabu" },
      { "id": "linkedin", "title": "LinkedIn", "url": "https://www.linkedin.com/in/aminbabu" }
    ]
  }'::jsonb
)
ON CONFLICT ("key") DO NOTHING;
