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

const data = {
  user: {
    name: "shadcn",
    email: "[EMAIL_ADDRESS]",
    avatar: "",
  },
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppBrand teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
