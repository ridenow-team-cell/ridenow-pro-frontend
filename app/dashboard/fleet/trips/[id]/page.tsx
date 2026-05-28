"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import {
   Activity,
   Navigation,
   Clock,
   AlertTriangle,
   CheckCircle2,
   Bus as BusIcon,
   ArrowRight,
   User,
   ShieldAlert,
   ChevronRight,
   MapPin,
   Ban,
   UserMinus,
   RefreshCcw,
   CreditCard,
   Banknote,
   History,
   Zap,
   ExternalLink,
   Lock,
   Calendar,
   Mail,
   Phone,
   Compass,
   Info,
   Star,
   AlertOctagon,
   PhoneCall
} from "lucide-react"

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   CardFooter,
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
   DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api"

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

const tripData = {
   id: "RN-TRX-000234",
   status: "Active",
   riskLevel: "High",
   paymentStatus: "Escrowed",
   route: {
      id: "RT-102",
      name: "Downtown - Science Plaza",
      distance: "12.4 km",
      duration: "24 mins",
      stops: 8,
      completedStops: 3,
      startStation: "Central Station",
      endStation: "Science Plaza North",
      viaStops: ["Metro Depot", "Market Square", "Tech Hub", "Science Plaza"]
   },
   telemetry: {
      speed: "45 km/h",
      bearing: "142° SE",
      lastUpdate: "Just now",
      position: "34.0522° N, 118.2437° W"
   },
   passenger: {
      name: "Alex Rivera",
      id: "USR-9921",
      phone: "+1 (555) 012-3456",
      email: "alex.r@example.com",
      source: "Mobile App (iOS)",
      rating: 4.8
   },
   driver: {
      name: "Sarah Jenkins",
      id: "DRV-4402",
      phone: "+1 (555) 012-9876",
      email: "s.jenkins@ridenow.com",
      license: "CDL-99201A",
      status: "Active",
      rating: 4.9,
      vehicle: {
         type: "Electric Bus",
         plate: "EV-992-RP",
         capacity: 45,
         owner: "RydeNow Fleet Services",
         model: "X-Transit 2025",
         battery: "85%",
         diagnostics: "Healthy",
         manufacturer: "Zenith Motors",
         status: "Nominal"
      }
   },
   schedule: {
      scheduledDeparture: "14:10 PM",
      estimatedArrival: "14:38 PM",
      delay: "+4 mins",
      dayOfWeek: "Thursday",
      frequency: "Daily Route",
      scheduleStatus: "Delayed"
   },
   finance: {
      flatRate: 150, // Flat rate in credits
      taxCredits: 12,
      discount: -25,
      total: 137,
      method: "Digital Wallet",
      settlementStatus: "Processed"
   },
   risk: {
      score: 82,
      flags: [
         "Abnormal Route Deviation",
         "Frequent Device Switching",
         "High-Value Transaction Alert"
      ]
   },
   rating: {
      tripRating: 5,
      driverRating: 4.8,
      comment: "The ride was exceptionally smooth. The bus was clean and on time.",
      refunded: false,
      status: "resolved"
   },
   sos: {
      status: "Triggered",
      activatedAt: "14:18:22",
      resolvedAt: "14:25:10",
      location: "34.0528° N, 118.2445° W",
      message: "Panic button pressed by passenger seat A12",
      responder: "LAPD Unit 42",
      notes: "False alarm. Passenger accidentally pressed the physical panic button."
   },
   timeline: [
      { event: "Booking Created", time: "14:02:12", date: "May 06, 2026", status: "completed" },
      { event: "Payment Initiated (Escrow)", time: "14:02:15", date: "May 06, 2026", status: "completed" },
      { event: "Driver Sarah Jenkins Assigned", time: "14:03:45", date: "May 06, 2026", status: "completed" },
      { event: "Driver Arrived at Pickup", time: "14:08:20", date: "May 06, 2026", status: "completed" },
      { event: "Trip Started", time: "14:10:05", date: "May 06, 2026", status: "completed" },
      { event: "Stop 1: Science Plaza Boarding", time: "14:15:30", date: "May 06, 2026", status: "completed" },
      { event: "Route Deviation Detected", time: "14:18:22", date: "May 06, 2026", status: "warning" },
      { event: "Current Position Updated", time: "14:20:00", date: "May 06, 2026", status: "active" },
   ],
   passengers: [
      { name: "Alex Rivera", id: "USR-9921", seat: "A12", status: "Boarded", rating: 4.8 },
      { name: "Maria Garcia", id: "USR-4402", seat: "B03", status: "Boarded", rating: 4.9 },
      { name: "Jordan Smith", id: "USR-1205", seat: "C08", status: "Waiting", rating: 4.5 },
      { name: "Elena Gilbert", id: "USR-8821", seat: "A01", status: "Boarded", rating: 4.7 },
      { name: "Marcus Miller", id: "USR-3301", seat: "D11", status: "Boarded", rating: 4.6 },
   ]
}

