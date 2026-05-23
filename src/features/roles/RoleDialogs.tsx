import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2Icon } from "lucide-react"
import type { Role } from "@/types"

interface RoleDialogsProps {
  isCreateOpen: boolean
  setIsCreateOpen: (open: boolean) => void
  createMutation: any
  editTarget: Role | null
  setEditTarget: (role: Role | null) => void
  updateMutation: any
  deleteTarget: Role | null
  setDeleteTarget: (role: Role | null) => void
  deleteMutation: any
}

export function RoleDialogs({
  isCreateOpen,
  setIsCreateOpen,
  createMutation,
  editTarget,
  setEditTarget,
  updateMutation,
  deleteTarget,
  setDeleteTarget,
  deleteMutation
}: RoleDialogsProps) {
  return (
    <>

      <RoleFormDialog
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
        <RoleFormDialog
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
          defaultValues={editTarget}
          onSubmit={(values) =>
            updateMutation.mutate(
              { id: editTarget.id, ...values },
              { onSuccess: () => setEditTarget(null) }
            )
          }
          isPending={updateMutation.isPending}
          error={updateMutation.error}
        />
      )}





      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-mono font-semibold">{deleteTarget?.name}</span>?
              All users with this role will lose its permissions.
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
    </>
  )
}


interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<{ name: string; description: string }>
  onSubmit: (values: { name: string; description: string }) => void
  isPending: boolean
  error: any
}

function RoleFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending,
  error,
}: RoleFormDialogProps) {
  const isEdit = !!defaultValues?.name

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
    },
    onSubmit: async ({ value }) => onSubmit(value),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {isEdit ? "Edit the role" : "Create a new role"}
        </DialogDescription>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>
                  Name
                  <span className="ml-1 text-xs text-muted-foreground">
                    (uppercase, e.g. MANAGER)
                  </span>
                </Label>
                <Input
                  id={field.name}
                  placeholder="e.g. MANAGER"
                  autoComplete={field.name}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  disabled={isEdit}
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
                  placeholder="e.g. Manager access"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          {error && (
            <p className="text-sm text-destructive">
              {(error as any)?.response?.data?.message ?? "Something went wrong"}
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
  )
}

