import { useState, useMemo, useEffect } from "react";

import { usePermissions } from "@/services/permissions/permissionQueries";
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "@/services/permissions/permissionMutations";

import type { Permission } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import { Can } from "@/components/rbac/can";
import { Permissions } from "@/constants/permissions";

import { createPermissionColumns } from "./PermissionColumn";
import { PermissionsTable } from "./PermissionTable";
import { PermissionDialogs } from "./PermissionDialogs";

export function PermissionsPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isLoading } = usePermissions({
    page,
    size: pageSize,
    searchTerm: debouncedSearchTerm || undefined,
  });

  const createMutation = useCreatePermissionMutation();
  const updateMutation = useUpdatePermissionMutation();
  const deleteMutation = useDeletePermissionMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Permission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);

  const columns = useMemo(
    () =>
      createPermissionColumns({
        onEdit: setEditTarget,
        onDelete: setDeleteTarget,
      }),
    [],
  );

  const handlePageChange = (newPage: number, newSize?: number) => {
    setPage(newPage);
    if (newSize) setPageSize(newSize);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Permissions</h1>

        <Can permission={Permissions.PERMISSIONS_CREATE}>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Permission
          </Button>
        </Can>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="permissions"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="pl-8"
          />
        </div>
      </div>

      <PermissionsTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <PermissionDialogs
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        createMutation={createMutation}
        editTarget={editTarget}
        setEditTarget={setEditTarget}
        updateMutation={updateMutation}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        deleteMutation={deleteMutation}
      />
    </div>
  );
}
