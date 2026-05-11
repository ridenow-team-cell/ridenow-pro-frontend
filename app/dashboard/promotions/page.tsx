"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Tag, 
  Ticket, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar, 
  Gift, 
  Zap, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Copy,
  Share2
} from "lucide-react"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
  Cell
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const campaignData = [
  { day: "Mon", usage: 120, conversions: 45 },
  { day: "Tue", usage: 150, conversions: 52 },
  { day: "Wed", usage: 180, conversions: 61 },
  { day: "Thu", usage: 210, conversions: 78 },
  { day: "Fri", usage: 190, conversions: 65 },
  { day: "Sat", usage: 240, conversions: 92 },
  { day: "Sun", usage: 280, conversions: 110 },
]

const promoCodes = [
  { code: "RIDE2024", type: "Percentage", value: "20%", status: "Active", used: 1240, total: 5000, expiry: "Dec 31, 2024" },
  { code: "NEWUSER50", type: "Fixed Amount", value: "$50", status: "Active", used: 450, total: 1000, expiry: "Nov 15, 2024" },
  { code: "ELITEPASS", type: "Subscription", value: "1 Month Free", status: "Paused", used: 210, total: 500, expiry: "Oct 20, 2024" },
  { code: "SUMMER24", type: "Percentage", value: "15%", status: "Expired", used: 5000, total: 5000, expiry: "Aug 31, 2024" },
]

