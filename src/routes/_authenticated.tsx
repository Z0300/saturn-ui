import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/authContext";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    // context.auth comes from your router context setup
    if (!context.auth.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: () => {
    const { isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    return <Outlet />;
  },
});
