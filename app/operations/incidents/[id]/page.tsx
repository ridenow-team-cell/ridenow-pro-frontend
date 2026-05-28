"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Siren,
  User,
  Phone,
  Mail,
  Navigation,
  ArrowLeft,
  Shield,
  AlertTriangle,
  History,
  Send,
  Zap,
  Activity,
  Battery,
  Wifi,
  ExternalLink
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api } from "@/lib/api/client"
import { toast } from "sonner"

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

interface SOSDetails {
  sos: {
    id: string
    userId: string
    driverId: string
    tripId: string
    status: string
    reason: string
    description: string
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
    agentId?: string
  }
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone_number: string
    date_of_birth: string
    is_suspended: boolean
    is_verified: boolean
  }
  trip: {
    id: string
    routeId: string
    scheduleId: string
    busId: string
    driverId: string
    direction: string
    status: string
    tripDate: string
    driverName: string
    busName: string
  }
  liveLocation?: {
    latitude: number
    longitude: number
    speed: number
    heading: number
    accuracy: number
    isMoving: boolean
    batteryLevel: number
    networkType: string
    trackedAt: string
  }
  trackingHistory: {
    latitude: number
    longitude: number
    speed?: number
    trackedAt?: string
    address?: string
  }[]
  emergencyContacts: {
    id: string
    fullName: string
    phoneNumber: string
    relationship: string
    isPrimary: boolean
    isVerified: boolean
  }[]
  timelineHistory: {
    id: string
    message: string
    createdAt: string
  }[]
}

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const [details, setDetails] = React.useState<SOSDetails | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState(false)
  const [agentIdInput, setAgentIdInput] = React.useState("")
  const [isResolveDialogOpen, setIsResolveDialogOpen] = React.useState(false)
  const [resolutionNote, setResolutionNote] = React.useState("")

  const fetchDetails = React.useCallback(async () => {
    try {
      const [detailsRes, locationsRes] = await Promise.all([
        api.get<SOSDetails>(`/admin/sos/${id}`),
        api.get<{ locations: any[] }>(`/admin/sos/${id}/locations`)
      ])
      
      if (detailsRes.success && detailsRes.data) {
        let trackingHistory = detailsRes.data.trackingHistory || []
        if (locationsRes.success && locationsRes.data?.locations) {
          trackingHistory = locationsRes.data.locations
        }
        setDetails({
          ...detailsRes.data,
          trackingHistory
        })
      } else {
        toast.error("Failed to load incident details")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to load incident details")
    } finally {
      setLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  const fetchLiveLocation = React.useCallback(async () => {
    try {
      const res = await api.get<{
        id: string
        sosId: string
        userId: string
        tripId: string
        latitude: number
        longitude: number
        speed: number
        heading: number
        accuracy: number
        isMoving: boolean
        batteryLevel: number
        networkType: string
        trackedAt: string
      }>(`/admin/sos/${id}/live`)
      
      if (res.success && res.data) {
        const liveData = res.data
        setDetails(prev => {
          if (!prev) return null
          
          const exists = prev.trackingHistory.some(pt => pt.latitude === liveData.latitude && pt.longitude === liveData.longitude)
          const updatedHistory = exists 
            ? prev.trackingHistory 
            : [...prev.trackingHistory, {
                latitude: liveData.latitude,
                longitude: liveData.longitude,
                speed: liveData.speed,
                trackedAt: liveData.trackedAt
              }]

          return {
            ...prev,
            liveLocation: {
              latitude: liveData.latitude,
              longitude: liveData.longitude,
              speed: liveData.speed,
              heading: liveData.heading,
              accuracy: liveData.accuracy,
              isMoving: liveData.isMoving,
              batteryLevel: liveData.batteryLevel,
              networkType: liveData.networkType,
              trackedAt: liveData.trackedAt
            },
            trackingHistory: updatedHistory
          }
        })
      }
    } catch (err) {
      console.error("Error fetching live telemetry", err)
    }
  }, [id])

  // Poll for live telemetry every 10 seconds to keep map updated
  React.useEffect(() => {
    const timer = setInterval(() => {
      fetchLiveLocation()
    }, 10000)
    return () => clearInterval(timer)
  }, [fetchLiveLocation])

  const handlePatchSOS = async (body: Partial<SOSDetails["sos"]>) => {
    setActionLoading(true)
    try {
      const res = await api.patch<any>(`/admin/sos/${id}`, body)
      if (res.success) {
        toast.success("SOS updated successfully")
        fetchDetails()
      } else {
        toast.error("Failed to update SOS alert")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to update SOS alert")
    } finally {
      setActionLoading(false)
    }
  }

  const handleAssignAgent = async () => {
    if (!agentIdInput.trim()) return
    setActionLoading(true)
    try {
      const res = await api.post<any>(`/admin/sos/${id}/assign`, { agentId: agentIdInput })
      if (res.success) {
        toast.success("Agent assigned successfully")
        setAgentIdInput("")
        fetchDetails()
      } else {
        toast.error("Failed to assign agent")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to assign agent")
    } finally {
      setActionLoading(false)
    }
  }

  const handleNotifyPolice = async () => {
    setActionLoading(true)
    try {
      const res = await api.post<any>(`/admin/sos/${id}/notify-police`, {})
      if (res.success) {
        toast.success("Police notified successfully")
        fetchDetails()
      } else {
        toast.error("Failed to notify police")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to notify police")
    } finally {
      setActionLoading(false)
    }
  }

  const handleResolveSOS = async () => {
    setActionLoading(true)
    try {
      const res = await api.patch<any>(`/admin/sos/${id}/resolve`, {
        resolutionNote: resolutionNote.trim() || "Resolved by administrator."
      })
      if (res.success) {
        toast.success("SOS resolved successfully")
        setIsResolveDialogOpen(false)
        setResolutionNote("")
        fetchDetails()
      } else {
        toast.error("Failed to resolve SOS alert")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to resolve SOS alert")
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleFakeAlert = async () => {
    setActionLoading(true)
    try {
      const res = await api.patch<any>(`/admin/sos/${id}/fake-alert`, {})
      if (res.success) {
        toast.success("SOS fake status updated successfully")
        fetchDetails()
      } else {
        toast.error("Failed to update fake alert status")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to update fake alert status")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center space-y-4">
        <Siren className="h-12 w-12 text-destructive animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Loading Telemetry & Live Incident Data...</p>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="container mx-auto py-12 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Incident Not Found</h2>
        <Button onClick={() => router.push("/operations/incidents")} className="brand-gradient text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Incidents
        </Button>
      </div>
    )
  }

  const { sos, user, trip, liveLocation, trackingHistory, emergencyContacts, timelineHistory } = details

  // Center maps either on live coordinates or fallback on SOS trigger location
  const mapCenter = liveLocation 
    ? { lat: liveLocation.latitude, lng: liveLocation.longitude }
    : { lat: sos.currentLatitude, lng: sos.currentLongitude }

  const polylinePath = trackingHistory.map(pt => ({
    lat: pt.latitude,
    lng: pt.longitude
  }))

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Detail Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/operations/incidents")}
            className="pl-0 text-muted-foreground hover:text-foreground text-xs"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Incident Feed
          </Button>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">Response Control Console</h1>
            <Badge variant={sos.status === "active" ? "destructive" : "secondary"} className="uppercase font-bold tracking-wider text-[10px] h-5">
              {sos.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            SOS ID: <span className="text-foreground font-bold">{sos.id}</span> • Registered: {new Date(sos.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sos.status === "active" && (
            <Button
              variant="default"
              onClick={() => setIsResolveDialogOpen(true)}
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider h-9 shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Resolve SOS
            </Button>
          )}
          <Button
            variant={sos.isFakeAlert ? "default" : "outline"}
            onClick={handleToggleFakeAlert}
            disabled={actionLoading}
            className={`font-bold text-xs uppercase tracking-wider h-9 ${sos.isFakeAlert ? "bg-zinc-800 text-white" : "border-zinc-300 text-zinc-700"}`}
          >
            {sos.isFakeAlert ? "Flagged Fake Alarm" : "Flag as Fake"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Dynamic Telemetry Map */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border shadow-xl overflow-hidden relative h-[500px]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={14}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: false
                }}
              >
                {/* Trail line */}
                {polylinePath.length > 1 && (
                  <Polyline
                    path={polylinePath}
                    options={{
                      strokeColor: "#f43f5e",
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                      icons: [{
                        icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
                        offset: "0",
                        repeat: "20px"
                      }]
                    }}
                  />
                )}

                {/* Tracking coordinates markers */}
                {trackingHistory.map((hist, idx) => (
                  <Marker
                    key={`hist-${idx}`}
                    position={{ lat: hist.latitude, lng: hist.longitude }}
                    title={`Tracked at: ${hist.trackedAt ? new Date(hist.trackedAt).toLocaleTimeString() : ""}`}
                    icon={{
                      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="4" fill="#f43f5e" stroke="white" stroke-width="1.5"/>
                        </svg>
                      `),
                      scaledSize: new google.maps.Size(12, 12),
                      anchor: new google.maps.Point(6, 6)
                    }}
                  />
                ))}

                {/* Primary target / Current Position */}
                <Marker
                  position={mapCenter}
                  title="Live Telemetry Position"
                  icon={{
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="16" fill="#f43f5e" fill-opacity="0.2"/>
                        <circle cx="20" cy="20" r="10" fill="#f43f5e" stroke="white" stroke-width="2.5"/>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 20)
                  }}
                />
              </GoogleMap>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-white">
                <p className="text-xs uppercase font-bold tracking-widest animate-pulse">Loading Google Telematics Map...</p>
              </div>
            )}

            {/* Quick Map Overlays */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-border p-3.5 rounded-xl shadow-lg max-w-xs space-y-2">
              <div className="flex items-center justify-between gap-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Network Stream</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold text-foreground">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground block text-[9px] uppercase">Speed</span>
                  <span className="text-xs font-bold text-primary">{liveLocation?.speed ?? 0} km/h</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground block text-[9px] uppercase">Battery</span>
                  <span className="text-xs font-bold flex items-center gap-1">
                    <Battery className="h-3 w-3 text-emerald-600" /> {liveLocation?.batteryLevel ?? 100}%
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground block text-[9px] uppercase">Connection</span>
                  <span className="text-xs font-bold flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-blue-600" /> {liveLocation?.networkType ?? "LTE"}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground block text-[9px] uppercase">Accuracy</span>
                  <span className="text-xs font-bold">±{liveLocation?.accuracy ?? 5} meters</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Log History */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <History className="h-4 w-4 text-primary" /> Incident Action Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[220px]">
                <div className="p-5 space-y-4">
                  {timelineHistory.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-6">No status actions logged yet.</p>
                  ) : (
                    timelineHistory.map((historyItem, idx) => (
                      <div key={historyItem.id || idx} className="relative pl-6 pb-2 border-l border-border last:border-0 last:pb-0">
                        <span className="absolute -left-[4.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold mb-0.5">
                          <span>{new Date(historyItem.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs font-bold text-foreground leading-normal">{historyItem.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Console Response Details Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dispatch Control panel */}
          <Card className="border-border bg-zinc-950 text-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Dispatch & Support</h3>
              <Shield className="h-4 w-4 text-rose-500 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => handlePatchSOS({ emergencyDispatched: true })}
                disabled={actionLoading || sos.emergencyDispatched}
                className={`w-full h-10 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg ${
                  sos.emergencyDispatched 
                    ? "bg-emerald-950 border border-emerald-900 text-emerald-400 cursor-not-allowed" 
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10"
                }`}
              >
                <Siren className="h-3.5 w-3.5" />
                {sos.emergencyDispatched ? "Emergency Response Dispatched" : "Dispatch Emergency Support"}
              </Button>

              <Button 
                onClick={handleNotifyPolice}
                disabled={actionLoading || sos.policeNotified}
                variant="outline"
                className={`w-full h-10 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-transparent border-zinc-800 ${
                  sos.policeNotified 
                    ? "border-amber-900 text-amber-400 cursor-not-allowed hover:bg-transparent" 
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                {sos.policeNotified ? "Police Notified" : "Notify Police Authorities"}
              </Button>

              <Separator className="my-3 bg-zinc-800" />

              <div className="space-y-1.5 pt-1">
                <Label htmlFor="agent-phone" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Assign Responder Phone</Label>
                <div className="flex gap-2">
                  <Input 
                    id="agent-phone"
                    placeholder="e.g. +2348033221100"
                    value={agentIdInput}
                    onChange={(e) => setAgentIdInput(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-xs h-9 text-white placeholder-zinc-500 focus-visible:ring-rose-500"
                  />
                  <Button 
                    onClick={handleAssignAgent}
                    disabled={actionLoading || !agentIdInput.trim()}
                    className="h-9 px-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider shrink-0"
                  >
                    Assign
                  </Button>
                </div>
                {sos.agentId && (
                  <div className="mt-2 text-[10px] font-semibold bg-zinc-900/60 p-2 rounded border border-zinc-800/80 flex items-center justify-between">
                    <span className="text-zinc-400">Assigned Responder:</span>
                    <span className="font-mono text-emerald-400 font-bold">{sos.agentId}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Incident Details Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trigger Intel</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Reason</span>
                <p className="text-xs font-bold text-foreground bg-destructive/5 border border-destructive/10 p-2.5 rounded-lg italic">
                  "{sos.reason || "Suspicious behavior reported"}"
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Additional Details</span>
                <p className="text-xs text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40 leading-relaxed">
                  {sos.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Trigger</span>
                  <span className="font-bold text-foreground block capitalize">{sos.triggerSource}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Silent Alert</span>
                  <span className="font-bold text-foreground block">{sos.isSilent ? "Yes (Silent)" : "No (Normal)"}</span>
                </div>
              </div>

              <div className="space-y-1 pt-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Current Address</span>
                <p className="text-xs font-semibold text-foreground flex items-start gap-1">
                  <MapPin className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                  <span>{sos.currentAddress || "Wuse 2, Abuja"}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rider (Passenger)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm">
                  {user?.first_name?.[0]?.toUpperCase()}{user?.last_name?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-foreground truncate">{user?.first_name} {user?.last_name}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
                </div>
              </div>

              <Separator className="bg-border/60" />

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {user?.phone_number}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold"
                  onClick={() => {
                    if (user?.phone_number) {
                      window.location.href = `tel:${user.phone_number}`
                      toast.success(`Calling Rider ${user.first_name} at ${user.phone_number}...`)
                    }
                  }}
                >
                  Call Rider
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transit/Driver Info */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Driver & Trip</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Trip Reference</span>
                  <span className="font-mono font-bold text-foreground">{trip?.id || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Vehicle / Bus</span>
                  <span className="font-bold text-foreground">{trip?.busName || "City Express"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Direction</span>
                  <span className="font-semibold text-foreground uppercase text-[10px]">{trip?.direction ? `${trip.direction} Station` : "N/A"}</span>
                </div>
              </div>

              <Separator className="bg-border/60" />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    {trip?.driverName?.[0]?.toUpperCase() || "D"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground leading-tight">{trip?.driverName || "Demo Driver"}</span>
                    <span className="text-[9px] text-muted-foreground">Active Captain</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          {emergencyContacts.length > 0 && (
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="py-4 border-b">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="p-3 bg-rose-50/10 border border-rose-200/20 rounded-xl space-y-2 last:mb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{contact.fullName}</span>
                      <Badge variant="outline" className="border-rose-300 text-rose-700 bg-rose-50/20 font-extrabold text-[8px] uppercase tracking-wider px-1.5 h-4.5">
                        {contact.relationship}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border/40">
                      <span className="font-mono font-semibold text-rose-700 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {contact.phoneNumber}
                      </span>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-[10px] text-rose-600 font-bold hover:text-rose-700"
                        onClick={() => {
                          toast.success(`Opening communications block to emergency contact ${contact.fullName}...`)
                        }}
                      >
                        <Send className="mr-1 h-3 w-3" /> SMS
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resolve Incident Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">Resolve SOS Incident</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Please provide a resolution note detailing the actions taken to resolve this alert.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="resolution-note" className="text-xs font-semibold text-muted-foreground">Resolution Note</Label>
            <textarea
              id="resolution-note"
              rows={3}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="e.g. Response team dispatched, resolved peacefully."
              className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 resize-none"
            />
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsResolveDialogOpen(false)
                setResolutionNote("")
              }}
              className="text-xs font-semibold border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleResolveSOS}
              disabled={actionLoading || !resolutionNote.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Submit Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
