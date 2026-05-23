import type { ColumnDef } from "@tanstack/react-table"
import type { UserSummary } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Can } from "@/components/rbac/can"
import { Permissions } from "@/constants/permissions"
import { PencilIcon, TrashIcon, ShieldIcon } from "lucide-react"

interface UserColumnActions {
    onEdit: (user: UserSummary) => void
    onDelete: (user: UserSummary) => void
    onAssignRoles: (user: UserSummary) => void
}

export function createUserColumns({
    onEdit,
    onDelete,
    onAssignRoles,
}: UserColumnActions): ColumnDef<UserSummary>[] {
    return [
        {
            accessorKey: "firstName",
            header: "First Name",
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.firstName.toUpperCase()}
                </span>
            ),
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.lastName.toUpperCase()}
                </span>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.email}</span>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) =>
                new Date(row.original.createdAt).toLocaleDateString(),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Can permission={Permissions.USERS_UPDATE}>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Assign roles"
                            onClick={() => onAssignRoles(row.original)}
                        >
                            <ShieldIcon className="h-4 w-4" />
                        </Button>
                    </Can>
                    <Can permission={Permissions.USERS_UPDATE}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(row.original)}
                        >
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                    </Can>
                    <Can permission={Permissions.USERS_DELETE}>
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
            ),
        },
    ]
}