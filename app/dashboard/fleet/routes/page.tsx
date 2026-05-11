"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Map as MapIcon, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Route,
  Plus,
  ChevronRight,
  Zap,
  Bus,
  Users,
  Settings2,
  Activity,
  AlertCircle
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
import { Progress } from "@/components/ui/progress"

const routes = [
  { 
    id: "RT-12", 
    name: "Kubwa → UNIABUJA Campus", 
    stops: 4, 
    buses: 2, 
    status: "Active", 
    utilization: 85,
    credits: 450,
    trips: "2/day"
  },
  { 
    id: "RT-08", 
    name: "Gwarinpa → Central Area", 
    stops: 6, 
    buses: 3, 
    status: "Active", 
    utilization: 62,
    credits: 500,
    trips: "4/day"
  },
  { 
    id: "RT-22", 
    name: "Airport → City Terminal", 
    stops: 3, 
    buses: 2, 
    status: "Paused", 
    utilization: 0,
    credits: 800,
    trips: "1/day"
  },
]

export default function RouteManagementPage() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Route Command
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">
            Manage your fleet's neural network and trip logistics.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 font-semibold text-xs">
            <MapIcon className="mr-2 h-4 w-4 text-primary" />
            Global Map
          </Button>
          <Link href="/dashboard/fleet/routes/new">
            <Button size="sm" className="h-9 px-4 font-semibold text-xs bg-primary shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New Route
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Distance</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">142.5 KM</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Active corridors</p>
           </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Corridors</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">8 Corridors</div>
              <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase">98% Service Uptime</p>
           </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Stops</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">48 Hubs</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Virtual & Physical Hubs</p>
           </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fleet Load Factor</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">74.2%</div>
              <Progress value={74.2} className="h-1 mt-2 bg-muted" />
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Route List */}
        <div className="lg:col-span-5 space-y-4">
           <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input 
                    placeholder="Search corridors..." 
                    className="pl-10 h-10 border-border bg-card rounded-lg font-medium"
                 />
              </div>
              <Button variant="outline" className="h-10 border-border gap-2 font-semibold text-xs px-4 rounded-lg">
                 <Filter className="h-4 w-4" /> Filter
              </Button>
           </div>

           <div className="grid gap-3">
              {routes.map((route) => (
                 <div key={route.id} className="relative group">
                    <Link href={`/dashboard/fleet/routes/${route.id}`}>
                       <Card className="border-border bg-card hover:bg-muted/50 transition-all duration-200 group overflow-hidden rounded-xl shadow-sm border-l-4 cursor-pointer" style={{ borderLeftColor: route.status === 'Active' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>
                          <div className="p-4 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors ${route.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                   <Route className="h-5 w-5" />
                                </div>
                                <div>
                                   <p className="font-bold text-base leading-none tracking-tight">{route.name}</p>
                                   <div className="flex items-center gap-3 mt-2">
                                      <Badge variant="secondary" className="text-[9px] font-bold h-4 px-1.5 uppercase tracking-wider">{route.id}</Badge>
                                      <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                         <MapPin className="h-3 w-3" /> {route.stops} Stops
                                      </div>
                                      <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                         <Zap className="h-3 w-3" /> {route.credits} Credits
                                      </div>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-6">
                                <div className="hidden md:flex flex-col items-end gap-1 mr-10">
                                   <p className="text-xs font-bold uppercase">{route.utilization}%</p>
                                   <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                                      <div className="h-full bg-primary" style={{ width: `${route.utilization}%` }} />
                                   </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                             </div>
                          </div>
                       </Card>
                    </Link>
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
                       <Link href="/dashboard/fleet/routes/new">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-background hover:text-primary border border-transparent hover:border-border transition-all">
                             <Settings2 className="h-4 w-4" />
                          </Button>
                       </Link>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-border bg-slate-950 text-white rounded-xl overflow-hidden shadow-lg">
              <CardHeader className="border-b border-white/10 pb-4">
                 <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">Intelligence</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <Bus className="h-3.5 w-3.5" /> Active
                       </div>
                       <span className="text-xs font-bold">12/15</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <Users className="h-3.5 w-3.5" /> Bookings
                       </div>
                       <span className="text-xs font-bold">1.4k</span>
                    </div>
                 </div>
                 <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      Demand for <span className="font-bold text-white">RT-12</span> is spiking. System recommends adding one vehicle.
                    </p>
                 </div>
                 <Button className="w-full h-10 text-xs font-bold uppercase bg-primary hover:bg-primary/90 rounded-lg shadow-sm">
                    Network Map
                 </Button>
              </CardContent>
           </Card>

           <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                 <AlertCircle className="h-4 w-4" />
                 <p className="text-xs font-bold uppercase">Alert</p>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                RT-22 is currently paused for maintenance.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
