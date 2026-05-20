"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Bus as BusIcon,
  MapPin,
  Fuel,
  Wrench,
  History,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Navigation,
  Clock,
  ShieldCheck,
  Zap,
  Power,
  Settings2,
  Thermometer,
  Gauge,
  MoreVertical,
  Loader2,
  Phone,
  User,
  Calendar,
  Layers,
  Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fleetApi, Bus, Refill, Inspection } from "@/lib/api/fleet"
import { toast } from "sonner"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

export default function BusDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [bus, setBus] = React.useState<Bus | null>(null)
  const [refills, setRefills] = React.useState<Refill[]>([])
  const [inspections, setInspections] = React.useState<Inspection[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false)
  const [updateStatus, setUpdateStatus] = React.useState("")
  const [updateMileage, setUpdateMileage] = React.useState("")

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const fetchData = React.useCallback(async () => {
    try {
      const [busRes, refillsRes, inspectionsRes] = await Promise.all([
        fleetApi.getBus(id),
        fleetApi.getBusRefills(id),
        fleetApi.getBusInspections(id)
      ])

      if (busRes.success && busRes.data) {
        setBus(busRes.data)
        setUpdateStatus(busRes.data.status)
        setUpdateMileage(busRes.data.mileageKm.toString())
      }
      if (refillsRes.success && refillsRes.data) setRefills(refillsRes.data.refills)
      if (inspectionsRes.success && inspectionsRes.data) setInspections(inspectionsRes.data.inspections)
    } catch (error) {
      toast.error("Failed to load vehicle details")
    } finally {
      setLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleUpdate = async () => {
    try {
      const res = await fleetApi.updateBus(id, {
        status: updateStatus,
        mileageKm: parseFloat(updateMileage)
      })
      if (res.success) {
        toast.success("Vehicle updated successfully")
        setIsUpdateOpen(false)
        fetchData()
      }
    } catch (error) {
      toast.error("Failed to update vehicle")
    }
  }

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground italic">Accessing Vehicle Core...</p>
      </div>
    )
  }

  if (!bus) return null

  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/operations">Operations</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/operations/fleet-control">Fleet</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-primary">{bus.busNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="outline" size="sm" onClick={() => router.back()} className="h-8 border-border text-[10px] font-bold uppercase tracking-widest">
            <ChevronLeft className="mr-1 h-3 w-3" /> Back to Fleet
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <BusIcon className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tighter text-foreground">{bus.busNumber}</h1>
                <Badge variant="outline" className={`border-none font-black text-[10px] px-3 h-6 ${bus.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                  {bus.status.toUpperCase()}
                </Badge>
                {bus.isOnline && <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[10px] h-6">ONLINE</Badge>}
              </div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {bus.brand} {bus.model} ({bus.year}) <Separator orientation="vertical" className="h-3" /> {bus.plateNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 border-border font-bold text-xs uppercase tracking-widest px-6 bg-white" onClick={() => setIsUpdateOpen(true)}>
              <Settings2 className="mr-2 h-4 w-4" /> Edit Status
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-12 font-black text-xs uppercase tracking-widest px-6 brand-gradient text-white shadow-lg shadow-primary/20">
                  <Database className="mr-2 h-4 w-4" /> Download Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={async () => {
                    const { jsPDF } = await import('jspdf')
                    const autoTable = (await import('jspdf-autotable')).default

                    const doc = new jsPDF('l', 'mm', 'a4') // Use landscape for more columns

                    // Header
                    doc.setFontSize(22)
                    doc.text("RydeNow Fleet Comprehensive Audit", 14, 20)
                    doc.setFontSize(10)
                    doc.setTextColor(100)
                    doc.text(`Vehicle: ${bus.busNumber} | Plate: ${bus.plateNumber} | Generated: ${new Date().toLocaleString()}`, 14, 28)

                    // Core Details
                    doc.setFontSize(14)
                    doc.setTextColor(0)
                    doc.text("Vehicle Core Status", 14, 40)
                    autoTable(doc, {
                      startY: 45,
                      head: [['Metric', 'Value', 'Metric', 'Value']],
                      body: [
                        ['Bus Number', bus.busNumber, 'Brand/Model', `${bus.brand} ${bus.model}`],
                        ['Year', bus.year.toString(), 'Status', bus.status.toUpperCase()],
                        ['Current Mileage', `${bus.mileageKm} KM`, 'Fuel Level', `${bus.cngInfo.currentFuelLevelPercent}%`],
                        ['Current Pressure', `${bus.cngInfo.currentPressurePsi} PSI`, 'Total Seats', bus.totalSeats.toString()]
                      ],
                      theme: 'grid',
                      styles: { fontSize: 8 }
                    })

                    // Refills
                    doc.text("Detailed Refill Logs", 14, (doc as any).lastAutoTable.finalY + 12)
                    autoTable(doc, {
                      startY: (doc as any).lastAutoTable.finalY + 15,
                      head: [['Date', 'Station', 'Qty', 'Cost', 'PSI (B/A)', 'Mileage', 'Est. Range']],
                      body: refills.map(r => [
                        new Date(r.createdAt).toLocaleDateString(),
                        r.stationName,
                        `${r.quantityKg} Kg`,
                        `N${r.totalCost.toLocaleString()}`,
                        `${r.pressureBeforeRefill} -> ${r.pressureAfterRefill}`,
                        `${r.mileageAtRefill} KM`,
                        `+${r.estimatedRangeAfterRefill} KM`
                      ]),
                      styles: { fontSize: 8 }
                    })

                    // Inspections
                    doc.text("Safety Audit History", 14, (doc as any).lastAutoTable.finalY + 12)
                    autoTable(doc, {
                      startY: (doc as any).lastAutoTable.finalY + 15,
                      head: [['Date', 'Inspector', 'Cylinder', 'Regulator', 'Valve', 'Leak', 'Result']],
                      body: inspections.map(i => [
                        new Date(i.createdAt).toLocaleDateString(),
                        i.inspectorName,
                        i.cylinderCondition,
                        i.pressureRegulatorStatus || 'N/A',
                        i.valveCondition || 'N/A',
                        i.leakDetected ? 'YES' : 'NO',
                        i.status.toUpperCase()
                      ]),
                      styles: { fontSize: 8 }
                    })

                    doc.save(`AuditReport_${bus.busNumber}_${new Date().toISOString().split('T')[0]}.pdf`)
                    toast.success("Comprehensive PDF generated")
                  }}
                >
                  <Database className="h-4 w-4" /> Export as PDF (Full Audit)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => {
                    const escapeCSV = (val: any) => `"${String(val).replace(/"/g, '""')}"`
                    let csvContent = `COMPREHENSIVE AUDIT REPORT: ${bus.busNumber}\n`
                    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`

                    csvContent += "VEHICLE STATUS\n"
                    csvContent += "ID,Number,Plate,Brand,Model,Year,Mileage,Fuel%,Pressure,Status\n"
                    csvContent += `${escapeCSV(bus.id)},${escapeCSV(bus.busNumber)},${escapeCSV(bus.plateNumber)},${escapeCSV(bus.brand)},${escapeCSV(bus.model)},${bus.year},${bus.mileageKm},${bus.cngInfo.currentFuelLevelPercent},${bus.cngInfo.currentPressurePsi},${escapeCSV(bus.status)}\n\n`

                    csvContent += "REFILL LOGS\n"
                    csvContent += "Date,Station,Qty(Kg),Cost,BeforePSI,AfterPSI,Mileage,EstRange\n"
                    refills.forEach(r => {
                      csvContent += `${new Date(r.createdAt).toLocaleDateString()},${escapeCSV(r.stationName)},${r.quantityKg},${r.totalCost},${r.pressureBeforeRefill},${r.pressureAfterRefill},${r.mileageAtRefill},${r.estimatedRangeAfterRefill}\n`
                    })
                    csvContent += "\n"

                    csvContent += "SAFETY AUDIT LOGS\n"
                    csvContent += "Date,Inspector,Cylinder,Regulator,Valve,LeakDetected,Status,Notes\n"
                    inspections.forEach(i => {
                      csvContent += `${new Date(i.createdAt).toLocaleDateString()},${escapeCSV(i.inspectorName)},${escapeCSV(i.cylinderCondition)},${escapeCSV(i.pressureRegulatorStatus || 'N/A')},${escapeCSV(i.valveCondition || 'N/A')},${i.leakDetected ? 'YES' : 'NO'},${escapeCSV(i.status)},${escapeCSV(i.notes)}\n`
                    })

                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `AuditReport_${bus.busNumber}_${new Date().toISOString().split('T')[0]}.csv`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    toast.success("Comprehensive CSV generated")
                  }}
                >
                  <Database className="h-4 w-4" /> Export as CSV (Raw Data)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Unit Telemetry */}
        <Card className="lg:col-span-1 border-border shadow-xl bg-zinc-950 text-white overflow-hidden">
          <CardHeader className="border-b border-zinc-800 bg-zinc-900/50">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5" /> Live CNG Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fuel Level</p>
                <Fuel className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-end justify-between">
                <div className="text-5xl font-black tracking-tighter text-primary">{bus.cngInfo.currentFuelLevelPercent}%</div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase pb-1">~{bus.cngInfo.estimatedRemainingKm} KM Range</p>
              </div>
              <Progress value={bus.cngInfo.currentFuelLevelPercent} className="h-2 bg-zinc-800" />
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-1.5">
                  <Activity className="h-3 w-3" /> Pressure
                </p>
                <p className="text-xl font-black">{bus.cngInfo.currentPressurePsi} <span className="text-[10px] text-zinc-500">PSI</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-1.5">
                  <Database className="h-3 w-3" /> Mileage
                </p>
                <p className="text-xl font-black">{bus.mileageKm} <span className="text-[10px] text-zinc-500">KM</span></p>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">CNG Integrity Verified</span>
              </div>
              <p className="text-[10px] text-primary/70 font-medium">Last Safety Check: {new Date(bus.cngInfo.lastSafetyInspectionDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* GIS & Location */}
        <Card className="lg:col-span-2 border-border shadow-xl overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black uppercase tracking-tight">Geographic Status</CardTitle>
              <CardDescription className="text-xs">Real-time asset positioning and terminal context.</CardDescription>
            </div>
            <Badge variant="outline" className="h-6 font-bold text-[10px] tracking-widest px-3 border-primary/30 text-primary uppercase">
              {bus.isOnline ? 'Active Tracking' : 'Offline Mode'}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[300px] relative bg-muted">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: bus.currentLatitude || 6.5244, lng: bus.currentLongitude || 3.3792 }}
                zoom={15}
                options={{ disableDefaultUI: true }}
              >
                <Marker position={{ lat: bus.currentLatitude || 6.5244, lng: bus.currentLongitude || 3.3792 }} />
              </GoogleMap>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hydrating GIS Data...</p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight">{bus.currentLatitude}, {bus.currentLongitude}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Update</p>
                <p className="text-xs font-bold">{new Date(bus.lastLocationUpdate).toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="refills" className="w-full">
        <TabsList className="h-12 bg-muted/50 p-1 border border-border/50 w-full justify-start md:w-auto">
          <TabsTrigger value="refills" className="px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Refill History</TabsTrigger>
          <TabsTrigger value="inspections" className="px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Inspections</TabsTrigger>
          <TabsTrigger value="technical" className="px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Technical Specs</TabsTrigger>
        </TabsList>

        <TabsContent value="refills" className="pt-6">
          <Card className="border-border shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Refill Detail</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Station</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Quantity/Cost</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Pressure (PSI)</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Mileage/Range</th>
                    <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {refills.map((refill) => (
                    <tr key={refill.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-black text-xs text-primary">{refill.id.slice(-6).toUpperCase()}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{refill.fuelType || 'CNG'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-xs uppercase">{refill.stationName}</p>
                        <p className="text-[9px] text-muted-foreground">{refill.stationLocation || 'Central Depot'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-xs">{refill.quantityKg} Kg</p>
                        <p className="text-[10px] font-bold text-emerald-600">₦{refill.totalCost.toLocaleString()} <span className="text-muted-foreground/60 text-[8px]">(@₦{refill.costPerKg})</span></p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-center">
                            <p className="text-[8px] text-muted-foreground font-black uppercase">Before</p>
                            <p className="font-bold text-xs">{refill.pressureBeforeRefill}</p>
                          </div>
                          <div className="h-4 w-[1px] bg-border" />
                          <div className="text-center">
                            <p className="text-[8px] text-primary font-black uppercase">After</p>
                            <p className="font-black text-xs text-primary">{refill.pressureAfterRefill}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-xs">{refill.mileageAtRefill.toLocaleString()} KM</p>
                        <p className="text-[10px] text-amber-600 font-black uppercase">+{refill.estimatedRangeAfterRefill} KM Est.</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs font-bold text-muted-foreground">{new Date(refill.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-muted-foreground/60">{new Date(refill.createdAt).toLocaleTimeString()}</p>
                      </td>
                    </tr>
                  ))}
                  {refills.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic text-xs">No refill records found for this vehicle.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className="pt-6">
          <Card className="border-border shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Auditor</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Components</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Integrity</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Technical Notes</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Result</th>
                    <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Audit Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {inspections.map((ins) => (
                    <tr key={ins.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-black text-xs">{ins.inspectorName}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Certified Inspector</p>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Cylinder</span>
                          <Badge variant="outline" className="h-4 text-[8px] font-black">{ins.cylinderCondition.toUpperCase()}</Badge>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Regulator</span>
                          <Badge variant="outline" className="h-4 text-[8px] font-black">{ins.pressureRegulatorStatus?.toUpperCase() || 'NORMAL'}</Badge>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Valves</span>
                          <Badge variant="outline" className="h-4 text-[8px] font-black">{ins.valveCondition?.toUpperCase() || 'GOOD'}</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {ins.leakDetected ? (
                          <div className="flex items-center gap-1.5 text-rose-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase">Leak Detected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <ShieldCheck className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase">Hermetic Seal</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-muted-foreground max-w-[200px] truncate" title={ins.notes}>
                          {ins.notes || 'No technical observations recorded.'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`font-black text-[10px] tracking-widest px-3 ${ins.status === 'passed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                            ins.status === 'failed' ? 'bg-rose-100 text-rose-700 hover:bg-rose-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          }`}>
                          {ins.status.toUpperCase()}
                        </Badge>
                        {ins.nextInspectionDate !== "0001-01-01T00:00:00Z" && (
                          <p className="text-[8px] text-muted-foreground font-bold mt-1 uppercase">Next: {new Date(ins.nextInspectionDate).toLocaleDateString()}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs font-bold text-muted-foreground">{new Date(ins.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-muted-foreground/60">{new Date(ins.createdAt).toLocaleTimeString()}</p>
                      </td>
                    </tr>
                  ))}
                  {inspections.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic text-xs">No audit logs found for this vehicle.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border shadow-xl p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b pb-4">Engine & Chassis</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Engine Number</p>
                  <p className="text-sm font-bold">{bus.engineNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Chassis Number</p>
                  <p className="text-sm font-bold">{bus.chassisNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Seats / Standing</p>
                  <p className="text-sm font-bold">{bus.totalSeats} / {bus.standingCapacity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Fuel Type</p>
                  <p className="text-sm font-bold uppercase">{bus.fuelType}</p>
                </div>
              </div>
            </Card>
            <Card className="border-border shadow-xl p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-600 border-b pb-4">On-Board Sensors</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "GPS Tracking", active: bus.hasGps },
                  { label: "Live Camera", active: bus.hasCamera },
                  { label: "Wi-Fi Hub", active: bus.hasWifi },
                  { label: "Panic Button", active: bus.hasPanicButton },
                ].map((sensor, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-border">
                    <span className="text-[10px] font-bold uppercase">{sensor.label}</span>
                    {sensor.active ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Power className="h-4 w-4 text-muted-foreground/30" />}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Vehicle Status</DialogTitle>
            <DialogDescription>
              Modify operational status and mileage for {bus.busNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-xs font-bold uppercase">Status</Label>
              <Select value={updateStatus} onValueChange={setUpdateStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">In Maintenance</SelectItem>
                  <SelectItem value="standby">Standby</SelectItem>
                  <SelectItem value="decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mileage" className="text-right text-xs font-bold uppercase">Mileage (KM)</Label>
              <Input
                id="mileage"
                type="number"
                step="0.1"
                className="col-span-3"
                value={updateMileage}
                onChange={(e) => setUpdateMileage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
