"use client"

import * as React from "react"
import {
   BarChart3,
   TrendingUp,
   Users,
   Bus,
   Map,
   Clock,
   ArrowUpRight,
   ArrowDownRight,
   PieChart as PieChartIcon,
   Filter,
   RefreshCcw,
   Zap,
   AlertTriangle,
   Lock
} from "lucide-react"
import {
   Area,
   AreaChart,
   CartesianGrid,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
   Bar,
   BarChart,
   Pie,
   PieChart,
   Cell,
   Legend
} from "recharts"

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getAnalyticsReport, ReportData } from "@/lib/api/analytics"

export default function ReportsPage() {
   const [report, setReport] = React.useState<ReportData | null>(null)
   const [isLoading, setIsLoading] = React.useState(true)
   const [error, setError] = React.useState<string | null>(null)

   const fetchReport = React.useCallback(async () => {
      try {
         setIsLoading(true)
         setError(null)
         const res = await getAnalyticsReport()
         if (res.success && res.data) {
            setReport(res.data)
         } else {
            setError(res.message || "Failed to load report data")
         }
      } catch (err: any) {
         console.error(err)
         setError(err?.message || "Failed to establish database connection")
      } finally {
         setIsLoading(false)
      }
   }, [])

   React.useEffect(() => {
      fetchReport()
   }, [fetchReport])

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4 animate-in fade-in duration-300">
            <RefreshCcw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm font-semibold text-muted-foreground">Assembling analytical ledgers...</p>
         </div>
      )
   }

   if (error || !report) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4 text-center p-6 animate-in fade-in duration-300">
            <div className="h-14 w-14 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 shadow-inner">
               <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
               <h3 className="text-base font-bold text-foreground">Failed to Compile Reports</h3>
               <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">{error || "No reports data returned"}</p>
            </div>
            <Button onClick={fetchReport} size="sm" className="h-9 px-4 font-bold text-xs bg-primary text-white hover:bg-primary/90 shadow-sm">
               <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Reconnect Service
            </Button>
         </div>
      )
   }

   // Prepare Chart Datasets with safe fallbacks
   const mrr = report.overview.monthlyRecurringRevenue
   const churn = report.overview.subscriberChurnRate
   const newSubs = report.overview.newSubscriptions

   const revenueVsChurnData = report.revenueVsChurn.data || []
   
   // 1. Route profitability fallback logic
   const routeProfitability = report.routeProfitabilityIndex?.data || []
   const topPerformers = report.routeProfitabilityIndex?.topPerformers || []

   // 2. Fleet Efficiency dataset
   const fleetEfficiency = [
      { name: "Most Used", value: 65, color: "hsl(var(--primary))" },
      { name: "Underutilized", value: 25, color: "hsl(var(--muted-foreground))" },
      { name: "Maintenance", value: 10, color: "hsl(var(--destructive))" },
   ]

   const assetUtilization = report.fleetStatusDistribution.assetUtilization
   const mostUsedBuses = assetUtilization?.mostUsedBuses || []
   const underutilizedRoutes = assetUtilization?.underutilizedRoutes || []

   // 3. Passenger Demand Flow dataset
   const demandLabels = report.passengerDemandFlow.timeLabels || []
   const demandValues = report.passengerDemandFlow.demand || []
   const demandData = demandLabels.map((time, idx) => ({
      time,
      demand: demandValues[idx] ?? 0
   }))

   const insights = report.passengerDemandFlow.insights

   return (
      <div className="space-y-6 pt-4 pb-10">
         {/* Header */}
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 border border-border rounded-xl shadow-sm">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                     <BarChart3 className="h-6 w-6 text-primary" /> Reports & Analytics
                  </h1>
                  <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-bold uppercase text-[9px] px-2">
                     Live Metrics
                  </Badge>
               </div>
               <p className="text-sm text-muted-foreground pl-0.5 font-medium">
                  Data-driven insights into platform revenue, fleet efficiency, and passenger demand.
               </p>
            </div>
         </div>

         {/* Main Analytics Tabs */}
         <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="w-full justify-start h-11 bg-muted p-1 border border-border rounded-md mb-6">
               <TabsTrigger value="revenue" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Revenue & Growth
               </TabsTrigger>
               <TabsTrigger value="routes" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Map className="h-3.5 w-3.5" />
                  Route Profitability
               </TabsTrigger>
               <TabsTrigger value="fleet" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Bus className="h-3.5 w-3.5" />
                  Fleet Efficiency
               </TabsTrigger>
               <TabsTrigger value="demand" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5" />
                  Peak Demand
               </TabsTrigger>
            </TabsList>

            {/* Revenue & Growth Tab */}
            <TabsContent value="revenue" className="space-y-6">
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Monthly Recurring Revenue */}
                  <Card className="border-border bg-card">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{mrr.title}</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">{mrr.formatted}</div>
                        <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${mrr.change.type === 'increase' ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {mrr.change.type === 'increase' ? (
                              <ArrowUpRight className="h-3 w-3" />
                           ) : (
                              <ArrowDownRight className="h-3 w-3" />
                           )}
                           {mrr.change.label}
                        </p>
                     </CardContent>
                  </Card>

                  {/* Subscriber Churn Rate */}
                  <Card className="border-border bg-card">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{churn.title}</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">{churn.change.value}%</div>
                        <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${churn.change.type === 'decrease' ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {churn.change.type === 'decrease' ? (
                              <ArrowDownRight className="h-3 w-3" />
                           ) : (
                              <ArrowUpRight className="h-3 w-3" />
                           )}
                           {churn.change.label}
                        </p>
                     </CardContent>
                  </Card>

                  {/* New Subscriptions */}
                  <Card className="border-border bg-card">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{newSubs.title}</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">+{newSubs.count}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">{newSubs.label}</p>
                     </CardContent>
                  </Card>
               </div>

               {/* Area Chart Card */}
               <Card className="border-border bg-card">
                  <CardHeader>
                     <CardTitle>{report.revenueVsChurn.title}</CardTitle>
                     <CardDescription>{report.revenueVsChurn.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {revenueVsChurnData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-12 space-y-3 bg-muted/10 border border-dashed border-border rounded-lg min-h-[300px]">
                           <TrendingUp className="h-10 w-10 text-muted-foreground" />
                           <h4 className="text-sm font-bold">No Performance History</h4>
                           <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Revenue versus subscription churn timelines will plot automatically here as passenger accounts activate monthly passes.</p>
                        </div>
                     ) : (
                        <div className="h-[350px] w-full mt-4">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={revenueVsChurnData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                 <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                 <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `₦${value.toLocaleString()}`} />
                                 <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                 />
                                 <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                                 <Area type="monotone" dataKey="churn" name="Churn Rate" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.05} strokeWidth={2} />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </TabsContent>

            {/* Route Profitability Tab */}
            <TabsContent value="routes" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bar Chart Container */}
                  <Card className="lg:col-span-2 border-border bg-card">
                     <CardHeader>
                        <CardTitle>{report.routeProfitabilityIndex?.title || "Route Profitability Index"}</CardTitle>
                        <CardDescription>{report.routeProfitabilityIndex?.description || "Comparison of operational costs vs. net profit per route."}</CardDescription>
                     </CardHeader>
                     <CardContent>
                        {routeProfitability.length === 0 ? (
                           <div className="flex flex-col items-center justify-center text-center p-12 space-y-3 bg-muted/10 border border-dashed border-border rounded-lg min-h-[350px]">
                              <Map className="h-10 w-10 text-muted-foreground" />
                              <h4 className="text-sm font-bold">No Profitability Logs</h4>
                              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Comparative profitability indexes for active lines will populate once transit revenues clear.</p>
                           </div>
                        ) : (
                           <div className="h-[350px] w-full mt-4">
                              <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={routeProfitability}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `₦${value.toLocaleString()}`} />
                                    <Tooltip
                                       cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                       contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                                    <Bar dataKey="costs" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[4, 4, 0, 0]} barSize={40} />
                                 </BarChart>
                              </ResponsiveContainer>
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* Profit Performance List */}
                  <Card className="lg:col-span-1 border-border bg-card">
                     <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Top Performing Routes</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        {topPerformers.length === 0 ? (
                           <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 bg-muted/10 border border-dashed border-border rounded-lg min-h-[220px]">
                              <TrendingUp className="h-8 w-8 text-muted-foreground" />
                              <p className="text-xs font-bold text-muted-foreground">No Profit Performers Identified</p>
                           </div>
                        ) : (
                           topPerformers.slice(0, 3).map((route, idx) => (
                              <div key={idx} className="space-y-2">
                                 <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold">{route.name}</span>
                                    <span className="text-emerald-600 font-black">+{route.roi}% ROI</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (route.profit / 20000) * 100)}%` }} />
                                 </div>
                              </div>
                           ))
                        )}
                        <Separator />
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold uppercase text-muted-foreground">Most Profitable Sector</p>
                           <p className="text-lg font-bold">{topPerformers.length > 0 ? "Aviation & Transit" : "None Identified"}</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            {/* Fleet Efficiency Tab */}
            <TabsContent value="fleet" className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Pie Chart Card */}
                  <Card className="border-border bg-card flex flex-col">
                     <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{report.fleetStatusDistribution.title}</CardTitle>
                     </CardHeader>
                     <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                        <ResponsiveContainer width="100%" height={250}>
                           <PieChart>
                              <Pie
                                 data={fleetEfficiency}
                                 innerRadius={60}
                                 outerRadius={80}
                                 paddingAngle={5}
                                 dataKey="value"
                              >
                                 {fleetEfficiency.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                           </PieChart>
                        </ResponsiveContainer>
                     </CardContent>
                  </Card>

                  {/* Asset Utilization Lists */}
                  <Card className="lg:col-span-2 border-border bg-card">
                     <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                           <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Asset Utilization</CardTitle>
                           <CardDescription>Identifying most used buses vs underutilized routes.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-primary font-bold text-xs">Optimization Map</Button>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="grid md:grid-cols-2 divide-x divide-border border-t border-border">
                           {/* Most Used Buses */}
                           <div className="p-6 space-y-4">
                              <h4 className="text-xs font-bold uppercase text-emerald-600 flex items-center gap-2">
                                 <TrendingUp className="h-4 w-4" /> Most Used Buses
                              </h4>
                              <div className="space-y-3">
                                 {mostUsedBuses.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-8 space-y-2 bg-muted/10 border border-dashed border-border rounded-lg">
                                       <Bus className="h-6 w-6 text-muted-foreground/60" />
                                       <span className="text-[11px] font-bold text-muted-foreground">No usage logs recorded</span>
                                    </div>
                                 ) : (
                                    mostUsedBuses.map((bus, idx) => (
                                       <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border">
                                          <span className="text-xs font-bold">{bus.name}</span>
                                          <span className="text-[10px] font-bold text-muted-foreground">{bus.utilization}% Utilization</span>
                                       </div>
                                    ))
                                 )}
                              </div>
                           </div>

                           {/* Underutilized Routes */}
                           <div className="p-6 space-y-4">
                              <h4 className="text-xs font-bold uppercase text-rose-600 flex items-center gap-2">
                                 <AlertTriangle className="h-4 w-4" /> Underutilized Routes
                              </h4>
                              <div className="space-y-3">
                                 {underutilizedRoutes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-8 space-y-2 bg-muted/10 border border-dashed border-border rounded-lg">
                                       <Map className="h-6 w-6 text-muted-foreground/60" />
                                       <span className="text-[11px] font-bold text-muted-foreground">No underutilized segments</span>
                                    </div>
                                 ) : (
                                    underutilizedRoutes.map((route, idx) => (
                                       <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border">
                                          <span className="text-xs font-bold">{route.route}</span>
                                          <span className="text-[10px] font-bold text-rose-600">Avg {route.avgLoad}% Load</span>
                                       </div>
                                    ))
                                 )}
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            {/* Peak Demand Tab */}
            <TabsContent value="demand" className="space-y-6">
               {/* Area Chart Card */}
               <Card className="border-border bg-card">
                  <CardHeader>
                     <CardTitle>{report.passengerDemandFlow.title}</CardTitle>
                     <CardDescription>{report.passengerDemandFlow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {demandData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-12 space-y-3 bg-muted/10 border border-dashed border-border rounded-lg min-h-[350px]">
                           <Clock className="h-10 w-10 text-muted-foreground animate-pulse" />
                           <h4 className="text-sm font-bold">No Peak Flow Data</h4>
                           <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Daily passenger load flow records will visualize here as users scan active passes on transport corridors.</p>
                        </div>
                     ) : (
                        <div className="h-[400px] w-full mt-4">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={demandData}>
                                 <defs>
                                    <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                       <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                 <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                 <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `${value}%`} />
                                 <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                 />
                                 <Area type="monotone" dataKey="demand" name="Passenger Load" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#demandGradient)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     )}
                  </CardContent>
               </Card>

               {/* Peak Insights Details */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Peak Hour Insight */}
                  <Card className="border-border bg-card p-6 flex items-start gap-4">
                     <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Clock className="h-5 w-5" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Peak Demand Hour</h4>
                        <p className="text-2xl font-bold mt-1">{insights?.peakHour || "None Logged"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{insights?.peakNote || "No active peaks recorded today."}</p>
                     </div>
                  </Card>

                  {/* Scheduling Advice Card */}
                  <Card className="border-border bg-card p-6 flex items-start gap-4">
                     <div className="h-10 w-10 rounded bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                        <RefreshCcw className="h-5 w-5 animate-spin-slow" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{insights?.schedulingAdvice.title || "Scheduling Advice"}</h4>
                        <p className="text-xl font-bold mt-1 text-orange-600">{insights?.schedulingAdvice.description ? "Active Suggestion" : "System Calibrating"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{insights?.schedulingAdvice.description || "Scheduling advisory metrics will formulate as scanner logs populate."}</p>
                     </div>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   )
}
