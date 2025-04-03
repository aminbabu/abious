import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const caseStudies = await getCollection("case-study");

  return new Response(JSON.stringify(caseStudies));
};
