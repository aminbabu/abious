import "@splidejs/react-splide/css";

import DecoratorUI from "@/components/decorator-ui";
import MarkdownRenderer from "@/components/global/markdown-renderer";
import Section from "@/components/layouts/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";
import TestimonialsLoader from "@/components/ui/loaders/testimonials";
import type { ITestimonial } from "@/interfaces/testimonial";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import axios from "axios";
import useSWR from "swr";

const Testimonials = () => {
  const { data, error, isLoading } = useSWR(
    "/api/testimonials/index.json",
    axios.get
  );

  let content = null;

  if (isLoading) {
    content = (
      <DecoratorUI className="before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed -mt-5">
        <div className="bg-secondary -mx-3 p-3">
          <TestimonialsLoader />
        </div>
      </DecoratorUI>
    );
  }

  if (!isLoading && error) {
    content = (
      <DecoratorUI className="before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed -mt-5">
        <div className="bg-secondary -mx-3 p-3">{error.message}</div>
      </DecoratorUI>
    );
  }

  if (!isLoading && !error && !data?.data?.length) {
    content = (
      <DecoratorUI className="before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed -mt-5">
        <div className="bg-secondary -mx-3 p-3">
          <p className="text-muted-foreground">No testimonials found.</p>
        </div>
      </DecoratorUI>
    );
  }

  if (!isLoading && !error && data?.data?.length) {
    content = (
      <Splide
        hasTrack={false}
        options={{
          type: "loop",
          perPage: 1,
          gap: "0.75rem",
          arrows: false,
          pagination: false,
          padding: {
            right: "15%",
          },
          autoScroll: { speed: 0.125 },
          mediaQuery: "min",
          breakpoints: {
            768: {
              perPage: 2,
            },
          },
        }}
        extensions={{ AutoScroll }}
        aria-label="Testimonials"
        className="-mt-3"
      >
        <DecoratorUI className="before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed py-px">
          <div className="-mx-3 bg-secondary px-3">
            <SplideTrack>
              {data?.data?.map((testimonial: ITestimonial) => (
                <SplideSlide key={testimonial?.id} className="py-3">
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col gap-6">
                      <CardDescription>
                        <MarkdownRenderer
                          content={testimonial?.body}
                          className="prose-p:text-lg"
                        />
                      </CardDescription>
                      <div className="mt-auto flex items-center gap-4">
                        <figure className="border-border block aspect-square size-16 overflow-hidden rounded-full border shadow">
                          <img
                            src={testimonial?.data?.avatar}
                            alt={testimonial?.data?.name}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover object-center"
                          />
                        </figure>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {testimonial?.data?.name}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground text-sm">
                            {testimonial?.data?.role}
                          </CardDescription>
                          <CardDescription className="text-muted-foreground text-sm">
                            {testimonial?.data?.company}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SplideSlide>
              ))}
            </SplideTrack>
          </div>
        </DecoratorUI>
      </Splide>
    );
  }

  return (
    <Section id="testimonials">
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./testimonials
      </Paragraph>
      <DecoratorUI className="mb-16 lg:mb-20">
        <Heading className="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Words That Matter, Trust That Counts
        </Heading>
      </DecoratorUI>
      {content}
    </Section>
  );
};

export default Testimonials;