export default function TripDetailsPage() {
   const params = useParams()
   const tripId = params.id as string || tripData.id

   const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
      libraries: GOOGLE_MAPS_LIBRARIES
   })

   return (
      <div className="flex flex-col min-h-screen bg-background pb-10">
         {/* 1. Control Header (Sticky Command Bar) */}
         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between py-4 max-w-full px-6">
               <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trip ID</span>
                        <Badge variant="outline" className="font-mono text-sm border-primary/20 bg-primary/5 text-primary">
                           {tripId}
                        </Badge>
                     </div>
                  </div>

                  <Separator orientation="vertical" className="h-8 mx-2" />

                  <div className="flex items-center gap-3">
                     <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1">
                        <Activity className="mr-1.5 h-3 w-3" />
                        {tripData.status}
                     </Badge>

                     <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 px-3 py-1">
                        <ShieldAlert className="mr-1.5 h-3 w-3" />
                        Risk: {tripData.riskLevel}
                     </Badge>

                     <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-200 hover:bg-amber-500/20 px-3 py-1">
                        <CreditCard className="mr-1.5 h-3 w-3" />
                        {tripData.paymentStatus}
                     </Badge>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9 border-border hover:bg-muted font-semibold">
                     <UserMinus className="mr-2 h-4 w-4" />
                     Reassign Driver
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 border-border hover:bg-muted font-semibold text-amber-600 border-amber-200 bg-amber-50/50">
                     <Lock className="mr-2 h-4 w-4" />
                     Freeze Tx
                  </Button>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button size="sm" className="h-9 bg-primary font-semibold">
                           Admin Actions <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="text-rose-600 focus:text-rose-600 font-medium">
                           <Ban className="mr-2 h-4 w-4" />
                           Cancel Trip
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-medium">
                           <CheckCircle2 className="mr-2 h-4 w-4" />
                           Force Complete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="font-medium">
                           <RefreshCcw className="mr-2 h-4 w-4" />
                           Adjust Fare
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-medium">
                           <Banknote className="mr-2 h-4 w-4" />
                           Refund Transaction
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
         </header>

         <div className="container max-w-full px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
               {/* Left Column: Operations & Timeline (8/12) */}
               <div className="lg:col-span-8 space-y-6">

                  {/* Live Telemetry Map Card */}
                  <Card className="border-border shadow-sm overflow-hidden flex flex-col">
                     <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                        <div className="space-y-1">
                           <CardTitle className="text-base font-bold flex items-center gap-2">
                              <Navigation className="h-4.5 w-4.5 text-primary" />
                              Live Telemetry Map
                           </CardTitle>
                           <CardDescription className="text-xs">Real-time GPS telematics, route path tracking and vehicle diagnostics.</CardDescription>
                        </div>
                        <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black uppercase tracking-wider animate-pulse px-2 py-0.5">
                           Active Tracking
                        </Badge>
                     </CardHeader>
                     <CardContent className="p-0 h-[380px] relative bg-muted/30">
                        {isLoaded ? (
                           <GoogleMap
                              mapContainerStyle={{ width: '100%', height: '100%' }}
                              center={{ lat: 9.0535, lng: 7.4880 }}
                              zoom={13}
                              options={{
                                 disableDefaultUI: false,
                                 zoomControl: true,
                                 mapTypeControl: false,
                                 scaleControl: true,
                                 streetViewControl: false,
                                 rotateControl: false,
                                 fullscreenControl: true
                              }}
                           >
                              {/* Origin Stop */}
                              <Marker
                                 position={{ lat: 9.0667, lng: 7.4833 }}
                                 title={`Start Station: ${tripData.route.startStation}`}
                                 icon={{
                                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                          <circle cx="12" cy="12" r="10" fill="white"/>
                                          <circle cx="12" cy="12" r="4" fill="#2563eb"/>
                                       </svg>
                                    `),
                                    scaledSize: new google.maps.Size(20, 20),
                                    anchor: new google.maps.Point(10, 10)
                                 }}
                              />

                              {/* Destination Stop */}
                              <Marker
                                 position={{ lat: 9.0433, lng: 7.5194 }}
                                 title={`Destination: ${tripData.route.endStation}`}
                                 icon={{
                                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                          <circle cx="12" cy="12" r="10" fill="white"/>
                                          <circle cx="12" cy="12" r="4" fill="#e11d48"/>
                                       </svg>
                                    `),
                                    scaledSize: new google.maps.Size(20, 20),
                                    anchor: new google.maps.Point(10, 10)
                                 }}
                              />

                              {/* Current Bus Position */}
                              <Marker
                                 position={{ lat: 9.0535, lng: 7.4880 }}
                                 title={`Current Location: ${tripData.driver.vehicle.plate}`}
                                 icon={{
                                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                       <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                          <rect width="36" height="36" rx="8" fill="#2563eb" stroke="white" stroke-width="2"/>
                                          <g transform="translate(10, 10)">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                                <line x1="2" y1="10" x2="22" y2="10"/>
                                                <path d="M6 21v-2M18 21v-2"/>
                                             </svg>
                                          </g>
                                       </svg>
                                    `),
                                    scaledSize: new google.maps.Size(36, 36),
                                    anchor: new google.maps.Point(18, 18)
                                 }}
                              />

                              {/* Route Line */}
                              <Polyline
                                 path={[
                                    { lat: 9.0667, lng: 7.4833 },
                                    { lat: 9.0535, lng: 7.4880 },
                                    { lat: 9.0433, lng: 7.5194 }
                                 ]}
                                 options={{
                                    strokeColor: "#2563eb",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 4,
                                    geodesic: true
                                 }}
                              />
                           </GoogleMap>
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                              <div className="flex flex-col items-center gap-2">
                                 <Activity className="h-8 w-8 text-primary animate-pulse" />
                                 <p className="text-xs uppercase font-black tracking-widest text-muted-foreground animate-pulse">Loading Live Telematics Map...</p>
                              </div>
                           </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 p-4 rounded-xl border border-border shadow-lg flex flex-wrap items-center justify-between gap-4">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                 <MapPin className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="text-xs font-black uppercase tracking-tight">{tripData.telemetry.position}</p>
                                 <p className="text-[10px] text-muted-foreground font-bold">Bearing: {tripData.telemetry.bearing} • Last updated: {tripData.telemetry.lastUpdate}</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Telemetry Speed</p>
                                 <p className="text-sm font-black text-foreground">{tripData.telemetry.speed}</p>
                              </div>
                              <div className="text-right border-l pl-4 border-border">
                                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Est. Diagnostics</p>
                                 <p className="text-sm font-black text-emerald-600">Nominal</p>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Passenger Manifest Block */}
                  <Card className="border-border shadow-sm">
                     <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                              <User className="h-5 w-5" />
                           </div>
                           <div>
                              <CardTitle className="text-base font-bold">Passenger Manifest</CardTitle>
                              <CardDescription className="text-xs">Full list of passengers assigned to this trip.</CardDescription>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="h-6 text-[10px] font-bold uppercase tracking-wider bg-muted border-none">
                              {tripData.passengers.filter(p => p.status === 'Boarded').length} BOARDED
                           </Badge>
                           <Badge variant="outline" className="h-6 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-none">
                              {tripData.passengers.length} TOTAL
                           </Badge>
                        </div>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="divide-y divide-border">
                           {tripData.passengers.map((p, idx) => (
                              <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                 <div className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9">
                                       <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                                          {p.name.split(' ').map(n => n[0]).join('')}
                                       </AvatarFallback>
                                    </Avatar>
                                    <div>
                                       <p className="text-sm font-bold leading-none">{p.name}</p>
                                       <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-mono">{p.id} • Seat {p.seat}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="text-right mr-4 hidden md:block">
                                       <p className="text-[10px] font-bold uppercase text-muted-foreground">Rating</p>
                                       <p className="text-xs font-black text-amber-500">★ {p.rating}</p>
                                    </div>
                                    <Badge className={`text-[9px] font-black uppercase px-2 h-5 border-none ${p.status === 'Boarded' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                       }`}>
                                       {p.status}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                       <ChevronRight className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                     <CardFooter className="bg-muted/20 border-t border-border/50 py-3 flex justify-between">
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                           Capacity Utilization: {Math.round((tripData.passengers.length / tripData.driver.vehicle.capacity) * 100)}% ({tripData.passengers.length}/{tripData.driver.vehicle.capacity})
                        </p>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest text-primary">
                           View All <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                     </CardFooter>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* 5. Trip Timeline (Audit Trail) */}
                     <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
                           <div>
                              <CardTitle className="text-base font-bold flex items-center gap-2">
                                 <History className="h-4 w-4 text-primary" />
                                 Trip Timeline
                              </CardTitle>
                              <CardDescription className="text-xs">Immutable audit trail of all trip events.</CardDescription>
                           </div>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <ExternalLink className="h-4 w-4" />
                           </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                           <ScrollArea className="h-[320px] pr-4">
                              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                                 {tripData.timeline.map((item, idx) => (
                                    <div key={idx} className="relative pl-8">
                                       <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-background flex items-center justify-center shadow-sm ${item.status === 'completed' ? 'bg-emerald-500' :
                                             item.status === 'warning' ? 'bg-rose-500' :
                                                'bg-primary animate-pulse'
                                          }`}>
                                          {item.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-white" />}
                                          {item.status === 'warning' && <AlertTriangle className="h-3 w-3 text-white" />}
                                          {item.status === 'active' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                       </div>
                                       <div>
                                          <p className="text-sm font-bold leading-tight">{item.event}</p>
                                          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2 uppercase tracking-tight">
                                             <Clock className="h-3 w-3" /> {item.time} • {item.date}
                                          </p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </ScrollArea>
                        </CardContent>
                        <CardFooter className="bg-muted/30 border-t border-border/50 py-3">
                           <Button variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-primary">
                              Download Audit Export (.PDF)
                           </Button>
                        </CardFooter>
                     </Card>

                     <div className="space-y-6">
                        {/* SOS Emergency Console */}
                        <Card className="border-rose-200 bg-rose-500/[0.01] shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4">
                              <AlertOctagon className="h-10 w-10 text-rose-500/10 scale-150 rotate-12" />
                           </div>
                           <CardHeader className="pb-3 border-b border-rose-100 flex flex-row items-center justify-between">
                              <CardTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
                                 <AlertOctagon className="h-4 w-4 animate-pulse" />
                                 SOS Alert System
                              </CardTitle>
                              <Badge className="bg-rose-500 text-white border-none text-[10px] font-black uppercase tracking-wider animate-pulse px-2 py-0.5">
                                 {tripData.sos.status}
                              </Badge>
                           </CardHeader>
                           <CardContent className="pt-6 space-y-4">
                              <div className="p-3.5 bg-rose-50 border border-rose-100/50 rounded-lg space-y-2">
                                 <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold text-rose-500 uppercase tracking-wide">Trigger Event</span>
                                    <span className="text-muted-foreground font-mono">{tripData.sos.activatedAt}</span>
                                 </div>
                                 <p className="text-xs font-bold text-rose-950 leading-relaxed">
                                    {tripData.sos.message}
                                 </p>
                                 <div className="flex items-center gap-1.5 text-xs text-rose-700">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="font-mono font-medium">{tripData.sos.location}</span>
                                 </div>
                              </div>

                              <div className="space-y-2 text-xs">
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground font-medium">First Responder</span>
                                    <span className="font-bold text-foreground">{tripData.sos.responder}</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground font-medium">Resolution Time</span>
                                    <span className="font-bold text-foreground">{tripData.sos.resolvedAt}</span>
                                 </div>
                                 <div className="space-y-1 bg-muted/20 p-2.5 rounded border border-border/50">
                                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Responder Notes</span>
                                    <p className="text-xs text-muted-foreground leading-normal italic">
                                       "{tripData.sos.notes}"
                                    </p>
                                 </div>
                              </div>

                              <div className="pt-2 flex gap-2">
                                 <Button variant="outline" size="sm" className="flex-1 h-9 text-[10px] font-bold uppercase border-rose-200 text-rose-600 hover:bg-rose-50">
                                    <PhoneCall className="mr-1.5 h-3.5 w-3.5" />
                                    Contact Dispatch
                                 </Button>
                                 <Button variant="outline" size="sm" className="flex-1 h-9 text-[10px] font-bold uppercase border-border">
                                    Location History
                                 </Button>
                              </div>
                           </CardContent>
                        </Card>

                        {/* Ratings & Feedback Card */}
                        <Card className="border-border shadow-sm">
                           <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                              <CardTitle className="text-base font-bold flex items-center gap-2">
                                 <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                 Passenger Feedback
                              </CardTitle>
                              <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                                 {tripData.rating.status}
                              </Badge>
                           </CardHeader>
                           <CardContent className="pt-6 space-y-4">
                              <div className="flex items-center justify-between">
                                 <div className="space-y-1">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Overall Trip Rating</span>
                                    <div className="flex gap-0.5">
                                       {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`h-4.5 w-4.5 ${
                                             i < tripData.rating.tripRating ? 'text-amber-500 fill-amber-500' : 'text-muted/30'
                                          }`} />
                                       ))}
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Driver Rating</span>
                                    <p className="text-sm font-black text-foreground">★ {tripData.rating.driverRating}</p>
                                 </div>
                              </div>

                              <div className="p-3.5 rounded-lg bg-muted/40 border border-border/50 relative">
                                 <span className="absolute -top-2.5 left-3 px-1.5 bg-background text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Review Comment</span>
                                 <p className="text-xs text-muted-foreground leading-relaxed italic">
                                    "{tripData.rating.comment}"
                                 </p>
                              </div>

                              <div className="pt-2 flex gap-2">
                                 <Button variant="outline" size="sm" className="flex-1 h-9 text-[10px] font-bold uppercase border-border">
                                    Reply to Rider
                                 </Button>
                                 <Button variant="outline" size="sm" className="flex-1 h-9 text-[10px] font-bold uppercase border-border text-primary border-primary/20 hover:bg-primary/5">
                                    Issue Refund
                                 </Button>
                              </div>
                           </CardContent>
                        </Card>
                     </div>
                  </div>
               </div>

               {/* Right Column: Identity & Finance (4/12) */}
               <div className="lg:col-span-4 space-y-6">

                  {/* 1. Driver Details Card */}
                  <Card className="border-border shadow-sm">
                     <CardHeader className="pb-3 border-b border-border/50">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <User className="h-4 w-4 text-primary" />
                           Driver Details
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-6 space-y-4">
                        <div className="flex gap-4">
                           <Avatar className="h-14 w-14 ring-4 ring-muted shadow-sm">
                              <AvatarImage src="/api/placeholder/40/40" />
                              <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-black text-xl">SJ</AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="text-base font-black leading-none">{tripData.driver.name}</p>
                              <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">{tripData.driver.id}</p>
                              <div className="flex items-center gap-1.5 mt-2">
                                 <Badge className="h-5 bg-emerald-500/10 text-emerald-600 border-none px-1.5 font-bold">
                                    ★ {tripData.driver.rating}
                                 </Badge>
                                 <Badge className="h-5 bg-emerald-500 text-white border-none text-[10px] font-bold uppercase tracking-tighter">
                                    {tripData.driver.status}
                                 </Badge>
                              </div>
                           </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="space-y-2 text-xs">
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground font-medium">CDL License</span>
                              <span className="font-mono font-bold text-foreground">{tripData.driver.license}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                 <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
                              </span>
                              <span className="font-medium text-foreground">{tripData.driver.email}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                 <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone
                              </span>
                              <span className="font-mono font-medium text-foreground">{tripData.driver.phone}</span>
                           </div>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                           <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase border-border text-primary border-primary/20 hover:bg-primary/5">
                              Reassign Driver
                           </Button>
                        </div>
                     </CardContent>
                  </Card>

                  {/* 2. Bus Details Card */}
                  <Card className="border-border shadow-sm">
                     <CardHeader className="pb-3 border-b border-border/50">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <BusIcon className="h-4 w-4 text-primary" />
                           Bus Details
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm font-black leading-none">{tripData.driver.vehicle.type}</p>
                              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">{tripData.driver.vehicle.model}</p>
                           </div>
                           <Badge variant="outline" className="bg-background font-mono text-xs font-bold uppercase border-border px-2 py-0.5">
                              {tripData.driver.vehicle.plate}
                           </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                           <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Capacity</span>
                              <p className="font-bold text-sm">{tripData.driver.vehicle.capacity} Seats</p>
                           </div>
                           <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Diagnostics</span>
                              <p className="font-bold text-sm text-emerald-600">{tripData.driver.vehicle.diagnostics}</p>
                           </div>
                           <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Battery</span>
                              <p className="font-bold text-sm text-primary">{tripData.driver.vehicle.battery}</p>
                           </div>
                           <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Status</span>
                              <p className="font-bold text-sm text-emerald-600">{tripData.driver.vehicle.status}</p>
                           </div>
                        </div>

                        <div className="space-y-2 text-xs">
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground font-medium">Manufacturer</span>
                              <span className="font-semibold text-foreground">{tripData.driver.vehicle.manufacturer}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground font-medium">Operator/Owner</span>
                              <span className="font-semibold text-foreground">{tripData.driver.vehicle.owner}</span>
                           </div>
                        </div>

                        <div className="pt-2">
                           <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase border-border">
                              Swap Vehicle
                           </Button>
                        </div>
                     </CardContent>
                  </Card>

                  {/* 3. Route Details Card */}
                  <Card className="border-border shadow-sm">
                     <CardHeader className="pb-3 border-b border-border/50">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <Compass className="h-4 w-4 text-primary" />
                           Route Details
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-6 space-y-4">
                        <div>
                           <div className="flex items-center gap-2">
                              <Badge className="bg-primary/10 text-primary border-none font-bold text-xs">
                                 {tripData.route.id}
                              </Badge>
                              <p className="text-sm font-black text-foreground">{tripData.route.name}</p>
                           </div>
                        </div>

                        <div className="space-y-3.5 pt-2">
                           <div className="relative pl-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-muted-foreground/30">
                              <div className="relative mb-4">
                                 <div className="absolute -left-[24px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                 </div>
                                 <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Start Origin</p>
                                 <p className="text-xs font-bold text-foreground mt-0.5">{tripData.route.startStation}</p>
                              </div>
                              <div className="relative">
                                 <div className="absolute -left-[24px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-rose-500 bg-background flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                 </div>
                                 <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Destination</p>
                                 <p className="text-xs font-bold text-foreground mt-0.5">{tripData.route.endStation}</p>
                              </div>
                           </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                           <div className="space-y-1 py-1 bg-muted/20 rounded">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Distance</span>
                              <p className="font-bold">{tripData.route.distance}</p>
                           </div>
                           <div className="space-y-1 py-1 bg-muted/20 rounded">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Est. Time</span>
                              <p className="font-bold">{tripData.route.duration}</p>
                           </div>
                           <div className="space-y-1 py-1 bg-muted/20 rounded">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Stops</span>
                              <p className="font-bold">{tripData.route.stops} Stops</p>
                           </div>
                        </div>

                        <div className="space-y-1.5 text-xs bg-muted/20 p-3 rounded-lg border border-border/50">
                           <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Via Stops</span>
                           <div className="flex flex-wrap gap-1 mt-1">
                              {tripData.route.viaStops.map((stop, idx) => (
                                 <Badge key={idx} variant="secondary" className="text-[9px] font-medium bg-background text-muted-foreground border-border/50">
                                    {stop}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* 4. Schedule Details Card */}
                  <Card className="border-border shadow-sm">
                     <CardHeader className="pb-3 border-b border-border/50">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-primary" />
                           Schedule Details
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="space-y-0.5">
                              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Frequency</span>
                              <p className="text-xs font-bold text-foreground">{tripData.schedule.frequency}</p>
                           </div>
                           <Badge className={`h-5 border-none font-bold text-[10px] uppercase ${
                              tripData.schedule.scheduleStatus === 'Delayed' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                           }`}>
                              {tripData.schedule.scheduleStatus}
                           </Badge>
                        </div>

                        <Separator className="my-2" />

                        <div className="grid grid-cols-2 gap-4 text-xs">
                           <div className="space-y-1">
                              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                 <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Scheduled Dep.
                              </span>
                              <p className="font-bold text-foreground text-sm">{tripData.schedule.scheduledDeparture}</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                 <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Est. Arrival
                              </span>
                              <p className="font-bold text-foreground text-sm">{tripData.schedule.estimatedArrival}</p>
                           </div>
                        </div>

                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                           <span className="font-medium text-amber-800">Current Delay Status</span>
                           <span className="font-mono font-bold text-amber-700">{tripData.schedule.delay}</span>
                        </div>

                        <div className="space-y-2 text-xs pt-1">
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground font-medium">Day of Week</span>
                              <span className="font-semibold text-foreground">{tripData.schedule.dayOfWeek}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground font-medium">Dispatch Authority</span>
                              <span className="font-semibold text-foreground">RydeNow Auto-Dispatch</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   )
}

function TelemetryItem({ icon, label, value, className = "" }: { icon: React.ReactNode, label: string, value: string, className?: string }) {
   return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
         <div className="flex items-center gap-3">
            <div className="text-zinc-500">{icon}</div>
            <span className="text-[10px] font-bold uppercase text-zinc-500">{label}</span>
         </div>
         <span className={`text-xs font-bold text-zinc-100 ${className}`}>{value}</span>
      </div>
   )
}


function Plus({ className }: { className?: string }) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
   )
}

function Minus({ className }: { className?: string }) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /></svg>
   )
}
