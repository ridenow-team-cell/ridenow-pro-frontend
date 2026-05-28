"use client"

import * as React from "react"
import { 
  ShieldCheck, 
  History, 
  ArrowRight, 
  Info, 
  Clock, 
  CheckCircle2, 
  XCircle
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AccessControlPage() {
  const [hardExpiryBlock, setHardExpiryBlock] = React.useState(true)
  const [dynamicGracePeriod, setDynamicGracePeriod] = React.useState(true)
  const [fraudDetection, setFraudDetection] = React.useState(true)
  const [gracePeriodCommutes, setGracePeriodCommutes] = React.useState(3)
  const [isSaved, setIsSaved] = React.useState(false)

  // Load from local storage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHardExpiry = localStorage.getItem("access_hardExpiryBlock")
      const storedGracePeriod = localStorage.getItem("access_dynamicGracePeriod")
      const storedFraud = localStorage.getItem("access_fraudDetection")
      const storedCommutes = localStorage.getItem("access_gracePeriodCommutes")

      if (storedHardExpiry !== null) setHardExpiryBlock(storedHardExpiry === "true")
      if (storedGracePeriod !== null) setDynamicGracePeriod(storedGracePeriod === "true")
      if (storedFraud !== null) setFraudDetection(storedFraud === "true")
      if (storedCommutes !== null) setGracePeriodCommutes(parseInt(storedCommutes, 10))
    }
  }, [])

  const saveState = (
    hardExpiry: boolean,
    gracePeriod: boolean,
    fraud: boolean,
    commutes: number
  ) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_hardExpiryBlock", String(hardExpiry))
      localStorage.setItem("access_dynamicGracePeriod", String(gracePeriod))
      localStorage.setItem("access_fraudDetection", String(fraud))
      localStorage.setItem("access_gracePeriodCommutes", String(commutes))
    }
  }

  const handleHardExpiryChange = (val: boolean) => {
    setHardExpiryBlock(val)
    saveState(val, dynamicGracePeriod, fraudDetection, gracePeriodCommutes)
  }

  const handleDynamicGraceChange = (val: boolean) => {
    setDynamicGracePeriod(val)
    saveState(hardExpiryBlock, val, fraudDetection, gracePeriodCommutes)
  }

  const handleFraudDetectionChange = (val: boolean) => {
    setFraudDetection(val)
    saveState(hardExpiryBlock, dynamicGracePeriod, val, gracePeriodCommutes)
  }

  const handleCommutesChange = (val: number) => {
    const newVal = Math.max(0, val)
    setGracePeriodCommutes(newVal)
    saveState(hardExpiryBlock, dynamicGracePeriod, fraudDetection, newVal)
  }

  const handleApplyChanges = () => {
    saveState(hardExpiryBlock, dynamicGracePeriod, fraudDetection, gracePeriodCommutes)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Access Control Engine
          </h1>
          <p className="text-sm text-muted-foreground">
            System-level logic governing ride permissions and subscription validation.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 border-border">
            <History className="mr-2 h-4 w-4 text-muted-foreground" />
            Audit Logs
          </Button>
          <Button 
            size="sm" 
            className={`h-9 px-4 font-semibold transition-all ${isSaved ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
            onClick={handleApplyChanges}
          >
            {isSaved ? "Changes Applied!" : "Apply Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border bg-card overflow-hidden">
             <CardHeader className="bg-muted/20 border-b border-border pb-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base font-bold">Validation Logic</CardTitle>
                   </div>
                   <Badge variant="outline" className="text-[10px] font-bold border-none bg-emerald-50 text-emerald-700 uppercase tracking-widest h-5">SYSTEM: ACTIVE</Badge>
                </div>
                <CardDescription className="text-xs">Rules that determine if a user can board a bus.</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-border">
                   <div className="p-6 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div className="space-y-1 flex-1">
                         <div className="flex items-center gap-2">
                            <Label className="text-sm font-bold">Hard Expiry Block</Label>
                            <Badge className="h-4 text-[8px] font-black uppercase tracking-widest bg-rose-600 border-none">CRITICAL</Badge>
                         </div>
                         <p className="text-[11px] text-muted-foreground pr-8 leading-relaxed">
                            Immediately block QR code validation if the subscription has reached its exact end date.
                         </p>
                      </div>
                      <Switch checked={hardExpiryBlock} onCheckedChange={handleHardExpiryChange} />
                   </div>
                   <div className="p-6 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div className="space-y-1 flex-1">
                         <div className="flex items-center gap-2">
                            <Label className="text-sm font-bold">Dynamic Grace Period</Label>
                            <Badge variant="outline" className="h-4 text-[8px] font-black uppercase tracking-widest bg-muted border-none text-muted-foreground">OPTIONAL</Badge>
                         </div>
                         <p className="text-[11px] text-muted-foreground pr-8 leading-relaxed">
                            Allow 1 additional ride after expiry if an auto-renewal attempt is already "In-Progress".
                         </p>
                      </div>
                      <Switch checked={dynamicGracePeriod} onCheckedChange={handleDynamicGraceChange} />
                   </div>
                   <div className="p-6 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div className="space-y-1 flex-1">
                         <div className="flex items-center gap-2">
                            <Label className="text-sm font-bold">Fraud Detection (Parallel Rides)</Label>
                            <Badge className="h-4 text-[8px] font-black uppercase tracking-widest bg-amber-500 border-none">WARNING</Badge>
                         </div>
                         <p className="text-[11px] text-muted-foreground pr-8 leading-relaxed">
                            Block validation if the same subscription is scanned on two different buses within 30 minutes.
                         </p>
                      </div>
                      <Switch checked={fraudDetection} onCheckedChange={handleFraudDetectionChange} />
                   </div>
                </div>
             </CardContent>
          </Card>

          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</AlertTitle>
            <AlertDescription className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              Adjusting the grace period logic affects roughly 1.2% of daily commutes. Ensure billing retries are synchronized.
            </AlertDescription>
          </Alert>
        </div>

        <div className="lg:col-span-3 space-y-6">
            <Card className="border-border bg-card overflow-hidden">
              <CardHeader className="border-b border-border pb-4">
                 <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-bold uppercase tracking-wider">Grace Period Tuning</CardTitle>
                 </div>
                 <CardDescription className="text-xs">Current setting: <span className="font-bold text-foreground">{gracePeriodCommutes} Commutes</span></CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                 <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Set how many times a user can ride after their subscription expires before hard-blocking.
                 </p>
                 <div className="flex items-center justify-between bg-muted p-4 rounded border border-border">
                    <Button 
                       variant="outline" 
                       size="icon" 
                       className="h-8 w-8 bg-card border-border font-bold text-base"
                       onClick={() => handleCommutesChange(gracePeriodCommutes - 1)}
                    >-</Button>
                    <span className="text-2xl font-black tabular-nums tracking-tighter">
                       {gracePeriodCommutes.toString().padStart(2, '0')}
                    </span>
                    <Button 
                       variant="outline" 
                       size="icon" 
                       className="h-8 w-8 bg-card border-border font-bold text-base"
                       onClick={() => handleCommutesChange(gracePeriodCommutes + 1)}
                    >+</Button>
                 </div>
                 {gracePeriodCommutes === 0 ? (
                    <div className="flex items-center gap-2 text-rose-600 text-[10px] font-bold uppercase tracking-widest">
                       <XCircle className="h-3.5 w-3.5" />
                       No Grace Period (Strict Block)
                    </div>
                 ) : (
                    <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                       <CheckCircle2 className="h-3.5 w-3.5" />
                       Optimal for User Retention
                    </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
