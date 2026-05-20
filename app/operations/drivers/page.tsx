"use client"

import * as React from "react"
import {
   UserCheck,
   Search,
   Filter,
   MoreHorizontal,
   Star,
   CheckCircle2,
   AlertTriangle,
   Clock,
   TrendingUp,
   History,
   ShieldAlert,
   Phone,
   MessageSquare,
   ChevronRight,
   User,
   Zap,
   Activity,
   Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { driverApi, DriverAnalytics, DriverPerformance } from "@/lib/api/drivers"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DriverOpsPage() {
   const router = useRouter()
   const [analytics, setAnalytics] = React.useState<DriverAnalytics | null>(null)
   const [selectedDriver, setSelectedDriver] = React.useState<DriverPerformance | null>(null)
   const [loading, setLoading] = React.useState(true)
   const [searchQuery, setSearchQuery] = React.useState("")

   const fetchData = React.useCallback(async () => {
      try {
         const data = await driverApi.getDriverAnalytics()
         if (data.success && data.data) {
            setAnalytics(data.data)
            // Auto-select first driver if none selected
            if (data.data.performance.length > 0 && !selectedDriver) {
               setSelectedDriver(data.data.performance[0])
            }
         }
      } catch (error) {
         toast.error("Failed to load driver performance data")
      } finally {
         setLoading(false)
      }
   }, [selectedDriver])

   React.useEffect(() => {
      fetchData()
   }, [fetchData])

   const filteredDrivers = React.useMemo(() => {
      if (!analytics) return []
      return analytics.performance.filter(d => 
         d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         d.driverId.toLowerCase().includes(searchQuery.toLowerCase())
      )
   }, [analytics, searchQuery])

   if (loading) {
      return (
         <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground italic">Auditing Crew Performance...</p>
         </div>
      )
   }

   if (!analytics) return null

   return (
      <div className="space-y-8 pt-4 pb-10">
         {/* Page Header */}
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
               <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <UserCheck className="h-7 w-7 text-primary" /> Driver Operations
               </h1>
               <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Real-time performance auditing and fleet crew management.
               </p>
            </div>

         </div>

         {/* Driver Availability Board */}
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
               { 
                  title: "Total Drivers", 
                  val: analytics.overview.totalDrivers.count.toString(), 
                  icon: User, 
                  color: "text-primary", 
                  bg: "bg-primary/5" 
               },
               { 
                  title: "Active Now", 
                  val: analytics.overview.activeDrivers.count.toString(), 
                  sub: `${analytics.overview.activeDrivers.percentage}%`,
                  icon: Zap, 
                  color: "text-emerald-600", 
                  bg: "bg-emerald-50" 
               },
               { 
                  title: "Avg Rating", 
                  val: analytics.overview.avgRating.rating.toFixed(2), 
                  icon: Award, 
                  color: "text-amber-600", 
                  bg: "bg-amber-50" 
               },
               { 
                  title: "Top Performer", 
                  val: analytics.overview.topPerformer.fullName || "N/A", 
                  icon: Star, 
                  color: "text-primary", 
                  bg: "bg-primary/5" 
               }
            ].map((stat, i) => (
               <Card key={i} className="border-border shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
                     <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-4 w-4" />
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold tracking-tight">{stat.val}</div>
                     {stat.sub && <p className="text-[10px] font-bold text-emerald-600 mt-1">{stat.sub} Participation</p>}
                  </CardContent>
               </Card>
            ))}
         </div>

         <div className="grid gap-6 lg:grid-cols-3 overflow-hidden">
            {/* Driver List Ledger */}
            <Card className="lg:col-span-2 border-border shadow-xl overflow-hidden flex flex-col">
               <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Crew Ledger</h3>
                  <div className="relative w-48">
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                     <Input 
                        placeholder="Search drivers..." 
                        className="pl-8 h-8 text-xs border-border bg-white" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
               </div>
               <ScrollArea className="flex-1 max-h-[600px]">
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border sticky top-0 z-10">
                           <tr>
                              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Driver Identity</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Performance</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Trips</th>
                              <th className="px-6 py-3 text-right"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                           {filteredDrivers.map((driver) => (
                              <tr
                                 key={driver.driverId}
                                 onClick={() => setSelectedDriver(driver)}
                                 className={`hover:bg-muted/10 transition-colors cursor-pointer ${selectedDriver?.driverId === driver.driverId ? 'bg-primary/5' : ''}`}
                              >
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-primary">
                                          {driver.fullName.split(' ').map((n: string) => n[0]).join('')}
                                       </div>
                                       <div>
                                          <p className="font-bold tracking-tight text-sm">{driver.fullName}</p>
                                          <p className="text-[10px] text-muted-foreground font-semibold uppercase">{driver.driverId}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <Badge variant="outline" className={`font-semibold text-[10px] border-none px-2 h-5 ${
                                          driver.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                                          driver.status === 'on_break' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                       }`}>
                                       {driver.status.toUpperCase()}
                                    </Badge>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                       <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                       {driver.rating.toFixed(1)}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-xs font-black text-primary">
                                    {driver.tripsCompleted}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                       <ChevronRight className="h-4 w-4" />
                                    </Button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </ScrollArea>
            </Card>

            {/* Performance & Activity Detail */}
            <div className="space-y-6">
               <Card className="border-border shadow-xl overflow-hidden flex flex-col h-full">
                  <div className="p-4 border-b border-border bg-muted/10">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Crew Intelligence</h3>
                  </div>

                  <ScrollArea className="flex-1">
                     {selectedDriver ? (
                        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                           {/* Driver Profile Summary */}
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl">
                                    {selectedDriver.fullName.split(' ').map((n: string) => n[0]).join('')}
                                 </div>
                                 <div>
                                    <h2 className="text-2xl font-bold tracking-tight">{selectedDriver.fullName}</h2>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Last Trip: {new Date(selectedDriver.lastTripDate).toLocaleDateString()}</p>
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border text-primary"><Phone className="h-4 w-4" /></Button>
                                 <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border text-primary"><MessageSquare className="h-4 w-4" /></Button>
                              </div>
                           </div>

                           {/* Performance Stats */}
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-muted/30 rounded-2xl space-y-2 border border-border/50">
                                 <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Total Volume</p>
                                 <div className="flex items-end justify-between">
                                    <p className="text-2xl font-black text-primary">{selectedDriver.tripsCompleted}</p>
                                    <TrendingUp className="h-4 w-4 text-emerald-500 mb-1" />
                                 </div>
                                 <p className="text-[10px] font-bold text-muted-foreground">TRIPS COMPLETED</p>
                              </div>
                              <div className="p-4 bg-muted/30 rounded-2xl space-y-2 border border-border/50">
                                 <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Quality Score</p>
                                 <div className="flex items-end justify-between">
                                    <p className={`text-2xl font-black ${selectedDriver.rating >= 4.5 ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedDriver.rating}</p>
                                    <Star className={`h-4 w-4 ${selectedDriver.rating >= 4.5 ? 'text-emerald-500' : 'text-amber-500'} mb-1 fill-current`} />
                                 </div>
                                 <p className="text-[10px] font-bold text-muted-foreground">AVG USER RATING</p>
                              </div>
                           </div>

                           {/* Driver Activity Timeline (Static for now as API doesn't provide it) */}
                           <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                 <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Operational Status</p>
                                 <History className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="p-4 bg-zinc-950 text-white rounded-xl space-y-3">
                                 <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-zinc-500">Live Status</span>
                                    <Badge className={`${
                                       selectedDriver.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                                    } border-none font-black text-[9px]`}>{selectedDriver.status.toUpperCase()}</Badge>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-zinc-500">Telemetry Sync</span>
                                    <span className="text-[10px] font-bold text-emerald-400">ENCRYPTED</span>
                                 </div>
                              </div>
                           </div>

                           {/* Action Tools */}
                           <div className="space-y-3 pt-4 border-t border-border">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Operational Actions</p>
                              <div className="grid grid-cols-2 gap-3">
                                 <Button 
                                   className="h-11 font-black text-[10px] uppercase tracking-widest brand-gradient text-white shadow-lg shadow-primary/20 col-span-2"
                                   onClick={() => router.push(`/operations/drivers/${selectedDriver.driverId}`)}
                                 >
                                    <User className="mr-2 h-3 w-3" /> View Full Profile
                                 </Button>

                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-40">
                           <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                              <Activity className="h-12 w-12 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="text-sm font-bold uppercase tracking-tight">Select Crew Member</p>
                              <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto">Click on a driver in the ledger to view performance auditing and live activity streams.</p>
                           </div>
                        </div>
                     )}
                  </ScrollArea>
               </Card>
            </div>
         </div>
      </div>
   )
}
