import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "../components/ui/tooltip";
import type { AuthState } from "#/types";
import { Toaster } from "sonner";

interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthState;
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
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body>
        <TooltipProvider>
          {children}

          {import.meta.env.DEV && (
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
          )}
        </TooltipProvider>

        <Scripts />
        <Toaster position="top-right"/>
      </body>
    </html>
  );
}
