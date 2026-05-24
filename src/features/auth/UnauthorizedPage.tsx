import { useNavigate } from "@tanstack/react-router";
import { ShieldOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <ShieldOffIcon className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">
          You don't have permission to view this page. Contact your administrator if you think this is a mistake.
        </p>
      </div>
      <Button onClick={() => navigate({ to: "/" })}>
        Go back home
      </Button>
    </div>
  );
}
