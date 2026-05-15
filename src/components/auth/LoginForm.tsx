import { useForm } from "@tanstack/react-form";
import { useNavigate, Link } from "@tanstack/react-router";
import { useLoginMutation } from "@/lib/auth/mutations/useLoginMutation";
import { LoginSchema } from "@/schemas";
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
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: LoginSchema,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value);
      await navigate({ to: redirectTo ?? "/dashboard" });
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials below to login to your account
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
                name="email"
                children={(field) => {
                  const errors = field.state.meta.errors;
                  return (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={field.name}>Email</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="email"
                      />
                      {errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {errors.map((e) => e?.message).join(", ")}
                        </p>
                      )}
                    </div>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const errors = field.state.meta.errors;
                  return (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={field.name}>Password</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="current-password"
                      />
                      {errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {errors.map((e) => e?.message).join(", ")}
                        </p>
                      )}
                    </div>
                  );
                }}
              />

              {loginMutation.isError && (
                <p className="text-sm text-destructive text-center">
                  {(loginMutation.error as any)?.response?.data?.message ??
                    "Invalid email or password"}
                </p>
              )}

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || loginMutation.isPending}
                    className="w-full"
                  >
                    {isSubmitting || loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                )}
              />

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link className="underline underline-offset-4" to="/signup">
                  Register
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
