"use client"

import * as React from "react"
import { 
  Activity, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Navigation, 
  User, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ChevronRight, 
  MapPin, 
  ArrowRight,
  Play,
  RotateCcw,
  Pause,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Mock Trip Data - Modified to show empty states by default but maintain layouts
const trips = {
  assigned: [] as any[],
  in_progress: [] as any[],
  completed: [] as any[],
  delayed: [] as any[]
}

export default function TripOpsPage() {
  const [selectedTrip, setSelectedTrip] = React.useState<any>(null)

  const renderTripCard = (trip: any) => (
    <Card 
      key={trip.id} 
      onClick={() => setSelectedTrip(trip)}
      className={`border-border shadow-sm cursor-pointer hover:shadow-md hover:border-primary/50 transition-all group ${selectedTrip?.id === trip.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
           <Badge variant="outline" className="font-bold text-[9px] tracking-widest px-2 h-5 bg-muted/50">{trip.id}</Badge>
           <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
           </Button>
        </div>
        <div className="space-y-1">
           <p className="font-bold text-sm tracking-tight">{trip.route}</p>
           <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
              <User className="h-3 w-3" /> {trip.driver}
           </div>
        </div>
        
        {trip.status === "In Progress" && (
           <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase">
                 <span className="text-muted-foreground">Progress</span>
                 <span className="text-primary">{trip.progress}%</span>
              </div>
              <Progress value={trip.progress} className="h-1" />
           </div>
        )}

        {trip.status === "Delayed" && (
           <div className="flex items-center gap-2 p-2 bg-rose-50 rounded-lg border border-rose-100">
              <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">{trip.delay} Delay</span>
           </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
           <div className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold">{trip.passengers} Pax</span>
           </div>
           {trip.status === "Assigned" && (
              <span className="text-[10px] font-bold text-muted-foreground">{trip.time}</span>
           )}
           {trip.status === "Completed" && (
              <span className="text-[10px] font-bold text-emerald-600">{trip.duration}</span>
           )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <Activity className="h-7 w-7 text-primary animate-pulse" /> Trip Operations Control
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Real-time Kanban flow for active transit operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search trips or drivers..." className="pl-10 h-10 border-border bg-white" disabled />
           </div>
           <Button size="sm" className="h-10 px-6 font-semibold text-xs uppercase tracking-wider brand-gradient text-white opacity-80 cursor-not-allowed">
              Launch Manual Trip
           </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Kanban Board */}
        <div className="flex-1 grid grid-cols-4 gap-6 overflow-hidden">
           {/* Column: Assigned */}
           <div className="flex flex-col gap-4 min-w-[280px]">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assigned</h3>
                 </div>
                 <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold">{trips.assigned.length}</Badge>
              </div>
              <ScrollArea className="flex-1 rounded-xl bg-muted/20 p-4">
                 <div className="space-y-4 h-full flex flex-col justify-center">
                    {trips.assigned.length === 0 ? (
                       <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-3 bg-muted/10 border border-dashed border-border/60 rounded-xl">
                          <Clock className="h-8 w-8 text-muted-foreground/40 animate-pulse" />
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">No Trips Assigned</p>
                             <p className="text-[9px] text-muted-foreground font-medium max-w-[160px] mx-auto">Corridor schedules waiting driver claim allocations.</p>
                          </div>
                       </div>
                    ) : (
                       trips.assigned.map(renderTripCard)
                    )}
                 </div>
              </ScrollArea>
           </div>

           {/* Column: In Progress */}
           <div className="flex flex-col gap-4 min-w-[280px]">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary font-bold">In Progress</h3>
                 </div>
                 <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold">{trips.in_progress.length}</Badge>
              </div>
              <ScrollArea className="flex-1 rounded-xl bg-primary/5 p-4 border border-primary/10">
                 <div className="space-y-4 h-full flex flex-col justify-center">
                    {trips.in_progress.length === 0 ? (
                       <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-3 bg-primary/5 border border-dashed border-primary/20 rounded-xl">
                          <Zap className="h-8 w-8 text-primary/40 animate-bounce-slow" />
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">No Active Runs</p>
                             <p className="text-[9px] text-muted-foreground font-medium max-w-[160px] mx-auto">Live buses currently staging at primary terminals.</p>
                          </div>
                       </div>
                    ) : (
                       trips.in_progress.map(renderTripCard)
                    )}
                 </div>
              </ScrollArea>
           </div>

           {/* Column: Completed */}
           <div className="flex flex-col gap-4 min-w-[280px]">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Completed</h3>
                 </div>
                 <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold">{trips.completed.length}</Badge>
              </div>
              <ScrollArea className="flex-1 rounded-xl bg-emerald-50/10 p-4 border border-emerald-500/10">
                 <div className="space-y-4 h-full flex flex-col justify-center">
                    {trips.completed.length === 0 ? (
                       <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-3 bg-emerald-500/5 border border-dashed border-emerald-500/20 rounded-xl">
                          <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider">No Completed Runs</p>
                             <p className="text-[9px] text-muted-foreground font-medium max-w-[160px] mx-auto">Finished runs will archive here automatically daily.</p>
                          </div>
                       </div>
                    ) : (
                       trips.completed.map(renderTripCard)
                    )}
                 </div>
              </ScrollArea>
           </div>

           {/* Column: Delayed */}
           <div className="flex flex-col gap-4 min-w-[280px]">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-rose-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Delayed</h3>
                 </div>
                 <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold">{trips.delayed.length}</Badge>
              </div>
              <ScrollArea className="flex-1 rounded-xl bg-rose-50/10 p-4 border border-rose-500/10">
                 <div className="space-y-4 h-full flex flex-col justify-center">
                    {trips.delayed.length === 0 ? (
                       <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-3 bg-rose-500/5 border border-dashed border-rose-500/20 rounded-xl">
                          <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider">Schedules Clear</p>
                             <p className="text-[9px] text-muted-foreground font-medium max-w-[160px] mx-auto">Zero corridor delays reported across networks.</p>
                          </div>
                       </div>
                    ) : (
                       trips.delayed.map(renderTripCard)
                    )}
                 </div>
              </ScrollArea>
           </div>
        </div>

        {/* Trip Detail Side Panel */}
        <div className="w-[400px] flex flex-col gap-6">
           <Card className="flex-1 border-border shadow-xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trip Intelligence</h3>
                 {selectedTrip && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedTrip(null)}>
                       <ChevronRight className="h-5 w-5" />
                    </Button>
                 )}
              </div>

              <ScrollArea className="flex-1">
                 {selectedTrip ? (
                    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                       {/* Context Header */}
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <h2 className="text-2xl font-bold tracking-tight">{selectedTrip.id}</h2>
                             <Badge className={
                                selectedTrip.status === 'Delayed' ? 'bg-rose-500' :
                                selectedTrip.status === 'In Progress' ? 'bg-primary' :
                                selectedTrip.status === 'Completed' ? 'bg-emerald-500' : 'bg-zinc-500'
                             }>{selectedTrip.status.toUpperCase()}</Badge>
                          </div>
                          <div className="p-4 bg-muted/20 rounded-xl border border-border space-y-3">
                             <div className="flex items-center gap-3">
                                <Navigation className="h-5 w-5 text-primary" />
                                <span className="text-lg font-bold tracking-tight">{selectedTrip.route}</span>
                             </div>
                             <div className="flex items-center gap-6 text-[10px] font-bold uppercase text-muted-foreground">
                                <div className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {selectedTrip.passengers} Pax</div>
                                <div className="flex items-center gap-1.5"><User className="h-3 w-3" /> {selectedTrip.driver}</div>
                              </div>
                          </div>
                       </div>

                       {/* Route Map (Simulated) */}
                       <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Route Telemetry</p>
                          <div className="h-48 w-full rounded-2xl bg-zinc-950 relative overflow-hidden">
                             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                             <svg className="absolute inset-0 w-full h-full p-8">
                                <path d="M 0 50 Q 50 10, 100 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4,4" />
                                <circle cx="0" cy="50" r="4" fill="#005baf" />
                                <circle cx="100" cy="50" r="4" fill="#fff" />
                                <circle cx="65" cy="25" r="6" fill="#005baf" className="animate-pulse" />
                              </svg>
                             <div className="absolute bottom-4 right-4 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                                Sector 4 → Central Station
                             </div>
                          </div>
                       </div>

                       {/* Trip Replay / Timeline */}
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Event Timeline</p>
                             <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6"><RotateCcw className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-primary"><Play className="h-3 w-3" /></Button>
                             </div>
                          </div>
                          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                             {[
                                { time: "08:30 AM", event: "Trip Initiated", desc: "Driver Alice Vance confirmed departure." },
                                { time: "08:42 AM", event: "Station A Reach", desc: "4 passengers boarded." },
                                { time: "08:55 AM", event: "Traffic Delay", desc: "System detected 12m congestion.", critical: true },
                             ].map((item, i) => (
                                <div key={i} className="pl-8 relative">
                                   <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white ${item.critical ? 'bg-rose-500' : 'bg-primary'}`} />
                                   <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.time}</p>
                                   <p className="text-xs font-bold tracking-tight">{item.event}</p>
                                   <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{item.desc}</p>
                                </div>
                             ))}
                          </div>
                       </div>

                       {/* Override Tools */}
                       <div className="space-y-3 pt-4 border-t border-border">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Operational Overrides</p>
                          <div className="grid grid-cols-2 gap-3">
                             <Button variant="outline" className="h-11 font-bold text-[10px] uppercase tracking-widest border-border hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                                Abort Trip
                             </Button>
                             <Button variant="outline" className="h-11 font-bold text-[10px] uppercase tracking-widest border-border">
                                Re-route Unit
                             </Button>
                          </div>
                          <Button className="w-full h-11 font-bold text-[10px] uppercase tracking-widest brand-gradient text-white">
                             Message Operator
                          </Button>
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-40">
                       <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                          <Activity className="h-12 w-12 text-muted-foreground" />
                       </div>
                       <div>
                          <p className="text-sm font-bold uppercase tracking-tight text-foreground">Intelligence Stream Ready</p>
                          <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto">Select an active trip from the Kanban board to initiate deep operational oversight.</p>
                       </div>
                    </div>
                 )}
              </ScrollArea>
           </Card>

           {/* Operational Alerts Panel - Updated to match zero schedule delays state */}
           <Card className="border-border bg-emerald-950 text-white p-5 space-y-4 shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Operational Alerts</h3>
                 <CheckCircle2 className="h-4 w-4 text-emerald-300 animate-pulse" />
              </div>
              <div className="space-y-3">
                 <div className="flex items-start gap-3 p-3 bg-emerald-900/50 rounded-lg border border-emerald-800">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <p className="text-[10px] font-medium text-emerald-100">All operational transit corridors running at peak scheduling efficiency.</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
