"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  MoreHorizontal, 
  AlertTriangle, 
  Wrench, 
  MessageSquare, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Siren,
  ArrowRight,
  History,
  User,
  Phone,
  Mail,
  Send,
  Navigation
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { GoogleMap, Marker, useJsApiLoader, Polyline } from "@react-google-maps/api"
import { toast } from "sonner"

// Mock Incident Data - Modified to show zero/empty states by default
const incidents: any[] = []

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = React.useState<any>(null)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = React.useState(false)
  const [messageType, setMessageType] = React.useState<"driver" | "emergency">("driver")
  const [messageText, setMessageText] = React.useState("")
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const handleSendMessage = () => {
    toast.success(`Message sent to ${messageType === "driver" ? "Driver" : "Emergency Contact"}`)
    setIsMessageDialogOpen(false)
    setMessageText("")
  }

  const openMessageDialog = (type: "driver" | "emergency") => {
    setMessageType(type)
    setIsMessageDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidents & Emergency</h1>
          <p className="text-muted-foreground">Manage active emergencies and operational incidents.</p>
        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-12 h-[calc(100vh-200px)]">
        {/* Incident List Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search incidents..." className="pl-9 bg-background border-border" disabled />
          </div>
          
          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Active Stream</CardTitle>
                <Badge variant="secondary" className="font-bold">{incidents.length}</Badge>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="divide-y h-full flex flex-col justify-center">
                {incidents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 my-20">
                     <CheckCircle2 className="h-10 w-10 text-emerald-500/60 animate-pulse" />
                     <div className="space-y-1">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Zero Active Incidents</h4>
                        <p className="text-[10px] text-muted-foreground leading-normal max-w-[200px] mx-auto">All campus corridors and assets are reporting nominal operations.</p>
                     </div>
                  </div>
                ) : (
                  incidents.map((inc) => (
                    <div 
                      key={inc.id} 
                      onClick={() => setSelectedIncident(inc)}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedIncident?.id === inc.id ? 'bg-muted' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {inc.type === 'SOS Alert' ? <Siren className="h-4 w-4 text-destructive animate-pulse" /> : 
                           inc.severity === 'Critical' ? <AlertTriangle className="h-4 w-4 text-destructive" /> : 
                           <Clock className="h-4 w-4 text-muted-foreground" />}
                          <span className="text-xs font-medium text-muted-foreground">{inc.id}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{inc.time}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">{inc.type}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {inc.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant={
                          inc.severity === 'Critical' ? 'destructive' : 
                          inc.severity === 'High' ? 'default' : 'secondary'
                        } className="text-[10px]">
                          {inc.status}
                        </Badge>
                        <span className="text-[10px] font-medium uppercase text-muted-foreground">{inc.asset}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Detailed View & Map */}
        <Card className="lg:col-span-8 flex flex-col overflow-hidden border-border bg-card">
          {selectedIncident ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={selectedIncident.severity === 'Critical' ? 'destructive' : 'outline'}>
                      {selectedIncident.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{selectedIncident.id}</span>
                  </div>
                  <h2 className="text-xl font-bold">{selectedIncident.type}</h2>
                  <p className="text-sm text-muted-foreground">{selectedIncident.location} • Asset {selectedIncident.asset}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openMessageDialog("driver")}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Message Driver
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = `tel:${selectedIncident.driverPhone || ''}`}>
                        Call Driver
                      </DropdownMenuItem>
                      <DropdownMenuItem>Assign Team</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Escalate Incident</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                {/* Details */}
                <ScrollArea className="border-r h-full">
                  <div className="p-6 flex flex-col gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground">Description</h4>
                      <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md border italic">
                        "{selectedIncident.desc}"
                      </p>
                    </div>

                    {selectedIncident.type === "SOS Alert" && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Driver & Emergency Contact</h4>
                          <div className="space-y-4">
                            <Card className="shadow-none border-border">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-semibold">{selectedIncident.driverName}</span>
                                  </div>
                                  <Badge variant="outline">Driver</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedIncident.driverPhone}</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="shadow-none border-primary/20 bg-primary/5">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold">{selectedIncident.emergencyContact.name}</span>
                                  </div>
                                  <Badge variant="outline" className="border-primary/30 text-primary">Emergency Contact</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1 font-medium text-foreground"><Phone className="h-3 w-3" /> {selectedIncident.emergencyContact.phone}</span>
                                  <span className="text-[10px] uppercase font-bold text-primary/70">{selectedIncident.emergencyContact.relationship}</span>
                                </div>
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="h-auto p-0 text-xs text-primary font-bold"
                                  onClick={() => openMessageDialog("emergency")}
                                >
                                  <Send className="mr-1.5 h-3 w-3" /> Message Emergency Contact
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Location History</h4>
                          <div className="relative pl-4 space-y-4 before:absolute before:left-1 before:top-1 before:bottom-1 before:w-0.5 before:bg-muted">
                            {selectedIncident.locationHistory?.map((loc: any, i: number) => (
                              <div key={i} className="relative flex items-center justify-between">
                                <div className="absolute -left-[18px] h-2 w-2 rounded-full bg-muted border-2 border-background" />
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</span>
                                  <span className="text-[10px] text-muted-foreground">{loc.time}</span>
                                </div>
                                {i === selectedIncident.locationHistory.length - 1 && <Badge variant="outline" className="h-5 text-[9px] bg-emerald-50 text-emerald-600 border-emerald-100">Current</Badge>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground">Status Workflow</h4>
                      <div className="flex items-center gap-2 py-2">
                        {['Open', 'Assigned', 'Resolved'].map((step, i) => (
                          <React.Fragment key={step}>
                            <div className="flex items-center gap-2">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                selectedIncident.status === step 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>{i + 1}</div>
                              <span className={`text-[10px] font-medium ${selectedIncident.status === step ? 'text-primary' : 'text-muted-foreground'}`}>{step}</span>
                            </div>
                            {i < 2 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Response ETA</p>
                        <p className="text-sm font-semibold">4 Minutes</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Assigned Unit</p>
                        <p className="text-sm font-semibold">Response Team 04</p>
                      </div>
                    </div>

                    <div className="pt-4 mt-auto">
                      <Button className="w-full">
                         Dispatch Emergency Support
                      </Button>
                    </div>
                  </div>
                </ScrollArea>

                {/* GIS View */}
                <div className="relative bg-muted h-full">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={{ lat: selectedIncident.lat, lng: selectedIncident.lng }}
                      zoom={15}
                    >
                      <Marker 
                        position={{ lat: selectedIncident.lat, lng: selectedIncident.lng }} 
                        label={selectedIncident.type === "SOS Alert" ? "!" : ""}
                      />
                      {selectedIncident.locationHistory && (
                        <>
                          <Polyline 
                            path={selectedIncident.locationHistory}
                            options={{ strokeColor: "#f43f5e", strokeOpacity: 0.6, strokeWeight: 3 }}
                          />
                          {selectedIncident.locationHistory.map((loc: any, i: number) => (
                            <Marker 
                              key={i}
                              position={{ lat: loc.lat, lng: loc.lng }}
                              icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 4,
                                fillColor: "#f43f5e",
                                fillOpacity: 0.4,
                                strokeColor: "#ffffff",
                                strokeWeight: 1
                              }}
                            />
                          ))}
                        </>
                      )}
                    </GoogleMap>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold">Loading Maps...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-card border-none">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 animate-pulse">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-base font-bold text-foreground">Emergency Console Ready</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2 leading-relaxed">
                 The live GIS telemetry network is scanning transit corridors. Zero active breakdowns, accidents, or driver SOS alert signals detected.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Message Trigger Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-border bg-card">
          <DialogHeader>
            <DialogTitle>Send Protocol Message</DialogTitle>
            <DialogDescription>
              Trigger a direct message to the {messageType === "driver" ? "Driver" : "Emergency Contact"} via SMS and App.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground">Recipient</p>
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {messageType === "driver" ? selectedIncident?.driverName : selectedIncident?.emergencyContact.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {messageType === "driver" ? selectedIncident?.driverPhone : selectedIncident?.emergencyContact.phone}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground">Message Content</p>
              <Textarea 
                placeholder="Enter your emergency message here..." 
                className="min-h-[120px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendMessage}>
              <Send className="mr-2 h-4 w-4" /> Trigger Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
