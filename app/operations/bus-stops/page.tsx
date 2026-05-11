"use client"

import * as React from "react"
import { 
  Navigation, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  MapPin, 
  TrendingUp, 
  Users, 
  Activity, 
  Zap, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  Locate, 
  Layers,
  Sparkles,
  Info
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

// Mock Bus Stop Data
const busStops = [
  { id: "STP-001", name: "Central Mall", location: "Downtown, Sector 4", trafficScore: 92, cluster: "Primary Hub", active: true },
  { id: "STP-002", name: "University North", location: "Campus District", trafficScore: 85, cluster: "Education Cluster", active: true },
  { id: "STP-003", name: "Airport Terminal 1", location: "Transit Hub", trafficScore: 78, cluster: "Transit Hub", active: true },
  { id: "STP-004", name: "Westside Tech Park", location: "Business District", trafficScore: 64, cluster: "Business Corridor", active: false },
  { id: "STP-005", name: "Riverside Residences", location: "Residential East", trafficScore: 45, cluster: "Residential Zone", active: true },
]

const suggestions = [
  { id: 1, type: "Add", target: "Sector 7 Junction", reason: "High demand detect during 08:00 - 10:00 AM", impact: "High" },
  { id: 2, type: "Relocate", target: "STP-005", reason: "Traffic flow optimization needed for efficiency", impact: "Medium" },
]

export default function BusStopsPage() {
  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <Navigation className="h-7 w-7 text-primary" /> Virtual Bus Stops
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Dynamic stop creation and optimization engine.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" className="h-10 border-border font-semibold text-xs uppercase tracking-wider px-4">
              <Layers className="mr-2 h-4 w-4" /> Stop Heatmap
           </Button>
           <Button size="sm" className="h-10 px-6 font-semibold text-xs uppercase tracking-wider brand-gradient text-white shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Create Virtual Stop
           </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map-based Stop Creator Tool (Simulated) */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-border shadow-xl overflow-hidden relative">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                 <div className="bg-white/90 backdrop-blur-md border border-border p-2 rounded-lg shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 pb-1 border-b border-border mb-1">Editor Tools</p>
                    <div className="flex flex-col gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Locate className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="h-4 w-4" /></Button>
                    </div>
                 </div>
              </div>

              <div className="h-[450px] w-full bg-zinc-950 relative">
                 {/* Simulated Map Grid */}
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                 
                 {/* Density Heatmap (Simulated) */}
                 <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
                 <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/10 blur-[60px] rounded-full" />

                 {/* Stop Markers */}
                 {busStops.map((stop, i) => (
                    <div 
                       key={stop.id} 
                       className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                       style={{ top: `${20 + i * 15}%`, left: `${30 + i * 10}%` }}
                    >
                       <div className="h-8 w-8 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                          <Navigation className="h-3 w-3 text-primary fill-primary/10" />
                       </div>
                       <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {stop.name}
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Stops</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">High Demand Zones</span>
                    </div>
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Coordinate System: WGS 84 / UTM</p>
              </div>
           </Card>

           {/* Stop List Table */}
           <Card className="border-border shadow-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Registered Virtual Stops</h3>
                 <div className="relative w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Filter stops..." className="pl-8 h-8 text-xs border-border bg-white" />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                       <tr>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Stop Name</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Traffic Score</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Cluster</th>
                          <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {busStops.map((stop) => (
                          <tr key={stop.id} className="hover:bg-muted/10 transition-colors">
                             <td className="px-6 py-4">
                                <div>
                                   <p className="font-bold tracking-tight text-sm">{stop.name}</p>
                                   <p className="text-[10px] text-muted-foreground font-semibold uppercase">{stop.location}</p>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <span className={`text-sm font-bold ${stop.trafficScore > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{stop.trafficScore}</span>
                                   <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                      <div className={`h-full ${stop.trafficScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${stop.trafficScore}%` }} />
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tight h-5 border-border">{stop.cluster}</Badge>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"><Edit2 className="h-3.5 w-3.5" /></Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6">
           <Card className="border-border shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                 <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Cluster Optimizer</CardTitle>
                 </div>
                 <CardDescription className="text-[10px] font-bold uppercase text-primary/70">AI-Powered Optimization</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 {suggestions.map((s) => (
                    <div key={s.id} className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
                       <div className="flex items-center justify-between">
                          <Badge className={s.type === 'Add' ? 'bg-emerald-500' : 'bg-primary'}>{s.type.toUpperCase()}</Badge>
                          <Badge variant="outline" className="text-[8px] font-black">{s.impact} Impact</Badge>
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-bold tracking-tight">{s.target}</p>
                          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{s.reason}</p>
                       </div>
                       <Button size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest" variant="outline">
                          Execute Suggestion
                       </Button>
                    </div>
                 ))}
                 <Button className="w-full h-10 font-black text-[10px] uppercase tracking-widest brand-gradient text-white">
                    Run New Global Scan
                 </Button>
              </CardContent>
           </Card>

           <Card className="border-border shadow-xl bg-zinc-950 text-white p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Stop Intelligence</h3>
                 <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                       <span className="text-zinc-500">Global Avg Traffic</span>
                       <span className="font-bold">72.4</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                       <span className="text-zinc-500">Peak Saturation</span>
                       <span className="font-bold text-amber-500">84%</span>
                    </div>
                 </div>
                 <Separator className="bg-zinc-800" />
                 <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                       <Info className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                       Current stop density in the **Campus District** is above optimal thresholds. Consider merging STP-002 with nearby virtual hubs.
                    </p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
