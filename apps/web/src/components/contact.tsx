import { RiBusinessMailSendLine, RiDevicePhoneLine } from "solid-icons/ri";
import DecoratorUI from "~/components/decorator-ui";
import CalCom from "~/components/global/calcom";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";

export default function Contact() {
  return (
    <Section id="contact">
      <Paragraph class="mb-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        ./contact
      </Paragraph>
      <DecoratorUI>
        <Heading size="lg" class="mb-4 max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          Let&apos;s Build Something Great Together!
        </Heading>
      </DecoratorUI>
      <DecoratorUI class="mb-16 before:-bottom-3 before:border-t-0 lg:mb-20">
        <Paragraph size="lg" class="max-w-3xl text-muted-foreground font-normal leading-relaxed text-base sm:text-lg lg:text-xl">
          Have a project in mind or just want to say hello? Feel free to reach
          out! Whether it&apos;s a new collaboration or a quick chat, I&apos;m
          always open to connecting.
        </Paragraph>
      </DecoratorUI>
      <DecoratorUI class="mb-16 flex items-center gap-3 lg:mb-20">
        <Button
          size="lg"
          href="mailto:amin.babu.bd@gmail.com"
          class="h-10 cursor-pointer rounded-full px-6 font-medium"
        >
          <RiBusinessMailSendLine class="mr-2 size-4" />
          Shoot us an email
        </Button>
        <Button
          size="lg"
          variant="outline"
          href="tel:+8801621990178"
          class="h-10 cursor-pointer rounded-full px-6 font-medium"
        >
          <RiDevicePhoneLine class="mr-2 size-4" />
          Call Us
        </Button>
      </DecoratorUI>
      <DecoratorUI class="-mt-3 py-px before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed">
        <div class="-mx-3 bg-secondary p-3 min-[819px]:pb-0 min-[819px]:pt-7">
          <CalCom />
        </div>
      </DecoratorUI>
    </Section>
  );
}
