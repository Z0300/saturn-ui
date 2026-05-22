import { UsersPage } from "#/features/users/UserPage";
import { createFileRoute } from "@tanstack/react-router";
import { requirePermission } from "#/utils/routeGuard";
import { Permissions } from "#/constants/permissions";


export const Route = createFileRoute("/_authenticated/users/")({
  beforeLoad: () => {
    requirePermission(Permissions.USERS_READ);
  },
  component: UsersPage,
  staticData: {
    title: "User Management"
  }
});

