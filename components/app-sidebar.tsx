"use client"

import * as React from "react"
import {
  BarChart3,
  Bus,
  CreditCard,
  Gift,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Tag,
  Users,
  Wallet,
  Search,
  ChevronRight,
  LogOut,
  User,
  Bell,
  BarChart,
  Cpu,
  FileText,
  ClipboardList,
  UserCheck,
  Lock,
  HardDrive,
  Map,
  Activity,
  Navigation,
  PlusCircle
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Revenue & Billing",
      url: "/dashboard/revenue",
      icon: Wallet,
      items: [
        {
          title: "Revenue Tracking",
          url: "/dashboard/revenue/tracking",
          icon: BarChart,
        },
        {
          title: "Billing Engine",
          url: "/dashboard/revenue/billing",
          icon: Cpu,
        },
      ],
    },
    {
      title: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: CreditCard,
      items: [
        {
          title: "Plan Management",
          url: "/dashboard/subscriptions/plans",
          icon: ClipboardList,
        },
        {
          title: "Add-ons",
          url: "/dashboard/subscriptions/addons",
          icon: PlusCircle,
        },
        {
          title: "Subscriber List",
          url: "/dashboard/subscriptions/subscribers",
          icon: UserCheck,
        },
        {
          title: "Access Control",
          url: "/dashboard/subscriptions/access",
          icon: Lock,
        },
      ],
    },
    {
      title: "Fleet & Operations",
      url: "/dashboard/fleet",
      icon: Bus,
      items: [
        {
          title: "Fleet Management",
          url: "/dashboard/fleet/inventory",
          icon: HardDrive,
        },
        {
          title: "Route Management",
          url: "/dashboard/fleet/routes",
          icon: Map,
        },
        {
          title: "Trip Operations",
          url: "/dashboard/fleet/trips",
          icon: Activity,
        },
        {
          title: "Schedules",
          url: "/dashboard/fleet/schedules",
          icon: ClipboardList,
        },
        {
          title: "Virtual Bus Stops",
          url: "/dashboard/fleet/bus-stops",
          icon: Navigation,
        },
        {
          title: "Incidents & Emergency",
          url: "/dashboard/fleet/incidents",
          icon: ShieldAlert,
        },
      ],
    },
    {
      title: "Users Management",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Pricing & Plans",
      url: "/dashboard/pricing",
      icon: Tag,
    },
    {
      title: "Compliance & Risk",
      url: "/dashboard/compliance",
      icon: ShieldAlert,
    },
    {
      title: "Reports & Analytics",
      url: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      title: "Promotions",
      url: "/dashboard/promotions",
      icon: Gift,
    },
    {
      title: "System Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
}

import { usePathname } from "next/navigation"
import { useProfile } from "@/hooks/use-profile"
import { signOut } from "@/lib/auth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, state } = useSidebar()
  const pathname = usePathname()
  const { user, isLoading } = useProfile()

  const userData = {
    name: user ? `${user.first_name} ${user.last_name}` : "User",
    email: user?.email || "user@RydeNow.pro",
    avatar: "/avatars/default.jpg",
    initials: user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : "RN",
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar" {...props}>
      <SidebarHeader className="h-16 border-b border-border/50">
        <div className="flex h-full items-center gap-3 px-4">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bus className="size-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col gap-0 leading-none">
              <span className="font-bold tracking-tight text-foreground">RydeNow Pro</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Admin Elite</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <div className="px-4 py-4">
          {state !== "collapsed" ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Quick Search..."
                className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-bold uppercase tracking-widest text-foreground/80">
            Enterprise Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 gap-1">
              {data.navMain.map((item) => {
                if (item.items) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={item.isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={pathname === item.url || item.items?.some(sub => pathname === sub.url)}
                            className="h-10 transition-all duration-200 hover:bg-white/10 active:scale-95 data-[active=true]:bg-white/20 data-[active=true]:text-white data-[active=true]:font-bold data-[active=true]:border-l-2 data-[active=true]:border-white data-[active=true]:rounded-none"
                          >
                            <item.icon className="size-[18px]" />
                            <span className="font-medium text-sm">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild className="h-9 transition-all duration-200 hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white data-[active=true]:font-bold" isActive={pathname === subItem.url}>
                                  <a href={subItem.url} className="flex items-center gap-2">
                                    {subItem.icon && <subItem.icon className="size-4 opacity-70" />}
                                    <span className="text-sm">{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                      className="h-10 transition-all duration-200 hover:bg-white/10 active:scale-95 data-[active=true]:bg-white/20 data-[active=true]:text-white data-[active=true]:font-bold data-[active=true]:border-l-2 data-[active=true]:border-white data-[active=true]:rounded-none"
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="size-[18px]" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2 gap-2 flex flex-col">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="rounded-lg">{userData.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="rounded-lg">{userData.initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData.name}</span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Bell className="mr-2 size-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 size-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 font-medium transition-all duration-200"
              tooltip="Log out"
            >
              <LogOut className="size-[18px]" />
              {state !== "collapsed" && <span className="font-semibold text-sm">Log out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
