import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ params }) => {
  const caseStudies = await getCollection("case-study");
  const caseStudy = caseStudies.find((cs) => cs.id === params.id);

  return new Response(JSON.stringify(caseStudy));
};

export const getStaticPaths = async () => {
  const caseStudies = await getCollection("case-study");

  return caseStudies.map((caseStudy) => ({
    params: { id: caseStudy.id },
  }));
};
