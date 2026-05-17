import { createFileRoute } from "@tanstack/react-router";
import { requirePermission } from "@/utils/routeGuard";
import { Permissions } from "@/constants/permissions";
import { PermissionsPage } from "#/features/permissions/PermissionsPage";

export const Route = createFileRoute("/_authenticated/permissions/")({
  beforeLoad: () => {
    requirePermission(Permissions.PERMISSIONS_READ);
  },
  component: PermissionsPage,
});
