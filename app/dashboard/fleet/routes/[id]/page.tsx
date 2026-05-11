"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  MapPin, 
  Clock, 
  Bus, 
  Users, 
  ChevronLeft,
  Settings2,
  Navigation,
  ArrowUpRight,
  User,
  ShieldCheck,
  Zap,
  Activity,
  History,
  Info
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function RouteDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const routeId = params.id as string

  // Mock data for the specific route
  const routeData = {
    id: routeId,
    name: "Kubwa → UNIABUJA Campus",
    status: "Active",
    loadFactor: 85,
    activeBus: "BUS-042",
    driver: "Tunde Ojo",
    nextTrip: "17:00",
    stops: [
      { name: "Kubwa Main Hub", type: "Pickup", time: "Start" },
      { name: "Gwarinpa Station", type: "Mid", time: "+15m" },
      { name: "UNIABUJA Main Gate", type: "School Hub", time: "+45m" },
    ],
    manifest: [
      { id: "U1", name: "Alex Johnson", type: "Priority", seat: "A1", status: "Boarded" },
      { id: "U2", name: "Sarah Williams", type: "Standard", seat: "A2", status: "Boarded" },
      { id: "U3", name: "David Kalu", type: "Basic", seat: "B1", status: "Awaiting" },
      { id: "U4", name: "Ibrahim Musa", type: "Priority", seat: "B2", status: "Boarded" },
      { id: "U5", name: "Blessing Okon", type: "Standard", seat: "C1", status: "Boarded" },
    ]
  }

  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {routeData.name}
            </h1>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold uppercase text-[10px]">
              {routeData.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-11 uppercase tracking-wider text-[10px]">
            Corridor Intelligence • {routeData.id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 px-4 font-semibold text-xs border-border">
            <Settings2 className="h-4 w-4 mr-2" /> Edit Route
          </Button>
          <Button size="sm" className="h-9 px-6 font-semibold bg-primary">
            Export Manifest
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Manifest and Status */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-border bg-card">
                 <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Live Load Factor</p>
                       <Activity className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{routeData.loadFactor}%</p>
                    <Progress value={routeData.loadFactor} className="h-1 mt-3 bg-muted" />
                 </CardContent>
              </Card>
              <Card className="border-border bg-card">
                 <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Vehicle</p>
                       <Bus className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-xl font-bold">{routeData.activeBus}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">{routeData.driver}</p>
                 </CardContent>
              </Card>
              <Card className="border-border bg-card">
                 <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Next Departure</p>
                       <Clock className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{routeData.nextTrip}</p>
                    <p className="text-[10px] text-emerald-600 mt-1 font-bold">ON TIME</p>
                 </CardContent>
              </Card>
           </div>

           <Tabs defaultValue="manifest" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg border border-border">
                <TabsTrigger value="manifest" className="text-xs font-bold uppercase">Passenger Manifest</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs font-bold uppercase">Route Timeline</TabsTrigger>
                <TabsTrigger value="history" className="text-xs font-bold uppercase">Trip History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manifest" className="space-y-4 pt-4">
                 <div className="grid gap-2">
                    {routeData.manifest.map((passenger) => (
                       <Card key={passenger.id} className="border-border bg-card hover:bg-muted/30 transition-colors">
                          <div className="p-4 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <Avatar className="h-9 w-9 border border-border">
                                   <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{passenger.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                   <p className="text-sm font-bold leading-none">{passenger.name}</p>
                                   <div className="flex items-center gap-2 mt-1.5">
                                      <Badge variant="outline" className={`text-[8px] font-bold uppercase px-1 border-none ${
                                         passenger.type === 'Priority' ? 'bg-indigo-500/10 text-indigo-600' :
                                         passenger.type === 'Standard' ? 'bg-primary/10 text-primary' :
                                         'bg-muted text-muted-foreground'
                                      }`}>
                                         {passenger.type}
                                      </Badge>
                                      <span className="text-[9px] font-semibold text-muted-foreground uppercase">Seat {passenger.seat}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <Badge variant="secondary" className={`text-[9px] font-bold uppercase ${
                                   passenger.status === 'Boarded' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                } border-none`}>
                                   {passenger.status}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                   <ArrowUpRight className="h-4 w-4" />
                                </Button>
                             </div>
                          </div>
                       </Card>
                    ))}
                 </div>
              </TabsContent>

              <TabsContent value="timeline" className="pt-4">
                 <Card className="border-border bg-card p-6">
                    <div className="relative pl-10 space-y-8">
                       <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-muted rounded-full" />
                       {routeData.stops.map((stop, i) => (
                          <div key={i} className="relative flex items-center justify-between group">
                             <div className={`absolute -left-10 h-5 w-5 rounded-full border-4 border-background z-10 ${
                                stop.type === 'Pickup' ? 'bg-primary' : 
                                stop.type === 'School Hub' ? 'bg-amber-500' : 
                                'bg-slate-400'
                             }`} />
                             <div className="flex-1">
                                <p className="text-sm font-bold">{stop.name}</p>
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{stop.type}</p>
                             </div>
                             <Badge variant="outline" className="text-[10px] font-bold">{stop.time}</Badge>
                          </div>
                       ))}
                    </div>
                 </Card>
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                 <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed border-border rounded-xl text-center">
                    <History className="h-8 w-8 text-muted-foreground opacity-20 mb-3" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Historical data processing...</p>
                 </div>
              </TabsContent>
           </Tabs>
        </div>

        {/* Right: Insights and Actions */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-border bg-slate-950 text-white rounded-xl shadow-xl overflow-hidden">
              <CardHeader className="border-b border-white/10 pb-4">
                 <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">Live Route Logic</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 <div className="space-y-3">
                    <div className="flex items-start gap-3">
                       <ShieldCheck className="h-4 w-4 text-emerald-400 mt-0.5" />
                       <div>
                          <p className="text-xs font-bold">Priority Integrity</p>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-medium mt-1">30% of seats are strictly held for Always On Seat members until 15 mins before departure.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <Navigation className="h-4 w-4 text-primary mt-0.5" />
                       <div>
                          <p className="text-xs font-bold">Dynamic ETA</p>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-medium mt-1">Real-time traffic processing indicates a +4 min delay at Gwarinpa Station.</p>
                       </div>
                    </div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                       <Info className="h-3.5 w-3.5 text-slate-400" />
                       <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Revenue Insight</p>
                    </div>
                    <p className="text-xl font-bold tracking-tight">4,050 Credits</p>
                    <p className="text-[9px] text-slate-500 font-medium">Projected revenue for current trip manifest.</p>
                 </div>
                 <Button className="w-full h-11 text-xs font-bold uppercase bg-primary hover:bg-primary/90 rounded-lg shadow-sm">
                    View Live GPS Feed
                 </Button>
              </CardContent>
           </Card>

           <Card className="border-border bg-card rounded-xl shadow-sm">
              <CardHeader className="pb-4">
                 <CardTitle className="text-xs font-bold uppercase tracking-wider">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2">
                 <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase border-border">
                    <User className="h-3.5 w-3.5 mr-2" /> Message All Boarded
                 </Button>
                 <Button variant="outline" className="w-full justify-start text-[11px] font-bold uppercase border-border">
                    <Users className="h-3.5 w-3.5 mr-2" /> Transfer Manifest
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
