"use client"

import * as React from "react"
import {
  Map,
  Bus,
  Activity,
  Navigation,
  UserCheck,
  ShieldAlert,
  TrendingUp,
  Settings,
  Search,
  ChevronRight,
  LogOut,
  Bell,
  User,
  ArrowLeftRight
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { usePathname } from "next/navigation"
import Link from "next/link"

const data = {
  user: {
    name: "Alex Johnson",
    email: "alex@ridenow.pro",
    avatar: "/avatars/alex.jpg",
  },
  navOperations: [
    {
      title: "Live Map",
      url: "/operations/live-map",
      icon: Map,
    },
    {
      title: "Fleet Control",
      url: "/operations/fleet-control",
      icon: Bus,
    },
    {
      title: "Trip Operations",
      url: "/operations/trip-ops",
      icon: Activity,
    },
    {
      title: "Virtual Bus Stops",
      url: "/operations/bus-stops",
      icon: Navigation,
    },
    {
      title: "Driver Operations",
      url: "/operations/drivers",
      icon: UserCheck,
    },
    {
      title: "Incidents & Emergency",
      url: "/operations/incidents",
      icon: ShieldAlert,
    },
    {
      title: "Demand Analytics",
      url: "/operations/demand",
      icon: TrendingUp,
    },
    {
      title: "System Settings",
      url: "/operations/settings",
      icon: Settings,
    },
  ],
}

export function OperationsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, state } = useSidebar()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar" {...props}>
      <SidebarHeader className="h-16 border-b border-border/50">
        <div className="flex h-full items-center gap-3 px-4">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Activity className="size-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col gap-0 leading-none">
              <span className="font-bold tracking-tight text-foreground">RideNow Pro</span>
              <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Command Center</span>
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
                 placeholder="Search operations..." 
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
          <SidebarGroupLabel className="px-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Mission Control
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 gap-1">
              {data.navOperations.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title} 
                    isActive={pathname === item.url}
                    className="h-10 transition-all duration-200 hover:bg-primary/5 active:scale-95 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-[18px]" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 pb-4">
           <Link href="/dashboard">
              <Button variant="outline" className="w-full h-10 border-border bg-white/50 backdrop-blur-sm font-semibold text-[10px] uppercase tracking-wider gap-2">
                 <ArrowLeftRight className="h-3 w-3" />
                 {state !== "collapsed" ? "Switch to Admin" : ""}
              </Button>
           </Link>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">AJ</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data.user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{data.user.email}</span>
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
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg">AJ</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
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
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
