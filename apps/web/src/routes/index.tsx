import { Title } from "@solidjs/meta";
import Hero from "~/components/hero";
import Services from "~/components/services";
import Experience from "~/components/experience";
import CaseStudies from "~/components/case-studies";
import Testimonials from "~/components/testimonials";
import Contact from "~/components/contact";

export default function Home() {
  return (
    <div>
      <Title>Amin Babu - Full Stack Web Developer & Tech Enthusiast</Title>
      <Hero />
      <Services />
      <Experience />
      <CaseStudies />
      <Testimonials />
      <Contact />
    </div>
  );
}
