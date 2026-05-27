import type { ColumnDef } from "@tanstack/react-table"
import type { Role } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Can } from "@/components/rbac/can"
import { Permissions } from "@/constants/permissions"
import { PencilIcon, TrashIcon, ShieldIcon } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

interface RoleColumnActions {
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function createRoleColumns({
  onEdit,
  onDelete,
}: RoleColumnActions): ColumnDef<Role>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-mono font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.description ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.permissions.length === 0 ? (
            <span className="text-muted-foreground text-sm">None</span>
          ) : (
            <>
              {row.original.permissions.slice(0, 3).map((p) => (
                <Badge key={p.id} variant="secondary" className="text-xs font-mono">
                  {p.name}
                </Badge>
              ))}
              {row.original.permissions.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{row.original.permissions.length - 3} more
                </Badge>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const navigate = useNavigate()
        return (
          <div className="flex items-center gap-2" >
            <Can permission={Permissions.ROLES_UPDATE}>
              <Button
                variant="ghost"
                size="icon"
                title="Manage permissions"
                onClick={() => navigate({ to: `/roles/$roleId/permissions`, params: { roleId: `${row.original.id}` } })}
              >
                <ShieldIcon className="h-4 w-4" />
              </Button>
            </Can>
            <Can permission={Permissions.ROLES_UPDATE}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(row.original)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Can>
            <Can permission={Permissions.ROLES_DELETE}>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(row.original)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </Can>
          </div>
        )
      },
    },
  ]
}