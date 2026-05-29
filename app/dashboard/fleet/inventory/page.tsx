"use client"

import * as React from "react"
import Link from "next/link"
import {
   Bus as BusIcon,
   Search,
   Filter,
   MoreHorizontal,
   Wrench,
   CheckCircle2,
   XCircle,
   Users,
   Settings2,
   Plus,
   History,
   AlertTriangle,
   UserCheck,
   Signal,
   SignalLow,
   Fuel,
   MapPin,
   Flame,
   Zap,
   ArrowUpRight,
   Gauge,
   Calendar,
   ShieldCheck,
   Info,
   Clock,
   Activity,
   Cpu,
   Wifi,
   Camera,
   AlertCircle
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
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getFleetAnalytics, type FleetAnalytics } from "@/lib/api/analytics"
import { getBuses, type Bus, updateBus } from "@/lib/api/fleet"
import { driverApi, type Driver } from "@/lib/api/drivers"

export default function FleetInventoryPage() {
   const [analytics, setAnalytics] = React.useState<FleetAnalytics | null>(null)
   const [buses, setBuses] = React.useState<Bus[]>([])
   const [drivers, setDrivers] = React.useState<Driver[]>([])
   const [isLoading, setIsLoading] = React.useState(true)
   const [searchTerm, setSearchTerm] = React.useState("")
   const [selectedBus, setSelectedBus] = React.useState<Bus | null>(null)
   const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)

   const fetchData = React.useCallback(async () => {
      try {
         setIsLoading(true)
         const [analyticsRes, busesRes, driversRes] = await Promise.all([
            getFleetAnalytics(),
            getBuses({ limit: 100 }), // Fetch a good chunk for searching
            driverApi.getDrivers()
         ])

         if (analyticsRes.success && analyticsRes.data) {
            setAnalytics(analyticsRes.data)
         }
         if (busesRes.success && busesRes.data) {
            setBuses(busesRes.data.buses)
         }
         if (driversRes.success && driversRes.data) {
            setDrivers(driversRes.data)
         }
      } catch (err) {
         console.error("Failed to fetch fleet data:", err)
      } finally {
         setIsLoading(false)
      }
   }, [])

   React.useEffect(() => {
      fetchData()
   }, [fetchData])

   const filteredBuses = buses.filter(bus =>
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.model.toLowerCase().includes(searchTerm.toLowerCase())
   )

   const getStatusBadge = (status: string) => {
      const s = status.toLowerCase()
      switch (s) {
         case "active":
            return <Badge variant="outline" className="border-none bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase gap-1.5"><CheckCircle2 className="h-3 w-3" /> Active</Badge>
         case "maintenance":
            return <Badge variant="outline" className="border-none bg-amber-50 text-amber-700 font-bold text-[10px] uppercase gap-1.5"><Wrench className="h-3 w-3" /> Maintenance</Badge>
         case "inactive":
            return <Badge variant="outline" className="border-none bg-rose-50 text-rose-700 font-bold text-[10px] uppercase gap-1.5"><XCircle className="h-3 w-3" /> Inactive</Badge>
         default:
            return <Badge variant="outline" className="uppercase text-[10px] font-bold">{status}</Badge>
      }
   }

   const getFuelIcon = (type: string) => {
      switch (type.toLowerCase()) {
         case 'cng': return <Flame className="h-3 w-3 text-orange-500" />
         case 'electric': return <Zap className="h-3 w-3 text-primary" />
         default: return <Fuel className="h-3 w-3 text-muted-foreground" />
      }
   }

   return (
      <div className="space-y-6 pt-4 pb-12 px-6">
         {/* Header */}
         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
               <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Fleet Management
               </h1>
               <p className="text-sm text-muted-foreground">
                  Manage your bus inventory, maintenance schedules, and route assignments.
               </p>
            </div>
            <div className="flex items-center gap-2 pt-2 md:pt-0">

               <Link href="/dashboard/fleet/inventory/new">
                  <Button size="sm" className="h-9 px-4 font-semibold text-xs shadow-lg shadow-primary/20 bg-primary">
                     <Plus className="mr-2 h-4 w-4" />
                     Add New Bus
                  </Button>
               </Link>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Fleet</CardTitle>
                  <BusIcon className="h-4 w-4 text-primary opacity-70" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{analytics?.totalFleet?.count || 0}</div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">{analytics?.totalFleet?.description || "Buses in system"}</p>
               </CardContent>
            </Card>
            <Card className="border-border bg-card shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operational</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 opacity-70" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{analytics?.operational?.count || 0}</div>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">{analytics?.operational?.description || "0% Availability"}</p>
               </CardContent>
            </Card>
            <Card className="border-border bg-card shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">In Service</CardTitle>
                  <Wrench className="h-4 w-4 text-amber-600 opacity-70" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{analytics?.inService?.count || 0}</div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">{analytics?.inService?.description || "Scheduled maintenance"}</p>
               </CardContent>
            </Card>
            <Card className="border-border bg-card shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Drivers</CardTitle>
                  <UserCheck className="h-4 w-4 text-indigo-600 opacity-70" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{analytics?.drivers?.count || 0}</div>
                  <p className="text-[10px] text-indigo-600 font-bold mt-1">Active verified crew</p>
               </CardContent>
            </Card>
         </div>

         <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input
                  placeholder="Search by ID, Name, or Plate..."
                  className="pl-9 h-10 border-border bg-card/50 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <Button variant="outline" className="h-10 border-border gap-2 font-medium px-4 text-sm">
               <Filter className="h-4 w-4" /> Filter
            </Button>
         </div>

         <Card className="border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                     <tr>
                        <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-widest">Asset Details</th>
                        <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-widest">Connectivity</th>
                        <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-widest">Propulsion</th>
                        <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-widest">Status</th>
                        <th className="px-6 py-4 text-right font-bold uppercase text-[9px] tracking-widest">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {filteredBuses.length > 0 ? (
                        filteredBuses.map((bus) => {
                           const driver = drivers.find(d => d.id === bus.assignedDriverId)
                           return (
                              <tr key={bus.id} className="hover:bg-muted/30 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className={`h-8 w-8 rounded flex items-center justify-center ${bus.isOnline ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                          <BusIcon className="h-4 w-4" />
                                       </div>
                                       <div>
                                          <p className="font-bold tracking-tight text-sm leading-none">{bus.name}</p>
                                          <p className="text-[10px] text-muted-foreground mt-1.5 font-mono uppercase">
                                             {bus.busNumber} • {bus.brand} {bus.model}
                                          </p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       {bus.isOnline ? (
                                          <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/5 text-[9px] font-bold gap-1.5 h-5 uppercase">
                                             <Signal className="h-2.5 w-2.5" /> Online
                                          </Badge>
                                       ) : (
                                          <Badge variant="outline" className="border-slate-200 text-slate-400 bg-slate-50 text-[9px] font-bold gap-1.5 h-5 uppercase">
                                             <SignalLow className="h-2.5 w-2.5" /> Offline
                                          </Badge>
                                       )}
                                       <p className="text-[9px] font-mono text-muted-foreground">{bus.plateNumber}</p>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                       <div className="flex items-center gap-1.5">
                                          {getFuelIcon(bus.fuelType)}
                                          <span className="text-xs font-bold uppercase">{bus.fuelType}</span>
                                       </div>
                                       {bus.fuelType === 'cng' && bus.cngInfo && (
                                          <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                                             <div className="h-full bg-orange-500" style={{ width: `${bus.cngInfo.currentFuelLevelPercent}%` }} />
                                          </div>
                                       )}
                                    </div>
                                 </td>

                                 <td className="px-6 py-4">
                                    {getStatusBadge(bus.status)}
                                 </td>

                                 <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest gap-1.5 border-border/60"
                                          onClick={() => {
                                             setSelectedBus(bus)
                                             setIsDetailsOpen(true)
                                          }}
                                       >
                                          Details <ArrowUpRight className="h-3 w-3" />
                                       </Button>
                                    </div>
                                 </td>
                              </tr>
                           )
                        })
                     ) : (
                        <tr>
                           <td colSpan={7} className="px-6 py-24 text-center">
                              <div className="flex flex-col items-center justify-center opacity-30">
                                 <BusIcon className="h-12 w-12 mb-4" />
                                 <p className="text-sm font-bold uppercase tracking-widest mb-1">Fleet Ledger Empty</p>
                                 <p className="text-xs">Register your first vehicle to begin tracking</p>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
            <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic italic">Live Fleet Stream • {buses.length} Active Assets</p>
               <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest" disabled>Prev</Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">Next</Button>
               </div>
            </div>
         </Card>

         <BusDetailsModal
            isOpen={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            bus={selectedBus}
            drivers={drivers}
            onUpdateBus={fetchData}
         />
      </div>
   )
}

function BusDetailsModal({
   isOpen,
   onOpenChange,
   bus,
   drivers,
   onUpdateBus
}: {
   isOpen: boolean
   onOpenChange: (open: boolean) => void
   bus: Bus | null
   drivers: Driver[]
   onUpdateBus: () => void
}) {
   if (!bus) return null

   return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-border bg-card">
            <DialogHeader className="p-6 border-b border-border bg-muted/20">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${bus.isOnline ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <BusIcon className="h-6 w-6" />
                     </div>
                     <div>
                        <DialogTitle className="text-xl font-bold tracking-tight">{bus.name}</DialogTitle>
                        <DialogDescription className="text-xs font-mono uppercase tracking-tighter">
                           {bus.busNumber} • {bus.brand} {bus.model} ({bus.year})
                        </DialogDescription>
                     </div>
                  </div>
                  <Badge variant={bus.status === 'active' ? 'default' : 'secondary'} className="uppercase text-[10px] font-bold h-6">
                     {bus.status}
                  </Badge>
               </div>
            </DialogHeader>

            <ScrollArea className="max-h-[80vh]">
               <div className="p-6 space-y-8 pb-10">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                           <Signal className="h-3.5 w-3.5 text-primary" />
                           <span className="text-[10px] font-bold uppercase text-muted-foreground">Connectivity</span>
                        </div>
                        <p className={`text-sm font-bold ${bus.isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                           {bus.isOnline ? 'Transmitting' : 'Offline'}
                        </p>
                     </div>
                     <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                           <Gauge className="h-3.5 w-3.5 text-primary" />
                           <span className="text-[10px] font-bold uppercase text-muted-foreground">Mileage</span>
                        </div>
                        <p className="text-sm font-bold">{bus.mileageKm.toLocaleString()} KM</p>
                     </div>
                     <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                           <Users className="h-3.5 w-3.5 text-primary" />
                           <span className="text-[10px] font-bold uppercase text-muted-foreground">Capacity</span>
                        </div>
                        <p className="text-sm font-bold">{bus.totalSeats + bus.standingCapacity} Total</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     {/* Technical Specs */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                           <Settings2 className="h-4 w-4" /> Technical Specifications
                        </h4>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-xs text-muted-foreground">Engine Number</span>
                              <span className="text-xs font-mono font-bold">{bus.engineNumber}</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-xs text-muted-foreground">Chassis Number</span>
                              <span className="text-xs font-mono font-bold">{bus.chassisNumber}</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-xs text-muted-foreground">License Plate</span>
                              <span className="text-xs font-bold uppercase">{bus.plateNumber}</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-xs text-muted-foreground">Last Location Sync</span>
                              <span className="text-xs font-bold">
                                 {bus.lastLocationUpdate !== "0001-01-01T00:00:00Z" ? new Date(bus.lastLocationUpdate).toLocaleTimeString() : 'Never'}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Fuel/Propulsion */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                           <Flame className="h-4 w-4" /> Propulsion System
                        </h4>
                        <Card className="bg-orange-500/5 border-orange-500/10 p-4">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-bold uppercase text-orange-700">Fuel Level ({bus.fuelType})</span>
                              <span className="text-xs font-black text-orange-600">{bus.cngInfo?.currentFuelLevelPercent || 0}%</span>
                           </div>
                           <div className="h-2 w-full bg-orange-500/10 rounded-full overflow-hidden mb-4">
                              <div className="h-full bg-orange-500" style={{ width: `${bus.cngInfo?.currentFuelLevelPercent || 0}%` }} />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[9px] font-bold text-orange-700/60 uppercase">Current Pressure</p>
                                 <p className="text-xs font-bold">{bus.cngInfo?.currentPressurePsi || 0} PSI</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-bold text-orange-700/60 uppercase">Est. Range</p>
                                 <p className="text-xs font-bold">{bus.cngInfo?.estimatedRemainingKm || 0} KM</p>
                              </div>
                           </div>
                        </Card>
                     </div>
                  </div>

                  {/* Hardware & Amenities */}
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> Hardware & Safety Suite
                     </h4>
                     <div className="grid grid-cols-4 gap-3">
                        <HardwareBadge label="GPS" active={bus.hasGps} icon={<MapPin className="h-3 w-3" />} />
                        <HardwareBadge label="Camera" active={bus.hasCamera} icon={<Camera className="h-3 w-3" />} />
                        <HardwareBadge label="Wi-Fi" active={bus.hasWifi} icon={<Wifi className="h-3 w-3" />} />
                        <HardwareBadge label="Panic" active={bus.hasPanicButton} icon={<AlertCircle className="h-3 w-3" />} />
                     </div>
                  </div>


                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-4">
                     <Info className="h-5 w-5 text-primary mt-0.5" />
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-primary uppercase">Operational Insight</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                           Vehicle is currently <span className="font-bold text-foreground">{bus.isOnline ? 'Active' : 'Standby'}</span>.
                           Maintenance was last performed on {new Date(bus.updatedAt).toLocaleDateString()}.
                        </p>
                     </div>
                  </div>
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   )
}

function HardwareBadge({ label, active, icon }: { label: string, active: boolean, icon: React.ReactNode }) {
   return (
      <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors ${active ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-50'}`}>
         {icon}
         <span className="text-[9px] font-bold uppercase">{label}</span>
      </div>
   )
}
