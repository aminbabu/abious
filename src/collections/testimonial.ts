// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// Define a `loader` and `schema` for each collection
export const testimonial = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    avatar: z.string(),
  }),
});
