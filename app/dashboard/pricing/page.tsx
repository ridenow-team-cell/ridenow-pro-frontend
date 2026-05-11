"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Percent,
  Users,
  Calendar,
  ShieldAlert,
  TrendingDown,
  Activity,
  Route,
  Ban,
  Flag,
  Ticket as TicketIcon,
  RefreshCw,
  ZapOff
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data updated for "Unlimited" OneTicket Model
const oneTicketPlans = [
  { name: "Daily Pass", price: 1200, validity: "1 Day", activeUsers: 1240, avgRides: 4.2, status: "Active" },
  { name: "Weekly Elite", price: 7500, validity: "7 Days", activeUsers: 850, avgRides: 22.5, status: "Active" },
  { name: "Monthly Unlimited", price: 25000, validity: "30 Days", activeUsers: 2100, avgRides: 88.4, status: "Active" },
  { name: "Student Pilot", price: 5000, validity: "14 Days", activeUsers: 450, avgRides: 12.1, status: "Inactive" },
]

const suspiciousUsers = [
  { name: "Alex Rivera", id: "USR-9921", ridesToday: 12, pattern: "Impossible Frequency", deviceSwitch: "3 Devices", status: "Flagged" },
  { name: "Maria Garcia", id: "USR-4402", ridesToday: 15, pattern: "Same Route Loop", deviceSwitch: "1 Device", status: "Critical" },
  { name: "Jordan Smith", id: "USR-1205", ridesToday: 9, pattern: "Shared Credential?", deviceSwitch: "2 Devices", status: "Warning" },
]

