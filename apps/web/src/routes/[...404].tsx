import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import NotFoundState from "~/components/global/not-found-state";
import Contact from "~/components/contact";

export default function NotFound() {
  return (
    <>
      <Title>Page Not Found | Amin Babu</Title>
      <HttpStatusCode code={404} />
      <NotFoundState
        badge="./status/404"
        code="404"
        title="Page Not Found"
        description="The page you are looking for doesn't exist, has been moved, or the link might be broken."
        primaryAction={{
          label: "Browse Case Studies",
          href: "/case-studies",
        }}
        secondaryAction={{
          label: "Return Home",
          href: "/",
        }}
      />
      <Contact />
    </>
  );
}
