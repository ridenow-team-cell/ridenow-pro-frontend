"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  Bus, 
  MapPin, 
  Battery, 
  Wrench, 
  History, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Power, 
  Settings2,
  Thermometer,
  Gauge,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const getBusData = (id: string) => {
  return {
    id: id || "BUS-102",
    model: "VoltMaster EV-900",
    status: "Active",
    battery: 84,
    temp: "24°C",
    odometer: "42,500 km",
    location: "Sector-4 Terminal",
    driver: "Thomas Anderson",
    lastService: "Oct 12, 2024",
    healthScore: 92,
    tripsToday: 12,
    activeRoute: "Express-01"
  }
}

export default function BusDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const bus = getBusData(id)

  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/operations">Operations</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/operations/fleet-control">Fleet</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-primary">{bus.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="outline" size="sm" onClick={() => router.back()} className="h-8 border-border text-[10px] font-bold uppercase tracking-widest">
            <ChevronLeft className="mr-1 h-3 w-3" /> Back to Fleet
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <Bus className="h-10 w-10" />
            </div>
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black tracking-tighter text-foreground">{bus.id}</h1>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none font-black text-[10px] px-3 h-6">ACTIVE</Badge>
               </div>
               <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {bus.model} <Separator orientation="vertical" className="h-3" /> {bus.location}
               </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-12 border-border font-bold text-xs uppercase tracking-widest px-6 bg-white">
                <History className="mr-2 h-4 w-4" /> Service Logs
             </Button>
             <Button className="h-12 font-black text-xs uppercase tracking-widest px-6 brand-gradient text-white">
                <Zap className="mr-2 h-4 w-4" /> Remote Diagnostics
             </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Unit Telemetry */}
        <Card className="lg:col-span-1 border-border shadow-xl bg-zinc-950 text-white overflow-hidden">
           <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Live Telemetry</CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Energy Source</p>
                    <Battery className="h-4 w-4 text-emerald-500" />
                 </div>
                 <div className="flex items-end justify-between">
                    <div className="text-5xl font-black tracking-tighter text-primary">{bus.battery}%</div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase pb-1">320 km Range</p>
                 </div>
                 <Progress value={bus.battery} className="h-2 bg-zinc-800" />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-1.5">
                       <Thermometer className="h-3 w-3" /> Core Temp
                    </p>
                    <p className="text-xl font-black">{bus.temp}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-1.5">
                       <Gauge className="h-3 w-3" /> Odometer
                    </p>
                    <p className="text-xl font-black">{bus.odometer}</p>
                 </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 space-y-2">
                 <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">System Integrity Optimal</span>
                 </div>
                 <p className="text-[10px] text-primary/70 font-medium">All subsystems verified and operational.</p>
              </div>
           </CardContent>
        </Card>

        {/* Operational Status */}
        <Card className="lg:col-span-2 border-border shadow-xl">
           <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
              <div className="space-y-1">
                 <CardTitle className="text-xl font-black uppercase tracking-tight">Mission Context</CardTitle>
                 <CardDescription className="text-xs">Current assignment and crew telemetry.</CardDescription>
              </div>
              <Badge className="h-6 font-bold text-[10px] tracking-widest px-3">IN OPERATION</Badge>
           </CardHeader>
           <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Assignment</p>
                       <div className="p-6 bg-muted/20 rounded-2xl border border-border space-y-4">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                <Navigation className="h-6 w-6" />
                             </div>
                             <div>
                                <p className="text-lg font-black tracking-tight">{bus.activeRoute}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Main Arterial Route</p>
                             </div>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold pt-2">
                             <span className="text-muted-foreground">Current Leg</span>
                             <span>Terminal A → Sector 4</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Assigned Operator</p>
                       <div className="flex items-center justify-between p-4 border border-border rounded-2xl bg-white">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">TA</div>
                             <p className="text-sm font-black tracking-tight">{bus.driver}</p>
                          </div>
                          <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black uppercase">Verified</Badge>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Unit Health Score</p>
                          <p className="text-4xl font-black text-emerald-600">{bus.healthScore}%</p>
                       </div>
                       <CheckCircle2 className="h-12 w-12 text-emerald-500/20" />
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Quick Controls</p>
                       <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="h-12 font-bold text-[10px] uppercase tracking-widest border-border hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all">
                             <Power className="mr-2 h-3 w-3" /> Shutdown
                          </Button>
                          <Button variant="outline" className="h-12 font-bold text-[10px] uppercase tracking-widest border-border hover:bg-primary/5">
                             <Settings2 className="mr-2 h-3 w-3" /> Config
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="history" className="w-full">
         <TabsList className="h-12 bg-muted/50 p-1 border border-border/50">
            <TabsTrigger value="history" className="px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Trip History</TabsTrigger>
            <TabsTrigger value="maintenance" className="px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Maintenance</TabsTrigger>
            <TabsTrigger value="telemetry" className="px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Advanced Data</TabsTrigger>
         </TabsList>
         
         <TabsContent value="history" className="pt-6">
            <Card className="border-border shadow-xl overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                        <tr>
                           <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Trip ID</th>
                           <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Route</th>
                           <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Passengers</th>
                           <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Efficiency</th>
                           <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Timestamp</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/50">
                        {[1, 2, 3, 4].map((i) => (
                           <tr key={i} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4 font-black text-sm text-primary">TRP-902{i}</td>
                              <td className="px-6 py-4 font-bold text-xs uppercase text-muted-foreground">Express-01</td>
                              <td className="px-6 py-4 font-black text-xs">42 / 50</td>
                              <td className="px-6 py-4 font-bold text-xs text-emerald-600">+12% Optimal</td>
                              <td className="px-6 py-4 text-right text-xs text-muted-foreground">Today, 0{i}:45 AM</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
         </TabsContent>

         <TabsContent value="maintenance" className="pt-6">
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">Service Records Pending Sync</p>
            </div>
         </TabsContent>
      </Tabs>
    </div>
  )
}
