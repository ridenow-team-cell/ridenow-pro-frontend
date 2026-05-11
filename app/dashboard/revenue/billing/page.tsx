"use client"

import * as React from "react"
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCcw, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  Settings
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const billingOverview = [
  { label: "Successful Payments", value: "1,240", status: "success", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Failed Payments", value: "24", status: "failed", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
  { label: "Pending Renewals", value: "85", status: "pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Auto-Renewal Rate", value: "92%", status: "neutral", icon: RefreshCcw, color: "text-blue-600", bg: "bg-blue-50" },
]

export default function BillingEnginePage() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Billing Engine
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage subscription payments and renewal logic.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 border-border">
            Payment Logs
          </Button>
          <Button size="sm" className="h-9 px-4 font-semibold">
            Configure Rules
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {billingOverview.map((item) => (
          <Card key={item.label} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</CardTitle>
              <div className={`h-8 w-8 rounded flex items-center justify-center ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold">Recent Billing Activity</CardTitle>
            <CardDescription className="text-xs">Real-time stream of subscription payment events.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { user: "Sarah Connor", plan: "Monthly Elite", amount: "$45.00", date: "2 mins ago", status: "Success" },
                { user: "John Wick", plan: "Daily Commuter", amount: "$5.00", date: "15 mins ago", status: "Success" },
                { user: "Ellen Ripley", plan: "Corporate Pass", amount: "$250.00", date: "45 mins ago", status: "Failed", error: "Insufficient Funds" },
                { user: "Marty McFly", plan: "Weekly Student", amount: "$15.00", date: "1 hour ago", status: "Success" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded flex items-center justify-center ${activity.status === "Success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {activity.status === "Success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{activity.user}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{activity.plan} • {activity.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.status === "Success" ? "outline" : "destructive"} className={`text-[9px] font-bold h-4 border-none ${activity.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : ''}`}>
                      {activity.status.toUpperCase()}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-transparent">
                View Full Activity Log <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Billing Logic & Rules</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">Configured automation for subscription lifecycle.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-muted-foreground">Grace Period</span>
                <Badge variant="secondary" className="font-bold text-[10px]">3 DAYS</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Subscriptions remain active for 3 days after a failed payment.</p>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%]" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-muted-foreground">Retry Strategy</span>
                <Badge variant="secondary" className="font-bold text-[10px]">3 ATTEMPTS / 48H</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Automated retries using exponential backoff logic.</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 space-y-2">
               <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Active Warning</span>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">12 users are currently in the grace period. Escalation emails sent.</p>
               <Button variant="link" className="p-0 h-auto text-xs text-amber-700 font-bold hover:no-underline">Manage At-Risk Users</Button>
            </div>

            <div className="pt-2">
               <div className="flex items-center gap-3 p-3 border border-border bg-muted/20">
                  <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                     <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                     <p className="text-xs font-bold">Payment Integrity</p>
                     <p className="text-[10px] text-muted-foreground font-medium">All gateways operational. 0.2% latency.</p>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
