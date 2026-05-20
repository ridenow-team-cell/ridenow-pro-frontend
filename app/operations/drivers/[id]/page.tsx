"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  User, 
  Bus as BusIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp, 
  History, 
  Navigation, 
  ChevronLeft,
  MoreVertical,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Gauge,
  Fuel,
  Map as MapIcon,
  ShieldCheck
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
import { driverApi, DriverProfile, Trip } from "@/lib/api/drivers"
import { toast } from "sonner"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

export default function DriverDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [profile, setProfile] = React.useState<DriverProfile | null>(null)
  const [loading, setLoading] = React.useState(true)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const fetchData = React.useCallback(async () => {
    try {
      const res = await driverApi.getDriverProfile(id)
      if (res.success && res.data) {
        setProfile(res.data)
      }
    } catch (error) {
      toast.error("Failed to load driver profile")
    } finally {
      setLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground italic">Decrypting Personnel File...</p>
      </div>
    )
  }

  if (!profile) return null

  const { driver, assignedBus, trips, activeTrip, stats } = profile

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
                <BreadcrumbLink href="/operations/drivers">Drivers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{driver.first_name} {driver.last_name}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl">
              <User className="h-10 w-10" />
            </div>
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black tracking-tighter text-foreground">{driver.first_name} {driver.last_name}</h1>
                  <Badge variant="outline" className={`border-none font-black text-[10px] px-3 h-6 ${
                    stats.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {stats.status.toUpperCase()}
                  </Badge>
                  {assignedBus?.isOnline && <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[10px] h-6">ONLINE</Badge>}
               </div>
               <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  ID: {driver.id.slice(-8).toUpperCase()} <Separator orientation="vertical" className="h-3" /> Joined {new Date(driver.created_at).toLocaleDateString()}
               </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-12 border-border font-bold text-xs uppercase tracking-widest px-6 bg-white" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Ledger
             </Button>
             <Button className="h-12 font-black text-xs uppercase tracking-widest px-6 brand-gradient text-white shadow-lg shadow-primary/20">
                <Navigation className="mr-2 h-4 w-4" /> Track Location
             </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Trips", val: stats.tripsCompleted, icon: Activity, color: "text-primary" },
          { title: "Avg Rating", val: stats.rating, icon: Star, color: "text-amber-500" },
          { title: "Assigned Unit", val: assignedBus?.busNumber || "UNASSIGNED", icon: BusIcon, color: "text-emerald-600" },
          { title: "Active Route", val: activeTrip?.route.code || "OFF DUTY", icon: MapIcon, color: "text-primary" }
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-sm bg-white overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black tracking-tight">{stat.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Profile & Assigned Unit */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border shadow-xl">
             <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Personnel Details</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50">
                   <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-border shadow-sm">
                      <Mail className="h-4 w-4 text-primary" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Email Address</p>
                      <p className="text-xs font-bold">{driver.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50">
                   <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-border shadow-sm">
                      <Phone className="h-4 w-4 text-primary" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Phone Number</p>
                      <p className="text-xs font-bold">{driver.phone_number || "NOT RECORDED"}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50">
                   <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-border shadow-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Date of Birth</p>
                      <p className="text-xs font-bold">{driver.date_of_birth || "NOT RECORDED"}</p>
                   </div>
                </div>
             </CardContent>
          </Card>

          {assignedBus && (
            <Card className="border-border shadow-xl bg-zinc-950 text-white overflow-hidden">
               <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <BusIcon className="h-3.5 w-3.5" /> Assigned Unit: {assignedBus.busNumber}
                    </CardTitle>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[8px] h-5">ACTIVE UNIT</Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fuel Level</p>
                        <Fuel className="h-4 w-4 text-emerald-500" />
                     </div>
                     <div className="flex items-end justify-between">
                        <div className="text-5xl font-black tracking-tighter text-primary">{assignedBus.cngInfo.currentFuelLevelPercent}%</div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase pb-1">CNG System</p>
                     </div>
                     <Progress value={assignedBus.cngInfo.currentFuelLevelPercent} className="h-2 bg-zinc-800" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">Plate Number</p>
                        <p className="text-xs font-bold text-white">{assignedBus.plateNumber}</p>
                     </div>
                     <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">Pressure</p>
                        <p className="text-xs font-bold text-white">{assignedBus.cngInfo.currentPressurePsi} PSI</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
          )}
        </div>

        {/* Center & Right Column: Map, Active Trip, History */}
        <div className="lg:col-span-2 space-y-6">
          {/* GIS Tracking Map */}
          <Card className="border-border shadow-xl overflow-hidden h-[300px] relative">
             {isLoaded ? (
                <GoogleMap
                   mapContainerStyle={{ width: '100%', height: '100%' }}
                   center={assignedBus ? { lat: assignedBus.currentLatitude, lng: assignedBus.currentLongitude } : { lat: 6.5244, lng: 3.3792 }}
                   zoom={14}
                   options={{
                      disableDefaultUI: true,
                      styles: [
                         { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }] },
                         { "featureType": "administrative.country", "elementType": "geometry", "stylers": [{ "visibility": "on" }] },
                         { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
                         { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
                         { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
                         { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] }
                      ]
                   }}
                >
                   {assignedBus && <Marker position={{ lat: assignedBus.currentLatitude, lng: assignedBus.currentLongitude }} />}
                </GoogleMap>
             ) : (
                <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
                   <Navigation className="h-8 w-8 text-muted-foreground/50" />
                </div>
             )}
             <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-white/90 backdrop-blur-md text-zinc-950 shadow-xl border-none font-black text-[10px] tracking-widest px-4 h-10 flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   LIVE ASSET TELEMETRY
                </Badge>
             </div>
          </Card>

          <Tabs defaultValue="trips" className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-xl h-12 border border-border">
              <TabsTrigger value="trips" className="rounded-lg font-bold text-xs uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Trip History</TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg font-bold text-xs uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Active Session</TabsTrigger>
            </TabsList>

            <TabsContent value="trips" className="pt-6">
               <Card className="border-border shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                           <tr>
                              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Route</th>
                              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Time</th>
                              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Fare</th>
                              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Status</th>
                              <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Date</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                           {trips.map((trip) => (
                              <tr key={trip.id} className="hover:bg-muted/10 transition-colors">
                                 <td className="px-6 py-4">
                                    <p className="font-bold text-xs uppercase text-primary">{trip.route.name}</p>
                                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{trip.route.code}</p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold">
                                       <Clock className="h-3 w-3 text-muted-foreground" />
                                       {trip.schedule.departureTime}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="font-black text-xs">₦{trip.route.baseFare.toLocaleString()}</p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none font-black text-[9px] uppercase">{trip.status}</Badge>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <p className="text-xs font-bold text-muted-foreground">{new Date(trip.tripDate).toLocaleDateString()}</p>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </Card>
            </TabsContent>

            <TabsContent value="active" className="pt-6">
               {activeTrip ? (
                  <Card className="border-border shadow-xl bg-zinc-950 text-white overflow-hidden p-8 space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-primary tracking-widest">Ongoing Mission</p>
                           <h2 className="text-3xl font-black tracking-tighter">{activeTrip.route.name}</h2>
                           <p className="text-xs font-medium text-zinc-500">{activeTrip.route.code} • Scheduled for {activeTrip.schedule.departureTime}</p>
                        </div>
                        <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary animate-pulse">
                           <Navigation className="h-8 w-8" />
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Base Fare</p>
                           <p className="text-xl font-black">₦{activeTrip.route.baseFare.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Total Passengers</p>
                           <p className="text-xl font-black text-emerald-400">18 / 32</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Trip Status</p>
                           <Badge className="bg-primary text-white font-black text-[9px] tracking-widest px-3">ACTIVE</Badge>
                        </div>
                     </div>

                     <Separator className="bg-zinc-800" />

                     <div className="flex items-center gap-4">
                        <Button className="flex-1 h-12 font-black text-xs uppercase tracking-widest brand-gradient text-white shadow-lg shadow-primary/20">
                           Intervene / Support
                        </Button>
                        <Button variant="outline" className="h-12 border-zinc-800 bg-transparent text-white font-black text-xs uppercase tracking-widest px-8">
                           Comms
                        </Button>
                     </div>
                  </Card>
               ) : (
                  <Card className="border-border shadow-xl p-12 text-center space-y-6 bg-muted/20">
                     <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <Clock className="h-10 w-10 text-muted-foreground/30" />
                     </div>
                     <div>
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No Active Session</p>
                        <p className="text-xs text-muted-foreground font-medium max-w-[300px] mx-auto mt-2">The driver is currently off-duty or between scheduled missions. Live telemetry will resume once a trip is initiated.</p>
                     </div>
                  </Card>
               )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
