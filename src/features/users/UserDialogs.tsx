import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { UserSummary, Role } from "@/types"
import { useRoles } from "@/services/roles/roleQueries"
import { useState } from "react"

interface UserDialogsProps {
    isCreateOpen: boolean
    setIsCreateOpen: (open: boolean) => void
    createMutation: any
    editTarget: UserSummary | null
    setEditTarget: (user: UserSummary | null) => void
    updateMutation: any
    deleteTarget: UserSummary | null
    setDeleteTarget: (user: UserSummary | null) => void
    deleteMutation: any
    rolesTarget: UserSummary | null
    setRolesTarget: (user: UserSummary | null) => void
    assignMutation: any
}

export function UserDialogs({
    isCreateOpen,
    setIsCreateOpen,
    createMutation,
    editTarget,
    setEditTarget,
    updateMutation,
    deleteTarget,
    setDeleteTarget,
    deleteMutation,
    rolesTarget,
    setRolesTarget,
    assignMutation,
}: UserDialogsProps) {
    return (
        <>

            <CreateUserDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                createMutation={createMutation}
            />


            {editTarget && (
                <EditUserDialog
                    user={editTarget}
                    onClose={() => setEditTarget(null)}
                    updateMutation={updateMutation}
                />
            )}


            {rolesTarget && (
                <AssignRolesDialog
                    user={rolesTarget}
                    onClose={() => setRolesTarget(null)}
                    assignMutation={assignMutation}
                />
            )}


            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">
                                {deleteTarget?.firstName} {deleteTarget?.lastName}
                            </span>?
                            This action cannot be undone.
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



function CreateUserDialog({
    open,
    onOpenChange,
    createMutation,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    createMutation: any
}) {
    const { data: rolesData } = useRoles()
    const allRoles = rolesData?.data ?? []

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            roleIds: [] as number[],
        },
        onSubmit: async ({ value }) => {
            createMutation.mutate(value, {
                onSuccess: () => onOpenChange(false),
            })
        },
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new user.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <form.Field
                            name="firstName"
                            children={(field) => (
                                <div className="flex flex-col gap-1.5">
                                    <Label>First Name</Label>
                                    <Input
                                        placeholder="John"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        />
                        <form.Field
                            name="lastName"
                            children={(field) => (
                                <div className="flex flex-col gap-1.5">
                                    <Label>Last Name</Label>
                                    <Input
                                        placeholder="Doe"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <form.Field
                        name="email"
                        children={(field) => (
                            <div className="flex flex-col gap-1.5">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        )}
                    />

                    <form.Field
                        name="password"
                        children={(field) => (
                            <div className="flex flex-col gap-1.5">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Min 8 characters"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        )}
                    />

                    <form.Field
                        name="roleIds"
                        children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label>Roles</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {allRoles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={field.state.value.includes(role.id)}
                                                onCheckedChange={(checked) => {
                                                    field.handleChange(
                                                        checked
                                                            ? [...field.state.value, role.id]
                                                            : field.state.value.filter((id) => id !== role.id)
                                                    )
                                                }}
                                            />
                                            <span className="text-sm font-mono">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    />

                    {createMutation.error && (
                        <p className="text-sm text-destructive">
                            {(createMutation.error as any)?.response?.data?.message ??
                                "Something went wrong"}
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
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending && (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}



function EditUserDialog({
    user,
    onClose,
    updateMutation,
}: {
    user: UserSummary
    onClose: () => void
    updateMutation: any
}) {
    const form = useForm({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
        },
        onSubmit: async ({ value }) => {
            updateMutation.mutate(
                { id: user.id, ...value },
                { onSuccess: () => onClose() }
            )
        },
    })

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Edit the details for the user.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <form.Field
                            name="firstName"
                            children={(field) => (
                                <div className="flex flex-col gap-1.5">
                                    <Label>First Name</Label>
                                    <Input
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        />
                        <form.Field
                            name="lastName"
                            children={(field) => (
                                <div className="flex flex-col gap-1.5">
                                    <Label>Last Name</Label>
                                    <Input
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <form.Field
                        name="isActive"
                        children={(field) => (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={field.state.value}
                                    onCheckedChange={(checked) =>
                                        field.handleChange(checked as boolean)
                                    }
                                />
                                <span className="text-sm">Active</span>
                            </label>
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
    )
}



function AssignRolesDialog({
    user,
    onClose,
    assignMutation,
}: {
    user: UserSummary
    onClose: () => void
    assignMutation: any
}) {
    const { data: rolesData } = useRoles()
    const allRoles = rolesData?.data ?? []

    const [selected, setSelected] = useState<Set<number>>(new Set())

    const toggle = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleSave = () => {
        assignMutation.mutate(
            { userId: user.id, data: { roleIds: Array.from(selected) } },
            { onSuccess: () => onClose() }
        )
    }

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Assign Roles —{" "}
                        <span className="font-medium">
                            {user.firstName} {user.lastName}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        Assign roles to the user.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 py-2">
                    {allRoles.map((role) => (
                        <label
                            key={role.id}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Checkbox
                                checked={selected.has(role.id)}
                                onCheckedChange={() => toggle(role.id)}
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-mono font-medium">{role.name}</span>
                                {role.description && (
                                    <span className="text-xs text-muted-foreground">
                                        {role.description}
                                    </span>
                                )}
                            </div>
                        </label>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={assignMutation.isPending}>
                        {assignMutation.isPending && (
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Roles
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}