import { useState, useMemo, useEffect } from "react"
import { useRoles } from "@/services/roles/roleQueries"
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsMutation,
} from "@/services/roles/roleMutations"
import type { Role } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Search } from "lucide-react"
import { Can } from "@/components/rbac/can"
import { Permissions } from "@/constants/permissions"
import { createRoleColumns } from "./RoleColumn"
import { RolesTable } from "./RoleTable"
import { RoleDialogs } from "./RoleDialogs"

export function RolesPage() {
  const [page,            setPage]            = useState(0)
  const [pageSize,        setPageSize]        = useState(20)
  const [search,          setSearch]          = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handler)
  }, [search])

  const { data, isLoading } = useRoles({
    page,
    size: pageSize,
    search: debouncedSearch || undefined,
  })

  const createMutation  = useCreateRoleMutation()
  const updateMutation  = useUpdateRoleMutation()
  const deleteMutation  = useDeleteRoleMutation()
  const assignMutation  = useAssignPermissionsMutation()

  const [isCreateOpen,       setIsCreateOpen]       = useState(false)
  const [editTarget,         setEditTarget]         = useState<Role | null>(null)
  const [deleteTarget,       setDeleteTarget]       = useState<Role | null>(null)
  const [permissionsTarget,  setPermissionsTarget]  = useState<Role | null>(null)

  const columns = useMemo(
    () =>
      createRoleColumns({
        onEdit:              setEditTarget,
        onDelete:            setDeleteTarget,
        onManagePermissions: setPermissionsTarget,
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
        <h1 className="text-2xl font-semibold">Roles</h1>
        <Can permission={Permissions.ROLES_CREATE}>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Role
          </Button>
        </Can>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            className="pl-8"
          />
        </div>
      </div>

      <RolesTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <RoleDialogs
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        createMutation={createMutation}
        editTarget={editTarget}
        setEditTarget={setEditTarget}
        updateMutation={updateMutation}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        deleteMutation={deleteMutation}
        permissionsTarget={permissionsTarget}
        setPermissionsTarget={setPermissionsTarget}
        assignMutation={assignMutation}
      />
    </div>
  )
}