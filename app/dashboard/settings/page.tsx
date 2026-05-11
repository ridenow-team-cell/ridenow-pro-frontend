"use client"

import * as React from "react"
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Key, 
  Webhook, 
  Database,
  UserCheck,
  Smartphone,
  Mail,
  ChevronRight,
  Plus,
  Save,
  Palette,
  Layout,
  RefreshCw,
  Clock,
  Percent,
  Calendar,
  Phone,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Gauge,
  Ticket
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            System Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure enterprise parameters, operational rules, and legal frameworks.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 border-border hover:bg-muted">
            <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />
            Restore Defaults
          </Button>
          <Button size="sm" className="h-9 px-4 font-semibold shadow-lg shadow-primary/20">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="w-full justify-start h-11 bg-muted p-1 border border-border rounded-md mb-6">
          <TabsTrigger value="operations" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="support-legal" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <FileText className="h-3.5 w-3.5" />
            Support & Legal
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <Bell className="h-3.5 w-3.5" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="api" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <Webhook className="h-3.5 w-3.5" />
            API
          </TabsTrigger>
        </TabsList>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Percent className="h-4 w-4 text-primary" />
                      Cancellation Policy
                    </CardTitle>
                    <CardDescription className="text-xs">Define fees and time windows for trip cancellations.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cancellation Fee (%)</Label>
                       <div className="relative">
                          <Input type="number" defaultValue="15" className="h-10 border-border font-medium pr-10" />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                             <span className="text-sm font-bold text-muted-foreground">%</span>
                          </div>
                       </div>
                       <p className="text-[10px] text-muted-foreground">The percentage of the trip credit deducted upon cancellation.</p>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cancellation Window (Hrs)</Label>
                       <div className="relative">
                          <Input type="number" defaultValue="2" className="h-10 border-border font-medium pr-10" />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                             <span className="text-sm font-bold text-muted-foreground">hrs</span>
                          </div>
                       </div>
                       <p className="text-[10px] text-muted-foreground">Free cancellation is only allowed outside this time window.</p>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Opening Hours & Days
                    </CardTitle>
                    <CardDescription className="text-xs">Set the operational availability of the fleet.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Daily Start Time</Label>
                        <Input type="time" defaultValue="06:00" className="h-10 border-border font-medium" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Daily End Time</Label>
                        <Input type="time" defaultValue="23:30" className="h-10 border-border font-medium" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operating Days</Label>
                       <div className="flex flex-wrap gap-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                             <Badge 
                                key={day} 
                                variant={day === 'Sun' ? 'outline' : 'secondary'} 
                                className={`h-8 px-3 cursor-pointer border-border font-bold text-[10px] uppercase transition-all ${
                                  day !== 'Sun' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground'
                                }`}
                             >
                                {day}
                             </Badge>
                          ))}
                       </div>
                    </div>
                 </CardContent>
              </Card>
              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-primary" />
                      Fleet Quotas & Safety
                    </CardTitle>
                    <CardDescription className="text-xs">Configure system-wide speed limits and trip allowances.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global Speed Limit (km/h)</Label>
                       <div className="relative">
                          <Input type="number" defaultValue="80" className="h-10 border-border font-medium pr-14" />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                             <span className="text-[10px] font-bold text-muted-foreground uppercase">km/h</span>
                          </div>
                       </div>
                       <p className="text-[10px] text-muted-foreground">Maximum allowable speed across the entire electric bus fleet.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Paid Trips / Day</Label>
                          <div className="relative">
                             <Input type="number" defaultValue="10" className="h-10 border-border font-medium pr-8" />
                             <Ticket className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-[10px] text-muted-foreground">Max paid trips per user/day.</p>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Free Trips / Day</Label>
                          <div className="relative">
                             <Input type="number" defaultValue="2" className="h-10 border-border font-medium pr-8" />
                             <Ticket className="absolute right-3 top-3 h-4 w-4 text-emerald-500/50" />
                          </div>
                          <p className="text-[10px] text-muted-foreground">Max free trips per user/day.</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Change Password
                    </CardTitle>
                    <CardDescription className="text-xs">Update your administrative credentials.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Password</Label>
                       <Input type="password" placeholder="••••••••" className="h-10 border-border" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">New Password</Label>
                       <Input type="password" placeholder="••••••••" className="h-10 border-border" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confirm New Password</Label>
                       <Input type="password" placeholder="••••••••" className="h-10 border-border" />
                    </div>
                    <Button className="w-full mt-2 font-bold uppercase text-[10px] tracking-widest h-10">Update Password</Button>
                 </CardContent>
              </Card>

              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold">Access Protocols</CardTitle>
                    <CardDescription className="text-xs">Advanced security and session controls.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border bg-muted/20 rounded-lg">
                       <div className="flex items-center gap-4">
                          <Key className="h-5 w-5 text-primary" />
                          <div>
                             <p className="text-sm font-bold">Two-Factor Auth</p>
                             <p className="text-[10px] text-muted-foreground">Enforce 2FA for all admins.</p>
                          </div>
                       </div>
                       <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border bg-muted/20 rounded-lg">
                       <div className="flex items-center gap-4 text-rose-600">
                          <Shield className="h-5 w-5" />
                          <div>
                             <p className="text-sm font-bold uppercase tracking-tight">Panic Mode</p>
                             <p className="text-[10px] font-medium">Kill all active sessions instantly.</p>
                          </div>
                       </div>
                       <Button size="sm" variant="destructive" className="h-8 font-black uppercase text-[10px] tracking-widest">ACTIVATE</Button>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        {/* Support & Legal Tab */}
        <TabsContent value="support-legal" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Support Details
                    </CardTitle>
                    <CardDescription className="text-xs">Manage how users contact your organization.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Support Hotline</Label>
                       <Input defaultValue="+1 (800) RIDE-NOW" className="h-10 border-border font-medium" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Support Email</Label>
                       <Input defaultValue="ops@ridenow.pro" className="h-10 border-border font-medium" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Help Center URL</Label>
                       <Input defaultValue="https://help.ridenow.pro" className="h-10 border-border font-medium" />
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Legal & Terms
                    </CardTitle>
                    <CardDescription className="text-xs">Manage public legal documentation.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Terms of Service URL</Label>
                       <Input defaultValue="https://ridenow.pro/legal/terms" className="h-10 border-border font-medium" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Privacy Policy URL</Label>
                       <Input defaultValue="https://ridenow.pro/legal/privacy" className="h-10 border-border font-medium" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Updated</Label>
                       <p className="text-sm font-bold py-2">May 01, 2026</p>
                    </div>
                    <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest h-10 border-border">Update Legal Archive</Button>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
           <Card className="border-border bg-card">
              <CardHeader>
                 <CardTitle className="text-base font-bold">Notification Matrix</CardTitle>
                 <CardDescription className="text-xs">Configure how the system communicates critical events.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground border-y border-border">
                       <tr>
                          <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Event Category</th>
                          <th className="px-6 py-3 text-center font-bold uppercase text-[9px] tracking-wider">Dashboard</th>
                          <th className="px-6 py-3 text-center font-bold uppercase text-[9px] tracking-wider">Email</th>
                          <th className="px-6 py-3 text-center font-bold uppercase text-[9px] tracking-wider">Push</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {[
                          { category: "Fraud Alerts", dashboard: true, email: true, push: true },
                          { category: "Revenue Milestones", dashboard: true, email: false, push: false },
                          { category: "System Latency", dashboard: true, email: true, push: true },
                          { category: "New Subscriber", dashboard: true, email: false, push: false },
                       ].map((row, i) => (
                          <tr key={i} className="hover:bg-muted/30">
                             <td className="px-6 py-4 font-bold text-xs">{row.category}</td>
                             <td className="px-6 py-4 text-center"><Switch defaultChecked={row.dashboard} className="scale-75" /></td>
                             <td className="px-6 py-4 text-center"><Switch defaultChecked={row.email} className="scale-75" /></td>
                             <td className="px-6 py-4 text-center"><Switch defaultChecked={row.push} className="scale-75" /></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </CardContent>
           </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold">Active API Keys</CardTitle>
                    <CardDescription className="text-xs">Credentials for external service integrations.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                    {[
                       { name: "Fleet Monitoring API", key: "sk_live_....4f21", status: "Active" },
                       { name: "Stripe Production", key: "pk_live_....99a2", status: "Active" },
                    ].map((key, i) => (
                       <div key={i} className="p-3 border border-border bg-muted/20 flex items-center justify-between">
                          <div className="space-y-1">
                             <p className="text-xs font-bold">{key.name}</p>
                             <p className="text-[10px] font-mono text-muted-foreground">{key.key}</p>
                          </div>
                          <Badge variant="outline" className="text-[9px] font-bold border-none bg-emerald-50 text-emerald-700">{key.status}</Badge>
                       </div>
                    ))}
                    <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest h-9 border-dashed border-border">
                       <Plus className="mr-2 h-3.5 w-3.5" /> Generate New Key
                    </Button>
                 </CardContent>
              </Card>

              <Card className="border-border bg-card">
                 <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-base font-bold">Webhooks</CardTitle>
                    <CardDescription className="text-xs">Outbound event notification endpoints.</CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Endpoint URL</Label>
                       <div className="flex gap-2">
                          <Input defaultValue="https://analytics.external-tool.com/webhook" className="h-10 border-border text-xs" />
                          <Button size="sm" variant="secondary" className="h-10 px-4">Test</Button>
                       </div>
                    </div>
                    <div className="pt-2">
                       <div className="p-3 border border-border bg-primary/5 space-y-1">
                          <div className="flex items-center gap-2 text-primary">
                             <Database className="h-4 w-4" />
                             <span className="text-xs font-bold uppercase">DB Sync Status</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-medium">Last synced: 4 mins ago. Latency: 42ms.</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
