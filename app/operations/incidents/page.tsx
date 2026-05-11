"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  MoreHorizontal, 
  AlertTriangle, 
  Wrench, 
  MessageSquare, 
  Flame, 
  PhoneCall, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Zap, 
  BellRing,
  AlertCircle,
  Siren,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Incident Data
const incidents = [
  { id: "INC-9402", type: "SOS Alert", severity: "Critical", asset: "BUS-214", location: "Sector 7 Junction", time: "2m ago", status: "Open", desc: "Panic button triggered by driver. Immediate response required." },
  { id: "INC-9398", type: "Accident", severity: "High", asset: "DRV-551", location: "Airport Link", time: "15m ago", status: "Assigned", desc: "Minor collision with passenger vehicle. No injuries reported." },
  { id: "INC-9395", type: "Breakdown", severity: "Medium", asset: "BUS-089", location: "Downtown Hub", time: "42m ago", status: "Assigned", desc: "Engine overheating. Passengers transferred to BUS-102." },
  { id: "INC-9390", type: "Passenger Complaint", severity: "Low", asset: "BUS-112", location: "Ring Road", time: "1h ago", status: "Resolved", desc: "Air conditioning failure reported in rear section." },
]

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = React.useState<any>(incidents[0])

  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <ShieldAlert className="h-7 w-7 text-rose-600" /> Incidents & Emergency
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            Live emergency response and resolution command center.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="destructive" className="h-12 px-8 font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 animate-pulse">
              <BellRing className="mr-2 h-4 w-4" /> Global SOS Trigger
           </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-250px)]">
        {/* Live Incident Feed */}
        <Card className="lg:col-span-1 border-border shadow-xl overflow-hidden flex flex-col">
           <div className="p-4 border-b border-border bg-rose-50/30 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-rose-800">Live Incident Stream</h3>
              <Badge variant="outline" className="bg-rose-100 text-rose-700 border-rose-200 font-bold">{incidents.length}</Badge>
           </div>
           <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                 {incidents.map((inc) => (
                    <div 
                       key={inc.id} 
                       onClick={() => setSelectedIncident(inc)}
                       className={`p-4 cursor-pointer hover:bg-muted/10 transition-all space-y-3 ${selectedIncident?.id === inc.id ? 'bg-primary/5 border-l-4 border-rose-600' : ''}`}
                    >
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             {inc.type === 'SOS Alert' ? <Siren className="h-4 w-4 text-rose-600 animate-bounce" /> :
                              inc.type === 'Accident' ? <AlertTriangle className="h-4 w-4 text-amber-600" /> :
                              inc.type === 'Breakdown' ? <Wrench className="h-4 w-4 text-zinc-600" /> :
                              <MessageSquare className="h-4 w-4 text-blue-600" />}
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{inc.id}</span>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground">{inc.time}</span>
                       </div>
                       <div>
                          <p className={`text-sm font-black tracking-tight ${inc.severity === 'Critical' ? 'text-rose-600' : 'text-foreground'}`}>{inc.type}</p>
                          <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                             <MapPin className="h-3 w-3" /> {inc.location}
                          </p>
                       </div>
                       <div className="flex items-center justify-between pt-1">
                          <Badge className={
                             inc.status === 'Open' ? 'bg-rose-600' :
                             inc.status === 'Assigned' ? 'bg-amber-500' : 'bg-emerald-600'
                          }>{inc.status.toUpperCase()}</Badge>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{inc.asset}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </ScrollArea>
        </Card>

        {/* Emergency Detail & Map View */}
        <Card className="lg:col-span-2 border-border shadow-xl flex flex-col overflow-hidden">
           {selectedIncident ? (
              <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                 {/* Detail Header */}
                 <div className={`p-6 border-b flex items-center justify-between ${
                    selectedIncident.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-muted/10'
                 }`}>
                    <div className="space-y-1">
                       <h2 className="text-2xl font-black tracking-tighter uppercase">{selectedIncident.type}</h2>
                       <p className={`text-xs font-bold uppercase tracking-widest ${
                          selectedIncident.severity === 'Critical' ? 'text-white/70' : 'text-muted-foreground'
                       }`}>Asset ID: {selectedIncident.asset} • {selectedIncident.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant={selectedIncident.severity === 'Critical' ? 'secondary' : 'outline'} className="font-bold text-[10px] uppercase tracking-widest">
                          Contact Unit
                       </Button>
                    </div>
                 </div>

                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                    {/* Resolution Workflow & Info */}
                    <ScrollArea className="p-8 space-y-8 border-r border-border">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Resolution Progress</p>
                          <div className="flex items-center gap-2">
                             {['Open', 'Assigned', 'Resolved'].map((step, i) => (
                                <React.Fragment key={step}>
                                   <div className={`flex items-center gap-2 ${
                                      selectedIncident.status === step ? 'text-primary' : 
                                      incidents.find(inc => inc.status === step) ? 'text-emerald-600' : 'text-zinc-300'
                                   }`}>
                                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                                         selectedIncident.status === step ? 'border-primary bg-primary/5' : 'border-zinc-200'
                                      }`}>{i + 1}</div>
                                      <span className="text-[10px] font-black uppercase tracking-widest">{step}</span>
                                   </div>
                                   {i < 2 && <ArrowRight className="h-3 w-3 text-zinc-200" />}
                                </React.Fragment>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Incident Intelligence</p>
                          <div className="p-6 bg-muted/20 rounded-2xl border border-border space-y-4">
                             <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white border border-border flex items-center justify-center text-rose-600 shadow-sm">
                                   <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                   <p className="text-sm font-medium leading-relaxed italic">"{selectedIncident.desc}"</p>
                                </div>
                             </div>
                             <Separator />
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                   <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Reporting Time</p>
                                   <p className="text-xs font-bold">14:42:08 GMT</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Reliability Score</p>
                                   <p className="text-xs font-bold text-emerald-600">High (98%)</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4 pt-4">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Assigned Response</p>
                          <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-white">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">RT</div>
                                <div>
                                   <p className="text-sm font-black tracking-tight">Response Team 4</p>
                                   <p className="text-[10px] text-muted-foreground font-bold uppercase">En Route (ETA 4m)</p>
                                </div>
                             </div>
                             <Button variant="ghost" size="icon" className="h-9 w-9 text-primary"><PhoneCall className="h-4 w-4" /></Button>
                          </div>
                       </div>
                    </ScrollArea>

                    {/* Emergency Map View (Simulated) */}
                    <div className="relative bg-zinc-950 overflow-hidden">
                       <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                       
                       {/* Pulsing Emergency Pin */}
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="relative h-24 w-24">
                             <div className="absolute inset-0 bg-rose-600/40 rounded-full animate-ping" />
                             <div className="absolute inset-4 bg-rose-600/60 rounded-full animate-pulse" />
                             <div className="absolute inset-8 bg-rose-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-zinc-950">
                                <MapPin className="h-4 w-4 text-white" />
                             </div>
                          </div>
                       </div>

                       {/* Map Overlay Controls */}
                       <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
                          <div className="p-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl space-y-3">
                             <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nearby Assets</span>
                                <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[8px]">3 UNITS</Badge>
                             </div>
                             <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                   <div key={i} className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary" style={{ width: '60%' }} />
                                   </div>
                                ))}
                             </div>
                          </div>
                          <Button className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-rose-900/40">
                             Dispatch Emergency Unit
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-40">
                 <ShieldAlert className="h-20 w-20 text-muted-foreground" />
                 <div>
                    <p className="text-xl font-black uppercase tracking-tight">System Standby</p>
                    <p className="text-sm text-muted-foreground font-medium max-w-[300px] mx-auto">Select a live incident from the feed to initiate emergency protocols and response dispatch.</p>
                 </div>
              </div>
           )}
        </Card>
      </div>
    </div>
  )
}
