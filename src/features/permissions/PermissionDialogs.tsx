import { useForm } from "@tanstack/react-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

import type { Permission, CreatePermissionRequest } from "@/types";
import { PermissionSchema } from "#/schemas/permission.schema";
import { FormFieldError } from "#/components/form/form-field-error";

interface Props {
  isCreateOpen: boolean;
  setIsCreateOpen: (v: boolean) => void;
  createMutation: any;

  editTarget: Permission | null;
  setEditTarget: (v: Permission | null) => void;
  updateMutation: any;

  deleteTarget: Permission | null;
  setDeleteTarget: (v: Permission | null) => void;
  deleteMutation: any;
}

export function PermissionDialogs({
  isCreateOpen,
  setIsCreateOpen,
  createMutation,

  editTarget,
  setEditTarget,
  updateMutation,

  deleteTarget,
  setDeleteTarget,
  deleteMutation,
}: Props) {
  return (
    <>
      <PermissionDialog
        open={isCreateOpen}
        title="Create Permission"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(values) =>
          createMutation.mutate(values, {
            onSuccess: () => setIsCreateOpen(false),
          })
        }
        loading={createMutation.isPending}
      />

      {editTarget && (
        <PermissionDialog
          open={!!editTarget}
          title="Edit Permission"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={(values) =>
            updateMutation.mutate(
              { id: editTarget.id, ...values },
              {
                onSuccess: () => setEditTarget(null),
              },
            )
          }
          loading={updateMutation.isPending}
        />
      )}

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
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
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
    </>
  );
}

function PermissionDialog({
  open,
  title,
  defaultValues,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  title: string;
  defaultValues?: Partial<CreatePermissionRequest>;
  onClose: () => void;
  onSubmit: (values: CreatePermissionRequest) => void;
  loading: boolean;
}) {
  const isEdit = !!defaultValues?.name;

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
    },
    validators: {
      onChange: PermissionSchema,
    },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the permission details below.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  autoComplete="off"
                  placeholder="e.g. users:read"
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isEdit}
                />

                <FormFieldError
                  touched={field.state.meta.isTouched}
                  errors={field.state.meta.errors}
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
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                <FormFieldError
                  touched={field.state.meta.isTouched}
                  errors={field.state.meta.errors}
                />
              </div>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
