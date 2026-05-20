"use client"

import * as React from "react"
import { 
  Settings2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Globe, 
  Scale, 
  Save, 
  RefreshCw, 
  AlertTriangle,
  Building2,
  Lock,
  CheckCircle2,
  HelpCircle,
  Truck,
  Activity,
  CheckCircle,
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  getOperationsSettings,
  updateOperationsSettings,
  getOrganizationSettings,
  updateOrganizationSettings,
  type OperationsSettings,
  type OrganizationSettings
} from "@/lib/api/settings"

export default function SettingsPage() {
  const [opsSettings, setOpsSettings] = React.useState<OperationsSettings | null>(null)
  const [orgSettings, setOrgSettings] = React.useState<OrganizationSettings | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [notification, setNotification] = React.useState<{ type: 'success' | 'error', message: string } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchSettings = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const [ops, org] = await Promise.all([
        getOperationsSettings(),
        getOrganizationSettings()
      ])
      if (ops.success && ops.data) setOpsSettings(ops.data)
      if (org.success && org.data) setOrgSettings(org.data)
    } catch (err) {
      console.error("Failed to fetch settings:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSaveOps = async () => {
    if (!opsSettings) return
    try {
      setIsSaving(true)
      const res = await updateOperationsSettings(opsSettings)
      if (res.success) {
        showNotification('success', 'Operations settings updated successfully.')
      } else {
        showNotification('error', res.message || 'Failed to update operations settings.')
      }
    } catch (err) {
      console.error("Failed to save ops settings:", err)
      showNotification('error', 'Network error while saving operations settings.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveOrg = async () => {
    if (!orgSettings) return
    try {
      setIsSaving(true)
      const res = await updateOrganizationSettings(orgSettings)
      if (res.success) {
        showNotification('success', 'Organization settings updated successfully.')
      } else {
        showNotification('error', res.message || 'Failed to update organization settings.')
      }
    } catch (err) {
      console.error("Failed to save org settings:", err)
      showNotification('error', 'Network error while saving organization settings.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Synchronizing with command center...</div>
  }

  return (
    <div className="space-y-8 pt-4 pb-12 px-6">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-4 right-6 z-50 p-4 rounded-lg shadow-lg border animate-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <p className="text-sm font-bold">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Settings</h1>
          <p className="text-sm text-muted-foreground font-medium">
             Manage global platform parameters, safety thresholds, and organizational identity.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold gap-2" onClick={fetchSettings}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Sync
           </Button>
        </div>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border border-border">
          <TabsTrigger value="operations" className="text-xs font-bold uppercase tracking-wider px-6 h-8">Operations</TabsTrigger>
          <TabsTrigger value="organization" className="text-xs font-bold uppercase tracking-wider px-6 h-8">Organization</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
           <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-border shadow-sm">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                       <AlertTriangle className="h-4 w-4 text-primary" /> Cancellation Policy
                    </CardTitle>
                    <CardDescription className="text-[10px]">Configure penalties and grace windows for user cancellations.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Fee Percent (%)</Label>
                          <Input 
                             type="number" 
                             className="h-10 bg-muted/20" 
                             value={opsSettings?.cancellationPolicy.cancellationFeePercent}
                             onChange={(e) => {
                                const val = parseFloat(e.target.value)
                                setOpsSettings(prev => prev ? ({
                                   ...prev,
                                   cancellationPolicy: { ...prev.cancellationPolicy, cancellationFeePercent: isNaN(val) ? 0 : val }
                                }) : null)
                             }}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Free Window (Hours)</Label>
                          <Input 
                             type="number" 
                             className="h-10 bg-muted/20" 
                             value={opsSettings?.cancellationPolicy.freeCancellationWindowHours}
                             onChange={(e) => {
                                const val = parseInt(e.target.value)
                                setOpsSettings(prev => prev ? ({
                                   ...prev,
                                   cancellationPolicy: { ...prev.cancellationPolicy, freeCancellationWindowHours: isNaN(val) ? 0 : val }
                                }) : null)
                             }}
                          />
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                       <Settings2 className="h-4 w-4 text-primary" /> Global State
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase">Operations Active</p>
                          <p className="text-[9px] text-muted-foreground">{opsSettings?.isActive ? 'Platform is Online' : 'Platform is Suspended'}</p>
                       </div>
                       <Switch 
                          checked={opsSettings?.isActive} 
                          onCheckedChange={(checked) => setOpsSettings(prev => prev ? ({ ...prev, isActive: checked }) : null)}
                       />
                    </div>
                    <Button 
                       className="w-full h-10 bg-primary font-bold uppercase tracking-widest text-[10px] gap-2"
                       onClick={handleSaveOps}
                       disabled={isSaving}
                    >
                       {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                       Save Operations
                    </Button>
                 </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-border shadow-sm">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                       <Clock className="h-4 w-4 text-primary" /> Operating Hours
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Opening Time</Label>
                          <Input 
                             className="h-10 bg-muted/20" 
                             value={opsSettings?.operatingHours.openingTime}
                             onChange={(e) => setOpsSettings(prev => prev ? ({
                                ...prev,
                                operatingHours: { ...prev.operatingHours, openingTime: e.target.value }
                             }) : null)}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Closing Time</Label>
                          <Input 
                             className="h-10 bg-muted/20" 
                             value={opsSettings?.operatingHours.closingTime}
                             onChange={(e) => setOpsSettings(prev => prev ? ({
                                ...prev,
                                operatingHours: { ...prev.operatingHours, closingTime: e.target.value }
                             }) : null)}
                          />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Service Days</Label>
                       <div className="flex flex-wrap gap-2">
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                             <Badge 
                                key={day}
                                variant={opsSettings?.operatingHours.operatingDays.includes(day) ? 'default' : 'outline'}
                                className={`cursor-pointer px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${opsSettings?.operatingHours.operatingDays.includes(day) ? 'bg-primary' : 'bg-muted/10 opacity-50'}`}
                                onClick={() => {
                                   if (!opsSettings) return
                                   const current = opsSettings.operatingHours.operatingDays
                                   const next = current.includes(day) 
                                      ? current.filter(d => d !== day)
                                      : [...current, day]
                                   setOpsSettings({
                                      ...opsSettings,
                                      operatingHours: { ...opsSettings.operatingHours, operatingDays: next }
                                   })
                                }}
                             >
                                {day}
                             </Badge>
                          ))}
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-border shadow-sm">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4 text-emerald-600" /> Fleet Safety Settings
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Max Speed (KM/H)</Label>
                          <Input 
                             type="number" 
                             className="h-10 bg-muted/20 font-bold" 
                             value={opsSettings?.fleetSafetySettings.maxSpeedKmh}
                             onChange={(e) => {
                                const val = parseFloat(e.target.value)
                                setOpsSettings(prev => prev ? ({
                                   ...prev,
                                   fleetSafetySettings: { ...prev.fleetSafetySettings, maxSpeedKmh: isNaN(val) ? 0 : val }
                                }) : null)
                             }}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Paid Trips / User / Day</Label>
                          <Input 
                             type="number" 
                             className="h-10 bg-muted/20 font-bold" 
                             value={opsSettings?.fleetSafetySettings.maxPaidTripsPerUserPerDay}
                             onChange={(e) => {
                                const val = parseInt(e.target.value)
                                setOpsSettings(prev => prev ? ({
                                   ...prev,
                                   fleetSafetySettings: { ...prev.fleetSafetySettings, maxPaidTripsPerUserPerDay: isNaN(val) ? 0 : val }
                                }) : null)
                             }}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Free Trips / User / Day</Label>
                          <Input 
                             type="number" 
                             className="h-10 bg-muted/20 font-bold" 
                             value={opsSettings?.fleetSafetySettings.maxFreeTripsPerUserPerDay}
                             onChange={(e) => {
                                const val = parseInt(e.target.value)
                                setOpsSettings(prev => prev ? ({
                                   ...prev,
                                   fleetSafetySettings: { ...prev.fleetSafetySettings, maxFreeTripsPerUserPerDay: isNaN(val) ? 0 : val }
                                }) : null)
                             }}
                          />
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
           <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-border shadow-sm">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                       <Building2 className="h-4 w-4 text-primary" /> Support Details
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Phone Number</Label>
                          <Input 
                             className="h-10 bg-muted/20" 
                             value={orgSettings?.supportDetails.phoneNumber}
                             onChange={(e) => setOrgSettings(prev => prev ? ({
                                ...prev,
                                supportDetails: { ...prev.supportDetails, phoneNumber: e.target.value }
                             }) : null)}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Email Address</Label>
                          <Input 
                             className="h-10 bg-muted/20" 
                             value={orgSettings?.supportDetails.email}
                             onChange={(e) => setOrgSettings(prev => prev ? ({
                                ...prev,
                                supportDetails: { ...prev.supportDetails, email: e.target.value }
                             }) : null)}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Help Center URL</Label>
                       <Input 
                          className="h-10 bg-muted/20" 
                          value={orgSettings?.supportDetails.helpCenterUrl}
                          onChange={(e) => setOrgSettings(prev => prev ? ({
                             ...prev,
                             supportDetails: { ...prev.supportDetails, helpCenterUrl: e.target.value }
                          }) : null)}
                       />
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                       <Lock className="h-4 w-4 text-primary" /> Identity State
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase">Entity Verified</p>
                          <p className="text-[9px] text-muted-foreground">{orgSettings?.isActive ? 'Identity is Active' : 'Identity is Pending'}</p>
                       </div>
                       <Switch 
                          checked={orgSettings?.isActive} 
                          onCheckedChange={(checked) => setOrgSettings(prev => prev ? ({ ...prev, isActive: checked }) : null)}
                       />
                    </div>
                    <Button 
                       className="w-full h-10 bg-primary font-bold uppercase tracking-widest text-[10px] gap-2"
                       onClick={handleSaveOrg}
                       disabled={isSaving}
                    >
                       {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                       Save Organization
                    </Button>
                 </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-border shadow-sm">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                       <Scale className="h-4 w-4 text-primary" /> Legal Settings
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Terms of Service URL</Label>
                          <Input 
                             className="h-10 bg-muted/20" 
                             value={orgSettings?.legalSettings.termsOfServiceUrl}
                             onChange={(e) => setOrgSettings(prev => prev ? ({
                                ...prev,
                                legalSettings: { ...prev.legalSettings, termsOfServiceUrl: e.target.value }
                             }) : null)}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Privacy Policy URL</Label>
                          <Input 
                             className="h-10 bg-muted/20" 
                             value={orgSettings?.legalSettings.privacyPolicyUrl}
                             onChange={(e) => setOrgSettings(prev => prev ? ({
                                ...prev,
                                legalSettings: { ...prev.legalSettings, privacyPolicyUrl: e.target.value }
                             }) : null)}
                          />
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
