"use client"

import * as React from "react"
import { 
  Settings, 
  Clock, 
  Map as MapIcon, 
  Bell, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Save, 
  RefreshCcw,
  Globe,
  Database,
  Lock,
  Cpu,
  Monitor
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OperationsSettingsPage() {
  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <Settings className="h-7 w-7 text-primary" /> Operations Settings
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Configure command protocols, map intelligence, and dispatch parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" className="h-10 px-4 border-border font-semibold text-xs uppercase tracking-wider">
              <RefreshCcw className="mr-2 h-4 w-4" /> Reset Defaults
           </Button>
           <Button size="sm" className="h-10 px-6 font-semibold text-xs uppercase tracking-wider brand-gradient text-white shadow-lg shadow-primary/20">
              <Save className="mr-2 h-4 w-4" /> Save Configuration
           </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
         <TabsList className="h-12 bg-muted/50 p-1 border border-border/50">
            <TabsTrigger value="general" className="px-6 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
               <Globe className="h-3.5 w-3.5" /> General
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="px-6 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
               <Monitor className="h-3.5 w-3.5" /> Intelligence & Map
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-6 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
               <Bell className="h-3.5 w-3.5" /> Alerts & Comms
            </TabsTrigger>
            <TabsTrigger value="security" className="px-6 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
               <Lock className="h-3.5 w-3.5" /> Protocols
            </TabsTrigger>
         </TabsList>

         <TabsContent value="general" className="pt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
               <Card className="border-border shadow-md">
                  <CardHeader>
                     <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" /> Operational Hours
                     </CardTitle>
                     <CardDescription className="text-xs">Define when the command center is active for automated dispatch.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">24/7 Operations</Label>
                        <Switch defaultChecked />
                     </div>
                     <Separator />
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase text-muted-foreground">Opening Hour</Label>
                           <Input type="time" defaultValue="06:00" className="h-10 border-border" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase text-muted-foreground">Closing Hour</Label>
                           <Input type="time" defaultValue="23:00" className="h-10 border-border" />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-border shadow-md">
                  <CardHeader>
                     <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" /> Dispatch Parameters
                     </CardTitle>
                     <CardDescription className="text-xs">Configure auto-dispatch logic and thresholds.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label className="text-xs font-semibold">Auto-Assignment Radius (km)</Label>
                        <Input type="number" defaultValue="5" className="h-10 border-border" />
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                           <Label className="text-xs font-semibold">Enable AI Rerouting</Label>
                           <p className="text-[10px] text-muted-foreground">Automatically suggest routes based on traffic.</p>
                        </div>
                        <Switch defaultChecked />
                     </div>
                  </CardContent>
               </Card>
            </div>
         </TabsContent>

         <TabsContent value="intelligence" className="pt-6 space-y-6">
            <Card className="border-border shadow-md">
               <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Map Visualizer Config</CardTitle>
                  <CardDescription className="text-xs">Adjust how tactical data is displayed on the live map.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                     <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
                        <div className="space-y-0.5">
                           <Label className="text-xs font-semibold">Live Demand Heatmap</Label>
                           <p className="text-[10px] text-muted-foreground">Toggle geographic demand clusters.</p>
                        </div>
                        <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
                        <div className="space-y-0.5">
                           <Label className="text-xs font-semibold">Traffic Density Overlay</Label>
                           <p className="text-[10px] text-muted-foreground">Show real-time traffic flow lines.</p>
                        </div>
                        <Switch />
                     </div>
                     <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
                        <div className="space-y-0.5">
                           <Label className="text-xs font-semibold">Unit Telemetry Labels</Label>
                           <p className="text-[10px] text-muted-foreground">Always show ID and ETA on markers.</p>
                        </div>
                        <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
                        <div className="space-y-0.5">
                           <Label className="text-xs font-semibold">Satellite Base Layer</Label>
                           <p className="text-[10px] text-muted-foreground">High-fidelity geographic imagery.</p>
                        </div>
                        <Switch />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </TabsContent>

         <TabsContent value="notifications" className="pt-6 space-y-6">
            <Card className="border-border shadow-md">
               <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Critical Alerts & Escalations</CardTitle>
                  <CardDescription className="text-xs">Manage how the command center responds to high-urgency events.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  {[
                     { label: "SOS/Emergency Alerts", desc: "Instant audio and visual takeover for life-safety events.", urgent: true },
                     { label: "Vehicle Breakdown", desc: "Notification for mechanical failure or power loss.", urgent: false },
                     { label: "Significant Delay (>15m)", desc: "Alert when a trip deviates from ETA threshold.", urgent: false },
                     { label: "Unauthorized Stop", desc: "Flag when a driver stops outside virtual hubs.", urgent: false }
                  ].map((alert, i) => (
                     <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
                        <div className="space-y-0.5">
                           <Label className={`text-sm font-bold ${alert.urgent ? 'text-rose-600' : ''}`}>{alert.label}</Label>
                           <p className="text-[10px] text-muted-foreground">{alert.desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <Select defaultValue="all">
                              <SelectTrigger className="w-[100px] h-8 text-[10px] border-border">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="all">Push + SMS</SelectItem>
                                 <SelectItem value="push">Push Only</SelectItem>
                                 <SelectItem value="none">Disabled</SelectItem>
                              </SelectContent>
                           </Select>
                           <Switch defaultChecked />
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
         </TabsContent>

         <TabsContent value="security" className="pt-6 space-y-6">
            <Card className="border-border shadow-md">
               <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Operational Protocols</CardTitle>
                  <CardDescription className="text-xs">Security and compliance settings for dispatchers.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                           <Label className="text-xs font-semibold">Multi-Dispatcher Authorization</Label>
                           <p className="text-[10px] text-muted-foreground">Require two dispatchers for decommissioning units.</p>
                        </div>
                        <Switch />
                     </div>
                     <Separator />
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                           <Label className="text-xs font-semibold">Incident Log Immutability</Label>
                           <p className="text-[10px] text-muted-foreground">Prevents editing of resolved incident records.</p>
                        </div>
                        <Switch defaultChecked />
                     </div>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-4 mt-6">
                     <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-primary">Compliance Mode Active</p>
                        <p className="text-[10px] text-primary/70 leading-relaxed">
                           Current protocols align with regional transit security standards (TS-2024).
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
    </div>
  )
}
