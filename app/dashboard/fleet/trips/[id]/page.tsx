"use client"

import * as React from "react"
import { useParams } from "next/navigation"
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
  ChevronRight,
  MapPin,
  Ban,
  UserMinus,
  RefreshCcw,
  CreditCard,
  Wallet,
  Banknote,
  History,
  MessageSquare,
  Paperclip,
  Flag,
  ShieldCheck,
  Zap,
  Info,
  MoreVertical,
  ExternalLink,
  Lock,
  DollarSign
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
    completedStops: 3
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
    status: "Active",
    rating: 4.9,
    vehicle: {
      type: "Electric Bus",
      plate: "EV-992-RP",
      capacity: 45,
      owner: "RideNow Fleet Services"
    }
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
            
            {/* 2. Live Operations Panel (Map + Telemetry) */}
            <Card className="overflow-hidden border-border bg-card shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 h-[450px]">
                <div className="md:col-span-3 relative bg-muted group">
                   {/* Map Placeholder */}
                   <img 
                    src="/trip_live_map.png" 
                    alt="Live Trip Map"
                    className="w-full h-full object-cover opacity-90"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                   
                   {/* Floating Map Controls */}
                   <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="p-2 bg-background/80 backdrop-blur rounded-lg shadow-xl border border-border flex flex-col gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8"><Plus className="h-4 w-4"/></Button>
                        <Separator />
                        <Button size="icon" variant="ghost" className="h-8 w-8"><Minus className="h-4 w-4"/></Button>
                      </div>
                      <Button size="icon" variant="secondary" className="h-10 w-10 shadow-xl border border-border"><Navigation className="h-5 w-5 text-primary" /></Button>
                   </div>

                   {/* Live Route Info Overlay */}
                   <div className="absolute bottom-4 left-4 right-4">
                      <div className="p-4 bg-background/90 backdrop-blur-md rounded-xl border border-border shadow-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <BusIcon className="h-5 w-5" />
                           </div>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground leading-none">Next Stop</p>
                              <p className="text-sm font-bold mt-1">St. George Station <span className="text-primary ml-1">• 4.2 km away</span></p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-center">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground">ETA</p>
                              <p className="text-sm font-mono font-bold text-emerald-500">14:38 PM</p>
                           </div>
                           <Separator orientation="vertical" className="h-8" />
                           <div className="text-center">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground">Delay</p>
                              <p className="text-sm font-mono font-bold text-rose-500">+4m</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-zinc-950 text-zinc-100 p-6 flex flex-col justify-between">
                   <div className="space-y-6">
                      <div className="flex items-center gap-2 text-primary">
                         <Activity className="h-4 w-4" />
                         <span className="text-xs font-black uppercase tracking-widest">Live Telemetry</span>
                      </div>
                      
                      <div className="grid gap-4">
                        <TelemetryItem icon={<Zap className="h-4 w-4"/>} label="Speed" value={tripData.telemetry.speed} />
                        <TelemetryItem icon={<Navigation className="h-4 w-4"/>} label="Bearing" value={tripData.telemetry.bearing} />
                        <TelemetryItem icon={<MapPin className="h-4 w-4"/>} label="Coordinates" value={tripData.telemetry.position} className="text-[10px] font-mono" />
                      </div>

                      <div className="pt-4 space-y-3">
                         <div className="flex items-center justify-between text-[10px] font-bold uppercase text-zinc-500">
                            <span>Route Progress</span>
                            <span>{Math.round((tripData.route.completedStops / tripData.route.stops) * 100)}%</span>
                         </div>
                         <Progress value={(tripData.route.completedStops / tripData.route.stops) * 100} className="h-1.5 bg-zinc-800" />
                         <p className="text-[10px] text-zinc-400 font-medium">3 of 8 stops completed • {tripData.route.name}</p>
                      </div>
                   </div>

                   <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 mt-auto">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-bold uppercase text-zinc-500">Last Ping</span>
                         <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[8px] h-4">STABLE</Badge>
                      </div>
                      <p className="text-xs font-mono text-zinc-300">{tripData.telemetry.lastUpdate}</p>
                   </div>
                </div>
              </div>
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
                              <Badge className={`text-[9px] font-black uppercase px-2 h-5 border-none ${
                                 p.status === 'Boarded' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
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
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                        {tripData.timeline.map((item, idx) => (
                          <div key={idx} className="relative pl-8">
                             <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-background flex items-center justify-center shadow-sm ${
                                item.status === 'completed' ? 'bg-emerald-500' : 
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

               {/* 9. Support & Dispute Center */}
               <div className="space-y-6">
                 <Card className="border-border shadow-sm">
                   <CardHeader className="pb-3 border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                           <MessageSquare className="h-4 w-4 text-primary" />
                           Support & Disputes
                        </CardTitle>
                        <Badge className="bg-rose-500 text-white border-none text-[10px] uppercase font-black">1 Active</Badge>
                      </div>
                   </CardHeader>
                   <CardContent className="pt-6 space-y-4">
                      <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 space-y-2">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-rose-500">Complaint #TK-8802</span>
                            <span className="text-[10px] text-muted-foreground font-medium">10m ago</span>
                         </div>
                         <p className="text-sm font-bold">Route Deviation Reported</p>
                         <p className="text-xs text-muted-foreground leading-relaxed">
                            Passenger claims driver missed the intended stop at Science Plaza.
                         </p>
                         <div className="flex items-center gap-2 pt-2">
                            <Button size="sm" className="h-8 text-[9px] font-bold uppercase bg-rose-600 hover:bg-rose-700">Open Chat</Button>
                            <Button size="sm" variant="outline" className="h-8 text-[9px] font-bold uppercase border-rose-200 text-rose-700 hover:bg-rose-100">Issue Refund</Button>
                         </div>
                      </div>
                   </CardContent>
                 </Card>

                 {/* 8. Internal Notes & Admin Collaboration */}
                 <Card className="border-border shadow-sm">
                   <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                         <Paperclip className="h-4 w-4 text-primary" />
                         Internal Notes
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-bold uppercase text-primary">Add Note</Button>
                   </CardHeader>
                   <CardContent className="pt-6">
                      <div className="space-y-4">
                         <div className="flex gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-background">
                               <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">JD</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                               <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold">Admin: James D.</span>
                                  <span className="text-[10px] text-muted-foreground">14:15 PM</span>
                               </div>
                               <p className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg border border-border">
                                  Monitoring the route deviation. Driver says there's a road block near the plaza.
                               </p>
                            </div>
                         </div>
                      </div>
                   </CardContent>
                 </Card>
               </div>
            </div>
          </div>

          {/* Right Column: Identity & Finance (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 6. Financial Engine (Pinned/Most Critical) */}
            <Card className="border-primary/20 bg-primary/[0.02] shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/20 scale-150 rotate-12">
                    <Zap className="h-full w-full" />
                 </div>
              </div>
              <CardHeader className="pb-4 border-b border-primary/10">
                 <CardTitle className="text-lg font-black uppercase tracking-tight text-primary flex items-center gap-2">
                    Financial Engine
                 </CardTitle>
                 <CardDescription className="text-xs font-medium">Real-time revenue tracking & control.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 <div className="space-y-3">
                    <FinanceRow label="Route Flat Rate" value={tripData.finance.flatRate} isCredit />
                    <FinanceRow label="System Fees / Tax" value={tripData.finance.taxCredits} isCredit />
                    <FinanceRow label="Promotional Discount" value={tripData.finance.discount} isNegative isCredit />
                    <Separator className="bg-primary/10 my-4" />
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-black uppercase tracking-widest text-primary">Total Credits</span>
                       <span className="text-2xl font-black text-primary">{tripData.finance.total} <span className="text-xs">CR</span></span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Recent Activity</p>
                    <div className="text-[10px] space-y-1.5 font-medium">
                       <div className="flex justify-between p-2 bg-background border border-border/50 rounded">
                          <span className="text-muted-foreground">Credit Redemption: {tripData.finance.total} CR</span>
                          <span className="font-mono text-emerald-600">SETTLED</span>
                       </div>
                       <div className="flex justify-between p-2 bg-background border border-border/50 rounded opacity-50">
                          <span className="text-muted-foreground">Settlement: Pending Trip Completion</span>
                          <span className="font-mono">WAITING</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-3 pt-0 pb-6 px-6">
                 <Button className="w-full bg-primary hover:bg-primary/90 text-xs font-bold uppercase tracking-wider h-10 shadow-lg">Manual Settle</Button>
                 <Button variant="outline" className="w-full border-border text-xs font-bold uppercase tracking-wider h-10">Issue Refund</Button>
              </CardFooter>
            </Card>



            {/* 4. Driver & Fleet Block */}
            <Card className="border-border shadow-sm">
               <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Driver & Fleet Control</CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                     <div className="flex gap-4">
                        <Avatar className="h-14 w-14 ring-4 ring-muted shadow-sm">
                           <AvatarImage src="/api/placeholder/40/40" />
                           <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-black text-xl">SJ</AvatarFallback>
                        </Avatar>
                        <div>
                           <p className="text-base font-black leading-none">{tripData.driver.name}</p>
                           <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">{tripData.driver.id}</p>
                           <div className="flex items-center gap-1.5 mt-2">
                              <Badge className="h-5 bg-emerald-500/10 text-emerald-600 border-none px-1.5">
                                 ★ {tripData.driver.rating}
                              </Badge>
                              <Badge className="h-5 bg-emerald-500 text-white border-none text-[10px] font-bold uppercase tracking-tighter">ACTIVE</Badge>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <BusIcon className="h-4 w-4 text-primary" />
                           <span className="text-xs font-bold">{tripData.driver.vehicle.type}</span>
                        </div>
                        <Badge variant="outline" className="bg-background font-mono text-[10px] font-bold uppercase border-border">{tripData.driver.vehicle.plate}</Badge>
                     </div>
                     <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">Capacity Util.</span>
                        <span className="font-bold">64% / 45 Seats</span>
                     </div>
                  </div>

                  <div className="mt-4 pt-2 flex flex-col gap-2">
                     <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase border-border">Swap Vehicle</Button>
                     <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase border-border text-primary border-primary/20 hover:bg-primary/5">Reassign Driver</Button>
                  </div>
               </CardContent>
            </Card>

            {/* 7. Risk & Compliance Panel */}
            <Card className="border-border bg-zinc-950 text-white shadow-xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[60px] pointer-events-none" />
               <CardHeader className="pb-3 border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-rose-500 flex items-center gap-2">
                       <ShieldAlert className="h-4 w-4" />
                       Risk Profile
                    </CardTitle>
                    <Badge className="bg-rose-500 text-white border-none font-black text-xs">{tripData.risk.score}/100</Badge>
                  </div>
               </CardHeader>
               <CardContent className="pt-6 space-y-6">
                  <div className="space-y-3">
                     <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Active Alerts</p>
                     {tripData.risk.flags.map((flag, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg group hover:border-rose-500/50 transition-colors">
                           <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                           <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors">{flag}</span>
                        </div>
                     ))}
                  </div>

                  <div className="pt-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase text-zinc-500">Security Insights</p>
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                           <div className="space-y-1">
                              <p className="text-zinc-500 uppercase">Device IP</p>
                              <p className="text-zinc-300">192.168.1.45</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-zinc-500 uppercase">Collusion Risk</p>
                              <p className="text-emerald-500 font-bold">LOW</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="bg-rose-500/5 border-t border-zinc-800 p-4">
                  <Button variant="ghost" className="w-full text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-widest">
                     Initiate Deep Forensic Audit
                  </Button>
               </CardFooter>
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

function FinanceRow({ label, value, isNegative = false, isCredit = false }: { label: string, value: number, isNegative?: boolean, isCredit?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
       <span className="font-medium text-muted-foreground">{label}</span>
       <span className={`font-mono font-bold ${isNegative ? 'text-rose-500' : 'text-foreground'}`}>
          {isNegative ? '-' : ''}{isCredit ? '' : '$'}{Math.abs(value)}{isCredit ? ' CR' : ''}
       </span>
    </div>
  )
}

function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  )
}

function Minus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>
  )
}
