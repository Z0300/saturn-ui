import { UnauthorizedPage } from "#/features/auth/UnauthorizedPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedComponent,
});

function UnauthorizedComponent() {
  return <UnauthorizedPage />;
}



