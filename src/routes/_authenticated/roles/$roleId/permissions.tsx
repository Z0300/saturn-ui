import { createFileRoute } from "@tanstack/react-router"
import { requirePermission } from "@/utils/routeGuard"
import { Permissions } from "@/constants/permissions"
import { ManageRolePermissionsPage } from "#/features/roles/ManageRolePermissionsPage";


export const Route = createFileRoute("/_authenticated/roles/$roleId/permissions")({
    beforeLoad: () => {
        requirePermission(Permissions.PERMISSIONS_UPDATE);
    },
    component: ManageRolePermissionsPage,
    staticData: {
        title: "Manage Role Permission"
    }
})