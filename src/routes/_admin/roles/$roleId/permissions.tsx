import { createFileRoute, notFound } from "@tanstack/react-router";
import { requirePermission } from "@/utils/routeGuard";
import { Permissions } from "@/constants/permissions";
import { ManageRolePermissionsPage } from "#/features/roles/ManageRolePermissionsPage";
import { getRole } from "#/services/roles/roleService";


export const Route = createFileRoute("/_admin/roles/$roleId/permissions")({
    beforeLoad: () => {
        requirePermission(Permissions.ROLES_UPDATE);
    },
    loader: async ({ params }) => {
        const raw = params.roleId;

        if (!/^\d+$/.test(raw)) {
            throw notFound();
        }

        const id = parseInt(raw, 10);

        if (id <= 0) {
            throw notFound();
        }

        try {
            return await getRole(id);
        } catch (error: any) {
            throw notFound();
        }
    },
    component: ManageRolePermissionsPage,
    staticData: {
        title: "Manage Role Permission"
    }
});