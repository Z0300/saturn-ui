import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useChangePasswordMutation } from "#/services/auth/authMutations";
import { ChangePasswordSchema } from "@/schemas";
import { requirePermission } from "#/utils/routeGuard";
import { Permissions } from "#/constants/permissions";

const RULES = [
    { key: "len", label: "8–128 characters", test: (v: string) => v.length >= 8 && v.length <= 128 },
    { key: "upper", label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
    { key: "lower", label: "Lowercase letter", test: (v: string) => /[a-z]/.test(v) },
    { key: "digit", label: "Number", test: (v: string) => /\d/.test(v) },
    { key: "special", label: "Special character (@$!%*?&)", test: (v: string) => /[@$!%*?&]/.test(v) },
];

function ChangePasswordPage() {
    const changePasswordMutation = useChangePasswordMutation();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validators: {
            onChange: ChangePasswordSchema,
        },
        onSubmit: async ({ value }) => {
            await changePasswordMutation.mutateAsync({
                currentPassword: value.currentPassword,
                newPassword: value.newPassword,
            });
        },
    });

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: ".." })}
                    className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={16} className="mr-1.5" />
                    Back
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Change password</CardTitle>
                        <CardDescription>
                            Update your account password below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                        >
                            <form.Field
                                name="currentPassword"
                                children={(field) => {
                                    const errors = field.state.meta.errors;
                                    return (
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor={field.name}>Current password</Label>
                                            <div className="relative">
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type={showCurrent ? "text" : "password"}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    autoComplete="current-password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrent((v) => !v)}
                                                    aria-label={showCurrent ? "Hide password" : "Show password"}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {errors.length > 0 && (
                                                <p className="flex items-center gap-1.5 text-xs text-destructive">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {errors.map((e) => e?.message).join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    );
                                }}
                            />

                            <form.Field
                                name="newPassword"
                                children={(field) => {
                                    const errors = field.state.meta.errors;
                                    const val = field.state.value;
                                    return (
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor={field.name}>New password</Label>
                                            <div className="relative">
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type={showNew ? "text" : "password"}
                                                    value={val}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    autoComplete="new-password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNew((v) => !v)}
                                                    aria-label={showNew ? "Hide password" : "Show password"}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                                                {RULES.map(({ key, label, test }) => {
                                                    const met = test(val);
                                                    return (
                                                        <li key={key} className={`flex items-center gap-1.5 text-xs ${met ? "text-green-600" : "text-muted-foreground"}`}>
                                                            {met
                                                                ? <CheckCircle2 size={12} className="shrink-0" />
                                                                : <Circle size={12} className="shrink-0" />}
                                                            {label}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                            {errors.length > 0 && (
                                                <p className="flex items-center gap-1.5 text-xs text-destructive">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {errors.map((e) => e?.message).join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    );
                                }}
                            />

                            <form.Field
                                name="confirmPassword"
                                children={(field) => {
                                    const errors = field.state.meta.errors;
                                    return (
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor={field.name}>Confirm new password</Label>
                                            <div className="relative">
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type={showConfirm ? "text" : "password"}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    autoComplete="new-password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirm((v) => !v)}
                                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {errors.length > 0 && (
                                                <p className="flex items-center gap-1.5 text-xs text-destructive">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {errors.map((e) => e?.message).join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    );
                                }}
                            />

                            {changePasswordMutation.isError && (
                                <div className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/8 px-3.5 py-2.5 text-destructive">
                                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                    <p className="text-sm leading-snug">
                                        {(changePasswordMutation.error as any)?.response?.data?.message ??
                                            "Current password is incorrect. Please try again."}
                                    </p>
                                </div>
                            )}

                            {changePasswordMutation.isSuccess && (
                                <div className="flex items-start gap-2.5 rounded-md border border-green-300/50 bg-green-50 px-3.5 py-2.5 text-green-700">
                                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                                    <p className="text-sm leading-snug">Password updated successfully.</p>
                                </div>
                            )}

                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                                children={([canSubmit, isSubmitting]) => (
                                    <Button
                                        type="submit"
                                        disabled={!canSubmit || changePasswordMutation.isPending}
                                        className="w-full"
                                    >
                                        {isSubmitting || changePasswordMutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update password"
                                        )}
                                    </Button>
                                )}
                            />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export const Route = createFileRoute('/_auth/change-password')({
    beforeLoad: () => {
        requirePermission(Permissions.PROFILE_UPDATE);
    },
    component: ChangePasswordPage,
});