import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ params }) => {
  const testimonials = await getCollection("testimonial");

  return new Response(JSON.stringify(testimonials));
};
