import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import {
  RiLogosGithubFill,
  RiLogosGoogleFill,
  RiUserFacesUserLine,
  RiBusinessMailLine,
  RiSystemLockLine,
  RiSystemEyeLine,
  RiSystemEyeOffLine,
  RiArrowsArrowRightLine,
  RiUserFacesUserAddLine,
} from "solid-icons/ri";
import AuthLayout from "~/components/auth/auth-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const RegisterSchema = v.object({
  name: v.pipe(
    v.string("Full name is required"),
    v.nonEmpty("Please enter your full name"),
    v.minLength(2, "Name must have at least 2 characters")
  ),
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: RegisterSchema,
  });

  const handleSubmit = async (values: v.InferOutput<typeof RegisterSchema>) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard/overview",
      });

      if (error) {
        setErrorMessage(error.message || "Failed to create account.");
      } else {
        window.location.href = "/dashboard/overview";
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setErrorMessage(null);
    try {
      const res = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard/overview`,
      });

      if (res?.error) {
        setErrorMessage(res.error.message || `Failed to authenticate with ${provider}.`);
      } else if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to sign up with ${provider}.`);
    }
  };

  return (
    <AuthLayout
      title="Create Admin Account"
      subtitle="Register an authorized administrative profile"
      icon={RiUserFacesUserAddLine}
    >
      <Card class="border-dashed bg-card/60 backdrop-blur-md">
        <CardHeader class="pb-4">
          <CardTitle class="text-lg">Get started</CardTitle>
          <CardDescription>Create your credentials or sign up via OAuth.</CardDescription>
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
              disabled={loading()}
              onClick={() => handleSocialSignIn("github")}
              class="w-full flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              <RiLogosGithubFill class="size-4.5" />
              <span>GitHub</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading()}
              onClick={() => handleSocialSignIn("google")}
              class="w-full flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              <RiLogosGoogleFill class="size-4.5" />
              <span>Google</span>
            </Button>
          </div>

          <div class="relative flex items-center justify-center py-2">
            <div class="w-full border-t border-dashed border-border" />
            <span class="absolute bg-card px-2 text-[11px] uppercase text-muted-foreground">
              Or sign up with email
            </span>
          </div>

          {/* Registration Form with Formisch */}
          <Form of={form} onSubmit={handleSubmit} class="space-y-4">
            <Field of={form} path={["name"]}>
              {(field) => (
                <div class="space-y-1.5">
                  <label for="name" class="text-xs font-medium text-foreground">
                    Full Name
                  </label>
                  <div class="relative flex items-center">
                    <RiUserFacesUserLine class="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      {...field.props}
                      id="name"
                      type="text"
                      value={field.input ?? ""}
                      placeholder="Amin Babu"
                      class="w-full rounded-md border border-input bg-background/50 pl-9.5 pr-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  {field.errors && (
                    <p class="text-[11px] text-destructive">{field.errors[0]}</p>
                  )}
                </div>
              )}
            </Field>

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
                  <label for="password" class="text-xs font-medium text-foreground">
                    Password
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
              <span>{loading() || form.isSubmitting ? "Creating profile..." : "Create Account"}</span>
              <RiArrowsArrowRightLine class="size-4" />
            </Button>
          </Form>

          <div class="text-center pt-2 text-xs text-muted-foreground">
            Already have an account?{" "}
            <A href="/auth/login" class="text-primary hover:underline font-medium">
              Sign in
            </A>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
