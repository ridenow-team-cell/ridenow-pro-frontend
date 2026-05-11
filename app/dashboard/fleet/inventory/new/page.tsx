"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Bus, 
  ChevronLeft,
  ShieldCheck,
  Zap,
  Battery,
  Gauge,
  Wifi,
  Usb,
  Wind,
  Plus,
  Trash2,
  Settings2,
  Check,
  Info,
  Calendar,
  Cpu,
  Unplug
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function AddBusPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      router.push("/dashboard/fleet/inventory")
    }, 1500)
  }

  return (
    <div className="space-y-6 pt-4 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Register New Vehicle
            </h1>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase text-[10px]">
              E-Mobility Class
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-11">
            Add a new electric asset to the RideNow Pro fleet network.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 px-4 font-semibold border-border" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button size="sm" className="h-9 px-6 font-semibold bg-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Syncing..." : "Add to Inventory"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-6">
           <Tabs defaultValue="identity" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg border border-border">
                 <TabsTrigger value="identity" className="text-xs font-bold uppercase tracking-wider">Identity</TabsTrigger>
                 <TabsTrigger value="electric" className="text-xs font-bold uppercase tracking-wider">Electric Specs</TabsTrigger>
                 <TabsTrigger value="amenities" className="text-xs font-bold uppercase tracking-wider">Amenities</TabsTrigger>
              </TabsList>

              <TabsContent value="identity" className="space-y-6 pt-4">
                 <Card className="border-border bg-card shadow-sm">
                    <CardHeader className="pb-4">
                       <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                          <Bus className="h-4 w-4 text-primary" /> Vehicle Identity
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-muted-foreground uppercase">Asset ID</Label>
                             <Input placeholder="e.g. BUS-405" className="h-10 bg-muted/20 border-border" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-muted-foreground uppercase">License Plate</Label>
                             <Input placeholder="e.g. ABC-123-XY" className="h-10 bg-muted/20 border-border" />
                          </div>
                       </div>
                       <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-muted-foreground uppercase">Manufacturer</Label>
                             <Select defaultValue="byd">
                                <SelectTrigger className="h-10 bg-muted/20">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="byd">BYD (Build Your Dreams)</SelectItem>
                                   <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                                   <SelectItem value="volvo">Volvo Buses</SelectItem>
                                   <SelectItem value="proterra">Proterra</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-muted-foreground uppercase">Model Year</Label>
                             <Select defaultValue="2024">
                                <SelectTrigger className="h-10 bg-muted/20">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="2024">2024 Model</SelectItem>
                                   <SelectItem value="2023">2023 Model</SelectItem>
                                   <SelectItem value="2022">2022 Model</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-xs font-bold text-muted-foreground uppercase">Seating Capacity</Label>
                          <Select defaultValue="18">
                             <SelectTrigger className="h-10 bg-muted/20">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="14">14 Seats (Executive Minivan)</SelectItem>
                                <SelectItem value="18">18 Seats (Campus Standard)</SelectItem>
                                <SelectItem value="22">22 Seats (Commuter XL)</SelectItem>
                                <SelectItem value="30">30 Seats (Staff Shuttle)</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>

              <TabsContent value="electric" className="space-y-6 pt-4">
                 <Card className="border-border bg-card shadow-sm">
                    <CardHeader className="pb-4">
                       <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" /> Propulsion & Battery
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                       <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold text-muted-foreground uppercase">Battery Capacity</Label>
                                <Badge variant="secondary" className="font-bold text-[10px]">kWh</Badge>
                             </div>
                             <Input type="number" defaultValue="250" className="h-11 text-xl font-bold bg-muted/20 border-border" />
                          </div>
                          <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold text-muted-foreground uppercase">Estimated Range</Label>
                                <Badge variant="secondary" className="font-bold text-[10px]">KM</Badge>
                             </div>
                             <Input type="number" defaultValue="320" className="h-11 text-xl font-bold bg-muted/20 border-border" />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <Label className="text-xs font-bold text-muted-foreground uppercase">Charging Architecture</Label>
                          <div className="grid gap-3 md:grid-cols-3">
                             {['CCS2 (Fast)', 'CCS1', 'GB/T'].map((port) => (
                                <div key={port} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
                                   <span className="text-xs font-semibold">{port}</span>
                                   <Switch defaultChecked={port.includes('CCS2')} />
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-4">
                          <Unplug className="h-5 w-5 text-amber-600 mt-1" />
                          <div className="space-y-1">
                             <p className="text-xs font-bold text-amber-700 uppercase">Smart Charging Ready</p>
                             <p className="text-[10px] text-amber-600/80 leading-relaxed font-medium">
                                This vehicle supports V2G (Vehicle-to-Grid) and scheduled charging to optimize electricity costs during off-peak hours.
                             </p>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6 pt-4">
                 <Card className="border-border bg-card shadow-sm">
                    <CardHeader className="pb-4">
                       <CardTitle className="text-sm font-semibold uppercase tracking-wider">Standard Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                             <div className="flex items-center gap-3">
                                <Wifi className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold uppercase">5G Wi-Fi Hub</span>
                             </div>
                             <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                             <div className="flex items-center gap-3">
                                <Usb className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold uppercase">USB Charging Ports</span>
                             </div>
                             <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                             <div className="flex items-center gap-3">
                                <Wind className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold uppercase">Climate Control (AC)</span>
                             </div>
                             <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                             <div className="flex items-center gap-3">
                                <Cpu className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold uppercase">Telemetry AI</span>
                             </div>
                             <Switch defaultChecked />
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>
           </Tabs>
        </div>

        {/* Right Column: Deployment & Intelligence */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-border bg-slate-950 text-white rounded-xl shadow-xl overflow-hidden">
              <CardHeader className="border-b border-white/10 pb-4">
                 <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">Initial Deployment</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold text-slate-400 uppercase">Operational Status</Label>
                       <Select defaultValue="active">
                          <SelectTrigger className="h-10 bg-white/5 border-white/10">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="active">Active (On Line)</SelectItem>
                             <SelectItem value="standby">Standby (Depot)</SelectItem>
                             <SelectItem value="maintenance">Initial Inspection</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold text-slate-400 uppercase">Primary Route</Label>
                       <Select defaultValue="none">
                          <SelectTrigger className="h-10 bg-white/5 border-white/10">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="none">Unassigned</SelectItem>
                             <SelectItem value="RT-12">RT-12: Kubwa Hub</SelectItem>
                             <SelectItem value="RT-08">RT-08: Gwarinpa City</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
                 <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
                    <div className="flex items-center gap-2">
                       <Info className="h-3.5 w-3.5 text-primary" />
                       <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Pre-Sync Audit</p>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      Registration will trigger an automatic handshake with the vehicle's onboard telematics unit. Ensure the ignition is in <span className="font-bold text-white">ACC mode</span> for the first sync.
                    </p>
                 </div>
              </CardContent>
           </Card>

           <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" />
                 <h3 className="text-xs font-bold uppercase tracking-wider">Compliance Check</h3>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500" /> VIO Inspection Certificate
                 </div>
                 <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500" /> Passenger Insurance (Group)
                 </div>
                 <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500" /> Battery Safety Validation
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
