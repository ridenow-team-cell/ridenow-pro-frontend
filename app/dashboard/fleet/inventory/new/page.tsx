"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
   Bus,
   ChevronLeft,
   ShieldCheck,
   Zap,
   Gauge,
   Wifi,
   Plus,
   Trash2,
   Settings2,
   Check,
   Info,
   Calendar,
   Cpu,
   Unplug,
   Camera,
   AlertCircle,
   Truck,
   Database,
   Flame
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
import { createBus, type CreateBusRequest } from "@/lib/api/fleet"

export default function AddBusPage() {
   const router = useRouter()
   const [isSaving, setIsSaving] = React.useState(false)
   const [formData, setFormData] = React.useState<CreateBusRequest>({
      busNumber: "",
      plateNumber: "",
      name: "",
      brand: "Toyota",
      model: "Coaster",
      year: 2024,
      busType: "coaster",
      fuelType: "cng",
      totalSeats: 32,
      standingCapacity: 10,
      engineNumber: "",
      chassisNumber: "",
      hasGps: true,
      hasCamera: true,
      hasWifi: false,
      hasPanicButton: true,
      cngInfo: {
         cylinderCount: 2,
         cylinderCapacityLiters: 100,
         maxPressurePsi: 3000
      }
   })

   const handleSave = async () => {
      try {
         setIsSaving(true)
         const res = await createBus(formData)
         if (res.success) {
            router.push("/dashboard/fleet/inventory")
         }
      } catch (err) {
         console.error("Failed to register bus:", err)
      } finally {
         setIsSaving(false)
      }
   }

   const updateFormData = (field: string, value: any) => {
      if (field.includes(".")) {
         const [parent, child] = field.split(".")
         setFormData(prev => ({
            ...prev,
            [parent]: {
               ...(prev[parent as keyof CreateBusRequest] as any),
               [child]: value
            }
         }))
      } else {
         setFormData(prev => ({ ...prev, [field]: value }))
      }
   }

   return (
      <div className="space-y-6 pt-4 pb-20 px-6">
         {/* Header Section */}
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => router.back()}
                     className="h-8 w-8 rounded-full border border-border/40"
                  >
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                     Register New Vehicle
                  </h1>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase text-[10px]">
                     Asset Enrollment
                  </Badge>
               </div>
               <p className="text-sm text-muted-foreground font-medium pl-11">
                  Configure and synchronize a new fleet asset with the RydeNow network.
               </p>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" size="sm" className="h-9 px-4 font-semibold border-border" onClick={() => router.back()}>
                  Cancel
               </Button>
               <Button size="sm" className="h-9 px-6 font-semibold bg-primary shadow-lg shadow-primary/20" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Syncing Ledger..." : "Register Asset"}
               </Button>
            </div>
         </div>

         <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-8 space-y-6">
               <Tabs defaultValue="identity" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-lg border border-border">
                     <TabsTrigger value="identity" className="text-[10px] font-bold uppercase tracking-wider">Identity</TabsTrigger>
                     <TabsTrigger value="specs" className="text-[10px] font-bold uppercase tracking-wider">Specs</TabsTrigger>
                     <TabsTrigger value="propulsion" className="text-[10px] font-bold uppercase tracking-wider">Propulsion</TabsTrigger>
                     <TabsTrigger value="amenities" className="text-[10px] font-bold uppercase tracking-wider">Amenity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="identity" className="space-y-6 pt-4">
                     <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-4">
                           <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                              <Bus className="h-4 w-4 text-primary" /> Core Identity
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Internal Bus Number</Label>
                                 <Input
                                    placeholder="e.g. BUS-405"
                                    className="h-10 bg-muted/20 border-border"
                                    value={formData.busNumber}
                                    onChange={(e) => updateFormData("busNumber", e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Display Name</Label>
                                 <Input
                                    placeholder="e.g. City Shuttle 1"
                                    className="h-10 bg-muted/20 border-border"
                                    value={formData.name}
                                    onChange={(e) => updateFormData("name", e.target.value)}
                                 />
                              </div>
                           </div>
                           <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">License Plate</Label>
                                 <Input
                                    placeholder="e.g. ABC-123-XY"
                                    className="h-10 bg-muted/20 border-border font-mono"
                                    value={formData.plateNumber}
                                    onChange={(e) => updateFormData("plateNumber", e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Manufacturer</Label>
                                 <Select
                                    value={formData.brand}
                                    onValueChange={(v) => updateFormData("brand", v)}
                                 >
                                    <SelectTrigger className="h-10 bg-muted/20 border-border">
                                       <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="Toyota">Toyota</SelectItem>
                                       <SelectItem value="Mercedes">Mercedes-Benz</SelectItem>
                                       <SelectItem value="BYD">BYD (Build Your Dreams)</SelectItem>
                                       <SelectItem value="Volvo">Volvo Buses</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                           <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Vehicle Type</Label>
                                 <Select
                                    value={formData.busType}
                                    onValueChange={(v) => updateFormData("busType", v)}
                                 >
                                    <SelectTrigger className="h-10 bg-muted/20 border-border">
                                       <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="coaster">Coaster (32 Seats)</SelectItem>
                                       <SelectItem value="minibus">Mini-Bus (14-18 Seats)</SelectItem>
                                       <SelectItem value="coach">Coach (50+ Seats)</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Model Year</Label>
                                 <Select
                                    value={formData.year.toString()}
                                    onValueChange={(v) => updateFormData("year", parseInt(v))}
                                 >
                                    <SelectTrigger className="h-10 bg-muted/20 border-border">
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
                        </CardContent>
                     </Card>
                  </TabsContent>

                  <TabsContent value="specs" className="space-y-6 pt-4">
                     <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-4">
                           <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                              <Settings2 className="h-4 w-4 text-primary" /> Technical Specs
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Total Seating</Label>
                                 <Input
                                    type="number"
                                    className="h-10 bg-muted/20"
                                    value={formData.totalSeats}
                                    onChange={(e) => updateFormData("totalSeats", parseInt(e.target.value))}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Standing Capacity</Label>
                                 <Input
                                    type="number"
                                    className="h-10 bg-muted/20"
                                    value={formData.standingCapacity}
                                    onChange={(e) => updateFormData("standingCapacity", parseInt(e.target.value))}
                                 />
                              </div>
                           </div>
                           <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Engine Number</Label>
                                 <Input
                                    placeholder="ENG123456"
                                    className="h-10 bg-muted/20 font-mono"
                                    value={formData.engineNumber}
                                    onChange={(e) => updateFormData("engineNumber", e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs font-bold text-muted-foreground uppercase">Chassis Number</Label>
                                 <Input
                                    placeholder="CHS789012"
                                    className="h-10 bg-muted/20 font-mono"
                                    value={formData.chassisNumber}
                                    onChange={(e) => updateFormData("chassisNumber", e.target.value)}
                                 />
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </TabsContent>

                  <TabsContent value="propulsion" className="space-y-6 pt-4">
                     <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-4">
                           <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                              <Flame className="h-4 w-4 text-orange-500" /> Fuel & Energy System
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                           <div className="space-y-4">
                              <Label className="text-xs font-bold text-muted-foreground uppercase">Primary Fuel Type</Label>
                              <div className="grid grid-cols-3 gap-3">
                                 {['cng', 'electric', 'diesel'].map((fuel) => (
                                    <Button
                                       key={fuel}
                                       variant={formData.fuelType === fuel ? "default" : "outline"}
                                       className={`h-11 font-bold uppercase text-[10px] tracking-widest ${formData.fuelType === fuel ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted/10"}`}
                                       onClick={() => updateFormData("fuelType", fuel)}
                                    >
                                       {fuel}
                                    </Button>
                                 ))}
                              </div>
                           </div>

                           {formData.fuelType === 'cng' && (
                              <div className="grid gap-6 md:grid-cols-3 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-orange-700 uppercase">Cylinder Count</Label>
                                    <Input
                                       type="number"
                                       className="h-10 bg-white border-orange-500/20 font-bold"
                                       value={formData.cngInfo?.cylinderCount}
                                       onChange={(e) => updateFormData("cngInfo.cylinderCount", parseInt(e.target.value))}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-orange-700 uppercase">Capacity (Liters)</Label>
                                    <Input
                                       type="number"
                                       className="h-10 bg-white border-orange-500/20 font-bold"
                                       value={formData.cngInfo?.cylinderCapacityLiters}
                                       onChange={(e) => updateFormData("cngInfo.cylinderCapacityLiters", parseFloat(e.target.value))}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-orange-700 uppercase">Max Pressure (PSI)</Label>
                                    <Input
                                       type="number"
                                       className="h-10 bg-white border-orange-500/20 font-bold"
                                       value={formData.cngInfo?.maxPressurePsi}
                                       onChange={(e) => updateFormData("cngInfo.maxPressurePsi", parseFloat(e.target.value))}
                                    />
                                 </div>
                              </div>
                           )}

                           {formData.fuelType === 'electric' && (
                              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex gap-4">
                                 <Unplug className="h-5 w-5 text-primary mt-1" />
                                 <div className="space-y-1">
                                    <p className="text-xs font-bold text-primary uppercase">E-Mobility Ready</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                                       This asset will be registered as an electric vehicle. Onboard telematics will sync battery health and SoC (State of Charge) in real-time.
                                    </p>
                                 </div>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  </TabsContent>

                  <TabsContent value="amenities" className="space-y-6 pt-4">
                     <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="pb-4">
                           <CardTitle className="text-sm font-bold uppercase tracking-wider">Safety & Connectivity</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid gap-4 md:grid-cols-2">
                              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                                 <div className="flex items-center gap-3">
                                    <Gauge className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase">GPS Tracking</span>
                                 </div>
                                 <Switch
                                    checked={formData.hasGps}
                                    onCheckedChange={(v) => updateFormData("hasGps", v)}
                                 />
                              </div>
                              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                                 <div className="flex items-center gap-3">
                                    <Camera className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase">AI Safety Camera</span>
                                 </div>
                                 <Switch
                                    checked={formData.hasCamera}
                                    onCheckedChange={(v) => updateFormData("hasCamera", v)}
                                 />
                              </div>
                              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                                 <div className="flex items-center gap-3">
                                    <Wifi className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase">5G Wi-Fi Hub</span>
                                 </div>
                                 <Switch
                                    checked={formData.hasWifi}
                                    onCheckedChange={(v) => updateFormData("hasWifi", v)}
                                 />
                              </div>
                              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                                 <div className="flex items-center gap-3">
                                    <AlertCircle className="h-4 w-4 text-rose-500" />
                                    <span className="text-xs font-bold uppercase">Panic Alert System</span>
                                 </div>
                                 <Switch
                                    checked={formData.hasPanicButton}
                                    onCheckedChange={(v) => updateFormData("hasPanicButton", v)}
                                 />
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
                        <CardTitle className="text-xs font-bold uppercase tracking-wider">Asset Preview</CardTitle>
                     </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                     <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                        <Bus className="h-12 w-12 text-primary mb-4" />
                        <h2 className="text-xl font-bold tracking-tight">{formData.name || "Unnamed Asset"}</h2>
                        <p className="text-xs text-slate-400 font-mono mt-1 uppercase">{formData.busNumber || "NO-ID"}</p>
                        <div className="flex gap-2 mt-4">
                           <Badge variant="outline" className="text-[9px] font-bold border-white/20 text-white">{formData.brand}</Badge>
                           <Badge variant="outline" className="text-[9px] font-bold border-white/20 text-white capitalize">{formData.fuelType}</Badge>
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
                     <h3 className="text-xs font-bold uppercase tracking-wider">Compliance Registry</h3>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> VIO Inspection Certificate
                     </div>
                     <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> Passenger Insurance (Group)
                     </div>
                     <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> Safety Validation Handshake
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
