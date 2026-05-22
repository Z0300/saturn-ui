import { Permissions } from '#/constants/permissions'
import { RolesPage } from '#/features/roles/RolePage'
import { requirePermission } from '#/utils/routeGuard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/roles/')({
  beforeLoad: () => {
    requirePermission(Permissions.PERMISSIONS_READ);
  },
  component: RolesPage,
  staticData: {
    title: "Role Management",
  },
})

