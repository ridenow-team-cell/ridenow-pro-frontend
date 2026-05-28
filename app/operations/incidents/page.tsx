"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Siren,
  ArrowRight,
  User,
  Phone,
  Mail,
  Send,
  Navigation,
  Plus,
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api/client"
import { toast } from "sonner"

export interface SOSAlert {
  id: string
  userId: string
  driverId: string
  tripId: string
  status: "active" | "resolved" | string
  reason: string
  description: string
  currentLocation: {
    type: string
    coordinates: number[]
  }
  currentLatitude: number
  currentLongitude: number
  currentAddress: string
  triggerSource: string
  isSilent: boolean
  isFakeAlert: boolean
  policeNotified: boolean
  emergencyDispatched: boolean
  createdAt: string
  updatedAt: string
}

export default function IncidentsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = React.useState<SOSAlert[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("active") // "active", "resolved", "all"

  const fetchAlerts = React.useCallback(async () => {
    setLoading(true)
    try {
      if (statusFilter === "all") {
        const [activeRes, resolvedRes] = await Promise.all([
          api.get<{ alerts: SOSAlert[] }>("/admin/sos?status=active"),
          api.get<{ alerts: SOSAlert[] }>("/admin/sos?status=resolved")
        ])
        const activeAlerts = activeRes.data?.alerts || []
        const resolvedAlerts = resolvedRes.data?.alerts || []
        setAlerts([...activeAlerts, ...resolvedAlerts])
      } else {
        const res = await api.get<{ alerts: SOSAlert[] }>(`/admin/sos?status=${statusFilter}`)
        setAlerts(res.data?.alerts || [])
      }
    } catch (err: any) {
      console.error("Error fetching alerts", err)
      toast.error("Failed to load SOS alerts")
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  React.useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (alert.currentAddress && alert.currentAddress.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  // Dynamic statistics
  const activeCount = alerts.filter(a => a.status === "active").length
  const resolvedCount = alerts.filter(a => a.status === "resolved").length
  const policeNotifiedCount = alerts.filter(a => a.policeNotified).length
  const emergencyDispatchedCount = alerts.filter(a => a.emergencyDispatched).length
  const fakeCount = alerts.filter(a => a.isFakeAlert).length

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-destructive" /> Incidents & Emergency
          </h1>
          <p className="text-muted-foreground text-sm">Manage and track active passenger SOS alerts and breakdowns.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAlerts}
            disabled={loading}
            className="h-9 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Emergencies</CardDescription>
            <CardTitle className="text-2xl font-black text-destructive flex items-center gap-2">
              <Siren className="h-5 w-5 animate-pulse" /> {activeCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground">SOS alerts requiring response</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Authorities Notified</CardDescription>
            <CardTitle className="text-2xl font-black text-amber-600 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> {policeNotifiedCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground">Police/Security units notified</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Emergency Dispatched</CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-600 flex items-center gap-2">
              <Navigation className="h-5 w-5" /> {emergencyDispatchedCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground">Medical or ground support units</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fake / False Alarms</CardDescription>
            <CardTitle className="text-2xl font-black text-zinc-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> {fakeCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground">Flagged as false triggers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtering and List Console */}
      <Card className="border-border bg-card shadow-md">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, Trip, Address, Reason..." 
              className="pl-9 bg-background border-border text-xs h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none h-9 text-foreground"
            >
              <option value="active">Active Alerts</option>
              <option value="resolved">Resolved Alerts</option>
              <option value="all">All Alerts</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider">Incident ID</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider">Trip details</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider">Reason & Description</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider">Location</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider">Telemetry</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-6 text-center">
                      <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-2" />
                      <div className="h-3 bg-muted rounded w-1/3 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500/80 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">All Corridor Operations Nominal</h4>
                        <p className="text-xs text-muted-foreground max-w-sm mt-1">
                          No active emergencies detected on the transit corridor.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-foreground">
                      {alert.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground">Trip: {alert.tripId}</span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Source: {alert.triggerSource}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-foreground truncate">{alert.reason}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{alert.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-destructive shrink-0" />
                        <span className="truncate max-w-[160px]">{alert.currentAddress || "Abuja Corridor"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {alert.policeNotified && (
                          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-extrabold text-[8px] uppercase tracking-wider px-1.5 h-5">Police</Badge>
                        )}
                        {alert.emergencyDispatched && (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-extrabold text-[8px] uppercase tracking-wider px-1.5 h-5">Dispatched</Badge>
                        )}
                        {alert.isFakeAlert && (
                          <Badge variant="destructive" className="font-extrabold text-[8px] uppercase tracking-wider px-1.5 h-5">Fake</Badge>
                        )}
                        {!alert.policeNotified && !alert.emergencyDispatched && !alert.isFakeAlert && (
                          <span className="text-[10px] text-muted-foreground italic">Standard alert</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={alert.status === "active" ? "destructive" : "secondary"} 
                        className="text-[9px] font-extrabold uppercase tracking-widest h-5"
                      >
                        {alert.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/operations/incidents/${alert.id}`)}
                        className="text-primary hover:text-primary-hover font-bold text-xs uppercase tracking-wider flex items-center gap-1 ml-auto"
                      >
                        Respond <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
