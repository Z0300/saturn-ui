import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { AuthProvider, useAuth } from "@/lib/auth/authContext";
import type { AuthUser } from "@/types/auth";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "../components/ui/tooltip";
import { useEffect } from "react";

interface MyRouterContext {
  queryClient: QueryClient;
  auth: { user: AuthUser | null; isLoading: boolean };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start Starter" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
  // ✅ component handles the auth-wrapped outlet
  component: RootComponent,
});

// Wraps the route tree with AuthProvider
function RootComponent() {
  return (
    <AuthProvider>
      <AuthSync />
      <Outlet />
    </AuthProvider>
  );
}

// Lives inside AuthProvider so both useAuth() and useRouter() are safe
function AuthSync() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.update({
      context: {
        ...router.options.context,
        auth: { user, isLoading },
      },
    });
    if (!isLoading) {
      router.invalidate();
    }
  }, [user, isLoading]);

  return null;
}

// shellComponent is the full HTML shell — no auth logic here
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          {children}
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  );
}
