"use client"

import * as React from "react"
import { 
  Bus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Battery, 
  Fuel, 
  Wrench, 
  Power, 
  UserCheck, 
  MapPin, 
  AlertTriangle,
  CheckCircle2,
  Settings2,
  TrendingUp,
  Zap,
  Activity,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const fleetData = [
  { id: "BUS-102", type: "Electric", status: "Available", battery: 84, location: "Sector-4 Terminal", assignment: "Express-01", maintenance: "None", active: true },
  { id: "BUS-089", type: "Diesel", fuel: 42, status: "In Service", location: "Downtown Hub", assignment: "Route-12", maintenance: "Due in 2 days", active: true },
  { id: "BUS-214", type: "Electric", battery: 12, status: "Charging", location: "Central Depot", assignment: "None", maintenance: "Critical", active: true },
  { id: "BUS-305", type: "Electric", battery: 95, status: "Standby", location: "North Station", assignment: "None", maintenance: "None", active: false },
  { id: "BUS-112", type: "Diesel", fuel: 15, status: "Low Fuel", location: "Ring Road", assignment: "Express-04", maintenance: "None", active: true },
]

export default function FleetControlPage() {
  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <Bus className="h-7 w-7 text-primary" /> Fleet Control Center
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Manage asset availability, health, and assignment overrides.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 px-4 border-border font-semibold text-xs uppercase tracking-wider">
             Maintenance Log
          </Button>
          <Button size="sm" className="h-10 px-6 font-semibold text-xs uppercase tracking-wider brand-gradient text-white">
             Add New Asset
          </Button>
        </div>
      </div>

      {/* Fleet Status Dashboard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Active Fleet", val: "42/50", icon: Bus, color: "text-primary", bg: "bg-primary/5" },
          { title: "In Operation", val: "31 Units", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Maintenance", val: "4 Pending", icon: Wrench, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Fleet Battery", val: "78% Avg", icon: Battery, color: "text-primary", bg: "bg-primary/5" }
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicle List Table */}
      <Card className="border-border shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
           <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by ID or Location..." className="pl-10 h-10 border-border bg-white" />
           </div>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-10 border-border font-semibold text-xs uppercase tracking-wider px-4">
                 <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
              <Button variant="outline" size="sm" className="h-10 border-border font-semibold text-xs uppercase tracking-wider px-4">
                 <Settings2 className="mr-2 h-4 w-4" /> Bulk Actions
              </Button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Asset ID</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Location</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Power Level</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Assignment</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Health</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest">Activation</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fleetData.map((vehicle, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/operations/fleet-control/${vehicle.id}`} className="flex items-center gap-3 group">
                       <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Bus className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="font-bold tracking-tight text-sm group-hover:text-primary transition-colors">{vehicle.id}</p>
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase">{vehicle.type}</p>
                       </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-semibold text-[10px] border-none px-2 h-5 ${
                      vehicle.status === 'Available' ? 'bg-emerald-50 text-emerald-700' :
                      vehicle.status === 'In Service' ? 'bg-primary/10 text-primary' :
                      vehicle.status === 'Charging' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {vehicle.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                       <MapPin className="h-3 w-3" />
                       {vehicle.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32 space-y-1.5">
                       <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                          <span className="flex items-center gap-1">
                             {vehicle.type === 'Electric' ? <Battery className="h-3 w-3" /> : <Fuel className="h-3 w-3" />}
                             {vehicle.battery || vehicle.fuel}%
                          </span>
                       </div>
                       <Progress value={vehicle.battery || vehicle.fuel} className={`h-1 ${
                          (vehicle.battery || vehicle.fuel || 0) < 20 ? 'bg-rose-100 text-rose-600' : 
                          (vehicle.battery || vehicle.fuel || 0) < 50 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                       }`} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold">{vehicle.assignment}</span>
                       {vehicle.assignment !== "None" && (
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                             <Zap className="h-3 w-3" />
                          </Button>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {vehicle.maintenance === "None" ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                           <CheckCircle2 className="h-3.5 w-3.5" />
                           <span className="text-[10px] font-bold uppercase">Clear</span>
                        </div>
                     ) : (
                        <div className={`flex items-center gap-1.5 ${vehicle.maintenance === 'Critical' ? 'text-rose-600' : 'text-amber-600'}`}>
                           <AlertTriangle className="h-3.5 w-3.5" />
                           <span className="text-[10px] font-bold uppercase">{vehicle.maintenance}</span>
                        </div>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end">
                        <Switch checked={vehicle.active} className="scale-75" />
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                           <DropdownMenuLabel>Unit Controls</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem className="gap-2"><UserCheck className="h-4 w-4" /> Override Assignment</DropdownMenuItem>
                           <DropdownMenuItem className="gap-2"><History className="h-4 w-4" /> Maintenance History</DropdownMenuItem>
                           <DropdownMenuItem className="gap-2"><MapPin className="h-4 w-4" /> Precise Tracking</DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem className="text-rose-600 font-bold gap-2"><Power className="h-4 w-4" /> Decommission Unit</DropdownMenuItem>
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
