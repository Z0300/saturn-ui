import { Permissions } from '#/constants/permissions'
import { requirePermission } from '#/utils/routeGuard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/users/profile/')({
  component: RouteComponent,
  beforeLoad: () => {
    requirePermission(Permissions.PROFILE_READ)
  },
})

function RouteComponent() {
  return <div>Hello "/_admin/users/profile/"!</div>
}
