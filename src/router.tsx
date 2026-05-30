import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getContext } from "./integrations/tanstack-query/root-provider";
import { NotFoundPage } from "./components/not-found";
import { useAuthStore } from "./store/authStore";
import GlobalPending from "./components/global-pending";

export function getRouter() {
  const context = getContext();

  const router = createTanStackRouter({
    routeTree,
    context: { ...context, auth: useAuthStore.getState() },
    scrollRestoration: true,
    defaultPendingMs: 300,
    defaultPendingMinMs: 500,
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFoundPage,
    defaultPendingComponent: GlobalPending
  });

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }

  interface StaticDataRouteOption {
    title?: string;
  }
}
