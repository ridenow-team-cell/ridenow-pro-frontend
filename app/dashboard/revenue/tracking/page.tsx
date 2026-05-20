"use client"

import * as React from "react"
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  RefreshCw,
  FileText,
  PieChart,
  ArrowUpRight,
  Download,
  CreditCard,
  Target
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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { getRevenueAnalytics, type RevenueAnalytics } from "@/lib/api/analytics"

export default function RevenueTrackingPage() {
  const [data, setData] = React.useState<RevenueAnalytics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchRevenue = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getRevenueAnalytics()
      if (res.success && res.data) {
        setData(res.data)
      }
    } catch (err) {
      console.error("Failed to fetch revenue analytics:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchRevenue()
  }, [fetchRevenue])

  if (isLoading) {
    return <RevenueLoadingScreen />
  }

  const { summary, revenueTrend, revenueByPlan } = data!

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="space-y-7 pt-2 pb-12 px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">Financial Intelligence</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Revenue Tracking</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time oversight of collections, billing, and subscription performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs font-semibold gap-1.5 border-border/60">
            <Download className="h-3.5 w-3.5" /> Export Ledger
          </Button>
          <Button size="sm" className="h-9 text-xs font-bold gap-1.5 shadow-sm px-5 bg-primary hover:bg-primary/90">
            <RefreshCw className="h-3.5 w-3.5" /> Force Sync
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Weekly Revenue */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-primary opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{summary.weeklyRevenue.title}</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-all">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1.5">{formatCurrency(summary.weeklyRevenue.amount || 0)}</div>
            <div className="flex items-center gap-1.5">
              {summary.weeklyRevenue.change.type === "increase" ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-rose-500" />
              )}
              <span className={`text-xs font-bold ${summary.weeklyRevenue.change.type === "increase" ? 'text-emerald-600' : 'text-rose-600'}`}>
                {summary.weeklyRevenue.change.value}%
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">{summary.weeklyRevenue.change.label}</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Forecast */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-violet-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{summary.monthlyForecast.title}</p>
              <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 transition-all">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold tracking-tight leading-none">{summary.monthlyForecast.progress}%</span>
                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-tighter">{summary.monthlyForecast.status}</span>
              </div>
              <Progress value={summary.monthlyForecast.progress} className="h-1.5 bg-violet-500/10" />
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-sky-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{summary.transactions.title}</p>
              <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 transition-all">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1.5">{(summary.transactions.total || 0).toLocaleString()}</div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">{summary.transactions.period}</span>
            </div>
          </CardContent>
        </Card>

        {/* Settlements */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{summary.settlements.title}</p>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-all">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="text-[13px] font-bold tracking-tight mb-1">{summary.settlements.frequency} Frequency</div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 text-emerald-500 animate-spin-slow" />
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-tight">{summary.settlements.processing}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-8 border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base font-bold">{revenueTrend.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{revenueTrend.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Current Week
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={fetchRevenue}>
                <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="h-[340px] w-full px-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0066cc" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#0066cc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis
                    dataKey="day"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => v >= 1000 ? `₦${v / 1000}k` : `₦${v}`}
                    domain={[revenueTrend.yAxis.min, revenueTrend.yAxis.max]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 10px 30px -5px rgba(0,0,0,0.15)",
                      padding: "10px 14px"
                    }}
                    itemStyle={{ fontWeight: 800, color: "hsl(var(--primary))" }}
                    cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1.5, strokeDasharray: "4 4" }}
                    formatter={(val: number) => [formatCurrency(val), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0066cc"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    dot={{ r: 4, fill: "#0066cc", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-6 py-4 flex items-center justify-between bg-muted/5">
            <div className="flex gap-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Total Period</p>
                <p className="text-sm font-bold text-foreground">₦{revenueTrend.data.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Highest Peak</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(Math.max(...revenueTrend.data.map(d => d.revenue)))}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-bold gap-1.5 text-primary group h-8">
              View Detailed Ledger <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </CardFooter>
        </Card>

        {/* Revenue By Plan */}
        <Card className="lg:col-span-4 border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">{revenueByPlan.title}</CardTitle>
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest px-2 py-0 h-5 border-border/60">
                {revenueByPlan.activeFilter}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{revenueByPlan.description}</p>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {revenueByPlan.data.length > 0 ? (
              revenueByPlan.data.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
                      <span className="text-sm font-bold tracking-tight">{item.plan}</span>
                    </div>
                    <span className="text-xs font-mono font-bold">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full rounded-full transition-all duration-1000 ${item.color}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>{item.percentage}% Contribution</span>
                    <span>₦{(item.revenue / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <PieChart className="h-10 w-10 mb-3 text-muted-foreground/50" />
                <p className="text-xs font-bold uppercase tracking-widest">No segmentation data</p>
                <p className="text-[10px] mt-1">Check billing engine sync status</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 border-t border-border/40 bg-muted/10">
            <Button variant="outline" className="w-full h-9 text-xs font-bold gap-2 border-border/60 hover:bg-primary hover:text-white transition-all group">
              Manage Pricing Tiers <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function RevenueLoadingScreen() {
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
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Calculating Revenue Yields</span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">Accessing financial ledgers & subscription data...</p>
        </div>
      </div>
    </div>
  )
}
