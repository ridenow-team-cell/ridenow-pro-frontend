"use client"

import * as React from "react"
import {
   BarChart3,
   TrendingUp,
   Users,
   Bus,
   Map,
   Clock,
   Download,
   Calendar,
   ArrowUpRight,
   ArrowDownRight,
   PieChart as PieChartIcon,
   Filter,
   RefreshCcw,
   Zap,
   AlertTriangle
} from "lucide-react"
import {
   Area,
   AreaChart,
   Bar,
   BarChart,
   CartesianGrid,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const revenueData = [
   { month: "Jan", revenue: 45000, churn: 2400 },
   { month: "Feb", revenue: 52000, churn: 2100 },
   { month: "Mar", revenue: 48000, churn: 2800 },
   { month: "Apr", revenue: 61000, churn: 1900 },
   { month: "May", revenue: 59000, churn: 2200 },
   { month: "Jun", revenue: 72000, churn: 1800 },
]

const routeProfitability = [
   { name: "Downtown Exp", profit: 12400, costs: 4500 },
   { name: "Airport Shuttle", profit: 18500, costs: 6200 },
   { name: "Campus Loop", profit: 8200, costs: 3100 },
   { name: "Inter-City 1", profit: 15100, costs: 8400 },
   { name: "Sector 7", profit: 6400, costs: 4200 },
]

const fleetEfficiency = [
   { name: "Most Used", value: 65, color: "hsl(var(--primary))" },
   { name: "Underutilized", value: 25, color: "hsl(var(--muted-foreground))" },
   { name: "Maintenance", value: 10, color: "hsl(var(--destructive))" },
]

const peakDemand = [
   { time: "06:00", demand: 20 },
   { time: "08:00", demand: 95 },
   { time: "10:00", demand: 45 },
   { time: "12:00", demand: 60 },
   { time: "14:00", demand: 50 },
   { time: "17:00", demand: 100 },
   { time: "19:00", demand: 75 },
   { time: "22:00", demand: 30 },
]

export default function ReportsPage() {
   return (
      <div className="space-y-6 pt-4 pb-10">
         {/* Header */}
         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
               <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Reports & Analytics
               </h1>
               <p className="text-sm text-muted-foreground">
                  Data-driven insights into platform revenue, fleet efficiency, and passenger demand.
               </p>
            </div>
            <div className="flex items-center gap-2 pt-2 md:pt-0">
               <Button variant="outline" size="sm" className="h-9 px-4 border-border">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  Last 30 Days
               </Button>
               <Button size="sm" className="h-9 px-4 font-semibold">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
               </Button>
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
                  <Card className="border-border bg-card">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monthly Recurring Revenue</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">$72,450.00</div>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                           <ArrowUpRight className="h-3 w-3" /> +12.5% growth
                        </p>
                     </CardContent>
                  </Card>
                  <Card className="border-border bg-card">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subscriber Churn Rate</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">2.4%</div>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                           <ArrowDownRight className="h-3 w-3" /> -0.8% improvement
                        </p>
                     </CardContent>
                  </Card>
                  <Card className="border-border bg-card">
                     <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">New Subscriptions</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">+850</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Acquisition target met</p>
                     </CardContent>
                  </Card>
               </div>

               <Card className="border-border bg-card">
                  <CardHeader>
                     <CardTitle>Revenue vs. Churn Performance</CardTitle>
                     <CardDescription>Visualizing revenue growth relative to subscription churn over 6 months.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={revenueData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                              <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value / 1000}k`} />
                              <Tooltip
                                 contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                 itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                              <Area type="monotone" dataKey="churn" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.05} strokeWidth={2} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* Route Profitability Tab */}
            <TabsContent value="routes" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 border-border bg-card">
                     <CardHeader>
                        <CardTitle>Route Profitability Index</CardTitle>
                        <CardDescription>Comparison of operational costs vs. net profit per route.</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="h-[350px] w-full mt-4">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={routeProfitability}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                 <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value / 1000}k`} />
                                 <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                 />
                                 <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                                 <Bar dataKey="costs" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="lg:col-span-1 border-border bg-card">
                     <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Top Performing Routes</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        {routeProfitability.slice(0, 3).map((route, idx) => (
                           <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                 <span className="font-bold">{route.name}</span>
                                 <span className="text-emerald-600 font-black">+{(route.profit / route.costs * 100).toFixed(0)}% ROI</span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                 <div className="h-full bg-primary" style={{ width: `${(route.profit / 20000 * 100)}%` }} />
                              </div>
                           </div>
                        ))}
                        <Separator />
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold uppercase text-muted-foreground">Most Profitable Sector</p>
                           <p className="text-lg font-bold">Aviation & Transit</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            {/* Fleet Efficiency Tab */}
            <TabsContent value="fleet" className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-border bg-card flex flex-col">
                     <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fleet Status Distribution</CardTitle>
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

                  <Card className="lg:col-span-2 border-border bg-card">
                     <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                           <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Asset Utilization</CardTitle>
                           <CardDescription>Identifying most used buses vs underutilized routes.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-primary font-bold">Optimization Map</Button>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="grid md:grid-cols-2 divide-x divide-border border-t border-border">
                           <div className="p-6 space-y-4">
                              <h4 className="text-xs font-bold uppercase text-emerald-600 flex items-center gap-2">
                                 <TrendingUp className="h-4 w-4" /> Most Used Buses
                              </h4>
                              <div className="space-y-3">
                                 {["BUS-402 (Express)", "BUS-112 (Airport)", "BUS-99 (Campus)"].map((bus, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border">
                                       <span className="text-xs font-bold">{bus}</span>
                                       <span className="text-[10px] font-bold text-muted-foreground">98% Utilization</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div className="p-6 space-y-4">
                              <h4 className="text-xs font-bold uppercase text-rose-600 flex items-center gap-2">
                                 <AlertTriangle className="h-4 w-4" /> Underutilized Routes
                              </h4>
                              <div className="space-y-3">
                                 {["Sector 4 Night Loop", "Suburban Connector", "Industrial Hub RT-2"].map((route, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border">
                                       <span className="text-xs font-bold">{route}</span>
                                       <span className="text-[10px] font-bold text-rose-600">Avg {15 + idx}% Load</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            {/* Peak Demand Tab */}
            <TabsContent value="demand" className="space-y-6">
               <Card className="border-border bg-card">
                  <CardHeader>
                     <CardTitle>Daily Passenger Demand Flow</CardTitle>
                     <CardDescription>Identifying peak hours and low-demand windows for scheduling optimization.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="h-[400px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={peakDemand}>
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
                              <Area type="monotone" dataKey="demand" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#demandGradient)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-border bg-card p-6 flex items-start gap-4">
                     <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <Clock className="h-5 w-5" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Morning Rush Peak</h4>
                        <p className="text-2xl font-bold mt-1">08:15 AM</p>
                        <p className="text-xs text-muted-foreground mt-1">Highest load detected on Downtown Express.</p>
                     </div>
                  </Card>
                  <Card className="border-border bg-card p-6 flex items-start gap-4">
                     <div className="h-10 w-10 rounded bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <RefreshCcw className="h-5 w-5" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Scheduling Advice</h4>
                        <p className="text-2xl font-bold mt-1">Consolidate RT-4</p>
                        <p className="text-xs text-muted-foreground mt-1">Merge RT-4 and RT-6 during 10:00 - 12:00 to save fuel.</p>
                     </div>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   )
}
