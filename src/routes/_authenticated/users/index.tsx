import { useAuthStore } from "#/store/authStore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users/")({
  beforeLoad: () => {
    const { permissions } = useAuthStore.getState();

    if (!permissions.includes("users:read")) {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: UsersPage,
});

function UsersPage() {
  return <div>Hello "/_authenticated/users/"!</div>;
}
