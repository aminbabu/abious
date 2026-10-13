import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import {
  RiOthersKeyLine,
  RiBusinessMailLine,
  RiBusinessMailSendLine,
  RiArrowsArrowLeftLine,
  RiSystemCheckLine,
} from "solid-icons/ri";
import AuthLayout from "~/components/auth/auth-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const ForgotPasswordSchema = v.object({
  email: v.pipe(
    v.string("Email address is required"),
    v.nonEmpty("Please enter your email"),
    v.email("Please provide a valid email address")
  ),
});

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: ForgotPasswordSchema,
  });

  const handleSubmit = async (values: v.InferOutput<typeof ForgotPasswordSchema>) => {
    setErrorMessage(null);
    setLoading(true);
    setSubmittedEmail(values.email);

    try {
      const { error } = await authClient.forgetPassword({
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message || "Failed to process request.");
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recover Password"
      subtitle="Reset your password via verified email link"
      icon={RiOthersKeyLine}
    >
      <Card class="border-dashed bg-card/60 backdrop-blur-md">
        <CardHeader class="pb-4">
          <CardTitle class="text-lg">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email and we'll send a secure reset link to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Show when={errorMessage()}>
            <div class="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage()}
            </div>
          </Show>

          <Show
            when={!success()}
            fallback={
              <div class="space-y-4">
                <div class="rounded-md border border-primary/50 bg-primary/10 p-4 text-xs text-foreground space-y-2">
                  <div class="flex items-center gap-2 font-medium text-primary">
                    <RiSystemCheckLine class="size-4" />
                    <span>Reset link dispatched!</span>
                  </div>
                  <p class="text-muted-foreground leading-relaxed">
                    If an account exists for <span class="font-mono font-semibold text-foreground">{submittedEmail()}</span>,
                    a password recovery email has been sent. Check your inbox or Mailpit.
                  </p>
                </div>
                <Button
                  as="a"
                  href="/auth/login"
                  variant="outline"
                  class="w-full text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <RiArrowsArrowLeftLine class="size-3.5" />
                  <span>Return to sign in</span>
                </Button>
              </div>
            }
          >
            {/* Formisch Form */}
            <Form of={form} onSubmit={handleSubmit} class="space-y-4">
              <Field of={form} path={["email"]}>
                {(field) => (
                  <div class="space-y-1.5">
                    <label for="email" class="text-xs font-medium text-foreground">
                      Email address
                    </label>
                    <div class="relative flex items-center">
                      <RiBusinessMailLine class="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                      <input
                        {...field.props}
                        id="email"
                        type="email"
                        value={field.input ?? ""}
                        placeholder="admin@example.com"
                        class="w-full rounded-md border border-input bg-background/50 pl-9.5 pr-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    {field.errors && (
                      <p class="text-[11px] text-destructive">{field.errors[0]}</p>
                    )}
                  </div>
                )}
              </Field>

              <Button
                type="submit"
                disabled={loading() || form.isSubmitting}
                class="w-full mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                <RiBusinessMailSendLine class="size-4" />
                <span>{loading() || form.isSubmitting ? "Sending link..." : "Send reset link"}</span>
              </Button>
            </Form>

            <div class="text-center pt-2 text-xs text-muted-foreground">
              Remember your password?{" "}
              <A href="/auth/login" class="text-primary hover:underline font-medium">
                Sign in
              </A>
            </div>
          </Show>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
