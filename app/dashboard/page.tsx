"use client"

import * as React from "react"
import {
  ArrowRight,
  Bus,
  Plus,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Route,
  DollarSign,
  MoreHorizontal,
  Download,
  RefreshCw,
  ChevronUp,
} from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const chartData = [
  { day: "Mon", revenue: 4500, users: 120 },
  { day: "Tue", revenue: 5200, users: 150 },
  { day: "Wed", revenue: 4800, users: 140 },
  { day: "Thu", revenue: 6100, users: 190 },
  { day: "Fri", revenue: 5900, users: 180 },
  { day: "Sat", revenue: 7200, users: 230 },
  { day: "Sun", revenue: 8500, users: 280 },
]

const recentRegistrations = [
  { name: "Thomas Anderson", role: "Passenger", id: "USR-4021", time: "2m ago", status: "Verified", color: "bg-violet-500" },
  { name: "Sarah Jenkins", role: "Driver", id: "DRV-9021", time: "15m ago", status: "Staged", color: "bg-sky-500" },
  { name: "Trinity Moss", role: "Passenger", id: "USR-4022", time: "42m ago", status: "Verified", color: "bg-pink-500" },
  { name: "Marcus Miller", role: "Driver", id: "DRV-9022", time: "1h ago", status: "Verified", color: "bg-emerald-500" },
  { name: "Elena Gilbert", role: "Passenger", id: "USR-8821", time: "3h ago", status: "Pending", color: "bg-amber-500" },
]

const risks = [
  { label: "Impossible Frequency", route: "RT-12", risk: "Critical", time: "2m ago" },
  { label: "Failed Payment Batch", route: "Elite", risk: "High", time: "14m ago" },
  { label: "GPS Drop Detected", route: "EV-902", risk: "Medium", time: "22m ago" },
]

const systemHealth = [
  { label: "Route RT-402", status: "Normal", value: 92, color: "bg-emerald-500", textColor: "text-emerald-600" },
  { label: "GPS Gateway", status: "Latency", value: 45, color: "bg-amber-500", textColor: "text-amber-600" },
  { label: "Boarding Server", status: "Stable", value: 88, color: "bg-emerald-500", textColor: "text-emerald-600" },
  { label: "Payment Engine", status: "Normal", value: 96, color: "bg-emerald-500", textColor: "text-emerald-600" },
]

