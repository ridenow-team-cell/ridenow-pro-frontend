"use client"

import * as React from "react"
import Link from "next/link"
import {
   Navigation,
   Clock,
   AlertTriangle,
   Bus as BusIcon,
   ChevronRight,
   Loader2,
   Calendar,
   Search,
   ChevronLeft
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
import { tripsApi, OperationalTrip } from "@/lib/api/trips"

export default function TripOperationsPage() {
   const [trips, setTrips] = React.useState<OperationalTrip[]>([])
   const [loading, setLoading] = React.useState(true)
   const [searchQuery, setSearchQuery] = React.useState("")
   const [statusFilter, setStatusFilter] = React.useState<string>("all")
   const [currentPage, setCurrentPage] = React.useState(1)
   const itemsPerPage = 5

   React.useEffect(() => {
      async function fetchTrips() {
         try {
            const res = await tripsApi.getOperationalTrips()
            if (res.success && res.data) {
               setTrips(res.data)
            }
         } catch (error) {
            console.error("Failed to fetch operational trips:", error)
         } finally {
            setLoading(false)
         }
      }
      fetchTrips()
   }, [])

   // Reset page if filters change
   React.useEffect(() => {
      setCurrentPage(1)
   }, [searchQuery, statusFilter])

   if (loading) {
      return (
         <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground italic">Syncing operational feed...</p>
         </div>
      )
   }

   const activeCount = trips.filter(t => t.status === "active").length

   const filteredTrips = trips.filter((trip) => {
      // Status Filter
      if (statusFilter !== "all" && trip.status !== statusFilter) {
         return false
      }

      // Search Filter (busName, routeName, driverName, id)
      if (searchQuery) {
         const query = searchQuery.toLowerCase()
         const matchBus = trip.busName?.toLowerCase().includes(query)
         const matchRoute = trip.routeName?.toLowerCase().includes(query)
         const matchDriver = trip.driverName?.toLowerCase().includes(query)
         const matchId = trip.id?.toLowerCase().includes(query)
         return matchBus || matchRoute || matchDriver || matchId
      }

      return true
   })

   const totalPages = Math.ceil(filteredTrips.length / itemsPerPage)
   const paginatedTrips = filteredTrips.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   )

   return (
      <div className="space-y-6 pt-4 pb-10">
         {/* Header */}
         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                     Trip Operations
                  </h1>
               </div>
               <p className="text-sm text-muted-foreground">
                  Real-time monitoring of active trips, driver assignments, and fleet performance.
               </p>
            </div>
         </div>

         {/* Search & Filter Controls */}
         <div className="flex flex-col gap-3 md:flex-row md:items-center bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input
                  placeholder="Search by bus, route, driver, or trip ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
               />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
               {["all", "active", "scheduled", "completed", "delayed", "cancelled"].map((status) => (
                  <Button
                     key={status}
                     variant={statusFilter === status ? "default" : "outline"}
                     size="sm"
                     onClick={() => setStatusFilter(status)}
                     className={`h-9 text-[10px] font-bold uppercase tracking-wider px-3 border-none ${
                        statusFilter === status 
                           ? "bg-primary text-primary-foreground shadow-sm" 
                           : "bg-muted/50 hover:bg-muted text-muted-foreground"
                     }`}
                  >
                     {status}
                  </Button>
               ))}
            </div>
         </div>

         <div className="space-y-4">
            {/* Live Monitoring Feed */}
            <Card className="border-border bg-card">
               <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                  <div>
                     <CardTitle className="text-base font-bold">Live Trip Feed</CardTitle>
                     <CardDescription className="text-xs">All active buses currently on routes.</CardDescription>
                  </div>
                  <Badge variant="outline" className="h-5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-none">
                     {filteredTrips.length} MATCHED / {trips.length} TOTAL
                  </Badge>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-border">
                     {paginatedTrips.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground italic text-sm">
                           No matching operational trips found.
                        </div>
                     ) : (
                        paginatedTrips.map((trip) => {
                           const loadPercent = trip.capacity > 0 ? Math.round((trip.passengerCount / trip.capacity) * 100) : 0
                           return (
                              <div key={trip.id} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                       <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-primary">
                                          <BusIcon className="h-5 w-5" />
                                       </div>
                                       <div>
                                          <p className="font-bold text-sm leading-tight">
                                             {trip.busName} 
                                             <span className="text-muted-foreground text-xs font-medium ml-1">on {trip.routeName}</span>
                                          </p>
                                          <p className="text-[10px] text-muted-foreground mt-1.5 font-mono uppercase tracking-widest">
                                             ID: {trip.id} • Driver: {trip.driverName}
                                          </p>
                                       </div>
                                    </div>
                                    <Badge 
                                       className={`text-[10px] font-black uppercase px-2 h-5 border-none ${
                                          trip.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                                          trip.status === 'scheduled' ? 'bg-blue-500/10 text-blue-600' :
                                          trip.status === 'completed' ? 'bg-zinc-500/10 text-zinc-600' :
                                          trip.status === 'delayed' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                                       }`}
                                    >
                                       {trip.status}
                                    </Badge>
                                 </div>

                                 <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                       <span>Passenger Load</span>
                                       <span>{loadPercent}% Capacity ({trip.passengerCount}/{trip.capacity} passengers)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                       <div 
                                          className={`h-full ${loadPercent > 80 ? 'bg-rose-500' : 'bg-primary'}`} 
                                          style={{ width: `${loadPercent}%` }} 
                                       />
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                       <div className="flex items-center gap-1.5">
                                          <Calendar className="h-3.5 w-3.5" />
                                          <span>{new Date(trip.tripDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                       </div>
                                       <div className="flex items-center gap-1.5">
                                          <Clock className="h-3.5 w-3.5" />
                                          <span>Departure: {trip.scheduledTime}</span>
                                       </div>
                                    </div>
                                    <Link href={`/dashboard/fleet/trips/${trip.id}`}>
                                       <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-transparent">
                                          Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                       </Button>
                                    </Link>
                                 </div>
                              </div>
                           )
                        })
                     )}
                  </div>
               </CardContent>

               {/* Pagination Controls */}
               {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10 rounded-b-xl">
                     <div className="text-xs text-muted-foreground font-medium">
                        Showing {Math.min(filteredTrips.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredTrips.length, currentPage * itemsPerPage)} of {filteredTrips.length} matching trips
                     </div>
                     <div className="flex items-center gap-2">
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                           disabled={currentPage === 1}
                           className="h-8 w-8 p-0"
                        >
                           <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs font-bold px-2">
                           Page {currentPage} of {totalPages}
                        </span>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                           disabled={currentPage === totalPages}
                           className="h-8 w-8 p-0"
                        >
                           <ChevronRight className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>
               )}
            </Card>
         </div>
      </div>
   )
}
