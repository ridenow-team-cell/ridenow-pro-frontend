"use client"

import * as React from "react"
import { 
  Download, 
  Filter, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar,
  DollarSign,
  BarChart as BarChartIcon
} from "lucide-react"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie,
  CartesianGrid,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const revenueData = [
  { name: "Mon", revenue: 4500 },
  { name: "Tue", revenue: 5200 },
  { name: "Wed", revenue: 4800 },
  { name: "Thu", revenue: 6100 },
  { name: "Fri", revenue: 5900 },
  { name: "Sat", revenue: 7200 },
  { name: "Sun", revenue: 8500 },
]

const planData = [
  { name: "Daily", value: 35, color: "hsl(var(--primary))" },
  { name: "Weekly", value: 25, color: "hsl(var(--muted-foreground))" },
  { name: "Monthly", value: 40, color: "hsl(var(--secondary))" },
]

export default function RevenueTrackingPage() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Revenue Tracking
          </h1>
          <p className="text-sm text-muted-foreground">
            Detailed analysis of subscription-based revenue flow.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 border-border">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            Filters
          </Button>
          <Button size="sm" className="h-9 px-4 font-semibold">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start h-11 bg-muted p-1 border border-border rounded-md mb-6">
          <TabsTrigger value="overview" className="flex-1 text-xs font-semibold uppercase tracking-wider">Overview</TabsTrigger>
          <TabsTrigger value="plans" className="flex-1 text-xs font-semibold uppercase tracking-wider">By Plan</TabsTrigger>
          <TabsTrigger value="segments" className="flex-1 text-xs font-semibold uppercase tracking-wider">By Segment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-2">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Weekly Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">$42,200</div>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +8.2% <span className="text-muted-foreground font-medium ml-1">vs last week</span>
                  </p>
                </CardContent>
             </Card>
             <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monthly Forecast</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">$185,000</div>
                  <p className="text-[10px] text-primary font-bold mt-1">On track for Q2 goals</p>
                </CardContent>
             </Card>
             <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transactions</CardTitle>
                  <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">1,240</div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">Last 7 days</p>
                </CardContent>
             </Card>
             <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Settlements</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">Daily</div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">Automatic processing</p>
                </CardContent>
             </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-bold">Revenue Trend</CardTitle>
                <CardDescription className="text-xs">Daily revenue fluctuations for the current week.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "4px" }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        cursor={{fill: 'hsl(var(--muted))', opacity: 0.4}}
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-bold">Revenue by Plan</CardTitle>
                <CardDescription className="text-xs">Distribution across different subscription tiers.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {planData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
