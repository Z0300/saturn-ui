import { useState } from "react";
import { usePermissions } from "@/services/permissions/permissionQueries";
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "@/services/permissions/permissionMutations";
import { Permissions } from "@/constants/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "@tanstack/react-form";
import { PlusIcon, PencilIcon, TrashIcon, Loader2Icon } from "lucide-react";
import type { Permission, CreatePermissionRequest } from "@/types";
import { Can } from "#/components/rbac/can";

export function PermissionsPage() {
  const { data: permissions, isLoading } = usePermissions();
  const createMutation = useCreatePermissionMutation();
  const deleteMutation = useDeletePermissionMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Permission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Manage system permissions ({permissions?.length ?? 0} total)
          </p>
        </div>
        <Can permission={Permissions.PERMISSIONS_CREATE}>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Permission
          </Button>
        </Can>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  No permissions found
                </TableCell>
              </TableRow>
            )}
            {permissions?.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="font-mono text-sm">
                  {permission.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {permission.name.split(":")[0]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {permission.name.split(":")[1]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {permission.description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Can permission={Permissions.PERMISSIONS_UPDATE}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditTarget(permission)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </Can>
                    <Can permission={Permissions.PERMISSIONS_DELETE}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(permission)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </Can>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PermissionFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={(values) =>
          createMutation.mutate(values, {
            onSuccess: () => setIsCreateOpen(false),
          })
        }
        isPending={createMutation.isPending}
        error={createMutation.error}
      />

      {editTarget && (
        <EditPermissionDialog
          permission={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-mono font-semibold">
                {deleteTarget?.name}
              </span>
              ? This will remove it from all roles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteTarget &&
                deleteMutation.mutate(deleteTarget.id, {
                  onSuccess: () => setDeleteTarget(null),
                })
              }
            >
              {deleteMutation.isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface PermissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<CreatePermissionRequest>;
  onSubmit: (values: CreatePermissionRequest) => void;
  isPending: boolean;
  error: any;
}

function PermissionFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending,
  error,
}: PermissionFormDialogProps) {
  const isEdit = !!defaultValues?.name;

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
    },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Permission" : "Create Permission"}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>
                  Name
                  <span className="ml-1 text-xs text-muted-foreground">
                    (format: resource:action)
                  </span>
                </Label>
                <Input
                  id={field.name}
                  placeholder="e.g. users:read"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isEdit} // ← don't allow renaming
                />
              </div>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>Description</Label>
                <Input
                  id={field.name}
                  placeholder="e.g. View all users"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          {error && (
            <p className="text-sm text-destructive">
              {error?.response?.data?.message ?? "Something went wrong"}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditPermissionDialog({
  permission,
  onClose,
}: {
  permission: Permission;
  onClose: () => void;
}) {
  const updateMutation = useUpdatePermissionMutation(permission.id);

  const form = useForm({
    defaultValues: {
      name: permission.name,
      description: permission.description,
    },
    onSubmit: async ({ value }) => {
      updateMutation.mutate(value, {
        onSuccess: () => onClose(),
      });
    },
  });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label>Name</Label>
                <Input
                  value={field.state.value}
                  disabled // ← name is immutable
                />
              </div>
            )}
          />
          <form.Field
            name="description"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label>Description</Label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />
          {updateMutation.error && (
            <p className="text-sm text-destructive">
              {(updateMutation.error as any)?.response?.data?.message ??
                "Something went wrong"}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
