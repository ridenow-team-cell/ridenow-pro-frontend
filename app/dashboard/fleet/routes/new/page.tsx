"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  MapPin, 
  Clock, 
  Bus, 
  Users, 
  CreditCard, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  BarChart3, 
  ChevronLeft,
  ShieldCheck,
  Armchair,
  Settings2,
  Navigation,
  Check,
  X,
  Zap,
  ArrowRightLeft,
  FileEdit,
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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddRoutePage() {
  const router = useRouter()
  const [isActive, setIsActive] = React.useState(true)
  const [routeName, setRouteName] = React.useState("Kubwa → UNIABUJA Campus Route")
  const [stops, setStops] = React.useState([
    { id: "1", name: "Kubwa Pickup Hub", type: "pickup", isSchool: false },
    { id: "2", name: "Gwarinpa Stop", type: "mid", isSchool: false },
    { id: "3", name: "UNIABUJA Main Gate", type: "dropoff", isSchool: true },
  ])
  const [priorityReserved, setPriorityReserved] = React.useState([30])
  const [access, setAccess] = React.useState({
    basic: true,
    standard: true,
    priority: true,
  })
  const [trips, setTrips] = React.useState([
    { id: "t1", time: "06:30", type: "Morning", buffer: 15 },
    { id: "t2", time: "17:00", type: "Evening", buffer: 20 },
  ])
  const [isRoundtrip, setIsRoundtrip] = React.useState(false)
  const [instructions, setInstructions] = React.useState("")

  const addTrip = () => {
    const newTrip = { id: Math.random().toString(), time: "12:00", type: "Off-Peak", buffer: 10 }
    setTrips([...trips, newTrip])
  }

  const removeTrip = (id: string) => {
    if (trips.length > 1) {
      setTrips(trips.filter(t => t.id !== id))
    }
  }

  const SCHOOLS = [
    "University of Abuja (Main)",
    "University of Abuja (City)",
    "Baze University",
    "Nile University",
    "Veritas University"
  ]

  const addStop = () => {
    if (stops.length < 8) {
      const newStop = { id: Math.random().toString(), name: "New Stop", type: "mid", isSchool: false }
      const newStops = [...stops]
      newStops.splice(stops.length - 1, 0, newStop)
      setStops(newStops)
    }
  }

  const removeStop = (id: string) => {
    if (stops.length > 2) {
      setStops(stops.filter(s => s.id !== id))
    }
  }

  return (
    <div className="space-y-6 pt-4 pb-20">
      {/* Header Section */}
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
              Route Designer
            </h1>
            <Badge 
              variant={isActive ? "default" : "secondary"} 
              className={`h-5 text-[10px] font-semibold px-2 ${isActive ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-none' : 'bg-rose-500 hover:bg-rose-600 text-white border-none'}`}
            >
              {isActive ? "Active" : "Paused"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-11">
            Build and optimize the operational parameters of your fleet routes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
            <Label htmlFor="route-status" className="text-xs font-semibold text-muted-foreground">
              {isActive ? "Route Online" : "Route Offline"}
            </Label>
            <Switch 
              id="route-status" 
              checked={isActive} 
              onCheckedChange={setIsActive}
            />
          </div>
          <Button size="sm" className="h-9 px-6 font-semibold shadow-sm">
            Save Route Config
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Route Configuration */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Route Definition */}
          <Card className="border-border bg-card overflow-hidden rounded-xl shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                 <Navigation className="h-4 w-4 text-primary" />
                 <CardTitle className="text-sm font-semibold">Operational Mapping</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Route Name */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground">Route Name / Corridor</Label>
                  <Input 
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="e.g. Kubwa → UNIABUJA"
                    className="h-11 font-medium bg-muted/20 border-border"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground">Route Code</Label>
                  <Input 
                    placeholder="e.g. KUB-UNI-01"
                    className="h-11 font-medium bg-muted/20 border-border uppercase"
                  />
                </div>
              </div>

              {/* Roundtrip Configuration */}
              <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ArrowRightLeft className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Roundtrip Configuration</p>
                    <p className="text-xs text-muted-foreground font-medium">Automatically generate a return route for this corridor.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{isRoundtrip ? "Enabled" : "Disabled"}</span>
                  <Switch checked={isRoundtrip} onCheckedChange={setIsRoundtrip} />
                </div>
              </div>

              {/* Specific Instructions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Specific Operational Instructions</Label>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <textarea 
                  className="w-full min-h-[100px] p-4 rounded-xl bg-muted/20 border border-border text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter specific instructions for drivers on this route (e.g., 'Avoid peak traffic via bypass', 'Wait 5 mins at Science Plaza')..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              {/* Stops Configuration */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stops & Schools Configuration</Label>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={addStop}
                    disabled={stops.length >= 8}
                    className="h-7 text-xs font-semibold text-primary"
                   >
                     <Plus className="h-3 w-3 mr-1" /> Add Intermediate Stop
                   </Button>
                </div>
                
                <div className="relative pl-8 space-y-4">
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-muted rounded-full" />
                  
                  {stops.map((stop, i) => (
                    <div key={stop.id} className="relative flex items-center gap-4 group">
                      <div className={`absolute -left-7 h-4 w-4 rounded-full border-4 border-background z-10 ${
                        stop.isSchool ? 'bg-amber-500' :
                        stop.type === 'pickup' ? 'bg-primary' : 
                        stop.type === 'dropoff' ? 'bg-emerald-500' : 
                        'bg-slate-400'
                      }`} />
                      
                      <div className="flex-1 flex flex-col gap-3 p-4 bg-muted/30 border border-border rounded-xl hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3 flex-1">
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center border border-border ${stop.isSchool ? 'bg-amber-500/10 text-amber-600' : 'bg-background text-muted-foreground'}`}>
                                <MapPin className="h-4 w-4" />
                              </div>
                              <Input 
                                value={stop.name}
                                onChange={(e) => {
                                  const newStops = [...stops]
                                  newStops[i].name = e.target.value
                                  setStops(newStops)
                                }}
                                className="h-8 bg-transparent border-none p-0 text-sm font-semibold focus-visible:ring-0 max-w-[200px]"
                              />
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 mr-2">
                                 <Label className="text-[10px] font-bold uppercase text-muted-foreground">School Hub</Label>
                                 <Switch 
                                    checked={stop.isSchool} 
                                    onCheckedChange={(v) => {
                                       const newStops = [...stops]
                                       newStops[i].isSchool = v
                                       setStops(newStops)
                                    }}
                                    className="scale-75"
                                 />
                              </div>
                              <Badge variant="secondary" className="h-5 text-[10px] font-semibold uppercase px-2">
                                 {stop.type}
                              </Badge>
                              {stop.type === 'mid' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeStop(stop.id)}
                                  className="h-6 w-6 text-rose-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                           </div>
                        </div>
                        {stop.isSchool && (
                           <div className="pt-2 border-t border-border/50">
                              <Select>
                                 <SelectTrigger className="h-8 bg-background border-border text-[11px] font-medium">
                                    <SelectValue placeholder="Link to specific school campus..." />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {SCHOOLS.map(school => (
                                       <SelectItem key={school} value={school}>{school}</SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Schedule Setup */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                   <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trip Schedules</Label>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={addTrip}
                    className="h-7 text-xs font-semibold text-primary"
                   >
                     <Plus className="h-3 w-3 mr-1" /> Add New Trip
                   </Button>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2">
                   {trips.map((trip, idx) => (
                      <div key={trip.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 relative group">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <Clock className="h-3.5 w-3.5 text-primary" />
                               <span className="text-xs font-semibold uppercase">Trip #{idx + 1}</span>
                               <Badge variant="outline" className="text-[8px] font-bold h-4">{trip.type}</Badge>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeTrip(trip.id)}
                              className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                               <Trash2 className="h-3 w-3" />
                            </Button>
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                               <span className="text-[10px] font-medium text-muted-foreground uppercase pl-0.5">Dep. Time</span>
                               <Input 
                                 type="time" 
                                 defaultValue={trip.time} 
                                 className="h-9 bg-background font-semibold text-xs border-border" 
                               />
                            </div>
                            <div className="space-y-1">
                               <span className="text-[10px] font-medium text-muted-foreground uppercase pl-0.5">Type</span>
                               <Select defaultValue={trip.type}>
                                  <SelectTrigger className="h-9 bg-background text-xs font-semibold">
                                     <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                     <SelectItem value="Morning">Morning Peak</SelectItem>
                                     <SelectItem value="Evening">Evening Peak</SelectItem>
                                     <SelectItem value="Off-Peak">Off-Peak</SelectItem>
                                     <SelectItem value="Night">Night Ride</SelectItem>
                                  </SelectContent>
                               </Select>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity & Pricing */}
          <div className="grid gap-6 md:grid-cols-2">
             <Card className="border-border bg-card rounded-xl shadow-sm">
                <CardHeader className="pb-4">
                   <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                      <Armchair className="h-4 w-4 text-primary" /> Capacity & Allocation
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-medium text-muted-foreground">Total Capacity</Label>
                        <Badge variant="outline" className="font-bold">22 SEATS</Badge>
                      </div>
                      <Select defaultValue="22">
                        <SelectTrigger className="h-10 bg-muted/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14">14 Seats (Minivan)</SelectItem>
                          <SelectItem value="18">18 Seats (Standard)</SelectItem>
                          <SelectItem value="22">22 Seats (Large)</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-medium text-muted-foreground">Priority Reserved</Label>
                        <span className="text-sm font-bold text-primary">{priorityReserved[0]}%</span>
                      </div>
                      <Slider 
                        value={priorityReserved} 
                        onValueChange={setPriorityReserved} 
                        max={50} 
                        step={5}
                      />
                   </div>
                </CardContent>
             </Card>

             <Card className="border-border bg-card rounded-xl shadow-sm">
                <CardHeader className="pb-4">
                   <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" /> Credit Mapping
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-3">
                      <Label className="text-xs font-medium text-muted-foreground">Credits per Ride</Label>
                      <div className="relative">
                        <Input type="number" defaultValue="450" className="h-11 pr-16 text-base font-bold bg-muted/10 border-border" />
                        <span className="absolute right-3 top-3 text-[10px] font-bold text-muted-foreground uppercase">Credits</span>
                      </div>
                   </div>
                   <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded-lg bg-background border border-border/50">
                         <p className="text-[9px] font-bold text-muted-foreground uppercase">Basic</p>
                         <p className="text-xs font-bold">450</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background border border-border/50">
                         <p className="text-[9px] font-bold text-muted-foreground uppercase">Standard</p>
                         <p className="text-xs font-bold">450</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/20">
                         <p className="text-[9px] font-bold text-primary uppercase">Priority</p>
                         <p className="text-xs font-bold text-primary">450</p>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Subscription Controls */}
          <Card className="border-border bg-slate-950 text-white rounded-xl overflow-hidden shadow-lg">
             <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider">Access Control</CardTitle>
                   </div>
                   <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[10px] font-bold h-5 px-2 uppercase">Gated</Badge>
                </div>
             </CardHeader>
             <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                   <div className={`p-4 rounded-xl border transition-all ${access.basic ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-40'}`}>
                      <div className="flex items-center justify-between mb-4">
                         <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Basic</p>
                         <Switch checked={access.basic} onCheckedChange={(v) => setAccess({...access, basic: v})} />
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                         {access.basic ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-rose-500" />}
                         {access.basic ? "Allowed" : "Denied"}
                      </div>
                   </div>
                   <div className={`p-4 rounded-xl border transition-all ${access.standard ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-40'}`}>
                      <div className="flex items-center justify-between mb-4">
                         <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Standard</p>
                         <Switch checked={access.standard} onCheckedChange={(v) => setAccess({...access, standard: v})} />
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                         {access.standard ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-rose-500" />}
                         {access.standard ? "Allowed" : "Denied"}
                      </div>
                   </div>
                   <div className={`p-4 rounded-xl border transition-all ${access.priority ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-40'}`}>
                      <div className="flex items-center justify-between mb-4">
                         <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority</p>
                         <Switch checked={access.priority} onCheckedChange={(v) => setAccess({...access, priority: v})} />
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                         {access.priority ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-rose-500" />}
                         {access.priority ? "Allowed" : "Denied"}
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Preview & Operations */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Route Preview (Visual Map) */}
          <Card className="border-border bg-card rounded-xl overflow-hidden shadow-sm h-[400px] relative">
             <div className="absolute inset-0 bg-muted/30">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path 
                    d="M 60 80 Q 150 150 160 250 T 260 350" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                    className="opacity-40"
                  />
                  <circle cx="60" cy="80" r="5" fill="hsl(var(--primary))" />
                  <circle cx="160" cy="250" r="5" fill="hsl(var(--primary))" />
                  <circle cx="260" cy="350" r="5" fill="#10b981" />
                </svg>

                <div className="absolute left-[160px] top-[250px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                   <div className="bg-primary text-white p-1 rounded-lg shadow-lg">
                      <Bus className="h-4 w-4" />
                   </div>
                </div>
             </div>

             <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border border-border h-7 gap-2 px-3">
                   <Navigation className="h-3.5 w-3.5 text-primary" />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Preview Intelligence</span>
                </Badge>
             </div>
          </Card>

          {/* Operational Controls */}
          <Card className="border-border bg-card rounded-xl shadow-sm">
             <CardHeader className="pb-4">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                   <Settings2 className="h-4 w-4 text-primary" /> Operations
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                   <Button 
                    variant={isActive ? "outline" : "default"}
                    onClick={() => setIsActive(true)}
                    className="h-10 rounded-lg text-xs font-semibold"
                   >
                      <Play className="h-3.5 w-3.5 mr-2" /> Activate
                   </Button>
                   <Button 
                    variant={!isActive ? "outline" : "destructive"}
                    onClick={() => setIsActive(false)}
                    className="h-10 rounded-lg text-xs font-semibold"
                   >
                      <Pause className="h-3.5 w-3.5 mr-2" /> Pause
                   </Button>
                </div>
                <Button variant="outline" className="w-full h-10 rounded-lg border-border gap-3 justify-start px-4">
                   <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                   <span className="text-xs font-semibold">Reset Daily Manifest</span>
                </Button>
                <Button variant="outline" className="w-full h-10 rounded-lg border-border gap-3 justify-start px-4">
                   <BarChart3 className="h-3.5 w-3.5 text-primary" />
                   <span className="text-xs font-semibold">View Analytics</span>
                </Button>
             </CardContent>
          </Card>

          <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
             <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase text-primary">System Logic</h3>
             </div>
             <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
               This route uses <span className="font-bold text-foreground">Priority First</span> booking. Seats are allocated in real-time using credits. Pausing the route immediately restricts new bookings in the passenger app.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
