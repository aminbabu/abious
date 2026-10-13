import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import {
  RiLogosGithubFill,
  RiLogosGoogleFill,
  RiBusinessMailLine,
  RiSystemLockLine,
  RiSystemEyeLine,
  RiSystemEyeOffLine,
  RiArrowsArrowRightLine,
  RiUserFacesAdminLine,
} from "solid-icons/ri";
import AuthLayout from "~/components/auth/auth-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const LoginSchema = v.object({
  email: v.pipe(
    v.string("Email address is required"),
    v.nonEmpty("Please enter your email"),
    v.email("Please provide a valid email address")
  ),
  password: v.pipe(
    v.string("Password is required"),
    v.nonEmpty("Please enter your password"),
    v.minLength(8, "Password must have at least 8 characters")
  ),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [oauthLoading, setOauthLoading] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: LoginSchema,
  });

  const handleSubmit = async (values: v.InferOutput<typeof LoginSchema>) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard/overview",
      });

      if (error) {
        setErrorMessage(error.message || "Invalid email or password.");
      } else {
        window.location.href = "/dashboard/overview";
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setErrorMessage(null);
    setOauthLoading(provider);

    try {
      const res = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard/overview`,
      });

      if (res?.error) {
        setErrorMessage(res.error.message || `Failed to authenticate with ${provider}.`);
        setOauthLoading(null);
      } else if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to sign in with ${provider}.`);
      setOauthLoading(null);
    }
  };

  return (
    <AuthLayout
      title="Admin Authentication"
      subtitle="Sign in to access your administrative dashboard"
      icon={RiUserFacesAdminLine}
    >
      <Card class="border-dashed bg-card/60 backdrop-blur-md">
        <CardHeader class="pb-4">
          <CardTitle class="text-lg">Welcome back</CardTitle>
          <CardDescription>Enter your credentials or use social single sign-on.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Show when={errorMessage()}>
            <div class="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage()}
            </div>
          </Show>

          {/* Social Logins */}
          <div class="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading() || !!oauthLoading()}
              onClick={() => handleSocialSignIn("github")}
              class="w-full flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              <RiLogosGithubFill class="size-4.5" />
              <span>{oauthLoading() === "github" ? "Connecting..." : "GitHub"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading() || !!oauthLoading()}
              onClick={() => handleSocialSignIn("google")}
              class="w-full flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              <RiLogosGoogleFill class="size-4.5" />
              <span>{oauthLoading() === "google" ? "Connecting..." : "Google"}</span>
            </Button>
          </div>

          <div class="relative flex items-center justify-center py-2">
            <div class="w-full border-t border-dashed border-border" />
            <span class="absolute bg-card px-2 text-[11px] uppercase text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Credentials Form with Formisch */}
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

            <Field of={form} path={["password"]}>
              {(field) => (
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label for="password" class="text-xs font-medium text-foreground">
                      Password
                    </label>
                    <A
                      href="/auth/forgot-password"
                      class="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </A>
                  </div>
                  <div class="relative flex items-center">
                    <RiSystemLockLine class="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      {...field.props}
                      id="password"
                      type={showPassword() ? "text" : "password"}
                      value={field.input ?? ""}
                      placeholder="••••••••"
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
                    <p class="text-[11px] text-destructive">{field.errors[0]}</p>
                  )}
                </div>
              )}
            </Field>

            <Button
              type="submit"
              disabled={loading() || !!oauthLoading() || form.isSubmitting}
              class="w-full mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading() || form.isSubmitting ? "Authenticating..." : "Sign in"}</span>
              <RiArrowsArrowRightLine class="size-4" />
            </Button>
          </Form>

          <div class="text-center pt-2 text-xs text-muted-foreground">
            Need an account?{" "}
            <A href="/auth/register" class="text-primary hover:underline font-medium">
              Register here
            </A>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