export default function OneTicketManagement() {
  return (
    <div className="space-y-8 pt-4 pb-10 px-6">
      {/* 1. Header / Overview Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            OneTicket Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage unlimited ride passes, monitor fleet utilization, and prevent system abuse.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 border-border font-medium text-sm">
            Utilization Report
          </Button>
          <Button size="sm" className="h-10 font-semibold text-sm bg-primary shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Create New Ticket
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Active OneTickets" value="4,640" icon={<Users className="h-4 w-4" />} trend="+12%" trendType="up" />
        <KPICard title="Ticket Revenue (MTD)" value="₦12.4M" icon={<TrendingUp className="h-4 w-4" />} trend="+₦2.1M" trendType="up" />
        <KPICard title="Total Unlimited Rides" value="185.2K" icon={<Activity className="h-4 w-4" />} trend="+8.4%" trendType="up" />
        <KPICard title="Avg Rides / Ticket" value="28.4" icon={<RefreshCw className="h-4 w-4" />} trend="+2.1" trendType="up" />
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-primary">Profit Margin</CardTitle>
            <Percent className="h-4 w-4 text-primary opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-primary">24.8%</div>
            <p className="text-xs text-primary/70 font-medium mt-1">Operational Efficiency</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. Plans Management Section (Left 8/12) */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-xl font-bold">OneTicket Pass Inventory</CardTitle>
                <CardDescription className="text-sm">Unlimited ride tiers organized by validity duration.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter tickets..." className="pl-9 h-9 text-sm border-border bg-background" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-xs">Ticket Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-xs">Price (₦)</th>
                      <th className="px-6 py-3 text-left font-semibold text-xs">Validity</th>
                      <th className="px-6 py-3 text-left font-semibold text-xs">Active Users</th>
                      <th className="px-6 py-3 text-left font-semibold text-xs">Avg Rides / User</th>
                      <th className="px-6 py-3 text-center font-semibold text-xs">Status</th>
                      <th className="px-6 py-3 text-right font-semibold text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {oneTicketPlans.map((plan, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <TicketIcon className="h-4 w-4 text-primary/60" />
                              <span className="font-semibold">{plan.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-sm">₦{plan.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                           <Badge variant="outline" className="font-semibold border-primary/20 text-primary bg-primary/5">{plan.validity}</Badge>
                        </td>
                        <td className="px-6 py-4 font-medium">{plan.activeUsers.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-primary">{plan.avgRides}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge className={`text-xs font-semibold px-2 h-6 border-none ${
                            plan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                          }`}>
                            {plan.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 3. Usage Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Fleet Utilization distribution
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Frequency of "Unlimited" usage per ticket holder.</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-end gap-2 pt-4">
                 <div className="flex-1 bg-primary/20 rounded-t h-[30%] relative group">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">1-2 Rides</div>
                    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">Casual</div>
                 </div>
                 <div className="flex-1 bg-primary/40 rounded-t h-[65%] relative group">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">3-5 Rides</div>
                    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">Commuter</div>
                 </div>
                 <div className="flex-1 bg-primary/80 rounded-t h-[85%] relative group">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">6+ Rides</div>
                    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">Intensive</div>
                 </div>
                 <div className="flex-1 bg-rose-500/60 rounded-t h-[25%] relative group">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">15+ Rides</div>
                    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-rose-500">Abusive</div>
                 </div>
              </CardContent>
              <CardFooter className="pt-8 pb-4">
                <p className="text-xs text-muted-foreground font-medium">Warning: 13% of Daily Pass holders exhibit shared-ticket behavior.</p>
              </CardFooter>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" />
                  High-Intensity Ticket Routes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                 {[
                   { route: "Downtown - Science Plaza", usage: "4.2K", intensity: "High" },
                   { route: "Airport Express", usage: "3.8K", intensity: "Medium" },
                   { route: "Campus Loop", usage: "2.1K", intensity: "Low" },
                 ].map((r, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                      <span className="text-sm font-semibold">{r.route}</span>
                      <div className="flex items-center gap-3">
                         <span className="text-sm font-mono font-bold">{r.usage}</span>
                         <Badge variant="ghost" className={`text-[10px] font-bold ${r.intensity === 'High' ? 'text-rose-500' : 'text-emerald-500'}`}>{r.intensity}</Badge>
                      </div>
                   </div>
                 ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 2. Create / Edit Ticket Panel (Right 4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-border shadow-md bg-card sticky top-24">
            <CardHeader className="border-b border-border bg-muted/20">
              <CardTitle className="text-lg font-bold">Configure OneTicket</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Everything is unlimited; focus on validity and cost.</CardDescription>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-350px)]">
              <CardContent className="pt-6 space-y-8 pb-10">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">OneTicket Details</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Ticket Name</Label>
                    <Input placeholder="e.g., Weekly Unlimited" className="h-10 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">One-Time Price (₦)</Label>
                    <Input type="number" placeholder="7500" className="h-10 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Validity Period (Days)</Label>
                    <Input type="number" placeholder="7" className="h-10 border-border" />
                  </div>
                </div>

                <Separator />

                {/* Unlimited System */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <ZapOff className="h-4 w-4" />
                    <span className="text-xs font-semibold">Unlimited Mode Active</span>
                  </div>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                     <p className="text-[11px] text-emerald-700 font-medium">This ticket provides unrestricted access to all routes for the duration of its validity. No credit tracking required.</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-sm font-semibold">Restrict to Daily Pilot</Label>
                        <p className="text-[10px] text-muted-foreground">Limit total users who can hold this ticket.</p>
                     </div>
                     <Switch />
                  </div>
                </div>

                <Separator />

                {/* Peak Control - Simplified */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-muted-foreground">Operational Guardrails</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Peak Hour Cooldown (Mins)</Label>
                    <Input type="number" defaultValue="15" className="h-10 border-border" />
                    <p className="text-[10px] text-muted-foreground">Minimum time between boarding during peak hours.</p>
                  </div>
                </div>
              </CardContent>
            </ScrollArea>
            <CardFooter className="border-t border-border bg-muted/20 p-6 grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full h-11 font-semibold text-sm border-border">Preview</Button>
              <Button className="w-full h-11 font-semibold text-sm bg-primary shadow-sm">Activate Ticket</Button>
            </CardFooter>
          </Card>
        </div>

        {/* 4. Revenue vs Cost Analysis & Profitability Engine (Full Width 12/12) */}
        <div className="lg:col-span-12">
          <Card className="border-border bg-zinc-950 text-white shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
             <CardHeader className="border-b border-zinc-800">
                <CardTitle className="text-xl font-bold text-primary">Unlimited Profitability Engine</CardTitle>
                <CardDescription className="text-zinc-400">Balancing OneTicket revenue against high-frequency operational costs.</CardDescription>
             </CardHeader>
             <CardContent className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                   <MetricBlock label="Revenue per Ticket" value="₦18,400" subText="Blended average" />
                   <MetricBlock label="Marginal Cost / Ride" value="₦380" subText="Fleet energy + Wear" />
                   <MetricBlock label="Breakeven Rides" value="48.4" subText="Rides required for ROI" />
                   <MetricBlock label="Utilization Rate" value="72.1%" subText="Current fleet capacity" color="text-emerald-500" />
                </div>

                <div className="mt-12 h-64 flex items-end gap-8 px-4">
                   {oneTicketPlans.map((plan, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-4">
                        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-t-lg relative group overflow-hidden">
                           <div 
                             className={`absolute bottom-0 left-0 right-0 ${plan.avgRides > 20 ? 'bg-rose-500/60' : 'bg-primary/60'}`} 
                             style={{ height: `${Math.min(plan.avgRides * 4, 100)}%` }} 
                           />
                           <div className="h-48 w-full flex items-center justify-center relative z-10">
                              <span className="text-xl font-bold">{plan.avgRides}</span>
                           </div>
                        </div>
                        <span className="text-xs font-semibold text-zinc-500">{plan.name}</span>
                     </div>
                   ))}
                </div>
             </CardContent>
             <CardFooter className="bg-zinc-900/50 border-t border-zinc-800 p-6 flex justify-between items-center">
                <div className="flex gap-4">
                   <Button variant="ghost" className="text-zinc-400 hover:text-white text-xs font-semibold">Adjust Pass Price</Button>
                   <Button variant="ghost" className="text-zinc-400 hover:text-white text-xs font-semibold">Audit High-Users</Button>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-zinc-950 font-bold text-sm h-10 px-8">Optimize Yield Model</Button>
             </CardFooter>
          </Card>
        </div>

        {/* 5. Fraud & Abuse Monitoring */}
        <div className="lg:col-span-12">
          <Card className="border-rose-500/20 bg-rose-500/[0.02] shadow-sm">
             <CardHeader className="border-b border-rose-500/10 flex flex-row items-center justify-between py-6">
                <div>
                   <CardTitle className="text-xl font-bold text-rose-600 flex items-center gap-3">
                      <ShieldAlert className="h-6 w-6" />
                      OneTicket Integrity Control
                   </CardTitle>
                   <CardDescription className="text-rose-950/60 font-medium italic">Detecting ticket sharing and impossible usage patterns in the unlimited model.</CardDescription>
                </div>
                <Badge className="bg-rose-600 text-white border-none font-semibold text-xs px-4 h-8">Abuse Detected</Badge>
             </CardHeader>
             <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                   <div className="lg:col-span-2 border-r border-rose-500/10">
                      <table className="w-full text-sm">
                        <thead className="bg-rose-50 text-rose-900/50 border-b border-rose-500/10">
                          <tr>
                            <th className="px-6 py-3 text-left font-semibold text-xs">Suspicious User</th>
                            <th className="px-6 py-3 text-left font-semibold text-xs">Rides (Today)</th>
                            <th className="px-6 py-3 text-left font-semibold text-xs">Behavior Pattern</th>
                            <th className="px-6 py-3 text-left font-semibold text-xs">Integrity Score</th>
                            <th className="px-6 py-3 text-right font-semibold text-xs">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-rose-500/10">
                          {suspiciousUsers.map((user, idx) => (
                            <tr key={idx} className="hover:bg-rose-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                   <p className="font-semibold text-rose-950">{user.name}</p>
                                   <p className="text-[10px] font-mono text-rose-500/70">{user.id}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-bold text-rose-600">{user.ridesToday}</td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className="text-[10px] font-semibold border-rose-200 text-rose-600 bg-rose-50/50">{user.pattern}</Badge>
                              </td>
                              <td className="px-6 py-4 text-xs font-medium italic text-rose-900/70">{user.deviceSwitch}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-100"><Ban className="h-4 w-4" /></Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-100"><Flag className="h-4 w-4" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                   <div className="p-6 space-y-6 bg-rose-50/20">
                      <p className="text-xs font-semibold text-rose-900/40">Integrity Violation Feed</p>
                      <div className="space-y-4">
                         <AlertBlock text="USR-9921: Boarded 2 separate buses in different zones within 5 mins." time="2m ago" />
                         <AlertBlock text="USR-4402: Ticket scanned on 3 different IMEI devices today." time="14m ago" />
                         <AlertBlock text="Possible Ticket Sharing: USR-1205 usage exceeds humanly possible commute." time="22m ago" />
                      </div>
                      <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-10 shadow-md">
                         Freeze All Flagged Tickets
                      </Button>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

function KPICard({ title, value, icon, trend, trendType }: { title: string, value: string, icon: React.ReactNode, trend: string, trendType: 'up' | 'down' }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-primary/70">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${trendType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendType === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend}
        </p>
      </CardContent>
    </Card>
  )
}

function MetricBlock({ label, value, subText, color = "text-primary" }: { label: string, value: string, subText: string, color?: string }) {
  return (
    <div className="space-y-2 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
       <p className="text-xs font-semibold text-zinc-500">{label}</p>
       <p className={`text-2xl font-bold ${color}`}>{value}</p>
       <p className="text-xs font-medium text-zinc-400 italic">{subText}</p>
    </div>
  )
}

function AlertBlock({ text, time }: { text: string, time: string }) {
  return (
    <div className="p-3 bg-white border border-rose-100 rounded shadow-sm space-y-1">
       <div className="flex justify-between items-center">
          <span className="text-[10px] font-semibold text-rose-600 uppercase">Integrity Alert</span>
          <span className="text-[10px] text-muted-foreground font-medium italic">{time}</span>
       </div>
       <p className="text-sm font-semibold text-rose-950 leading-tight">{text}</p>
    </div>
  )
}
