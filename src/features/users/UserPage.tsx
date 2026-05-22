import { useState, useMemo, useEffect } from "react"
import { useUsers } from "@/services/users/userQueries"
import {
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useAssignRolesMutation,
} from "@/services/users/userMutations"
import type { UserSummary } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Search } from "lucide-react"
import { Can } from "@/components/rbac/can"
import { Permissions } from "@/constants/permissions"
import { createUserColumns } from "./UserColumn"
import { UsersTable } from "./UserTable"
import { UserDialogs } from "./UserDialogs"

export function UsersPage() {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 300)
        return () => clearTimeout(handler)
    }, [search])

    const { data, isLoading } = useUsers({
        page,
        size: pageSize,
        search: debouncedSearch || undefined,
    })

    const createMutation = useCreateUserMutation()
    const updateMutation = useUpdateUserMutation()
    const deleteMutation = useDeleteUserMutation()
    const assignMutation = useAssignRolesMutation()

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<UserSummary | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<UserSummary | null>(null)
    const [rolesTarget, setRolesTarget] = useState<UserSummary | null>(null)

    const columns = useMemo(
        () =>
            createUserColumns({
                onEdit: setEditTarget,
                onDelete: setDeleteTarget,
                onAssignRoles: setRolesTarget,
            }),
        []
    )

    const handlePageChange = (newPage: number, newSize?: number) => {
        setPage(newPage)
        if (newSize) setPageSize(newSize)
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Users</h1>
                <Can permission={Permissions.USERS_CREATE}>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New User
                    </Button>
                </Can>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(0)
                        }}
                        className="pl-8"
                    />
                </div>
            </div>

            <UsersTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />

            <UserDialogs
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
                createMutation={createMutation}
                editTarget={editTarget}
                setEditTarget={setEditTarget}
                updateMutation={updateMutation}
                deleteTarget={deleteTarget}
                setDeleteTarget={setDeleteTarget}
                deleteMutation={deleteMutation}
                rolesTarget={rolesTarget}
                setRolesTarget={setRolesTarget}
                assignMutation={assignMutation}
            />
        </div>
    )
}