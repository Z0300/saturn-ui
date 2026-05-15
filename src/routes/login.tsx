import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/LoginForm";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    // Already logged in → go to dashboard
    if (!context.auth.isLoading && context.auth.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  return <LoginForm />;
}