import { Skeleton } from "@/components/ui/skeleton"
import { getDashboardAnalytics, type DashboardAnalytics } from "@/lib/api/analytics"

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardAnalytics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchAnalytics = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getDashboardAnalytics()
      if (res.success && res.data) {
        setData(res.data)
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const analytics = data?.analytics
  const chartData = analytics?.chart || []
  const recentRegistrations = analytics?.registrations.data || []
  const revenueTotal = analytics?.revenueTotal || 0
  const formattedRevenue = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(revenueTotal)

  return (
    <div className="space-y-7 pt-2 pb-12 px-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">Command Center</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operational Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Live fleet performance, revenue oversight, and identity acquisition.</p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Revenue (Total)"
          value={formattedRevenue}
          change="+12.5%"
          changeLabel="vs last month"
          up
          icon={<DollarSign className="h-4 w-4" />}
          accent="from-primary/20 to-primary/5"
          data={chartData.map(d => d.revenue)}
        />
        <KPICard
          title="New Users"
          value={(analytics?.newUsers || 0).toLocaleString()}
          change="+8.2%"
          changeLabel="Total registrations"
          up
          icon={<Users className="h-4 w-4" />}
          accent="from-violet-500/20 to-violet-500/5"
          data={chartData.map(d => d.users)}
          color="#8b5cf6"
        />
        <KPICard
          title="Fleet Utilization"
          value="84%"
          change="+2.4%"
          changeLabel="42 / 50 active"
          up
          icon={<Bus className="h-4 w-4" />}
          accent="from-sky-500/20 to-sky-500/5"
          data={[70, 75, 72, 80, 82, 84, 84]}
          color="#0ea5e9"
        />
        <KPICard
          title="Avg Trip Duration"
          value="24.5m"
          change="-1.2m"
          changeLabel="improving trend"
          up
          icon={<Activity className="h-4 w-4" />}
          accent="from-emerald-500/20 to-emerald-500/5"
          data={[30, 28, 27, 26, 25, 24, 24]}
          color="#10b981"
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid gap-5 lg:grid-cols-12">

        {/* Performance Chart */}
        <Card className="lg:col-span-8 border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base font-bold">Performance Analytics</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Revenue & user growth — last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold"><span className="h-2.5 w-2.5 rounded-sm bg-primary inline-block" />Revenue</span>
                <span className="flex items-center gap-1.5 font-semibold text-muted-foreground"><span className="h-2.5 w-2.5 rounded-sm bg-violet-500 inline-block" />Users</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={fetchAnalytics}>
                <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="h-[280px] w-full px-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0066cc" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#0066cc" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="day" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => v >= 1000 ? `₦${v / 1000}k` : v} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "10px", fontSize: "12px", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }}
                    itemStyle={{ fontWeight: 700 }}
                    cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1.5 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0066cc" strokeWidth={2.5} fill="url(#gRevenue)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gUsers)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 px-6 py-3 flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total Revenue</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{formattedRevenue}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Registrations</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{(analytics?.registrations.total || 0).toLocaleString()}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Peak Day</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{analytics?.peakDay || "..."}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-bold gap-1 text-primary h-8" asChild>
              <Link href="/dashboard/reports">
                Deep Audit <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Registrations */}
        <Card className="lg:col-span-4 border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Recent Registrations</CardTitle>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Live</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Latest identities onboarded to the platform.</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((reg, idx) => {
                  const initials = reg.fullName
                    ? reg.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : "?"

                  return (
                    <div key={reg.id || idx} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-border/60 group-hover:border-primary/40 transition-colors shrink-0">
                          <AvatarFallback className={`${reg.avatarColor || 'bg-slate-500'} text-white text-[10px] font-bold`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold leading-tight">{reg.fullName || "Unknown User"}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${reg.role === 'admin' ? 'bg-rose-500/10 text-rose-700' : 'bg-violet-500/10 text-violet-700'}`}>
                              {reg.role}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">{reg.id ? `${reg.id.substring(0, 8)}...` : "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {reg.createdAt ? new Date(reg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                        </p>
                        <Badge
                          className={`text-[9px] font-bold border-none px-2 h-4 mt-1 ${reg.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-700' :
                            reg.status === 'Pending' ? 'bg-amber-500/10 text-amber-700' :
                              'bg-slate-500/10 text-slate-600'
                            }`}
                        >
                          {reg.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <Users className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs font-medium text-muted-foreground">No recent registrations</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t border-border/40 bg-muted/10">
            <Button variant="outline" asChild className="w-full h-9 text-xs font-bold border-border/60 hover:bg-primary hover:text-white transition-all">
              <Link href="/dashboard/users" className="flex items-center gap-2">
                View Identity Base <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Bottom Row */}
        <div className="lg:col-span-12 grid gap-5 md:grid-cols-3">

          {/* System Health */}
          <Card className="border-border/60 shadow-sm bg-card/80">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <CardTitle className="text-sm font-bold">System Health</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {[
                { label: "Route RT-402", status: "Normal", value: 92, color: "bg-emerald-500", textColor: "text-emerald-600" },
                { label: "GPS Gateway", status: "Latency", value: 45, color: "bg-amber-500", textColor: "text-amber-600" },
                { label: "Boarding Server", status: "Stable", value: 88, color: "bg-emerald-500", textColor: "text-emerald-600" },
                { label: "Payment Engine", status: "Normal", value: 96, color: "bg-emerald-500", textColor: "text-emerald-600" },
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-foreground">{item.label}</span>
                    <span className={`text-[10px] font-bold ${item.textColor}`}>{item.status}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>


          {/* Quick Deployment */}
          <Card className="border-border/60 bg-zinc-950 text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-violet-600/10 pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <CardHeader className="border-b border-white/10 relative z-10 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
                <CardTitle className="text-sm font-bold text-white">Quick Deployment</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-3 relative z-10">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded-xl px-3 py-2.5 text-[11px] font-bold text-white">
                  <Plus className="h-3.5 w-3.5" /> New Driver
                </button>
                <button className="flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded-xl px-3 py-2.5 text-[11px] font-bold text-white">
                  <Bus className="h-3.5 w-3.5" /> New Fleet
                </button>
                <button className="flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded-xl px-3 py-2.5 text-[11px] font-bold text-white">
                  <Route className="h-3.5 w-3.5" /> New Route
                </button>
                <button className="flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded-xl px-3 py-2.5 text-[11px] font-bold text-white">
                  <UserCheck className="h-3.5 w-3.5" /> New Operator
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl py-2.5 transition-all shadow-lg shadow-primary/20">
                <Zap className="h-4 w-4" /> Go to Commmand Center
              </button>
            </CardContent>
            <CardFooter className="relative z-10 border-t border-white/10 pt-3 pb-4">
              <p className="text-[10px] text-white/30 font-medium">Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/60 text-[10px]">⌘ D</kbd> to toggle dark mode</p>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src="/logo.png"
            alt="RydeNow Logo"
            className="h-24 w-auto object-contain animate-breathing"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Synchronizing Intelligence</span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">Preparing your operational command center...</p>
        </div>
      </div>
    </div>
  )
}

function KPICard({ title, value, change, changeLabel, up, icon, accent, data, color = "#0066cc" }: {
  title: string; value: string; change: string; changeLabel: string; up: boolean;
  icon: React.ReactNode; accent: string; data: number[]; color?: string
}) {
  return (
    <Card className="border-border/60 bg-card/80 shadow-sm hover:shadow-md transition-all overflow-hidden relative group cursor-default">
      {/* Background micro chart */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-[0.15] pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.map((v, i) => ({ v, i }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={color} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Accent gradient top strip */}
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent} opacity-80`} />
      <CardContent className="pt-5 pb-5 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shrink-0">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight mb-1.5">{value}</div>
        <div className="flex items-center gap-1.5">
          {up
            ? <TrendingUp className="h-3 w-3 text-emerald-500 shrink-0" />
            : <TrendingDown className="h-3 w-3 text-rose-500 shrink-0" />
          }
          <span className={`text-xs font-bold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>{change}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}
