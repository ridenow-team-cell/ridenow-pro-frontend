"use client"

import * as React from "react"
import { 
  Map as MapIcon, 
  Bus, 
  User, 
  Activity, 
  Zap, 
  Clock, 
  ChevronRight, 
  Phone, 
  MessageSquare,
  Navigation,
  Sparkles,
  AlertTriangle,
  Play,
  Pause,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api"

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

// Coordinates mapping actual Abuja locations for a high-fidelity Capital City representation
const ROUTES_DATA = {
  "Federal-Corridor": [
    { lat: 9.0667, lng: 7.4833, name: "Wuse Market Terminal" },
    { lat: 9.0602, lng: 7.4622, name: "Berger Roundabout" },
    { lat: 9.0535, lng: 7.4880, name: "National Mosque Stop" },
    { lat: 9.0490, lng: 7.4980, name: "Federal Secretariat Hub" },
    { lat: 9.0433, lng: 7.5194, name: "Asokoro Terminal" }
  ],
  "Garki-Express": [
     { lat: 9.0289, lng: 7.4864, name: "Garki Area 1 Stop" },
     { lat: 9.0395, lng: 7.4920, name: "Garki Area 11 Interchange" },
     { lat: 9.0770, lng: 7.4795, name: "Wuse II Boulevard" },
     { lat: 9.0882, lng: 7.4996, name: "Maitama Terminal" }
  ],
  "Airport-Shuttle": [
     { lat: 9.0068, lng: 7.2631, name: "Nnamdi Azikiwe Intl Airport" },
     { lat: 9.0040, lng: 7.3750, name: "Lugbe Interchange" },
     { lat: 9.0370, lng: 7.4520, name: "National Stadium Hub" }
  ]
}

const ROUTE_PATHS = {
  "Federal-Corridor": [
    { lat: 9.0667, lng: 7.4833 },
    { lat: 9.0640, lng: 7.4730 },
    { lat: 9.0602, lng: 7.4622 },
    { lat: 9.0560, lng: 7.4750 },
    { lat: 9.0535, lng: 7.4880 },
    { lat: 9.0490, lng: 7.4980 },
    { lat: 9.0460, lng: 7.5090 },
    { lat: 9.0433, lng: 7.5194 }
  ],
  "Garki-Express": [
    { lat: 9.0289, lng: 7.4864 },
    { lat: 9.0340, lng: 7.4890 },
    { lat: 9.0395, lng: 7.4920 },
    { lat: 9.0500, lng: 7.4900 },
    { lat: 9.0620, lng: 7.4850 },
    { lat: 9.0710, lng: 7.4820 },
    { lat: 9.0770, lng: 7.4795 },
    { lat: 9.0830, lng: 7.4900 },
    { lat: 9.0882, lng: 7.4996 }
  ],
  "Airport-Shuttle": [
    { lat: 9.0068, lng: 7.2631 },
    { lat: 9.0055, lng: 7.3100 },
    { lat: 9.0040, lng: 7.3750 },
    { lat: 9.0150, lng: 7.4100 },
    { lat: 9.0280, lng: 7.4350 },
    { lat: 9.0370, lng: 7.4520 },
    { lat: 9.0490, lng: 7.4580 },
    { lat: 9.0602, lng: 7.4622 }
  ]
}

const ROUTE_COLORS = {
  "Federal-Corridor": "#005baf",
  "Garki-Express": "#f59e0b",
  "Airport-Shuttle": "#10b981"
}

export default function LiveMapPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null)
  const [simulationSpeed, setSimulationSpeed] = React.useState(1500) // ms step interval
  const [isPaused, setIsPaused] = React.useState(false)
  const [simulationLogs, setSimulationLogs] = React.useState<string[]>([
    "Tactical Simulator online.",
    "Abuja Federal Capital telematics stream active.",
    "Waiting for telemetry pulses..."
  ])

  const [simulatedVehicles, setSimulatedVehicles] = React.useState([
    { id: "BUS-102", type: "Bus", status: "Moving", driver: "John Doe", route: "Federal-Corridor", pathName: "Federal-Corridor", pathIndex: 0, lat: 9.0667, lng: 7.4833, eta: "4m", speed: "42km/h", passengers: 28, direction: 1 },
    { id: "DRV-402", type: "Driver", status: "Idle", driver: "Sarah Smith", route: "Garki-Express", pathName: "Garki-Express", pathIndex: 2, lat: 9.0395, lng: 7.4920, eta: "--", speed: "0km/h", passengers: 0, direction: 1 },
    { id: "BUS-089", type: "Bus", status: "Delayed", driver: "Mike Ross", route: "Airport-Shuttle", pathName: "Airport-Shuttle", pathIndex: 4, lat: 9.0280, lng: 7.4350, eta: "12m", speed: "12km/h", passengers: 45, direction: 1 },
    { id: "BUS-214", type: "Bus", status: "Offline", driver: "Unknown", route: "None", pathName: null, pathIndex: 0, lat: 9.0550, lng: 7.4800, eta: "--", speed: "0km/h", passengers: 0, direction: 1 },
    { id: "DRV-551", type: "Driver", status: "Moving", driver: "Emma Wilson", route: "Airport-Shuttle", pathName: "Airport-Shuttle", pathIndex: 1, lat: 9.0055, lng: 7.3100, eta: "8m", speed: "55km/h", passengers: 3, direction: 1 }
  ])

  // Simulation Tick Effect
  React.useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setSimulatedVehicles(prev => prev.map(v => {
        if (v.status === "Offline" || v.status === "Idle" || !v.pathName) return v

        const path = ROUTE_PATHS[v.pathName as keyof typeof ROUTE_PATHS]
        if (!path) return v

        let nextIndex = v.pathIndex + v.direction
        let nextDirection = v.direction

        // Bounce trajectory when hitting boundaries
        if (nextIndex >= path.length) {
          nextIndex = path.length - 2
          nextDirection = -1
        } else if (nextIndex < 0) {
          nextIndex = 1
          nextDirection = 1
        }

        const nextPos = path[nextIndex]

        // Onboarding/Deboarding Simulation (Dynamic Passengers Entering Stops)
        let currentPassengers = v.passengers
        let eventMsg = ""
        
        if (Math.random() > 0.4) {
          const delta = Math.random() > 0.4 
            ? Math.floor(Math.random() * 3) + 1 
            : -(Math.floor(Math.random() * 2) + 1)
          
          const oldPassengers = currentPassengers
          currentPassengers = Math.max(0, Math.min(50, currentPassengers + delta))
          const net = currentPassengers - oldPassengers

          const stops = ROUTES_DATA[v.pathName as keyof typeof ROUTES_DATA] || []
          const nearestStop = stops[nextIndex % stops.length]?.name || "Virtual Junction"

          if (net > 0) {
            eventMsg = `[${new Date().toLocaleTimeString()}] ${v.id}: +${net} passengers entered at ${nearestStop}.`
          } else if (net < 0) {
            eventMsg = `[${new Date().toLocaleTimeString()}] ${v.id}: ${Math.abs(net)} passengers exited stop.`
          }
        }

        // Variate speeds beautifully
        const speedVal = v.status === "Delayed" 
          ? Math.floor(Math.random() * 8) + 8 
          : Math.floor(Math.random() * 25) + 38
        
        const speedStr = `${speedVal}km/h`
        const etaVal = Math.max(2, Math.floor((path.length - nextIndex) * 1.5))
        const etaStr = `${etaVal}m`

        if (eventMsg) {
          setSimulationLogs(logs => [eventMsg, ...logs].slice(0, 20))
        }

        return {
          ...v,
          pathIndex: nextIndex,
          direction: nextDirection,
          lat: nextPos.lat,
          lng: nextPos.lng,
          passengers: currentPassengers,
          speed: speedStr,
          eta: etaStr
        }
      }))
    }, simulationSpeed)

    return () => clearInterval(timer)
  }, [simulationSpeed, isPaused])

  // Commander Controls
  const triggerRushHour = () => {
    setSimulatedVehicles(prev => prev.map(v => {
      if (v.status === "Offline") return v
      const added = Math.floor(Math.random() * 8) + 4
      const current = Math.min(50, v.passengers + added)
      return { ...v, passengers: current }
    }))
    setSimulationLogs(logs => [`[${new Date().toLocaleTimeString()}] COMMAND DECK: Rush hour passenger influx injected (+4 to +12 passengers across all active units).`, ...logs])
  }

  const triggerSOS = () => {
    setSimulatedVehicles(prev => prev.map(v => {
      if (v.id === "BUS-102") {
        return { ...v, status: "Delayed", speed: "5km/h" }
      }
      return v
    }))
    setSimulationLogs(logs => [`[${new Date().toLocaleTimeString()}] ALERT: BUS-102 triggered panic incident event! Speed throttled.`, ...logs])
  }

  const selectedVehicle = simulatedVehicles.find(v => v.id === selectedVehicleId) || null

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
             <MapIcon className="h-7 w-7 text-primary" /> Tactical Live Map
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isPaused ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
            {isPaused ? 'Simulation paused. Waiting for commander deck input.' : 'Abuja fleet trajectory telematics loop active.'}
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Map Visualizer */}
        <div className="flex-1 relative rounded-2xl border border-border bg-zinc-100 overflow-hidden shadow-xl">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={selectedVehicle ? { lat: selectedVehicle.lat, lng: selectedVehicle.lng } : { lat: 9.0578, lng: 7.4950 }}
              zoom={12}
              options={{
                disableDefaultUI: true,
                zoomControl: true
              }}
            >
              {/* Route Polyline Tracks */}
              {Object.entries(ROUTE_PATHS).map(([routeName, path]) => (
                <Polyline
                  key={routeName}
                  path={path}
                  options={{
                    strokeColor: ROUTE_COLORS[routeName as keyof typeof ROUTE_COLORS] || "#005baf",
                    strokeOpacity: 0.9,
                    strokeWeight: 5
                  }}
                />
              ))}

              {/* Stop Anchors */}
              {Object.entries(ROUTES_DATA).flatMap(([routeName, stops]) => 
                stops.map((stop, i) => (
                  <Marker
                    key={`${routeName}-stop-${i}`}
                    position={{ lat: stop.lat, lng: stop.lng }}
                    icon={{
                      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${ROUTE_COLORS[routeName as keyof typeof ROUTE_COLORS]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10" fill="white"/>
                          <circle cx="12" cy="12" r="4" fill="${ROUTE_COLORS[routeName as keyof typeof ROUTE_COLORS]}"/>
                        </svg>
                      `),
                      scaledSize: new google.maps.Size(16, 16),
                      anchor: new google.maps.Point(8, 8)
                    }}
                    title={`${routeName}: ${stop.name}`}
                  />
                ))
              )}

              {/* Real-time Dynamic Vehicle Pins */}
              {simulatedVehicles.map(v => (
                <Marker
                  key={v.id}
                  position={{ lat: v.lat, lng: v.lng }}
                  onClick={() => setSelectedVehicleId(v.id)}
                  title={`${v.id} (${v.type})`}
                  icon={{
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <rect width="36" height="36" rx="8" fill="${
                          v.status === 'Moving' ? '#005baf' :
                          v.status === 'Idle' ? '#f59e0b' :
                          v.status === 'Delayed' ? '#f43f5e' : '#71717a'
                        }" stroke="white" stroke-width="2"/>
                        <g transform="translate(10, 10)">
                          ${v.type === 'Bus' ? `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                              <line x1="2" y1="10" x2="22" y2="10"/>
                              <path d="M6 21v-2M18 21v-2"/>
                            </svg>
                          ` : `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                          `}
                        </g>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(36, 36),
                    anchor: new google.maps.Point(18, 18)
                  }}
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-white">
              <p className="text-xs uppercase font-bold tracking-widest animate-pulse">Loading Live Telematics Map...</p>
            </div>
          )}

          {/* Legend (Bottom Left) */}
          <div className="absolute bottom-4 left-4">
             <div className="bg-white/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-lg">
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      <span className="text-[9px] font-bold uppercase text-muted-foreground">Moving Bus</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-[9px] font-bold uppercase text-muted-foreground">Idle Unit</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500" />
                      <span className="text-[9px] font-bold uppercase text-muted-foreground">Delayed / Heavy Traffic</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Tactical Commander Control side-panel */}
        <div className="w-80 flex flex-col gap-6">
           <Card className="border-border bg-card shadow-lg flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                 <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit Intelligence</h3>
                 {selectedVehicle && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedVehicleId(null)}>
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
                    </div>
                 ) : (
                    <div className="p-6 space-y-6">
                       <div className="space-y-2">
                         <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Simulator Event Feed</h4>
                         <div className="bg-zinc-950 text-emerald-400 p-3 rounded-lg font-mono text-[9px] h-[220px] overflow-y-auto space-y-2 border border-zinc-800">
                           {simulationLogs.map((log, i) => (
                             <div key={i} className="leading-relaxed border-b border-zinc-900/50 pb-1">{log}</div>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-3">
                         <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Simulation Pace</h4>
                         <div className="flex gap-2">
                           <Button 
                             size="sm" 
                             variant={simulationSpeed === 2500 ? "secondary" : "outline"} 
                             className="text-[9px] font-bold flex-1 h-8"
                             onClick={() => setSimulationSpeed(2500)}
                           >
                             Slow (2.5s)
                           </Button>
                           <Button 
                             size="sm" 
                             variant={simulationSpeed === 1500 ? "secondary" : "outline"} 
                             className="text-[9px] font-bold flex-1 h-8"
                             onClick={() => setSimulationSpeed(1500)}
                           >
                             Normal
                           </Button>
                           <Button 
                             size="sm" 
                             variant={simulationSpeed === 500 ? "secondary" : "outline"} 
                             className="text-[9px] font-bold flex-1 h-8"
                             onClick={() => setSimulationSpeed(500)}
                           >
                             Hyper (0.5s)
                           </Button>
                         </div>
                       </div>
                    </div>
                 )}
              </ScrollArea>
           </Card>

           {/* simulator control panel */}
           <Card className="border-border bg-zinc-950 text-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Commander Console</h3>
                 <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <Button 
                   onClick={() => setIsPaused(!isPaused)} 
                   variant="outline" 
                   className="h-9 text-[9px] font-bold uppercase tracking-wider bg-transparent border-zinc-800 hover:bg-zinc-900 flex items-center gap-1"
                 >
                   {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                   {isPaused ? "Resume" : "Pause"}
                 </Button>
                 <Button 
                   onClick={triggerRushHour} 
                   className="h-9 text-[9px] font-bold uppercase tracking-wider brand-gradient text-white flex items-center gap-1"
                 >
                   <Zap className="h-3 w-3" />
                   Rush Hour
                 </Button>
                 <Button 
                   onClick={triggerSOS} 
                   className="h-9 text-[9px] font-bold uppercase tracking-wider bg-rose-950 border border-rose-900 text-rose-300 hover:bg-rose-900/40 flex items-center gap-1 col-span-2"
                 >
                   <AlertCircle className="h-3 w-3 text-rose-400" />
                   Inject BUS-102 Panic SOS
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
