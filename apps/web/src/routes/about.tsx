import { Title } from "@solidjs/meta";
import PageHero from "~/components/global/hero";
import Contact from "~/components/contact";

export default function About() {
  return (
    <>
      <Title>About | Amin Babu - Full Stack Web Developer & Tech Enthusiast</Title>
      <PageHero
        title="Engineering Impactful Experiences"
        description="Full stack engineer specializing in robust frontend architecture, high-efficiency NestJS backends, and modern web applications."
      />
      <Contact />
    </>
  );
}
