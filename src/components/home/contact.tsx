import DecoratorUI from "@/components/decorator-ui";
import CalCom from "@/components/global/calcom";
import Section from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";
import { ThemeProvider } from "@/context/theme";

const Contact = () => {
  return (
    <Section id="contact">
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./contact
      </Paragraph>
      <DecoratorUI>
        <Heading asChild size="lg">
          <h1 className="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            Let&apos;s Build Something Great Together!
          </h1>
        </Heading>
      </DecoratorUI>
      <DecoratorUI className="mb-16 before:-bottom-3 before:border-t-0 lg:mb-20">
        <Paragraph size="lg" className="max-w-3xl">
          Have a project in mind or just want to say hello? Feel free to reach
          out! Whether it&apos;s a new collaboration or a quick chat, I&apos;m
          always open to connecting.
        </Paragraph>
      </DecoratorUI>
      <DecoratorUI className="mb-16 flex items-center gap-3 lg:mb-20">
        <Button asChild size="lg" className="cursor-pointer rounded-full">
          <a href="mailto:amin.babu.bd@gmail.com">Shoot us an email</a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="cursor-pointer rounded-full"
        >
          <a href="tel:+8801621990178">Call Us</a>
        </Button>
      </DecoratorUI>
      <DecoratorUI className="bg-secondary -mx-3 -mt-5 p-3 min-[819px]:pb-0 min-[819px]:pt-7 bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed">
        <ThemeProvider>
          <CalCom />
        </ThemeProvider>
      </DecoratorUI>
    </Section>
  );
};

export default Contact;
