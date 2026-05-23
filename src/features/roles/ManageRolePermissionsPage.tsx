import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, Loader2Icon, ShieldIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissions } from "@/services/permissions/permissionQueries";
import { useAssignPermissionsMutation } from "@/services/roles/roleMutations";
import { useRole } from "@/services/roles/roleQueries";
import type { Permission } from "@/types";

export function ManageRolePermissionsPage() {
    const { roleId } = useParams({
        from: "/_authenticated/roles/$roleId/permissions",
    });
    const navigate = useNavigate();

    const { data: role, isLoading: roleLoading } = useRole(Number(roleId));
    const { data: permsData, isLoading: permsLoading } = usePermissions();
    const assignMutation = useAssignPermissionsMutation();

    const allPermissions = permsData?.data ?? [];
    const [selected, setSelected] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (role?.permissions) {
            setSelected(new Set(role.permissions.map((p) => p.id)));
        }
    }, [role]);

    const toggle = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleGroup = (perms: Permission[]) => {
        const allSelected = perms.every((p) => selected.has(p.id));
        setSelected((prev) => {
            const next = new Set(prev);
            if (allSelected) {
                for (const p of perms) {
                    next.delete(p.id);
                }
            } else {
                for (const p of perms) {
                    next.add(p.id);
                }
            }
            return next;
        });
    };

    const grouped = allPermissions.reduce(
        (acc, p) => {
            const resource = p.name.split(":")[0];
            if (!acc[resource]) acc[resource] = [];
            acc[resource].push(p);
            return acc;
        },
        {} as Record<string, Permission[]>,
    );

    const handleSave = () => {
        if (!role) return;
        assignMutation.mutate(
            { roleId: role.id, data: { permissionIds: Array.from(selected) } },
            { onSuccess: () => navigate({ to: "/roles" }) },
        );
    };

    if (roleLoading || permsLoading) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!role) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <p className="text-muted-foreground">Role not found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate({ to: "/roles" })}
                    className="h-9 w-9 rounded-lg"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Role Permissions
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage permission bindings for application roles
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-6 flex flex-col gap-4">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <ShieldIcon className="h-5 w-5" />
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Role Name
                                    </span>
                                    <h2 className="text-lg font-bold font-mono tracking-tight text-foreground truncate">
                                        {role.name}
                                    </h2>
                                </div>
                            </div>

                            {role.description && (
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Description
                                    </span>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {role.description}
                                    </p>
                                </div>
                            )}

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-muted-foreground">
                                        Selected Permissions
                                    </span>
                                    <span className="font-mono text-foreground font-semibold">
                                        {selected.size} / {allPermissions.length}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300 ease-out"
                                        style={{
                                            width: `${(selected.size / Math.max(allPermissions.length, 1)) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t">
                                <Button
                                    onClick={handleSave}
                                    disabled={assignMutation.isPending}
                                    className="w-full cursor-pointer"
                                >
                                    {assignMutation.isPending && (
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Save Permissions
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate({ to: "/roles" })}
                                    className="w-full cursor-pointer"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(grouped).map(([resource, perms]) => {
                        const allSelected = perms.every((p) => selected.has(p.id));
                        const someSelected = perms.some((p) => selected.has(p.id));
                        const selectedCount = perms.filter((p) =>
                            selected.has(p.id),
                        ).length;

                        return (
                            <div
                                key={resource}
                                className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md flex flex-col overflow-hidden"
                            >
                                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id={`group-${resource}`}
                                            checked={allSelected}
                                            ref={(el) => {
                                                if (el)
                                                    (el as unknown as HTMLInputElement).indeterminate =
                                                        someSelected && !allSelected;
                                            }}
                                            onCheckedChange={() => toggleGroup(perms)}
                                            className="h-4 w-4 rounded cursor-pointer"
                                        />
                                        <label
                                            htmlFor={`group-${resource}`}
                                            className="text-sm font-semibold uppercase tracking-wider text-foreground cursor-pointer select-none"
                                        >
                                            {resource}
                                        </label>
                                    </div>
                                    <Badge
                                        variant={selectedCount > 0 ? "secondary" : "outline"}
                                        className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                                    >
                                        {selectedCount} / {perms.length}
                                    </Badge>
                                </div>

                                <div className="p-4 flex flex-col gap-2.5">
                                    {perms.map((p) => {
                                        const isChecked = selected.has(p.id);
                                        const action = p.name.split(":")[1];
                                        return (
                                            <label
                                                key={p.id}
                                                htmlFor={`perm-${p.id}`}
                                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-150 group hover:border-foreground/20 ${isChecked
                                                    ? "bg-accent/40 border-accent-foreground/20"
                                                    : "bg-background border-border"
                                                    }`}
                                            >
                                                <Checkbox
                                                    id={`perm-${p.id}`}
                                                    checked={isChecked}
                                                    onCheckedChange={() => toggle(p.id)}
                                                    className="mt-0.5 h-4 w-4 rounded cursor-pointer"
                                                />
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <span className="text-sm font-mono font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">
                                                        {action}
                                                    </span>
                                                    {p.description && (
                                                        <span className="text-xs text-muted-foreground leading-normal">
                                                            {p.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
