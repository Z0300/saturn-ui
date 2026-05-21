import { Link, useRouter } from "@tanstack/react-router";
import { ShieldX, ArrowLeft, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border">
            <ShieldX className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <div
            className="absolute -inset-1 rounded-2xl bg-slate-500/10"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black px-4 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.12em] text-white/90 uppercase">
              403 — Access Denied
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            You don&apos;t have permission
          </h1>

          <p className="max-w-sm text-base text-muted-foreground leading-relaxed">
            Your account doesn&apos;t have the required role or permissions to
            view this page. Contact your administrator if you believe this is a
            mistake.
          </p>
        </div>

        <Separator className="w-full max-w-xs opacity-50" />

        <div className="flex flex-col items-center gap-3 w-full sm:flex-row sm:justify-center">
          <Button
            variant="default"
            size="lg"
            asChild
            className="w-full sm:w-auto"
          >
            <Link to="/" id="go-home-btn">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.history.back()}
            id="go-back-btn"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Using the wrong account?{" "}
          <Link
            to="/login"
            id="login-link"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            <LogIn className="inline mr-1 h-3.5 w-3.5" />
            Sign in with another account
          </Link>
        </p>
      </div>
    </div>
  );
}
