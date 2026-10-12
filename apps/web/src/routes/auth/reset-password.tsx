import { createSignal, Show, onMount } from "solid-js";
import { A, useSearchParams } from "@solidjs/router";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import {
  RiSystemShieldKeyholeLine,
  RiSystemLockLine,
  RiSystemEyeLine,
  RiSystemEyeOffLine,
  RiArrowsArrowRightLine,
  RiSystemCheckLine,
} from "solid-icons/ri";
import AuthLayout from "~/components/auth/auth-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const ResetPasswordSchema = v.pipe(
  v.object({
    password: v.pipe(
      v.string("Password is required"),
      v.nonEmpty("Please enter a new password"),
      v.minLength(8, "Password must have at least 8 characters")
    ),
    confirmPassword: v.pipe(
      v.string("Confirm password is required"),
      v.nonEmpty("Please confirm your password")
    ),
  }),
  v.forward(
    v.check(
      (input) => input.password === input.confirmPassword,
      "Passwords do not match."
    ),
    ["confirmPassword"]
  )
);

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [token, setToken] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [success, setSuccess] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: ResetPasswordSchema,
  });

  onMount(() => {
    const queryToken = searchParams.token;
    if (queryToken && typeof queryToken === "string") {
      setToken(queryToken);
    } else {
      setErrorMessage("No valid password reset token found in URL.");
    }
  });

  const handleSubmit = async (values: v.InferOutput<typeof ResetPasswordSchema>) => {
    setErrorMessage(null);

    if (!token()) {
      setErrorMessage("Missing or invalid token. Please request a new link.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token: token(),
      });

      if (error) {
        setErrorMessage(error.message || "Failed to reset password.");
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
      title="Set New Password"
      subtitle="Enter a new secure password for your account"
      icon={RiSystemShieldKeyholeLine}
    >
      <Card class="border-dashed bg-card/60 backdrop-blur-md">
        <CardHeader class="pb-4">
          <CardTitle class="text-lg">Reset credentials</CardTitle>
          <CardDescription>
            Choose a strong password with at least 8 characters.
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
                    <span>Password updated successfully!</span>
                  </div>
                  <p class="text-muted-foreground leading-relaxed">
                    You can now log in using your new credentials.
                  </p>
                </div>
                <Button
                  as="a"
                  href="/auth/login"
                  class="w-full font-mono text-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to sign in</span>
                  <RiArrowsArrowRightLine class="size-4" />
                </Button>
              </div>
            }
          >
            {/* Formisch Form */}
            <Form of={form} onSubmit={handleSubmit} class="space-y-4">
              <Field of={form} path={["password"]}>
                {(field) => (
                  <div class="space-y-1.5">
                    <label for="password" class="text-xs font-mono font-medium text-foreground">
                      New Password
                    </label>
                    <div class="relative flex items-center">
                      <RiSystemLockLine class="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                      <input
                        {...field.props}
                        id="password"
                        type={showPassword() ? "text" : "password"}
                        value={field.input ?? ""}
                        placeholder="Minimum 8 characters"
                        class="w-full rounded-md border border-input bg-background/50 pl-9.5 pr-9 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword())}
                        aria-label={showPassword() ? "Hide password" : "Show password"}
                        class="absolute right-2.5 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showPassword() ? (
                          <RiSystemEyeOffLine class="size-4" />
                        ) : (
                          <RiSystemEyeLine class="size-4" />
                        )}
                      </button>
                    </div>
                    {field.errors && (
                      <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field of={form} path={["confirmPassword"]}>
                {(field) => (
                  <div class="space-y-1.5">
                    <label for="confirmPassword" class="text-xs font-mono font-medium text-foreground">
                      Confirm New Password
                    </label>
                    <div class="relative flex items-center">
                      <RiSystemLockLine class="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                      <input
                        {...field.props}
                        id="confirmPassword"
                        type={showConfirmPassword() ? "text" : "password"}
                        value={field.input ?? ""}
                        placeholder="Repeat new password"
                        class="w-full rounded-md border border-input bg-background/50 pl-9.5 pr-9 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                        aria-label={showConfirmPassword() ? "Hide password" : "Show password"}
                        class="absolute right-2.5 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showConfirmPassword() ? (
                          <RiSystemEyeOffLine class="size-4" />
                        ) : (
                          <RiSystemEyeLine class="size-4" />
                        )}
                      </button>
                    </div>
                    {field.errors && (
                      <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                    )}
                  </div>
                )}
              </Field>

              <Button
                type="submit"
                disabled={loading() || !token() || form.isSubmitting}
                class="w-full font-mono mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loading() || form.isSubmitting ? "Updating password..." : "Confirm & Save"}</span>
                <RiArrowsArrowRightLine class="size-4" />
              </Button>
            </Form>

            <div class="text-center pt-2 text-xs text-muted-foreground font-mono">
              Remembered your credentials?{" "}
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
