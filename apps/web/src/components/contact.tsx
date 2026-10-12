import { createSignal, Show } from "solid-js";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import {
  RiBusinessMailSendLine,
  RiDevicePhoneLine,
  RiSystemCheckDoubleLine,
  RiSystemAlertLine,
  RiSystemLoader4Line,
  RiUserFacesUserLine,
  RiBusinessMailLine,
  RiDocumentArticleLine,
  RiCommunicationChat1Line,
} from "solid-icons/ri";
import DecoratorUI from "~/components/decorator-ui";
import CalCom from "~/components/global/calcom";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/lib/api";

const ContactSchema = v.object({
  name: v.pipe(
    v.string("Name is required"),
    v.nonEmpty("Please enter your name"),
    v.minLength(2, "Name must be at least 2 characters")
  ),
  email: v.pipe(
    v.string("Email address is required"),
    v.nonEmpty("Please enter your email"),
    v.email("Please provide a valid email address")
  ),
  subject: v.pipe(
    v.string("Subject is required"),
    v.nonEmpty("Please enter your subject"),
    v.minLength(3, "Subject must be at least 3 characters")
  ),
  message: v.pipe(
    v.string("Message is required"),
    v.nonEmpty("Please enter your message"),
    v.minLength(10, "Message should be at least 10 characters")
  ),
});

