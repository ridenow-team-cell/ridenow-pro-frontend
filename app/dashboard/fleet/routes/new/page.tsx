"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Clock,
  Bus,
  Users,
  CreditCard,
  Plus,
  Trash2,
  ChevronLeft,
  Navigation,
  Check,
  X,
  Zap,
  ArrowRightLeft,
  Info,
  Loader2,
  AlertCircle
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
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { routesApi } from "@/lib/api/routes"
import { busStopsApi, BusStop } from "@/lib/api/bus-stops"

export default function AddRoutePage() {
  const router = useRouter()

  // Route details state
  const [isActive, setIsActive] = React.useState(true)
  const [routeName, setRouteName] = React.useState("Lekki - Ajah Express")
  const [routeCode, setRouteCode] = React.useState("R-001")
  const [baseFare, setBaseFare] = React.useState(500)

  // Dynamic Bus Stops loading
  const [availableStops, setAvailableStops] = React.useState<BusStop[]>([])
  const [loadingStops, setLoadingStops] = React.useState(true)

  // Stops list state: backend format is stops: [{ busStopId, order, defaultFare }]
  const [stopsList, setStopsList] = React.useState<Array<{
    busStopId: string
    defaultFare: number
  }>>([
    { busStopId: "", defaultFare: 0 },
    { busStopId: "", defaultFare: 500 }
  ])

  // Google Maps state
  const [isMapEngineLoaded, setIsMapEngineLoaded] = React.useState(false)
  const mapRef = React.useRef<HTMLDivElement>(null)
  const googleMapRef = React.useRef<any>(null)
  const markersRef = React.useRef<any[]>([])
  const polylineRef = React.useRef<any>(null)

  // Simulation state
  const [dwellTime, setDwellTime] = React.useState(2)
  const [isSurgeActive, setIsSurgeActive] = React.useState(false)

  // Form submission and error states
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)

  // Extra visual states
  const [isRoundtrip, setIsRoundtrip] = React.useState(false)
  const [instructions, setInstructions] = React.useState("")

  // Fetch stops list
  React.useEffect(() => {
    async function loadStops() {
      try {
        setLoadingStops(true)
        const res = await busStopsApi.getBusStops({ isActive: true, limit: 100 })
        if (res.success && res.data?.bus_stops) {
          setAvailableStops(res.data.bus_stops)
        }
      } catch (err) {
        console.error("Failed to load active bus stops:", err)
      } finally {
        setLoadingStops(false)
      }
    }
    loadStops()
  }, [])

  // Load Google Maps SDK
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if ((window as any).google) {
      setIsMapEngineLoaded(true)
      return
    }

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "AIzaSyBjpTeVMERj4TPGN8RU6UOmCtt6nnYVVqk"
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry`
    script.async = true
    script.defer = true
    script.onload = () => setIsMapEngineLoaded(true)
    script.onerror = () => console.error("Google Maps SDK failed to load.")
    document.head.appendChild(script)
  }, [])

  // Compute currently selected stops locations
  const selectedStopsData = React.useMemo(() => {
    return stopsList
      .map((stop) => {
        const matched = availableStops.find(s => s.id === stop.busStopId)
        return matched ? {
          id: matched.id,
          name: matched.name,
          lat: Number(matched.latitude),
          lng: Number(matched.longitude),
          code: matched.code
        } : null
      })
      .filter((s): s is NonNullable<typeof s> => s !== null && !isNaN(s.lat) && !isNaN(s.lng))
  }, [stopsList, availableStops])

  // Initialize Map Engine instance
  React.useEffect(() => {
    if (!isMapEngineLoaded || !mapRef.current || typeof window === "undefined" || googleMapRef.current) return

    const google = (window as any).google
    if (!google) return

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: 6.5244, lng: 3.3792 }, // Default center to Lagos
      zoom: 12,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{ "color": "#dedede" }, { "lightness": 21 }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }]
        },
        {
          "elementType": "labels.icon",
          "stylers": [{ "visibility": "off" }]
        }
      ]
    })

    googleMapRef.current = mapInstance
  }, [isMapEngineLoaded])

  // Update Markers and Polyline Flight Path
  React.useEffect(() => {
    if (!googleMapRef.current || typeof window === "undefined") return

    const google = (window as any).google
    if (!google) return

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    // Clear old polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }

    if (selectedStopsData.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    const pathCoords: any[] = []

    selectedStopsData.forEach((stop, idx) => {
      const isStart = idx === 0
      const isEnd = idx === selectedStopsData.length - 1
      const pos = { lat: stop.lat, lng: stop.lng }
      pathCoords.push(pos)
      bounds.extend(pos)

      // Color scheme matches sequence timeline UI
      const markerColor = isStart ? "#3b82f6" : isEnd ? "#10b981" : "#f59e0b"

      const marker = new google.maps.Marker({
        position: pos,
        map: googleMapRef.current,
        title: stop.name,
        label: {
          text: (idx + 1).toString(),
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "11px"
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2.5,
          scale: 13,
        }
      })

      // Interactive detail info card
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 180px;">
            <p style="margin: 0; font-weight: 700; font-size: 12px; color: #1e293b;">${stop.name}</p>
            <p style="margin: 2px 0 0 0; font-size: 10px; font-weight: 600; color: #3b82f6;">Stop Sequence #${idx + 1}</p>
            <p style="margin: 1px 0 0 0; font-size: 9px; font-weight: 500; color: #64748b;">Code: ${stop.code}</p>
          </div>
        `
      })

      marker.addListener("click", () => {
        infoWindow.open(googleMapRef.current, marker)
      })

      markersRef.current.push(marker)
    })

    // Auto centering & zooming fitting bounds
    if (selectedStopsData.length === 1) {
      googleMapRef.current.setCenter(pathCoords[0])
      googleMapRef.current.setZoom(14)
    } else if (selectedStopsData.length > 1) {
      googleMapRef.current.fitBounds(bounds)
      // Draw Polyline path that follows the roads
      const directionsService = new google.maps.DirectionsService()
      const waypoints = selectedStopsData.slice(1, -1).map(stop => ({
        location: new google.maps.LatLng(stop.lat, stop.lng),
        stopover: true
      }))

      directionsService.route(
        {
          origin: new google.maps.LatLng(selectedStopsData[0].lat, selectedStopsData[0].lng),
          destination: new google.maps.LatLng(
            selectedStopsData[selectedStopsData.length - 1].lat,
            selectedStopsData[selectedStopsData.length - 1].lng
          ),
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result: any, status: string) => {
          if (polylineRef.current) {
            polylineRef.current.setMap(null)
          }

          if (status === "OK" && result && result.routes && result.routes[0]) {
            const polylineInstance = new google.maps.Polyline({
              path: result.routes[0].overview_path,
              geodesic: true,
              strokeColor: "#3b82f6",
              strokeOpacity: 0.85,
              strokeWeight: 4,
            })
            polylineInstance.setMap(googleMapRef.current)
            polylineRef.current = polylineInstance
          } else {
            console.warn("Directions request failed: " + status + ". Falling back to straight lines.")
            const polylineInstance = new google.maps.Polyline({
              path: pathCoords,
              geodesic: true,
              strokeColor: "#3b82f6",
              strokeOpacity: 0.85,
              strokeWeight: 4,
            })
            polylineInstance.setMap(googleMapRef.current)
            polylineRef.current = polylineInstance
          }
        }
      )
    }
  }, [selectedStopsData, isMapEngineLoaded])

  // Simulation logic derived states
  const totalDwellOverhead = React.useMemo(() => stopsList.length * dwellTime, [stopsList, dwellTime])
  const estimatedTransitTime = React.useMemo(() => 25 + (stopsList.length * 5) + totalDwellOverhead, [stopsList, totalDwellOverhead])

  const handleAddStop = () => {
    if (stopsList.length < 8) {
      const newStops = [...stopsList]
      newStops.splice(stopsList.length - 1, 0, { busStopId: "", defaultFare: baseFare })
      setStopsList(newStops)
    }
  }

  const handleRemoveStop = (index: number) => {
    if (stopsList.length > 2) {
      setStopsList(stopsList.filter((_, idx) => idx !== index))
    }
  }

  const handleStopChange = (index: number, busStopId: string) => {
    const updated = [...stopsList]
    updated[index].busStopId = busStopId
    setStopsList(updated)
  }

  const handleStopFareChange = (index: number, fare: number) => {
    const updated = [...stopsList]
    updated[index].defaultFare = fare
    setStopsList(updated)
  }

  const handleSaveRoute = async () => {
    try {
      setSubmitError(null)
      setIsSubmitting(true)

      // Validations
      if (!routeName.trim()) {
        throw new Error("Please enter a valid route name.")
      }
      if (!routeCode.trim()) {
        throw new Error("Please enter a valid route code.")
      }
      if (stopsList.some(stop => !stop.busStopId)) {
        throw new Error("All stops in the corridor must have a selected physical location.")
      }

      // Map stops to add order
      const stopsPayload = stopsList.map((stop, index) => ({
        busStopId: stop.busStopId,
        order: index + 1,
        defaultFare: stop.defaultFare
      }))

      const response = await routesApi.createRoute({
        name: routeName,
        code: routeCode,
        baseFare: Number(baseFare) || 0,
        stops: stopsPayload,
        isActive
      })

      if (response.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          router.push("/dashboard/fleet/routes")
        }, 1500)
      } else {
        setSubmitError(response.message || "Failed to create route.")
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred during creation.")
    } finally {
      setIsSubmitting(false)
    }
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
              disabled={isSubmitting}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Route Designer
            </h1>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={`h-5 text-[10px] font-semibold px-2 border-none ${isActive ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
            >
              {isActive ? "Active" : "Paused"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-11">
            Build and optimize the operational parameters of your fleet routes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveRoute}
            disabled={isSubmitting || submitSuccess}
            size="sm"
            className="h-9 px-6 font-semibold shadow-sm bg-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : submitSuccess ? (
              "Created successfully!"
            ) : (
              "Save Route Config"
            )}
          </Button>
        </div>
      </div>

      {/* Submission Feedback */}
      {submitError && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2 shadow-sm animate-pulse">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          <span>Route successfully logged into database! Redirecting to dashboard...</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Route Configuration */}
        <div className="lg:col-span-8 space-y-6">

          {/* Route Definition */}
          <Card className="border-border bg-card overflow-hidden rounded-xl shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Operational Mapping</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Route Name */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground">Route Name / Corridor</Label>
                  <Input
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="e.g. Lekki - Ajah Express"
                    className="h-11 font-medium bg-muted/20 border-border"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground">Route Code</Label>
                  <Input
                    value={routeCode}
                    onChange={(e) => setRouteCode(e.target.value)}
                    placeholder="e.g. R-001"
                    className="h-11 font-medium bg-muted/20 border-border uppercase"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Roundtrip Configuration */}
              <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ArrowRightLeft className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Roundtrip Configuration</p>
                    <p className="text-xs text-muted-foreground font-medium">Automatically generate a return route for this corridor.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{isRoundtrip ? "Enabled" : "Disabled"}</span>
                  <Switch checked={isRoundtrip} onCheckedChange={setIsRoundtrip} disabled={isSubmitting} />
                </div>
              </div>

              {/* Specific Instructions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Specific Operational Instructions</Label>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <textarea
                  className="w-full min-h-[80px] p-4 rounded-xl bg-muted/20 border border-border text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter specific instructions for drivers on this route (e.g., 'Avoid peak traffic via bypass')...."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Stops Configuration */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ordered Stops & Fares</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddStop}
                    disabled={stopsList.length >= 8 || isSubmitting}
                    className="h-7 text-xs font-semibold text-primary"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add intermediate stop
                  </Button>
                </div>

                <div className="relative pl-8 space-y-4">
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-muted rounded-full" />

                  {stopsList.map((stop, idx) => {
                    const isStart = idx === 0
                    const isEnd = idx === stopsList.length - 1

                    return (
                      <div key={idx} className="relative flex items-center gap-4 group">
                        <div className={`absolute -left-7 h-4 w-4 rounded-full border-4 border-background z-10 ${isStart ? 'bg-primary' :
                          isEnd ? 'bg-emerald-500' :
                            'bg-amber-500'
                          }`} />

                        <div className="flex-1 flex flex-col gap-3 p-4 bg-muted/30 border border-border rounded-xl hover:border-primary/50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1 space-y-2">
                              <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                                {isStart ? "Start Hub (Order #1)" : isEnd ? `Destination Hub (Order #${stopsList.length})` : `Stop Order #${idx + 1}`}
                              </Label>
                              <Select
                                value={stop.busStopId}
                                onValueChange={(val) => handleStopChange(idx, val)}
                                disabled={isSubmitting}
                              >
                                <SelectTrigger className="h-10 bg-background border-border text-xs font-semibold">
                                  <SelectValue placeholder={loadingStops ? "Syncing Virtual Stops..." : "Choose Bus Stop..."} />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableStops.map(bs => (
                                    <SelectItem key={bs.id} value={bs.id}>
                                      {bs.name} ({bs.code}) • {bs.city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="w-full md:w-36 space-y-2">
                              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Fare contribution</Label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  value={stop.defaultFare}
                                  onChange={(e) => handleStopFareChange(idx, Number(e.target.value) || 0)}
                                  className="h-10 text-xs font-bold bg-background border-border"
                                  placeholder="e.g. 500"
                                  disabled={isSubmitting}
                                />
                                <span className="absolute right-3 top-3 text-[9px] font-bold text-muted-foreground">₦</span>
                              </div>
                            </div>

                            {!isStart && !isEnd && (
                              <div className="flex items-center justify-end self-end h-10">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveStop(idx)}
                                  className="h-9 w-9 text-rose-500 rounded-lg hover:bg-rose-500/10"
                                  disabled={isSubmitting}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Credit Configuration */}
          <Card className="border-border bg-card rounded-xl shadow-sm overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="pb-4 bg-muted/10 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider">Corridor Fare Configuration</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold">
                  ₦ Price Matrix
                </Badge>
              </div>
              <CardDescription className="text-[11px] text-muted-foreground font-medium mt-1">
                Define the default operational base fare for passengers on this corridor and see projected load yields.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-12">
                {/* Left Column: Interactive Input & Presets */}
                <div className="md:col-span-7 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Base Corridor Fare (₦)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={baseFare}
                        onChange={(e) => setBaseFare(Number(e.target.value) || 0)}
                        className="h-11 pl-8 pr-12 text-base font-bold bg-muted/10 border-border"
                        placeholder="e.g. 500"
                        disabled={isSubmitting}
                      />
                      <span className="absolute left-3 top-3.5 text-xs font-bold text-muted-foreground">₦</span>
                      <span className="absolute right-3 top-3.5 text-[9px] font-bold text-muted-foreground uppercase">₦</span>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick Presets</span>
                    <div className="flex flex-wrap gap-2">
                      {[200, 500, 1000, 1500, 2000].map((preset) => (
                        <Button
                          key={preset}
                          type="button"
                          variant={baseFare === preset ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBaseFare(preset)}
                          className="h-8 text-xs font-bold px-3 rounded-lg"
                          disabled={isSubmitting}
                        >
                          ₦{preset}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Transit Simulation & Dwell Intel */}
          <Card className="border-border bg-card rounded-xl shadow-sm overflow-hidden border-l-4 border-l-amber-500">
            <CardHeader className="pb-4 bg-muted/10 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider">Transit Time & Dwell Simulator</CardTitle>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 border-none text-[10px] font-bold h-5 px-2 uppercase">Simulation ONLY</Badge>
              </div>
              <CardDescription className="text-[11px] text-muted-foreground font-medium mt-1">
                Simulate travel timelines and boarding overheads dynamically based on intermediate stops.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-12">
                {/* Left Side: Controls */}
                <div className="md:col-span-7 space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-bold text-slate-700">Dwell Time per Stop</Label>
                      <span className="text-xs font-bold text-amber-600">{dwellTime} mins</span>
                    </div>
                    <Slider
                      value={[dwellTime]}
                      onValueChange={(val) => setDwellTime(val[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <p className="text-[10px] text-muted-foreground font-medium mt-1">
                      Set wait times at each physical stop along the corridor.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Simulate Peak Hour Surge</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 font-medium">Rush hour traffic premium preview.</p>
                    </div>
                    <Switch checked={isSurgeActive} onCheckedChange={setIsSurgeActive} />
                  </div>
                </div>

                {/* Right Side: Visual Metrics Output */}
                <div className="md:col-span-5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Simulated Transit Metrics</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Estimated timeline impacts on schedule.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium border-b border-amber-500/10 pb-1.5">
                      <span className="text-slate-500">Boarding Overhead</span>
                      <span className="font-bold text-slate-800">{totalDwellOverhead} mins</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium border-b border-amber-500/10 pb-1.5">
                      <span className="text-slate-500">Est. Total Duration</span>
                      <span className="font-bold text-slate-800">{estimatedTransitTime} mins</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-slate-500">Peak Surge Target</span>
                      <span className="font-bold text-emerald-600">
                        ₦{isSurgeActive ? Math.round(baseFare * 1.5) : baseFare}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Persistent Google Maps View Container & Stop LEDGER */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border bg-card rounded-xl overflow-hidden shadow-sm h-[500px] relative flex flex-col">
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border border-border h-7 gap-2 px-3 shadow-sm">
                <Navigation className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Live GIS preview</span>
              </Badge>
            </div>

            {/* Persistently mounted Map div, ensuring google.maps.Map initiates immediately on DOM mount */}
            <div className="flex-1 w-full h-full relative">
              <div ref={mapRef} className="w-full h-full rounded-xl" />

              {/* Loader Overlay when Maps SDK is fetching */}
              {!isMapEngineLoaded && (
                <div className="absolute inset-0 bg-muted/80 flex flex-col items-center justify-center gap-3 z-20 rounded-xl">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground font-semibold">Loading Map Engine...</p>
                </div>
              )}

              {/* Welcome Placeholder Overlay shown when no stops are actively selected */}
              {isMapEngineLoaded && selectedStopsData.length === 0 && (
                <div className="absolute inset-0 bg-muted/95 flex flex-col items-center justify-center p-6 text-center gap-3 z-20 rounded-xl">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">No stops mapped yet</p>
                    <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px] mx-auto font-semibold leading-relaxed">
                      Select bus stops on the left to display their coordinates, order, and polyline sequence paths on the interactive map.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Dynamic Stop Sequence Timeline Summary */}
          {selectedStopsData.length > 0 && (
            <Card className="border-border bg-card rounded-xl shadow-sm overflow-hidden border-t-4 border-t-primary animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CardHeader className="pb-3 border-b border-border bg-muted/10">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Corridor Sequence Ledger
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-2.5 top-1 bottom-1 w-0.5 bg-muted rounded-full" />

                  {selectedStopsData.map((stop, idx) => {
                    const isStart = idx === 0
                    const isEnd = idx === selectedStopsData.length - 1
                    const bulletColor = isStart ? "bg-primary" : isEnd ? "bg-emerald-500" : "bg-amber-500"

                    return (
                      <div key={stop.id} className="relative flex items-center justify-between text-xs py-0.5">
                        <div className={`absolute -left-[19px] h-2.5 w-2.5 rounded-full border-2 border-background ${bulletColor}`} />
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{stop.name}</p>
                          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                            Sequence Order #{idx + 1} • {stop.code}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₦{stopsList[idx]?.defaultFare || 0}</p>
                          <p className="text-[8px] text-muted-foreground font-semibold uppercase tracking-wider">Contribution</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
