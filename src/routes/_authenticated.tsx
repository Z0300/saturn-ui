import { createFileRoute, Outlet, useMatches, useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "#/components/ui/sidebar";
import { SidebarInset } from "#/components/ui/sidebar";
import { Separator } from "#/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { AppSidebar } from "#/components/app-sidebar";
import { useAuthStore } from "@/store/authStore";
import { isTokenExpired } from "@/utils/jwt";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { registerNavigate } from "@/lib/navigate";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { accessToken, setAuth, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const title = currentMatch?.staticData?.title ?? ''

  useEffect(() => {

    registerNavigate(({ to, replace }) =>
      navigate({ to, replace })
    );

    async function checkAuth() {
      if (accessToken && !isTokenExpired(accessToken)) {
        setIsChecking(false);
        return;
      }

      try {
        const { data } = await api.post("/v1/auth/refresh");
        setAuth(data.data);
      } catch {
        clearAuth();
        navigate({ to: "/login" });
        return;
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [accessToken]);


  if (!accessToken && !isChecking) {
    return null;
  }

  if (isChecking) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Saturn UI</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
