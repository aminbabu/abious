import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Header from "~/components/header";
import Footer from "~/components/footer";
import { ThemeProvider } from "~/context/theme";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Amin Babu - Full Stack Web Developer & Tech Enthusiast</Title>
          <Meta name="author" content="Amin Babu" />
          <Meta
            name="description"
            content="Building seamless web and mobile experiences with Next.js, NestJS, MERN stack, WordPress, Webflow, and more. Passionate about scalable solutions, performance, and modern UI/UX."
          />
          <Meta
            name="keywords"
            content="Amin Babu, Amin, Babu, Web Developer, Full Stack Developer, Web Designer, Tech Enthusiast, Portfolio, Blog, Dev, UI/UX Designer, Amin Babu Portfolio, Amin Babu Blog"
          />
          <Meta name="og:title" content="Amin Babu | Full Stack Web Developer & Tech Enthusiast" />
          <Meta
            name="og:description"
            content="Building seamless web and mobile experiences with Next.js, NestJS, MERN stack, WordPress, Webflow, and more. Passionate about scalable solutions, performance, and modern UI/UX."
          />
          <Meta name="og:image" content="/og-image.png" />
          <Meta name="og:url" content="https://portfolio.aminbabu.com/" />
          <Meta name="og:type" content="website" />
          <Link rel="icon" type="image/png" href="/favicon/favicon-32x32.png" />

          <ThemeProvider>
            <div class="flex min-h-screen flex-col font-sans antialiased bg-background text-foreground">
              <Header />
              <main class="flex-1">
                <Suspense fallback={<div class="flex h-32 items-center justify-center font-mono text-sm text-muted-foreground">Loading...</div>}>
                  {props.children}
                </Suspense>
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
