import { Title } from "@solidjs/meta";
import PageHero from "~/components/global/hero";
import BlogsGrid from "~/components/blogs/index";
import Contact from "~/components/contact";

export default function BlogsPage() {
  return (
    <>
      <Title>Blogs | Amin Babu - Full Stack Web Developer & Tech Enthusiast</Title>
      <PageHero
        title="Technical Writing & Architecture"
        description="Articles on modern full-stack web development, NestJS, SolidJS, cloud architecture, and engineering principles."
      />
      <BlogsGrid />
      <Contact />
    </>
  );
}
