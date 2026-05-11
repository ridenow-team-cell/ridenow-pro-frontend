"use client"

import * as React from "react"
import { 
  TrendingUp, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  Calendar, 
  Map as MapIcon, 
  Activity, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info,
  BarChart3,
  LineChart,
  ChevronRight,
  Layers,
  Sparkles
} from "lucide-react"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Cell
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock Forecasting Data (Next 24h)
const forecastData = [
  { time: "00:00", demand: 120 },
  { time: "04:00", demand: 80 },
  { time: "08:00", demand: 450 },
  { time: "12:00", demand: 320 },
  { time: "16:00", demand: 580 },
  { time: "20:00", demand: 390 },
  { time: "23:59", demand: 150 },
]

// Peak Hour Analysis
const peakHourData = [
  { hour: "6AM", volume: 150 },
  { hour: "8AM", volume: 520 },
  { hour: "10AM", volume: 380 },
  { hour: "12PM", volume: 310 },
  { hour: "2PM", volume: 290 },
  { hour: "4PM", volume: 480 },
  { hour: "6PM", volume: 610 },
  { hour: "8PM", volume: 340 },
]

// Route Ranking
const routeDemand = [
  { route: "Campus Express", trips: 1420, growth: "+12.4%", trend: "up" },
  { route: "Downtown Hub", trips: 1280, growth: "+8.2%", trend: "up" },
  { route: "Airport Link", trips: 950, growth: "-2.1%", trend: "down" },
  { route: "Sector-9 Loop", trips: 840, growth: "+5.6%", trend: "up" },
  { route: "Residential East", trips: 620, growth: "+1.8%", trend: "up" },
]

export default function DemandAnalyticsPage() {
  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <TrendingUp className="h-7 w-7 text-primary" /> Demand Analytics
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Predictive demand modeling and route optimization intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Select defaultValue="24h">
              <SelectTrigger className="w-[140px] h-10 border-border bg-white">
                 <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="24h">Next 24 Hours</SelectItem>
                 <SelectItem value="72h">Next 72 Hours</SelectItem>
                 <SelectItem value="7d">Next 7 Days</SelectItem>
              </SelectContent>
           </Select>
           <Button size="sm" className="h-10 px-6 font-semibold text-xs uppercase tracking-wider brand-gradient text-white shadow-lg shadow-primary/20">
              <Sparkles className="mr-2 h-4 w-4" /> Generate Forecast
           </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Geographic Demand Heatmap (Simulated) */}
        <Card className="lg:col-span-4 border-border shadow-xl overflow-hidden relative">
           <CardHeader className="border-b border-border/50 bg-white/50 backdrop-blur-sm z-10 relative">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Demand Heatmap</CardTitle>
                    <CardDescription className="text-xs">Geographic concentration of ride requests.</CardDescription>
                 </div>
                 <Badge variant="outline" className="h-6 font-bold text-[10px] tracking-widest px-3 border-primary/20 text-primary bg-primary/5">LIVE SYNC</Badge>
              </div>
           </CardHeader>
           <div className="h-[400px] w-full bg-zinc-950 relative">
              {/* Simulated Map Grid */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              {/* Heatmap Blobs */}
              <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/30 blur-[100px] rounded-full animate-pulse" />
              <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full" />
              <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-rose-500/10 blur-[60px] rounded-full" />

              {/* Cluster Labels */}
              <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="h-3 w-3 bg-primary rounded-full ring-4 ring-primary/20" />
                 <p className="mt-2 text-[10px] font-black uppercase text-white tracking-[0.2em] bg-zinc-900/80 px-2 py-1 rounded">Downtown Core</p>
              </div>
              <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 flex flex-col items-center">
                 <div className="h-3 w-3 bg-amber-500 rounded-full ring-4 ring-amber-500/20" />
                 <p className="mt-2 text-[10px] font-black uppercase text-white tracking-[0.2em] bg-zinc-900/80 px-2 py-1 rounded">Business District</p>
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                 <Button variant="secondary" size="icon" className="h-8 w-8 rounded-md bg-zinc-900/80 text-white border-zinc-800"><Layers className="h-4 w-4" /></Button>
                 <Button variant="secondary" size="icon" className="h-8 w-8 rounded-md bg-zinc-900/80 text-white border-zinc-800"><MapIcon className="h-4 w-4" /></Button>
              </div>
           </div>
           <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Peak Saturation: 82%</span>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> High</div>
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> Medium</div>
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-zinc-500" /> Low</div>
              </div>
           </div>
        </Card>

        {/* Demand Forecasting Graph */}
        <Card className="lg:col-span-3 border-border shadow-xl">
           <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                 <CardTitle className="text-lg font-black uppercase tracking-tight">Demand Forecast</CardTitle>
                 <LineChart className="h-5 w-5 text-primary" />
              </div>
              <CardDescription className="text-xs">Projected volume for the next 24 hours.</CardDescription>
           </CardHeader>
           <CardContent className="pt-8">
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                       <defs>
                          <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#005baf" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#005baf" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                          dy={10}
                       />
                       <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                       />
                       <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                          itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="demand" 
                          stroke="#005baf" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorDemand)" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         {/* Peak Hour Analysis */}
         <Card className="border-border shadow-xl">
            <CardHeader className="border-b border-border/50">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <CardTitle className="text-lg font-black uppercase tracking-tight">Peak Hour Analysis</CardTitle>
                     <CardDescription className="text-xs">Historical volume distribution across day parts.</CardDescription>
                  </div>
                  <Clock className="h-5 w-5 text-amber-500" />
               </div>
            </CardHeader>
            <CardContent className="pt-8">
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={peakHourData}>
                        <XAxis 
                           dataKey="hour" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                           dy={10}
                        />
                        <YAxis 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                        />
                        <Tooltip 
                           cursor={{fill: 'rgba(0, 91, 175, 0.05)'}}
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        />
                        <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                           {peakHourData.map((entry, index) => (
                              <Cell 
                                 key={`cell-${index}`} 
                                 fill={entry.volume > 500 ? '#005baf' : '#e2e8f0'} 
                                 className="transition-all hover:fill-primary"
                              />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         {/* Route Demand Ranking */}
         <Card className="border-border shadow-xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-black uppercase tracking-tight">Route Rankings</CardTitle>
                  <Activity className="h-5 w-5 text-emerald-500" />
               </div>
               <CardDescription className="text-xs">Highest demand corridors by trip volume.</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                     <tr>
                        <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Route Corridor</th>
                        <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Total Trips</th>
                        <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Trend</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {routeDemand.map((route, i) => (
                        <tr key={i} className="hover:bg-muted/10 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">#0{i+1}</div>
                                 <span className="font-bold tracking-tight text-sm">{route.route}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 font-black text-sm">
                              {route.trips.toLocaleString()}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-1 rounded-full ${
                                 route.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                 {route.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                 {route.growth}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="p-4 bg-primary/5 border-t border-primary/10 flex items-center justify-center">
               <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary gap-2">
                  View Full Network Analysis <ChevronRight className="h-3 w-3" />
               </Button>
            </div>
         </Card>
      </div>
    </div>
  )
}
