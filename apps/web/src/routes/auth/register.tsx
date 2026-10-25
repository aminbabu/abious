import { A } from "@solidjs/router";
import {
  RiSystemLockLine,
  RiArrowsArrowRightLine,
} from "solid-icons/ri";
import AuthLayout from "~/components/auth/auth-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Registration Closed"
      subtitle="Public registration is disabled for this personal administrative portal"
      icon={RiSystemLockLine}
    >
      <Card class="border-dashed bg-card/60 backdrop-blur-md">
        <CardHeader class="pb-4 text-center">
          <CardTitle class="text-lg">Owner Access Only</CardTitle>
          <CardDescription>
            This website is a personal portfolio. Only pre-configured administrator accounts are permitted.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-md border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground text-center leading-relaxed">
            If you are the site owner, please proceed with your administrator credentials.
          </div>

          <Button
            href="/auth/login"
            class="w-full mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Proceed to Sign In</span>
            <RiArrowsArrowRightLine class="size-4" />
          </Button>

          <div class="text-center pt-2 text-xs text-muted-foreground">
            <A href="/" class="text-primary hover:underline font-medium">
              Back to main website
            </A>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
