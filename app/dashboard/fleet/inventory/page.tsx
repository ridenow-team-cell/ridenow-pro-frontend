"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Bus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Wrench, 
  CheckCircle2, 
  XCircle,
  Users,
  Settings2,
  Plus,
  History,
  AlertTriangle
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fleet = [
  { id: "BUS-402", model: "Mercedes-Benz Citaro", reg: "ABC-1234", status: "Active", capacity: 45, route: "RT-12" },
  { id: "BUS-105", model: "Volvo 7900", reg: "XYZ-5678", status: "Maintenance", capacity: 52, route: "RT-08" },
  { id: "BUS-205", model: "Scania Citywide", reg: "LMN-9012", status: "Active", capacity: 48, route: "RT-22" },
  { id: "BUS-301", model: "BYD K9", reg: "EVC-4455", status: "Inactive", capacity: 40, route: "None" },
  { id: "BUS-512", model: "MAN Lion's City", reg: "GHI-7788", status: "Active", capacity: 60, route: "RT-01" },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge variant="outline" className="border-none bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase gap-1.5"><CheckCircle2 className="h-3 w-3" /> Active</Badge>
    case "Maintenance":
      return <Badge variant="outline" className="border-none bg-amber-50 text-amber-700 font-bold text-[10px] uppercase gap-1.5"><Wrench className="h-3 w-3" /> Maintenance</Badge>
    case "Inactive":
      return <Badge variant="outline" className="border-none bg-rose-50 text-rose-700 font-bold text-[10px] uppercase gap-1.5"><XCircle className="h-3 w-3" /> Inactive</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function FleetInventoryPage() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Fleet Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your bus inventory, maintenance schedules, and route assignments.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 border-border">
            <History className="mr-2 h-4 w-4 text-muted-foreground" />
            Service History
          </Button>
          <Link href="/dashboard/fleet/inventory/new">
            <Button size="sm" className="h-9 px-4 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Add New Bus
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Fleet</CardTitle>
               <Bus className="h-4 w-4 text-primary opacity-70" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold tracking-tight">52</div>
               <p className="text-[10px] text-muted-foreground mt-1 font-medium">Buses in system</p>
            </CardContent>
         </Card>
         <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operational</CardTitle>
               <CheckCircle2 className="h-4 w-4 text-emerald-600 opacity-70" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold tracking-tight">42</div>
               <p className="text-[10px] text-emerald-600 font-bold mt-1">80.7% Availability</p>
            </CardContent>
         </Card>
         <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">In Service</CardTitle>
               <Wrench className="h-4 w-4 text-amber-600 opacity-70" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold tracking-tight">6</div>
               <p className="text-[10px] text-muted-foreground mt-1 font-medium">Scheduled maintenance</p>
            </CardContent>
         </Card>
         <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Alerts</CardTitle>
               <AlertTriangle className="h-4 w-4 text-rose-600 opacity-70" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold tracking-tight">4</div>
               <p className="text-[10px] text-rose-600 font-bold mt-1">Immediate action</p>
            </CardContent>
         </Card>
      </div>

      <div className="flex items-center justify-between gap-4">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
               placeholder="Search by ID, Reg, or Model..." 
               className="pl-9 h-10 border-border"
            />
         </div>
         <Button variant="outline" className="h-10 border-border gap-2 font-medium px-4">
            <Filter className="h-4 w-4" /> Filter
         </Button>
      </div>

      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Bus Details</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Reg Number</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Status</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Current Route</th>
                <th className="px-6 py-3 text-right font-bold uppercase text-[9px] tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fleet.map((bus) => (
                <tr key={bus.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4">
                     <div>
                        <p className="font-bold tracking-tight text-sm leading-none">{bus.model}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5 font-mono uppercase">{bus.id}</p>
                     </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-xs">{bus.reg}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(bus.status)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                     <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">{bus.capacity} seats</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <Badge variant="secondary" className="font-bold text-[10px] h-5">{bus.route}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-border">
                        <DropdownMenuLabel className="text-xs">Fleet Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                           <Settings2 className="h-4 w-4" /> Edit Config
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                           <Wrench className="h-4 w-4" /> Schedule Service
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                           <History className="h-4 w-4" /> View Logs
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600 gap-2 font-semibold">
                           Decommission
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
