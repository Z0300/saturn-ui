"use client";

import * as React from "react";

import { NavMain } from "#/components/nav-main";
import { NavUser } from "#/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "#/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  LayoutDashboardIcon,
  Settings2Icon,
} from "lucide-react";
import { AppBrand } from "./app-brand";
import { Route } from "@tanstack/react-router";
import { useAuthStore } from "#/store/authStore";

const data = {
  teams: [
    {
      name: "Saturn UI",
      logo: <GalleryVerticalEndIcon />,
      plan: "Free",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Access Management",
      url: "/#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "Users",
          url: "/users",
        },
        {
          title: "Roles",
          url: "/roles",
        },
        {
          title: "Permissions",
          url: "/permissions",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user } = useAuthStore();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppBrand teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