export default function PromotionsPage() {
  return (
    <div className="space-y-6 pt-4 pb-10 min-h-screen px-4 md:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Promotions & Growth
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Manage campaigns, referral programs, and campus discount ecosystems.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 font-semibold text-xs border-border">
            Analytics Report
          </Button>
          <Link href="/dashboard/promotions/new">
            <Button size="sm" className="h-9 px-4 font-bold text-xs bg-primary shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Campaign Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-5 border-border bg-card shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Campaign Velocity</CardTitle>
              <CardDescription className="text-[10px] font-medium">Real-time conversion tracking across active promotions.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold px-2 h-5 text-[9px]">+24% GROWTH</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={campaignData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', padding: '12px' }}
                    itemStyle={{ fontWeight: 600, fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorUsage)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border bg-slate-950 text-white shadow-lg rounded-xl flex flex-col">
          <CardHeader className="border-b border-white/10 pb-4">
             <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Insights</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6 space-y-6">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Top Performing Code</p>
                   <Badge className="bg-primary text-white border-none text-[8px] font-bold h-4">ACTIVE</Badge>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                   <p className="text-xl font-bold text-primary tracking-tight">RIDE2024</p>
                   <p className="text-[10px] text-slate-400 font-semibold uppercase mt-1">842 conversions today</p>
                </div>
             </div>
             <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Referral Network</p>
                <div className="flex items-center justify-between">
                   <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                         <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                            <div className="bg-primary/20 w-full h-full flex items-center justify-center text-primary">U{i}</div>
                         </div>
                      ))}
                   </div>
                   <p className="text-sm font-bold tracking-tight">+1,240 <span className="text-emerald-400 text-[10px] uppercase ml-1">Daily</span></p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="codes" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1 border border-border rounded-lg">
            <TabsTrigger value="codes" className="gap-2 text-xs font-bold uppercase tracking-tight h-8 px-4 rounded-md">
              <Ticket className="h-3.5 w-3.5" />
              Promo Codes
            </TabsTrigger>
            <TabsTrigger value="referrals" className="gap-2 text-xs font-bold uppercase tracking-tight h-8 px-4 rounded-md">
              <Share2 className="h-3.5 w-3.5" />
              Referral System
            </TabsTrigger>
            <TabsTrigger value="discounts" className="gap-2 text-xs font-bold uppercase tracking-tight h-8 px-4 rounded-md">
              <Tag className="h-3.5 w-3.5" />
              Sub Discounts
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="codes" className="space-y-6">
          <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search codes..." className="pl-10 h-10 border-border bg-muted/20 rounded-lg font-medium" />
               </div>
               <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-10 border-border font-bold text-xs uppercase px-4 rounded-lg">
                     <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Code</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Type</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Value</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Usage</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest">Expiry</th>
                    <th className="px-6 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {promoCodes.map((promo, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-sm tracking-tight text-primary uppercase">{promo.code}</span>
                           <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary rounded-md">
                              <Copy className="h-3 w-3" />
                           </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-xs uppercase text-muted-foreground">{promo.type}</td>
                      <td className="px-6 py-4 font-bold text-xs text-foreground">
                        {promo.value.startsWith('$') ? `₦${promo.value.slice(1)}` : promo.value}
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="space-y-1.5">
                           <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                              <span>{promo.used.toLocaleString()} used</span>
                              <span className="text-muted-foreground">{Math.round((promo.used / promo.total) * 100)}%</span>
                           </div>
                           <Progress value={(promo.used / promo.total) * 100} className="h-1 bg-muted" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className={`font-bold text-[9px] border-none px-2 h-5 uppercase tracking-wide ${
                          promo.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' :
                          promo.status === 'Paused' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                        }`}>
                          {promo.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-xs text-muted-foreground">{promo.expiry}</td>
                      <td className="px-6 py-4 text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 border-border">
                               <DropdownMenuLabel className="text-xs">Campaign Control</DropdownMenuLabel>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem className="gap-2 text-xs font-medium"><Clock className="h-4 w-4" /> View History</DropdownMenuItem>
                               <DropdownMenuItem className="gap-2 text-xs font-medium"><Zap className="h-4 w-4" /> Parameters</DropdownMenuItem>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem className="text-rose-600 font-bold gap-2 text-xs"><XCircle className="h-4 w-4" /> Terminate</DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border bg-card shadow-sm p-6 space-y-6 rounded-xl">
               <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                     <Users className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px] uppercase h-5 px-2">ACTIVE</Badge>
               </div>
               <div className="space-y-1">
                  <h3 className="text-base font-bold uppercase tracking-tight">Refer-a-Campus Friend</h3>
                  <p className="text-[11px] text-muted-foreground font-medium">Incentivizing organic growth through user invites.</p>
               </div>
               <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                     <span>Inviter Reward</span>
                     <span className="text-primary">1,000 Credits</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                     <span>New User Reward</span>
                     <span className="text-primary">₦500 OFF Plan</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button className="flex-1 h-9 font-bold text-xs uppercase tracking-wider rounded-lg">Edit Rewards</Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-border rounded-lg"><Share2 className="h-4 w-4" /></Button>
               </div>
            </Card>

            <Card className="border-border bg-slate-950 text-white p-6 flex flex-col justify-between rounded-xl shadow-lg">
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Referral Conversion</p>
                     <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-4xl font-bold tracking-tighter">14.2%</div>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">Organic growth has increased by 4.5% since the last reward adjustment.</p>
               </div>
               <div className="pt-6 border-t border-white/10">
                  <Button variant="ghost" className="w-full text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest gap-2">
                     Deep Analytics <ArrowUpRight className="h-3 w-3" />
                  </Button>
               </div>
            </Card>

            <Card className="border-border border-dashed bg-muted/5 flex flex-col items-center justify-center p-6 text-center space-y-3 hover:bg-muted/10 transition-colors cursor-pointer group rounded-xl">
               <div className="h-10 w-10 rounded-full border border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all">
                  <Plus className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest">New Growth Scheme</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Design tiered rewards for power users.</p>
               </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card shadow-sm overflow-hidden rounded-xl">
                 <div className="h-1.5 w-full bg-amber-500" />
                 <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                       <CardTitle className="text-sm font-bold uppercase tracking-wider">Active Plan Discounts</CardTitle>
                       <Gift className="h-4 w-4 text-amber-500" />
                    </div>
                    <CardDescription className="text-[10px] font-medium">Dynamic pricing overrides for specific subscription tiers.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-3">
                    {[
                       { plan: "Student Pass", discount: "15% OFF", duration: "6 Months", active: 1420 },
                       { plan: "Elite Unlimited", discount: "10% OFF", duration: "First Year", active: 540 }
                    ].map((d, i) => (
                       <div key={i} className="flex items-center justify-between p-3 border border-border bg-muted/20 rounded-xl">
                          <div className="space-y-0.5">
                             <p className="font-bold text-sm tracking-tight">{d.plan}</p>
                             <p className="text-[10px] text-muted-foreground font-bold uppercase">{d.duration}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-base font-bold text-emerald-600">{d.discount}</p>
                             <p className="text-[10px] text-muted-foreground font-bold uppercase">{d.active} Active</p>
                          </div>
                       </div>
                    ))}
                    <Button className="w-full h-9 mt-2 font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs">Manage Sub Discounts</Button>
                 </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm p-6 flex flex-col justify-between rounded-xl">
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
                          <Zap className="h-4 w-4" />
                       </div>
                       <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest">Emergency Flash Sale</h3>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Global Price Override</p>
                       </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                       Trigger a temporary price reduction across all plans to boost engagement during low-utilization periods or special events.
                    </p>
                    <div className="p-3 border border-dashed border-rose-200 bg-rose-500/5 rounded-xl text-center">
                       <p className="text-[10px] font-bold uppercase text-rose-600 tracking-widest">Inactive</p>
                    </div>
                 </div>
                 <Button variant="outline" className="w-full h-9 mt-6 border-border font-bold uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all rounded-lg text-xs">Launch Flash Sale</Button>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
