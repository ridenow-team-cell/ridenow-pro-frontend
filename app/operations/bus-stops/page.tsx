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
   Info,
   Loader2,
   AlertCircle,
   TrendingDown,
   Eye
} from "lucide-react"
import { useRouter } from "next/navigation"
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api"
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
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { busStopsApi, BusStop, BusStopsResponse, CreateBusStopRequest, BusStopAnalytics } from "@/lib/api/bus-stops"
import { toast } from "sonner"

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

const suggestions = [
   { id: 1, type: "Add", target: "Sector 7 Junction", reason: "High demand detect during 08:00 - 10:00 AM", impact: "High" },
   { id: 2, type: "Relocate", target: "STP-005", reason: "Traffic flow optimization needed for efficiency", impact: "Medium" },
]

export default function BusStopsPage() {
   const router = useRouter()
   const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
      libraries: GOOGLE_MAPS_LIBRARIES
   })

   const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null)
   const [loading, setLoading] = React.useState(true)
   const [busStops, setBusStops] = React.useState<BusStop[]>([])
   const [total, setTotal] = React.useState(0)
   const [page, setPage] = React.useState(1)
   const [search, setSearch] = React.useState("")
   const [debouncedSearch, setDebouncedSearch] = React.useState("")
   const [analytics, setAnalytics] = React.useState<BusStopAnalytics | null>(null)
   const [filters, setFilters] = React.useState({
      limit: 10,
      city: "",
      isActive: undefined as boolean | undefined
   })

   // Debounce search input
   React.useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedSearch(search)
         setPage(1) // Reset to first page on new search
      }, 500)
      return () => clearTimeout(timer)
   }, [search])

   const [isDialogOpen, setIsDialogOpen] = React.useState(false)
   const [editingStop, setEditingStop] = React.useState<BusStop | null>(null)
   const [isSubmitting, setIsSubmitting] = React.useState(false)

   const [formData, setFormData] = React.useState<CreateBusStopRequest>({
      name: "",
      code: "",
      description: "",
      bannerImage: "https://example.com/banner.jpg",
      latitude: 0,
      longitude: 0,
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      radiusMeters: 50,
      hasCCTV: false,
      isSafeZone: false,
      landmarks: []
   })

   const handleOpenCreate = () => {
      setEditingStop(null)
      setFormData({
         name: "",
         code: "",
         description: "",
         bannerImage: "https://example.com/banner.jpg",
         latitude: 0,
         longitude: 0,
         address: "",
         city: "",
         state: "",
         country: "Nigeria",
         radiusMeters: 50,
         hasCCTV: false,
         isSafeZone: false,
         landmarks: []
      })
      setIsDialogOpen(true)
   }

   const handleOpenEdit = (stop: BusStop) => {
      setEditingStop(stop)
      setFormData({
         name: stop.name,
         code: stop.code,
         description: stop.description,
         bannerImage: stop.bannerImage,
         latitude: stop.latitude,
         longitude: stop.longitude,
         address: stop.address,
         city: stop.city,
         state: stop.state,
         country: stop.country,
         radiusMeters: stop.radiusMeters,
         hasCCTV: stop.hasCCTV,
         isSafeZone: stop.isSafeZone,
         landmarks: stop.landmarks || []
      })
      setIsDialogOpen(true)
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
         let response
         if (editingStop) {
            response = await busStopsApi.updateBusStop(editingStop.id, formData)
         } else {
            response = await busStopsApi.createBusStop(formData)
         }

         if (response.success) {
            toast.success(editingStop ? "Bus stop updated" : "Bus stop created")
            setIsDialogOpen(false)
            fetchBusStops()
         }
      } catch (error) {
         console.error("Failed to save bus stop:", error)
         toast.error("Failed to save bus stop")
      } finally {
         setIsSubmitting(false)
      }
   }

   const fetchAnalytics = React.useCallback(async () => {
      try {
         const response = await busStopsApi.getBusStopAnalytics()
         if (response.success && response.data) {
            setAnalytics(response.data)
         }
      } catch (error) {
         console.error("Failed to fetch analytics:", error)
      }
   }, [])

   const fetchBusStops = React.useCallback(async () => {
      setLoading(true)
      try {
         const response = await busStopsApi.getBusStops({
            page,
            limit: filters.limit,
            search: debouncedSearch,
            city: filters.city,
            isActive: filters.isActive
         })
         if (response.success && response.data) {
            setBusStops(response.data.bus_stops)
            setTotal(response.data.total)
         }
      } catch (error) {
         console.error("Failed to fetch bus stops:", error)
         toast.error("Failed to fetch bus stops")
      } finally {
         setLoading(false)
      }
   }, [page, filters, debouncedSearch])

   React.useEffect(() => {
      fetchBusStops()
      fetchAnalytics()
   }, [fetchBusStops, fetchAnalytics])

   const handleToggleStatus = async (id: string, currentStatus: boolean) => {
      try {
         const response = await busStopsApi.updateBusStopStatus(id, !currentStatus)
         if (response.success) {
            toast.success(response.message)
            fetchBusStops()
         }
      } catch (error) {
         toast.error("Failed to update status")
      }
   }

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


               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                     <Button
                        size="sm"
                        className="h-10 px-6 font-semibold text-xs uppercase tracking-wider brand-gradient text-white shadow-lg shadow-primary/20"
                        onClick={handleOpenCreate}
                     >
                        <Plus className="mr-2 h-4 w-4" /> Create Virtual Stop
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                     <DialogHeader>
                        <DialogTitle>{editingStop ? "Edit Virtual Stop" : "Create Virtual Stop"}</DialogTitle>
                        <DialogDescription>
                           Configure the parameters for the virtual bus stop. These stops are dynamic and can be optimized.
                        </DialogDescription>
                     </DialogHeader>

                     <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-2">
                           <Label htmlFor="search">Live Location Search</Label>
                           {isLoaded ? (
                              <Autocomplete
                                 onLoad={(ac) => setAutocomplete(ac)}
                                 onPlaceChanged={() => {
                                    if (autocomplete !== null) {
                                       const place = autocomplete.getPlace()
                                       if (place.geometry && place.geometry.location) {
                                          setFormData({
                                             ...formData,
                                             address: place.formatted_address || "",
                                             latitude: place.geometry.location.lat(),
                                             longitude: place.geometry.location.lng(),
                                             name: place.name || formData.name
                                          })
                                       }
                                    }
                                 }}
                              >
                                 <Input
                                    id="location-search"
                                    placeholder="Search for a location via Google..."
                                    className="brand-border"
                                 />
                              </Autocomplete>
                           ) : (
                              <Input
                                 id="location-search"
                                 placeholder="Search (Google Maps Key Required)"
                                 disabled
                                 className="bg-muted"
                              />
                           )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="name">Stop Name</Label>
                              <Input
                                 id="name"
                                 placeholder="e.g. Central Station"
                                 value={formData.name}
                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                 required
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="code">Stop Code</Label>
                              <Input
                                 id="code"
                                 placeholder="e.g. BST-001"
                                 value={formData.code}
                                 onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                 required
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="description">Description</Label>
                           <Input
                              id="description"
                              placeholder="Short description of the stop"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="latitude">Latitude</Label>
                              <Input
                                 id="latitude"
                                 type="number"
                                 step="any"
                                 placeholder="6.5244"
                                 value={formData.latitude}
                                 onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                                 required
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="longitude">Longitude</Label>
                              <Input
                                 id="longitude"
                                 type="number"
                                 step="any"
                                 placeholder="3.3792"
                                 value={formData.longitude}
                                 onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                                 required
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="address">Address</Label>
                           <Input
                              id="address"
                              placeholder="Street address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              required
                           />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                 id="city"
                                 placeholder="Lagos"
                                 value={formData.city}
                                 onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                 required
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Input
                                 id="state"
                                 placeholder="Lagos"
                                 value={formData.state}
                                 onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                 required
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="radius">Radius (Meters)</Label>
                              <Input
                                 id="radius"
                                 type="number"
                                 value={formData.radiusMeters}
                                 onChange={(e) => setFormData({ ...formData, radiusMeters: parseFloat(e.target.value) })}
                                 required
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <Label className="text-sm font-bold">Landmarks</Label>
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 className="h-7 text-[10px] font-bold uppercase"
                                 onClick={() => setFormData({
                                    ...formData,
                                    landmarks: [...(formData.landmarks || []), { name: "", distance: 0 }]
                                 })}
                              >
                                 <Plus className="mr-1 h-3 w-3" /> Add Landmark
                              </Button>
                           </div>
                           <div className="space-y-2">
                              {formData.landmarks?.map((landmark, index) => (
                                 <div key={index} className="flex items-center gap-2">
                                    <Input
                                       placeholder="Landmark Name"
                                       value={landmark.name}
                                       onChange={(e) => {
                                          const newLandmarks = [...(formData.landmarks || [])]
                                          newLandmarks[index].name = e.target.value
                                          setFormData({ ...formData, landmarks: newLandmarks })
                                       }}
                                       className="flex-1"
                                    />
                                    <Input
                                       type="number"
                                       placeholder="Dist (m)"
                                       value={landmark.distance}
                                       onChange={(e) => {
                                          const newLandmarks = [...(formData.landmarks || [])]
                                          newLandmarks[index].distance = parseFloat(e.target.value)
                                          setFormData({ ...formData, landmarks: newLandmarks })
                                       }}
                                       className="w-24"
                                    />
                                    <Button
                                       type="button"
                                       variant="ghost"
                                       size="icon"
                                       className="h-8 w-8 text-rose-500"
                                       onClick={() => {
                                          const newLandmarks = formData.landmarks?.filter((_, i) => i !== index)
                                          setFormData({ ...formData, landmarks: newLandmarks })
                                       }}
                                    >
                                       <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                 </div>
                              ))}
                              {(!formData.landmarks || formData.landmarks.length === 0) && (
                                 <p className="text-[10px] text-muted-foreground italic text-center py-2 bg-muted/20 rounded border border-dashed border-border">No landmarks added</p>
                              )}
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                           <div className="flex flex-col gap-1">
                              <Label className="text-sm font-bold">Safety & Security</Label>
                              <p className="text-[10px] text-muted-foreground font-medium">Toggle CCTV and Safe Zone status</p>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                 <Label htmlFor="cctv" className="text-[10px] font-bold uppercase">CCTV</Label>
                                 <Switch
                                    id="cctv"
                                    checked={formData.hasCCTV}
                                    onCheckedChange={(checked) => setFormData({ ...formData, hasCCTV: checked })}
                                 />
                              </div>
                              <div className="flex items-center gap-2">
                                 <Label htmlFor="safe" className="text-[10px] font-bold uppercase">Safe Zone</Label>
                                 <Switch
                                    id="safe"
                                    checked={formData.isSafeZone}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isSafeZone: checked })}
                                 />
                              </div>
                           </div>
                        </div>

                        <DialogFooter>
                           <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                           <Button type="submit" className="brand-gradient text-white" disabled={isSubmitting}>
                              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {editingStop ? "Save Changes" : "Create Stop"}
                           </Button>
                        </DialogFooter>
                     </form>
                  </DialogContent>
               </Dialog>
            </div>
         </div>

         {/* Analytics Statistics */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border shadow-sm overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Navigation className="h-12 w-12 text-primary" />
               </div>
               <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total Virtual Stops</CardDescription>
                  <CardTitle className="text-2xl font-black">{analytics?.totalStops || 0}</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                     <span className="text-emerald-500">{analytics?.activeStops || 0} Active</span>
                     <span>•</span>
                     <span>{analytics?.inactiveStops || 0} Inactive</span>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-border shadow-sm overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="h-12 w-12 text-blue-500" />
               </div>
               <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Today's Passengers</CardDescription>
                  <CardTitle className="text-2xl font-black">{analytics?.totalTodayPassengers || 0}</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                     <Activity className="h-3 w-3 text-blue-500" />
                     <span>Real-time traffic flow</span>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-border shadow-sm overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="h-12 w-12 text-amber-500" />
               </div>
               <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Avg Wait Time</CardDescription>
                  <CardTitle className="text-2xl font-black">{analytics?.averageWaitTime || 0}m</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                     <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '45%' }} />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-border shadow-sm overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="h-12 w-12 text-emerald-500" />
               </div>
               <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Safety Score</CardDescription>
                  <CardTitle className="text-2xl font-black">{analytics ? Math.round((analytics.safeZones / analytics.totalStops) * 100) : 0}%</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                     <span className="text-emerald-500">{analytics?.safeZones || 0} Safe Zones</span>
                     <span>•</span>
                     <span>{analytics?.cctvCoverage || 0} CCTV</span>
                  </div>
               </CardContent>
            </Card>
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
                     {isLoaded ? (
                        <GoogleMap
                           mapContainerStyle={{ width: '100%', height: '100%' }}
                           center={busStops.length > 0 ? { lat: busStops[0].latitude, lng: busStops[0].longitude } : { lat: 6.5244, lng: 3.3792 }}
                           zoom={12}
                        >
                           {busStops.map((stop) => (
                              <Marker
                                 key={stop.id}
                                 position={{ lat: stop.latitude, lng: stop.longitude }}
                                 onClick={() => router.push(`/operations/bus-stops/${stop.id}`)}
                                 title={stop.name}
                              />
                           ))}
                        </GoogleMap>
                     ) : (
                        <>
                           {/* Simulated Map Grid */}
                           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                           {/* Density Heatmap (Simulated) */}
                           <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
                           <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/10 blur-[60px] rounded-full" />

                           {/* Stop Markers */}
                           {busStops.length > 0 ? (
                              busStops.map((stop, i) => (
                                 <div
                                    key={stop.id}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                                    style={{
                                       top: `${25 + (i % 4) * 20}%`,
                                       left: `${20 + Math.floor(i / 4) * 25}%`
                                    }}
                                    onClick={() => router.push(`/operations/bus-stops/${stop.id}`)}
                                 >
                                    <div className={`h-8 w-8 rounded-full bg-white border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${stop.isActive ? 'border-primary' : 'border-zinc-500'}`}>
                                       <Navigation className={`h-3 w-3 ${stop.isActive ? 'text-primary fill-primary/10' : 'text-zinc-500 fill-zinc-500/10'}`} />
                                    </div>
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                       {stop.name} ({stop.code})
                                    </div>
                                 </div>
                              ))
                           ) : !loading && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">No stops registered in this sector</p>
                              </div>
                           )}
                        </>
                     )}

                     {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/20 backdrop-blur-sm">
                           <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                     )}
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
                  <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between bg-muted/10 gap-4">
                     <div className="space-y-1">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Registered Virtual Stops</h3>
                        <p className="text-[10px] text-muted-foreground">Total: {total} stops</p>
                     </div>
                     <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                           placeholder="Search by name, code, or city..."
                           className="pl-8 h-8 text-xs border-border bg-white"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                           <tr>
                              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Stop Details</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Region</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Capacity / Wait</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                              <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                           {loading ? (
                              Array.from({ length: 5 }).map((_, i) => (
                                 <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-8">
                                       <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                                       <div className="h-3 bg-muted rounded w-1/2" />
                                    </td>
                                 </tr>
                              ))
                           ) : busStops.length === 0 ? (
                              <tr>
                                 <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                       <AlertCircle className="h-10 w-10 opacity-20" />
                                       <p className="text-sm font-medium">No bus stops found</p>
                                       <Button variant="link" onClick={() => { setSearch(""); setFilters({ ...filters, city: "", isActive: undefined }) }}>Clear all filters</Button>
                                    </div>
                                 </td>
                              </tr>
                           ) : (
                              busStops.map((stop) => (
                                 <tr
                                    key={stop.id}
                                    className="hover:bg-muted/10 transition-colors cursor-pointer group"
                                    onClick={() => router.push(`/operations/bus-stops/${stop.id}`)}
                                 >
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-3">
                                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                             <Navigation className="h-5 w-5" />
                                          </div>
                                          <div>
                                             <p className="font-bold tracking-tight text-sm">{stop.name}</p>
                                             <p className="text-[10px] text-muted-foreground font-semibold uppercase">{stop.code} • {stop.address}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="space-y-1">
                                          <p className="text-xs font-bold">{stop.city}</p>
                                          <p className="text-[10px] text-muted-foreground font-semibold uppercase">{stop.state}, {stop.country}</p>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-4">
                                          <div className="space-y-1">
                                             <p className="text-[10px] font-bold uppercase text-muted-foreground">Wait Time</p>
                                             <p className="text-xs font-bold text-amber-600">{stop.averageWaitTimeMinutes}m</p>
                                          </div>
                                          <div className="space-y-1">
                                             <p className="text-[10px] font-bold uppercase text-muted-foreground">Today</p>
                                             <p className="text-xs font-bold text-primary">{stop.todayPassengers}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <Badge
                                          variant={stop.isActive ? "default" : "secondary"}
                                          className={`text-[9px] font-bold uppercase tracking-tight h-5 ${stop.isActive ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                                       >
                                          {stop.isActive ? "Active" : "Inactive"}
                                       </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                          <Button
                                             variant="ghost"
                                             size="icon"
                                             className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                                             onClick={() => router.push(`/operations/bus-stops/${stop.id}`)}
                                          >
                                             <Eye className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                             variant="ghost"
                                             size="icon"
                                             className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                                             onClick={() => handleOpenEdit(stop)}
                                          >
                                             <Edit2 className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                             variant="ghost"
                                             size="icon"
                                             className={`h-8 w-8 transition-colors ${stop.isActive ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                                             onClick={() => handleToggleStatus(stop.id, stop.isActive)}
                                          >
                                             <Activity className="h-3.5 w-3.5" />
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination */}
                  {total > filters.limit && (
                     <div className="p-4 border-t border-border flex items-center justify-between bg-muted/5">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">
                           Showing {(page - 1) * filters.limit + 1} to {Math.min(page * filters.limit, total)} of {total}
                        </p>
                        <div className="flex items-center gap-2">
                           <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-[10px] font-bold uppercase"
                              disabled={page === 1}
                              onClick={() => setPage(p => p - 1)}
                           >
                              Previous
                           </Button>
                           <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-[10px] font-bold uppercase"
                              disabled={page * filters.limit >= total}
                              onClick={() => setPage(p => p + 1)}
                           >
                              Next
                           </Button>
                        </div>
                     </div>
                  )}
               </Card>
            </div>

            {/* Intelligence Side Panel */}
            <div className="space-y-6">
               <Card className="border-border shadow-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-primary/10">
                     <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <CardTitle className="text-sm font-black uppercase tracking-tight">Regional Clusters</CardTitle>
                     </div>
                     <CardDescription className="text-[10px] font-bold uppercase text-primary/70">Top Performing Sectors</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                     {analytics?.clusters && analytics.clusters.length > 0 ? (
                        analytics.clusters.map((cluster, i) => (
                           <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
                              <div className="flex items-center justify-between">
                                 <Badge className="bg-primary">{cluster.city.toUpperCase()}</Badge>
                                 <Badge variant="outline" className="text-[8px] font-black">{cluster.stopCount} Stops</Badge>
                              </div>
                              <div className="space-y-1">
                                 <div className="flex items-center justify-between">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Avg Wait Time</p>
                                    <p className="text-xs font-bold">{cluster.avgWaitTime}m</p>
                                 </div>
                                 <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                                    <div className="h-full bg-primary" style={{ width: `${Math.min(cluster.avgWaitTime * 10, 100)}%` }} />
                                 </div>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center py-10 opacity-20">
                           <Layers className="h-10 w-10 mx-auto mb-2" />
                           <p className="text-[10px] font-bold uppercase">No Cluster Data</p>
                        </div>
                     )}
                     <Button className="w-full h-10 font-black text-[10px] uppercase tracking-widest brand-gradient text-white" onClick={fetchAnalytics}>
                        Run Regional Scan
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
                           <span className="text-zinc-500">Total Safe Zones</span>
                           <span className="font-bold">{analytics?.safeZones || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                           <span className="text-zinc-500">CCTV Coverage</span>
                           <span className="font-bold text-emerald-500">{analytics?.cctvCoverage || 0}</span>
                        </div>
                     </div>
                     <Separator className="bg-zinc-800" />
                     <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                           <Info className="h-4 w-4" />
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                           Regional density is currently **{analytics?.totalStops ? 'Stable' : 'Optimizing'}**. {analytics?.averageWaitTime && analytics.averageWaitTime > 15 ? ' High wait times detected in some hubs.' : ' Operational efficiency is within target thresholds.'}
                        </p>
                     </div>
                  </div>
               </Card>
            </div>
         </div>
      </div>
   )
}

