// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";
import dayjs from "dayjs";

// Define a `loader` and `schema` for each collection
export const caseStudy = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    banner: z.string(),
    type: z.string(),
    liveURL: z.string().optional(),
    stack: z.array(z.string()),
    createdAt: z.string().transform((val) => dayjs(val).format("DD MMM, YYYY")),
  }),
});
