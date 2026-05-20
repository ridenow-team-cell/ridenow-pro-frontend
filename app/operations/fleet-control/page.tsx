"use client"

import * as React from "react"
import {
  Bus as BusIcon,
  Search,
  Filter,
  MoreHorizontal,
  Battery,
  Fuel,
  Wrench,
  Power,
  UserCheck,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Settings2,
  TrendingUp,
  Zap,
  Activity,
  History,
  Loader2,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { fleetApi, Bus, FleetAnalytics } from "@/lib/api/fleet"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

export default function FleetControlPage() {
  const [buses, setBuses] = React.useState<Bus[]>([])
  const [analytics, setAnalytics] = React.useState<FleetAnalytics | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [selectedBus, setSelectedBus] = React.useState<Bus | null>(null)
  const [isRefillOpen, setIsRefillOpen] = React.useState(false)
  const [isInspectionOpen, setIsInspectionOpen] = React.useState(false)

  const fetchFleetData = React.useCallback(async () => {
    try {
      const [busesRes, analyticsRes] = await Promise.all([
        fleetApi.getBuses({ search }),
        fleetApi.getFleetAnalytics()
      ])
      if (busesRes.success) setBuses(busesRes.data.buses)
      if (analyticsRes.success) setAnalytics(analyticsRes.data)
    } catch (error) {
      toast.error("Failed to fetch fleet data")
    } finally {
      setLoading(false)
    }
  }, [search])

  React.useEffect(() => {
    fetchFleetData()
  }, [fetchFleetData])

  const refillForm = useForm({
    defaultValues: {
      stationName: "",
      quantityKg: 0,
      costPerKg: 0,
      totalCost: 0,
      pressureAfterRefill: 0
    }
  })

  const inspectionForm = useForm({
    defaultValues: {
      inspectorName: "",
      cylinderCondition: "good",
      leakDetected: false,
      status: "passed",
      notes: ""
    }
  })

  const onRefillSubmit = async (data: any) => {
    if (!selectedBus) return
    try {
      const res = await fleetApi.recordRefill({
        busId: selectedBus.id,
        ...data,
        quantityKg: parseFloat(data.quantityKg),
        costPerKg: parseFloat(data.costPerKg),
        totalCost: parseFloat(data.totalCost),
        pressureAfterRefill: parseFloat(data.pressureAfterRefill)
      })
      if (res.success) {
        toast.success("Refill recorded successfully")
        setIsRefillOpen(false)
        refillForm.reset()
        fetchFleetData()
      }
    } catch (error) {
      toast.error("Failed to record refill")
    }
  }

  const onInspectionSubmit = async (data: any) => {
    if (!selectedBus) return
    try {
      const res = await fleetApi.recordInspection({
        busId: selectedBus.id,
        ...data
      })
      if (res.success) {
        toast.success("Inspection recorded successfully")
        setIsInspectionOpen(false)
        inspectionForm.reset()
        fetchFleetData()
      }
    } catch (error) {
      toast.error("Failed to record inspection")
    }
  }

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground italic">Syncing Fleet Intelligence...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BusIcon className="h-7 w-7 text-primary" /> Fleet Control Center
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Manage asset availability, health, and assignment overrides.
          </p>
        </div>
      </div>

      {/* Fleet Status Dashboard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            title: analytics?.totalFleet.title || "Total Fleet", 
            val: analytics?.totalFleet.count || 0, 
            sub: analytics?.totalFleet.description || "Buses in system",
            icon: BusIcon, color: "text-primary", bg: "bg-primary/5" 
          },
          { 
            title: analytics?.operational.title || "Operational", 
            val: `${analytics?.operational.percentage || 0}%`, 
            sub: analytics?.operational.description || "Availability",
            icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" 
          },
          { 
            title: analytics?.inService.title || "In Service", 
            val: analytics?.inService.count || 0, 
            sub: analytics?.inService.description || "Maintenance",
            icon: Wrench, color: "text-amber-600", bg: "bg-amber-50" 
          },
          { 
            title: analytics?.drivers.title || "Drivers", 
            val: analytics?.drivers.count || 0, 
            sub: "Active Personnel",
            icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" 
          }
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.val}</div>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicle List Table */}
      <Card className="border-border shadow-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID or Location..." 
              className="pl-10 h-10 border-border bg-white" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-10 border-border font-semibold text-xs uppercase tracking-wider px-4">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Asset</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Location</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">CNG Level</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Health</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest">Activation</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/operations/fleet-control/${bus.id}`} className="flex items-center gap-3 group">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <BusIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold tracking-tight text-sm group-hover:text-primary transition-colors">{bus.busNumber}</p>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">{bus.plateNumber}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-semibold text-[10px] border-none px-2 h-5 ${
                      bus.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      bus.status === 'maintenance' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {bus.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {bus.currentLatitude}, {bus.currentLongitude}
                      </div>
                      <span className="text-[9px] text-muted-foreground/60 italic">Updated {new Date(bus.lastLocationUpdate).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                        <span className="flex items-center gap-1">
                          <Fuel className="h-3 w-3" />
                          {bus.cngInfo.currentFuelLevelPercent}%
                        </span>
                        <span className="text-muted-foreground">{bus.cngInfo.currentPressurePsi} PSI</span>
                      </div>
                      <Progress value={bus.cngInfo.currentFuelLevelPercent} className={`h-1 ${
                        bus.cngInfo.currentFuelLevelPercent < 20 ? 'bg-rose-100 text-rose-600' :
                        bus.cngInfo.currentFuelLevelPercent < 50 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {bus.cngInfo.nextInspectionDue === "0001-01-01T00:00:00Z" ? (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase">Healthy</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase">Check Due</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end">
                      <Switch checked={bus.status === 'active'} className="scale-75" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Unit Controls</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => {
                            setSelectedBus(bus)
                            setIsRefillOpen(true)
                          }}
                        >
                          <UserCheck className="h-4 w-4" /> Refill Bus
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => {
                            setSelectedBus(bus)
                            setIsInspectionOpen(true)
                          }}
                        >
                          <History className="h-4 w-4" /> Report Inspection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Refill Dialog */}
      <Dialog open={isRefillOpen} onOpenChange={setIsRefillOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-primary" />
              Record CNG Refill
            </DialogTitle>
            <DialogDescription>
              Enter refill details for {selectedBus?.busNumber}. This will update fuel levels and estimated range.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="station" className="text-right text-xs uppercase font-bold">Station</Label>
              <Input id="station" placeholder="Lekki CNG" className="col-span-3" {...refillForm.register("stationName")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right text-xs uppercase font-bold">Qty (Kg)</Label>
              <Input id="quantity" type="number" step="0.1" className="col-span-3" {...refillForm.register("quantityKg")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right text-xs uppercase font-bold">Total Cost</Label>
              <Input id="cost" type="number" step="0.01" className="col-span-3" {...refillForm.register("totalCost")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pressure" className="text-right text-xs uppercase font-bold">Pressure</Label>
              <Input id="pressure" type="number" className="col-span-3" {...refillForm.register("pressureAfterRefill")} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefillOpen(false)}>Cancel</Button>
            <Button onClick={refillForm.handleSubmit(onRefillSubmit)}>Record Refill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspection Dialog */}
      <Dialog open={isInspectionOpen} onOpenChange={setIsInspectionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-600" />
              Safety Inspection
            </DialogTitle>
            <DialogDescription>
              Record safety check results for {selectedBus?.busNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inspector" className="text-right text-xs uppercase font-bold">Inspector</Label>
              <Input id="inspector" placeholder="John Doe" className="col-span-3" {...inspectionForm.register("inspectorName")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-xs uppercase font-bold">Status</Label>
              <Select onValueChange={(val) => inspectionForm.setValue("status", val)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Passed with Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right text-xs uppercase font-bold">Cylinder</Label>
              <Select onValueChange={(val) => inspectionForm.setValue("cylinderCondition", val)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs uppercase font-bold">Leak?</Label>
              <Switch onCheckedChange={(val) => inspectionForm.setValue("leakDetected", val)} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="notes" className="text-xs uppercase font-bold">Technical Notes</Label>
              <Textarea id="notes" {...inspectionForm.register("notes")} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInspectionOpen(false)}>Cancel</Button>
            <Button onClick={inspectionForm.handleSubmit(onInspectionSubmit)}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
