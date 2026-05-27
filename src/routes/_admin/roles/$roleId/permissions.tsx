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
        const id = Number(params.roleId);
        if (!Number.isInteger(id) || id <= 0) {
            throw notFound();
        }
        try {
            return await getRole(id);
        } catch (error: any) {
            if (error?.response?.status === 404) throw notFound();
            throw error;
        }
    },
    component: ManageRolePermissionsPage,
    staticData: {
        title: "Manage Role Permission"
    }
});