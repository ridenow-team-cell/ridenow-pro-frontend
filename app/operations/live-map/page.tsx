"use client"

import * as React from "react"
import { 
  Map as MapIcon, 
  Bus, 
  User, 
  Activity, 
  Search, 
  Filter, 
  MoreVertical, 
  Navigation, 
  Zap, 
  Clock, 
  ShieldAlert, 
  AlertTriangle,
  Locate,
  Layers,
  ChevronRight,
  Info,
  Phone,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Mock Vehicle Data
const vehicles = [
  { id: "BUS-102", type: "Bus", status: "Moving", driver: "John Doe", route: "Express-01", lat: 35, lng: 42, eta: "4m", speed: "42km/h", passengers: 28 },
  { id: "DRV-402", type: "Driver", status: "Idle", driver: "Sarah Smith", route: "Campus Loop", lat: 55, lng: 28, eta: "--", speed: "0km/h", passengers: 0 },
  { id: "BUS-089", type: "Bus", status: "Delayed", driver: "Mike Ross", route: "Sector-9", lat: 72, lng: 65, eta: "12m", speed: "12km/h", passengers: 45 },
  { id: "BUS-214", type: "Bus", status: "Offline", driver: "Unknown", route: "None", lat: 15, lng: 85, eta: "--", speed: "0km/h", passengers: 0 },
  { id: "DRV-551", type: "Driver", status: "Moving", driver: "Emma Wilson", route: "Airport-Link", lat: 48, lng: 75, eta: "8m", speed: "55km/h", passengers: 3 },
]

const demandZones = [
  { id: 1, lat: 20, lng: 30, intensity: 0.8, name: "City Center" },
  { id: 2, lat: 60, lng: 40, intensity: 0.6, name: "University Campus" },
  { id: 3, lat: 40, lng: 80, intensity: 0.9, name: "International Airport" },
]

export default function LiveMapPage() {
  const [selectedVehicle, setSelectedVehicle] = React.useState<typeof vehicles[0] | null>(null)
  const [activeFilter, setActiveFilter] = React.useState("all")

  const filteredVehicles = vehicles.filter(v => {
    if (activeFilter === "all") return true
    if (activeFilter === "drivers") return v.type === "Driver"
    if (activeFilter === "buses") return v.type === "Bus"
    if (activeFilter === "active") return v.status === "Moving"
    return true
  })

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <MapIcon className="h-7 w-7 text-primary" /> Tactical Live Map
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live fleet telemetry and demand visualization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-md border border-border">
            {[
              { id: "all", label: "All Units" },
              { id: "drivers", label: "Drivers" },
              { id: "buses", label: "Buses" },
              { id: "active", label: "Active" }
            ].map(f => (
              <Button 
                key={f.id}
                variant={activeFilter === f.id ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setActiveFilter(f.id)}
                className={`text-[10px] font-semibold uppercase tracking-wider h-8 px-4 ${activeFilter === f.id ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <Button size="icon" variant="outline" className="h-10 w-10 border-border"><Layers className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="h-10 w-10 border-border"><Locate className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Map Visualizer */}
        <div className="flex-1 relative rounded-2xl border border-border bg-zinc-950 overflow-hidden shadow-xl">
          {/* Simulated Map Grid */}
          <div className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, #71717a 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} 
          />
          
          {/* Demand Heatmap Zones */}
          {demandZones.map((zone, i) => (
            <div 
              key={zone.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
              style={{
                top: `${zone.lat}%`,
                left: `${zone.lng}%`,
                width: `${zone.intensity * 250}px`,
                height: `${zone.intensity * 250}px`,
                backgroundColor: i % 2 === 0 ? 'rgba(0, 91, 175, 0.3)' : 'rgba(231, 165, 51, 0.2)'
              }}
            />
          ))}

          {/* Simulated Route Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             <path d="M 0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="4,4" />
             
             {/* Active Trip Lines (Simulated) */}
             {filteredVehicles.filter(v => v.status === "Moving").map((v, i) => (
                <line 
                  key={v.id}
                  x1={`${v.lat - 8}%`} 
                  y1={`${v.lng - 8}%`} 
                  x2={`${v.lat}%`} 
                  y2={`${v.lng}%`} 
                  stroke="url(#lineGradient)" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  className="animate-pulse"
                />
             ))}
             <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="transparent" />
                   <stop offset="100%" stopColor="#005baf" />
                </linearGradient>
             </defs>
          </svg>

          {/* Vehicle Markers */}
          {filteredVehicles.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 group hover:scale-110 ${
                selectedVehicle?.id === v.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-zinc-950 z-50' : 'z-40'
              }`}
              style={{ top: `${v.lat}%`, left: `${v.lng}%` }}
            >
               <div className={`h-9 w-9 rounded-md flex items-center justify-center relative shadow-md border border-white/10 ${
                 v.status === 'Moving' ? 'bg-primary text-white' :
                 v.status === 'Idle' ? 'bg-amber-500 text-white' :
                 v.status === 'Delayed' ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-500'
               }`}>
                  {v.type === 'Bus' ? <Bus className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  
                  {/* Status Indicator */}
                  <span className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-zinc-950 ${
                    v.status === 'Moving' ? 'bg-emerald-500 animate-pulse' :
                    v.status === 'Idle' ? 'bg-amber-400' :
                    v.status === 'Delayed' ? 'bg-rose-400' : 'bg-zinc-600'
                  }`} />
               </div>
               
               <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-900 border border-zinc-800 rounded px-2 py-1 transition-opacity ${
                 selectedVehicle?.id === v.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
               }`}>
                  <p className="text-[9px] font-semibold uppercase text-white tracking-wider">{v.id}</p>
               </div>
            </button>
          ))}

          {/* Legend (Bottom Left) */}
          <div className="absolute bottom-4 left-4">
             <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-2 rounded-md">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-[8px] font-semibold uppercase text-zinc-400 tracking-wider">Moving</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-[8px] font-semibold uppercase text-zinc-400 tracking-wider">Idle</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      <span className="text-[8px] font-semibold uppercase text-zinc-400 tracking-wider">Delay</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-80 flex flex-col gap-6">
           <Card className="border-border bg-card shadow-lg flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                 <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit Intelligence</h3>
                 {selectedVehicle && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedVehicle(null)}>
                       <ChevronRight className="h-4 w-4" />
                    </Button>
                 )}
              </div>
              
              <ScrollArea className="flex-1">
                 {selectedVehicle ? (
                    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
                       <div className="flex items-center gap-4">
                          <div className={`h-14 w-14 rounded-xl flex items-center justify-center text-white ${
                             selectedVehicle.status === 'Moving' ? 'bg-primary' : 
                             selectedVehicle.status === 'Delayed' ? 'bg-rose-500' : 'bg-amber-500'
                          }`}>
                             {selectedVehicle.type === 'Bus' ? <Bus className="h-7 w-7" /> : <User className="h-7 w-7" />}
                          </div>
                          <div>
                             <h2 className="text-xl font-bold tracking-tight">{selectedVehicle.id}</h2>
                             <Badge variant="outline" className="font-semibold text-[9px] uppercase tracking-wider h-5">{selectedVehicle.status}</Badge>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                             <p className="text-[8px] font-semibold uppercase text-muted-foreground tracking-wider">ETA</p>
                             <p className="text-lg font-bold text-primary">{selectedVehicle.eta}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                             <p className="text-[8px] font-semibold uppercase text-muted-foreground tracking-wider">Speed</p>
                             <p className="text-lg font-bold">{selectedVehicle.speed}</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="space-y-1.5">
                             <p className="text-[9px] font-semibold uppercase text-muted-foreground tracking-wider">Active Driver</p>
                             <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                                <div className="flex items-center gap-2">
                                   <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center font-semibold text-[10px]">
                                      {selectedVehicle.driver[0]}
                                   </div>
                                   <span className="text-sm font-semibold tracking-tight">{selectedVehicle.driver}</span>
                                </div>
                                <div className="flex gap-1">
                                   <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-primary hover:bg-primary/10"><Phone className="h-3.5 w-3.5" /></Button>
                                   <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-primary hover:bg-primary/10"><MessageSquare className="h-3.5 w-3.5" /></Button>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-1.5">
                             <p className="text-[9px] font-semibold uppercase text-muted-foreground tracking-wider">Current Route</p>
                             <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-muted/20">
                                <Navigation className="h-3.5 w-3.5 text-primary" />
                                <span className="text-sm font-semibold tracking-tight">{selectedVehicle.route}</span>
                             </div>
                          </div>

                          {selectedVehicle.type === 'Bus' && (
                             <div className="space-y-2">
                                <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider">
                                   <span>Occupancy</span>
                                   <span className="text-primary">{selectedVehicle.passengers}/50</span>
                                </div>
                                <Progress value={(selectedVehicle.passengers / 50) * 100} className="h-1.5" />
                             </div>
                          )}
                       </div>

                       <Button className="w-full h-11 font-semibold uppercase tracking-wider gap-2">
                          Direct Unit Control <ChevronRight className="h-4 w-4" />
                       </Button>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-40">
                       <Activity className="h-10 w-10 text-muted-foreground" />
                       <div>
                          <p className="text-sm font-semibold uppercase tracking-tight">System Standby</p>
                          <p className="text-[10px] text-muted-foreground font-medium">Select a vehicle from the live map to initiate intelligence stream.</p>
                       </div>
                    </div>
                 )}
              </ScrollArea>
           </Card>

           <Card className="border-border bg-zinc-950 text-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Fleet Health</h3>
                 <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2.5">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Active Units</span>
                    <span className="font-semibold">42 Units</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Avg ETA</span>
                    <span className="font-semibold text-emerald-500">6.2m</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Alerts</span>
                    <span className="font-semibold text-rose-500">2 Critical</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
