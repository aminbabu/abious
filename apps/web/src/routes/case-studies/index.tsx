import { Title } from "@solidjs/meta";
import PageHero from "~/components/global/hero";
import CaseStudiesGrid from "~/components/case-studies/index";
import Contact from "~/components/contact";


export default function CaseStudiesPage() {
  return (
    <>
      <Title>Case Studies | Amin Babu - Full Stack Web Developer & Tech Enthusiast</Title>
      <PageHero
        title="Case Studies"
        description="In-depth analysis of a real-world project, showcasing challenges, solutions, and results in web development and technology."
      />
      <CaseStudiesGrid />
      <Contact />
    </>
  );
}
