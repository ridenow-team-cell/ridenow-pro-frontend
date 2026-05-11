"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Activity, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Navigation, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Bus as BusIcon,
  ArrowRight,
  User,
  ShieldAlert,
  Send,
  ChevronRight
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const liveTrips = [
  { id: "TR-8001", bus: "BUS-402", route: "RT-12", driver: "John Smith", load: 85, delay: 0, status: "On Time" },
  { id: "TR-8002", bus: "BUS-205", route: "RT-22", driver: "Elena Gilbert", load: 42, delay: 5, status: "Slight Delay" },
  { id: "TR-8003", bus: "BUS-512", route: "RT-01", driver: "Marcus Miller", load: 60, delay: 15, status: "Delayed" },
]

export default function TripOperationsPage() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500" />
             <h1 className="text-3xl font-bold tracking-tight text-foreground">
               Trip Operations
             </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of active trips, driver assignments, and fleet performance.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 border-border">
            Trip History
          </Button>
          <Button size="sm" className="h-9 px-4 font-semibold bg-rose-600 hover:bg-rose-700">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Incident
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Live Monitoring Feed */}
        <div className="lg:col-span-4 space-y-4">
           <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                 <div>
                    <CardTitle className="text-base font-bold">Live Trip Feed</CardTitle>
                    <CardDescription className="text-xs">All active buses currently on routes.</CardDescription>
                 </div>
                 <Badge variant="outline" className="h-5 text-[10px] font-bold uppercase tracking-wider bg-muted border-none">12 ACTIVE</Badge>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-border">
                    {liveTrips.map((trip) => (
                       <div key={trip.id} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-primary">
                                   <BusIcon className="h-5 w-5" />
                                </div>
                                <div>
                                   <p className="font-bold text-sm leading-tight">{trip.bus} <span className="text-muted-foreground text-xs font-medium ml-1">on {trip.route}</span></p>
                                   <p className="text-[10px] text-muted-foreground mt-1.5 font-mono uppercase tracking-widest">{trip.id} • Driver: {trip.driver}</p>
                                </div>
                             </div>
                             <Badge variant="outline" className={`text-[10px] font-bold border-none uppercase h-5 ${trip.status === 'On Time' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                                {trip.status} {trip.delay > 0 && `(${trip.delay}M)`}
                             </Badge>
                          </div>
                          
                          <div className="space-y-1.5">
                             <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Passenger Load</span>
                                <span>{trip.load}% Capacity</span>
                             </div>
                             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className={`h-full ${trip.load > 80 ? 'bg-rose-500' : 'bg-primary'}`} style={{ width: `${trip.load}%` }} />
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                             <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                   <Navigation className="h-3.5 w-3.5" />
                                   <span>Station 4/8</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                   <Clock className="h-3.5 w-3.5" />
                                   <span>ETA: 12:45 PM</span>
                                </div>
                             </div>
                             <Link href={`/dashboard/fleet/trips/${trip.id}`}>
                               <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-transparent">
                                  Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
                               </Button>
                             </Link>
                          </div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Operational Intelligence */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="border-border bg-zinc-950 text-white overflow-hidden">
              <CardHeader className="border-b border-zinc-800 pb-4">
                 <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-rose-500" />
                    <CardTitle className="text-base font-bold uppercase tracking-wider">Active Incident Report</CardTitle>
                 </div>
                 <CardDescription className="text-zinc-400 text-xs">High priority operational issues.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                 <div className="p-4 bg-rose-500/10 border border-rose-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Urgent</span>
                       <span className="text-[10px] text-zinc-500 font-bold uppercase">14:02 PM</span>
                    </div>
                    <p className="text-sm font-bold">Bus RT-12 Mechanical Failure</p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                       Vehicle stopped at Science Plaza. Replacement bus BUS-301 dispatched. Est. recovery: 20 mins.
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                       <Button size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700">Assign Driver</Button>
                       <Button size="sm" variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest border-zinc-800 hover:bg-zinc-900">Notify Passengers</Button>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-border bg-card overflow-hidden">
              <CardHeader className="border-b border-border pb-4">
                 <CardTitle className="text-sm font-bold uppercase tracking-wider">Quick Trip Dispatch</CardTitle>
                 <CardDescription className="text-xs">Manually assign a bus to a route.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 <div className="space-y-3">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Route</label>
                       <Input placeholder="Search route ID..." className="h-10 border-border text-xs" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assign Bus</label>
                       <div className="flex items-center gap-2">
                          <Input placeholder="Search available fleet..." className="flex-1 h-10 border-border text-xs" />
                          <Button size="icon" className="h-10 w-10 shrink-0">
                             <Send className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                 </div>
                 <div className="pt-2">
                    <div className="flex items-center gap-3 p-3 border border-border bg-muted/20">
                       <User className="h-4 w-4 text-primary" />
                       <div className="flex-1">
                          <p className="text-[11px] font-bold uppercase tracking-tight">Auto-Assign Driver</p>
                          <p className="text-[10px] text-muted-foreground font-medium">System will pick the best available driver.</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
