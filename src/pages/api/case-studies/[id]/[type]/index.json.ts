import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ params }) => {
  const caseStudies = await getCollection("case-study");
  const data = caseStudies
    .filter((cs) => cs.id !== params.id && cs.type === params.type)
    .slice(0, 6);

  return new Response(JSON.stringify(data));
};

export const getStaticPaths = async () => {
  const caseStudies = await getCollection("case-study");

  return caseStudies.map((caseStudy) => ({
    params: { id: caseStudy.id, type: caseStudy.data?.type },
  }));
};
