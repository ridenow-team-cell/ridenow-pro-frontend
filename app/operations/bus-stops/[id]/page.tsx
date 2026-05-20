"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  Navigation, 
  ArrowLeft, 
  MapPin, 
  Shield, 
  Video, 
  Users, 
  Activity, 
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Edit2,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { busStopsApi, BusStop } from "@/lib/api/bus-stops"
import { toast } from "sonner"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

export default function BusStopDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [stop, setStop] = React.useState<BusStop | null>(null)
  const [loading, setLoading] = React.useState(true)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const fetchStop = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await busStopsApi.getBusStop(id as string)
      if (response.success && response.data) {
        // Handle both direct and wrapped data
        const stopData = (response.data as any).bus_stop || response.data
        setStop(stopData)
      } else {
        toast.error("Bus stop not found")
        router.push("/operations/bus-stops")
      }
    } catch (error) {
      console.error("Failed to fetch stop details:", error)
      toast.error("Failed to fetch stop details")
    } finally {
      setLoading(false)
    }
  }, [id, router])

  React.useEffect(() => {
    fetchStop()
  }, [fetchStop])

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Activity className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!stop) return null

  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="pl-0 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             {stop.name} <Badge className={stop.isActive ? "bg-emerald-500 hover:bg-emerald-600" : "bg-zinc-500 hover:bg-zinc-600"}>{stop.isActive ? "Active" : "Inactive"}</Badge>
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {stop.code} • {stop.address}, {stop.city}
          </p>
        </div>
      </div>

      {stop.bannerImage && (
        <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-border shadow-xl">
           <img 
             src={stop.bannerImage} 
             alt={stop.name} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <p className="text-white/80 text-xs font-medium italic">{stop.description}</p>
           </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Details & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
             <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                   <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Today's Traffic</CardDescription>
                   <CardTitle className="text-2xl font-black">{stop.todayPassengers}</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>+12% from yesterday</span>
                   </div>
                </CardContent>
             </Card>
             <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                   <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Avg Wait Time</CardDescription>
                   <CardTitle className="text-2xl font-black">{stop.averageWaitTimeMinutes}m</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-amber-500" style={{ width: '65%' }} />
                   </div>
                </CardContent>
             </Card>
             <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                   <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Security Status</CardDescription>
                   <CardTitle className="text-2xl font-black text-emerald-500">SECURE</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex gap-2">
                      {stop.hasCCTV && <Video className="h-4 w-4 text-emerald-500" />}
                      {stop.isSafeZone && <Shield className="h-4 w-4 text-primary" />}
                   </div>
                </CardContent>
             </Card>
          </div>

          <Card className="border-border shadow-xl overflow-hidden">
             <CardHeader className="bg-muted/30 border-b border-border">
                <CardTitle className="text-sm font-black uppercase tracking-tight">Geographic Intelligence</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="h-[400px] w-full bg-zinc-900 relative">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={{ lat: stop.latitude, lng: stop.longitude }}
                      zoom={15}
                      
                    >
                      <Marker position={{ lat: stop.latitude, lng: stop.longitude }} />
                    </GoogleMap>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                      <MapPin className="h-10 w-10 opacity-20 mb-2" />
                      <p className="text-[10px] font-bold uppercase">Loading High-Fidelity Maps...</p>
                    </div>
                  )}
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Coordinates</p>
                      <p className="text-xs font-bold">{stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Radius</p>
                      <p className="text-xs font-bold">{stop.radiusMeters}m</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">City Sector</p>
                      <p className="text-xs font-bold">{stop.city}, {stop.state}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Country</p>
                      <p className="text-xs font-bold">{stop.country}</p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Landmarks & Activity */}
        <div className="space-y-6">
           <Card className="border-border shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                 <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Nearby Landmarks</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 {stop.landmarks && stop.landmarks.length > 0 ? (
                    stop.landmarks.map((landmark, i) => (
                       <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border">
                          <div>
                             <p className="text-xs font-bold">{landmark.name}</p>
                             <p className="text-[10px] text-muted-foreground">Proximity: {landmark.distance}m</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                       </div>
                    ))
                 ) : (
                    <div className="text-center py-10 opacity-20">
                       <Layers className="h-10 w-10 mx-auto mb-2" />
                       <p className="text-[10px] font-bold uppercase">No Landmarks Mapping</p>
                    </div>
                 )}
              </CardContent>
           </Card>

           <Card className="border-border shadow-xl bg-zinc-950 text-white p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Stop History</h3>
                 <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5" />
                    <div className="space-y-1">
                       <p className="text-xs font-bold">Created at Hub 01</p>
                       <p className="text-[10px] text-zinc-500">{new Date(stop.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <div className="space-y-1">
                       <p className="text-xs font-bold">Optimization Applied</p>
                       <p className="text-[10px] text-zinc-500">Automatic radius adjustment</p>
                    </div>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
