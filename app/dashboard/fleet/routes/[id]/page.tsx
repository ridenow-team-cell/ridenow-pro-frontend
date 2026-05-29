"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  Users, 
  ChevronLeft,
  Zap,
  Activity,
  Info,
  Loader2,
  AlertCircle
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { routesApi, RouteDetailsData } from "@/lib/api/routes"
import { busStopsApi } from "@/lib/api/bus-stops"

export default function RouteDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const routeId = params.id as string

  const [details, setDetails] = React.useState<RouteDetailsData | null>(null)
  const [stopsMap, setStopsMap] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const [detailsRes, stopsRes] = await Promise.all([
          routesApi.getRouteDetails(routeId),
          busStopsApi.getBusStops({ limit: 100 })
        ])

        if (stopsRes.success && stopsRes.data?.bus_stops) {
          const mapping: Record<string, string> = {}
          stopsRes.data.bus_stops.forEach(stop => {
            mapping[stop.id] = stop.name
          })
          setStopsMap(mapping)
        }

        if (detailsRes.success && detailsRes.data) {
          setDetails(detailsRes.data)
        } else {
          setError(detailsRes.message || "Failed to load route configuration.")
        }
      } catch (err) {
        console.error(err)
        setError("Error synchronizing route intelligence feed.")
      } finally {
        setLoading(false)
      }
    }

    if (routeId) {
      loadData()
    }
  }, [routeId])

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground italic">Syncing Corridor Details...</p>
      </div>
    )
  }

  if (error || !details) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto p-4">
        <AlertCircle className="h-12 w-12 text-destructive animate-bounce" />
        <h2 className="text-lg font-bold text-foreground">Corridor Feed Error</h2>
        <p className="text-xs text-muted-foreground">{error || "Could not retrieve configuration for this route corridor."}</p>
        <Button onClick={() => window.location.reload()} size="sm" className="mt-2 bg-primary">
          Retry Sync
        </Button>
      </div>
    )
  }

  const { route, schedules, tripHistory, statistics } = details

  // Map stops array to named stops
  const stopsList = route.stops?.map(stop => ({
    name: stopsMap[stop.busStopId] || `Bus Stop (${stop.busStopId.substring(18)})`,
    order: stop.order,
    defaultFare: stop.defaultFare
  })).sort((a, b) => a.order - b.order) || []

  // Est revenue projection
  const projectedRevenue = statistics.totalBookings * route.baseFare

  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
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
              {route.name}
            </h1>
            <Badge variant="secondary" className={`border-none font-bold uppercase text-[10px] ${
              route.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
            }`}>
              {route.isActive ? "Active" : "Paused"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-11 uppercase tracking-wider text-[10px]">
            Corridor Intelligence • {route.code}
          </p>
        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Manifest and Status */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-border bg-card">
                 <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Trips</p>
                       <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-2xl font-bold">{statistics.activeTrips} / {statistics.totalTrips}</p>
                    <Progress value={statistics.totalTrips > 0 ? (statistics.activeTrips / statistics.totalTrips) * 100 : 0} className="h-1 mt-3 bg-muted" />
                 </CardContent>
              </Card>
              <Card className="border-border bg-card">
                 <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Bookings</p>
                       <Users className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-xl font-bold">{statistics.totalBookings}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">Tickets sold today</p>
                 </CardContent>
              </Card>
              <Card className="border-border bg-card">
                 <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Base Route Fare</p>
                       <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">₦{route.baseFare.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 mt-1 font-bold">FLAT RATE</p>
                 </CardContent>
              </Card>
           </div>

           <Tabs defaultValue="history" className="w-full">
               <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg border border-border">
                  <TabsTrigger value="history" className="text-xs font-bold uppercase">Trip History</TabsTrigger>
                  <TabsTrigger value="schedule" className="text-xs font-bold uppercase">Schedule History</TabsTrigger>
               </TabsList>
               
               <TabsContent value="history" className="pt-4">
                  <Card className="border-border bg-card shadow-sm overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                              <tr>
                                 <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest">Trip / Direction</th>
                                 <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest">Departure Time & Date</th>
                                 <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest">Pilot / Vehicle</th>
                                 <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border/50">
                              {tripHistory.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="text-center py-8 text-xs text-muted-foreground italic">No trip logs available for this corridor.</td>
                                </tr>
                              ) : (
                                tripHistory.map((trip) => (
                                   <tr key={trip.id} className="hover:bg-muted/10 transition-colors">
                                      <td className="px-4 py-4">
                                         <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground capitalize">{trip.direction} Trip</span>
                                            <span className="text-[9px] text-muted-foreground mt-0.5 font-mono">{trip.id}</span>
                                         </div>
                                      </td>
                                      <td className="px-4 py-4">
                                         <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">
                                              {new Date(trip.tripDate).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground mt-0.5">
                                              {new Date(trip.tripDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                                            </span>
                                         </div>
                                      </td>
                                      <td className="px-4 py-4">
                                         <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">{trip.driverName || "Demo Pilot"}</span>
                                            <span className="text-[10px] text-muted-foreground mt-0.5">{trip.busName || "Demo Bus"}</span>
                                         </div>
                                      </td>
                                      <td className="px-4 py-4 text-right">
                                         <Badge variant="outline" className={`border-none font-black text-[9px] uppercase ${
                                            trip.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                                            trip.status === 'completed' ? 'bg-slate-500/10 text-slate-600' : 'bg-amber-500/10 text-amber-600'
                                         }`}>
                                            {trip.status}
                                         </Badge>
                                      </td>
                                   </tr>
                                ))
                              )}
                           </tbody>
                        </table>
                     </div>
                  </Card>
               </TabsContent>

               <TabsContent value="schedule" className="pt-4">
                  <Card className="border-border bg-card shadow-sm overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                              <tr>
                                 <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest">Schedule / Direction</th>
                                 <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest">Time & Frequency</th>
                                 <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border/50">
                              {schedules.length === 0 ? (
                                <tr>
                                  <td colSpan={3} className="text-center py-8 text-xs text-muted-foreground italic">No schedule parameters established.</td>
                                </tr>
                              ) : (
                                schedules.map((sch) => (
                                   <tr key={sch.id} className="hover:bg-muted/10 transition-colors">
                                      <td className="px-4 py-4">
                                         <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground capitalize">{sch.direction} Corridor run</span>
                                            <span className="text-[9px] text-muted-foreground font-mono mt-0.5">{sch.id}</span>
                                         </div>
                                      </td>
                                      <td className="px-4 py-4">
                                         <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">{sch.departureTime}</span>
                                         </div>
                                      </td>
                                      <td className="px-4 py-4 text-right">
                                         <Badge variant="outline" className={`border-none font-black text-[9px] uppercase ${
                                            sch.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-muted-foreground'
                                         }`}>
                                            {sch.isActive ? 'Active' : 'Inactive'}
                                         </Badge>
                                      </td>
                                   </tr>
                                ))
                              )}
                           </tbody>
                        </table>
                     </div>
                  </Card>
               </TabsContent>
            </Tabs>
        </div>

        {/* Right: Insights and Actions */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-border bg-slate-950 text-white rounded-xl shadow-xl overflow-hidden">
              <CardHeader className="border-b border-white/10 pb-4">
                 <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">Live Corridor Logic</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 {/* Timeline of Stops */}
                 <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bus Stops Ordered</p>
                    <div className="relative pl-6 border-l-2 border-primary/20 space-y-4 ml-1.5">
                       {stopsList.map((stop, index) => (
                          <div key={index} className="relative">
                             {/* Indicator dot */}
                             <span className="absolute -left-[30px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-primary bg-slate-950">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                             </span>
                             <div>
                                <p className="text-xs font-bold text-white">{stop.name}</p>
                                <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                                  Stop Order #{stop.order} • Fare contribution: ₦{stop.defaultFare}
                                </p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                       <Info className="h-3.5 w-3.5 text-slate-400" />
                       <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Revenue Insight</p>
                    </div>
                    <p className="text-xl font-bold tracking-tight">₦{projectedRevenue.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-500 font-medium">Estimated revenue for current bookings.</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