export default function Contact() {
  const [status, setStatus] = createSignal<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = createSignal("");
  const [successMessage, setSuccessMessage] = createSignal("");

  const form = createForm({
    schema: ContactSchema,
  });

  const handleSubmit = async (values: v.InferOutput<typeof ContactSchema>) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await api.contact.submit({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setSuccessMessage(res.message || "Message sent successfully!");
      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

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
      <DecoratorUI class="mb-12 before:-bottom-3 before:border-t-0 lg:mb-16">
        <Paragraph size="lg" class="max-w-3xl text-muted-foreground font-normal leading-relaxed text-base sm:text-lg lg:text-xl">
          Have a project in mind, need technical consulting, or just want to say hello? Send a message directly below, schedule a call, or reach out via email.
        </Paragraph>
      </DecoratorUI>

      {/* Interactive Form & Direct Connect */}
      <div class="mb-16 grid grid-cols-12 gap-y-6 lg:gap-x-8">
        <div class="col-span-12 lg:col-span-7">
          <Card class="bg-card/60 border-dashed backdrop-blur-xs shadow-md">
            <CardContent class="p-6 sm:p-8">
              <h3 class="mb-2 text-xl font-bold font-mono tracking-tight text-foreground">Send a Message</h3>
              <p class="mb-6 text-sm text-muted-foreground">Fill in the details and I'll reply promptly.</p>

              <Show when={status() === "success"}>
                <div class="mb-6 flex items-start gap-3 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-400">
                  <RiSystemCheckDoubleLine class="size-5 shrink-0 mt-0.5 text-emerald-500" />
                  <div>
                    <h4 class="font-semibold text-sm font-mono">Message Sent</h4>
                    <p class="text-xs sm:text-sm mt-0.5 opacity-90">{successMessage()}</p>
                  </div>
                </div>
              </Show>

              <Show when={status() === "error"}>
                <div class="mb-6 flex items-start gap-3 rounded-lg border border-dashed border-destructive/40 bg-destructive/10 p-4 text-destructive">
                  <RiSystemAlertLine class="size-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 class="font-semibold text-sm font-mono">Error Sending Message</h4>
                    <p class="text-xs sm:text-sm mt-0.5 opacity-90">{errorMessage()}</p>
                  </div>
                </div>
              </Show>

              <Form of={form} onSubmit={handleSubmit} class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field of={form} path={["name"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono uppercase tracking-wider text-muted-foreground" for="name">
                          Name *
                        </label>
                        <div class="relative flex items-center">
                          <RiUserFacesUserLine class="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                          <input
                            {...field.props}
                            id="name"
                            type="text"
                            value={field.input ?? ""}
                            placeholder="Jane Doe"
                            disabled={status() === "submitting"}
                            class={`w-full rounded-md border bg-background/50 pl-9.5 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 ${
                              field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                            }`}
                          />
                        </div>
                        {field.errors && (
                          <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                        )}
                      </div>
                    )}
                  </Field>

                  <Field of={form} path={["email"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono uppercase tracking-wider text-muted-foreground" for="email">
                          Email *
                        </label>
                        <div class="relative flex items-center">
                          <RiBusinessMailLine class="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                          <input
                            {...field.props}
                            id="email"
                            type="email"
                            value={field.input ?? ""}
                            placeholder="jane@example.com"
                            disabled={status() === "submitting"}
                            class={`w-full rounded-md border bg-background/50 pl-9.5 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 ${
                              field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                            }`}
                          />
                        </div>
                        {field.errors && (
                          <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <Field of={form} path={["subject"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono uppercase tracking-wider text-muted-foreground" for="subject">
                        Subject *
                      </label>
                      <div class="relative flex items-center">
                        <RiDocumentArticleLine class="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                        <input
                          {...field.props}
                          id="subject"
                          type="text"
                          value={field.input ?? ""}
                          placeholder="Project Inquiry / Consultation"
                          disabled={status() === "submitting"}
                          class={`w-full rounded-md border bg-background/50 pl-9.5 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 ${
                            field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                          }`}
                        />
                      </div>
                      {field.errors && (
                        <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                      )}
                    </div>
                  )}
                </Field>

                <Field of={form} path={["message"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono uppercase tracking-wider text-muted-foreground" for="message">
                        Message *
                      </label>
                      <div class="relative">
                        <RiCommunicationChat1Line class="absolute left-3 top-3 size-4 text-muted-foreground pointer-events-none" />
                        <textarea
                          {...field.props}
                          id="message"
                          rows={4}
                          value={field.input ?? ""}
                          placeholder="Tell me about your project, timeline, and goals..."
                          disabled={status() === "submitting"}
                          class={`w-full rounded-md border bg-background/50 pl-9.5 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 resize-y ${
                            field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                          }`}
                        />
                      </div>
                      {field.errors && (
                        <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                      )}
                    </div>
                  )}
                </Field>

                <div class="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status() === "submitting" || form.isSubmitting}
                    class="w-full sm:w-auto h-11 px-8 rounded-full font-mono font-medium cursor-pointer"
                  >
                    <Show
                      when={status() === "submitting" || form.isSubmitting}
                      fallback={
                        <>
                          <RiBusinessMailSendLine class="mr-2 size-4" />
                          Send Message
                        </>
                      }
                    >
                      <RiSystemLoader4Line class="mr-2 size-4 animate-spin" />
                      Sending...
                    </Show>
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div class="col-span-12 lg:col-span-5 flex flex-col justify-between gap-6">
          <Card class="bg-card border-border/80">
            <CardContent class="p-6 sm:p-8 space-y-6">
              <h3 class="text-xl font-bold tracking-tight text-foreground">Direct Contact</h3>
              <p class="text-sm text-muted-foreground">
                Prefer email or phone? Reach out directly anytime.
              </p>
              <div class="flex flex-col gap-3">
                <Button
                  size="lg"
                  href="mailto:amin.babu.bd@gmail.com"
                  variant="outline"
                  class="h-11 justify-start rounded-xl px-4 font-medium"
                >
                  <RiBusinessMailSendLine class="mr-3 size-5 text-primary" />
                  amin.babu.bd@gmail.com
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  href="tel:+8801621990178"
                  class="h-11 justify-start rounded-xl px-4 font-medium"
                >
                  <RiDevicePhoneLine class="mr-3 size-5 text-primary" />
                  +880 1621-990178
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card class="bg-secondary/40 border-border/60">
            <CardContent class="p-6 space-y-2">
              <span class="text-xs font-mono uppercase tracking-wider text-primary">Availability</span>
              <p class="text-sm font-medium text-foreground">Open for new projects & consulting</p>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Typically responds within 24 hours. Based in Dhaka (UTC+6), working globally.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <DecoratorUI class="-mt-3 py-px before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed">
        <div class="-mx-3 bg-secondary p-3 min-[819px]:pb-0 min-[819px]:pt-7">
          <CalCom />
        </div>
      </DecoratorUI>
    </Section>
  );
}

