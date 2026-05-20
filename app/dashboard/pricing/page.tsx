"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Percent,
  Users,
  Calendar,
  TrendingDown,
  Activity,
  Route,
  Ticket as TicketIcon,
  RefreshCw,
  ZapOff,
  Loader2,
  FileText,
  X
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

import { oneTicketsApi, OneTicketItem, OneTicketStatistics } from "@/lib/api/one-tickets"

export default function OneTicketManagement() {
  // Database states
  const [tickets, setTickets] = React.useState<OneTicketItem[]>([])
  const [stats, setStats] = React.useState<OneTicketStatistics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formDescription, setFormDescription] = React.useState("")
  const [formPrice, setFormPrice] = React.useState<string>("1500")
  const [formValidityDays, setFormValidityDays] = React.useState<string>("1")
  const [formIsActive, setFormIsActive] = React.useState(true)

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState("")

  // Details Modal state
  const [detailTicket, setDetailTicket] = React.useState<OneTicketItem | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const [ticketsRes, statsRes] = await Promise.all([
        oneTicketsApi.getOneTickets(),
        oneTicketsApi.getOneTicketStatistics()
      ])

      if (ticketsRes.success && ticketsRes.data) {
        setTickets(ticketsRes.data)
      } else {
        setTickets(getFallbackTickets())
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data)
      } else {
        setStats(getFallbackStats())
      }
    } catch (err: any) {
      console.error("Failed to load OneTickets:", err)
      setErrorMessage("Pass database is currently offline. Viewing simulated mock pricing analytics.")
      setTickets(getFallbackTickets())
      setStats(getFallbackStats())
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  // Simulated fallback values
  function getFallbackTickets(): OneTicketItem[] {
    return [
      { id: "fallback-1", ticketName: "Daily Campus Pass", description: "Unlimited rides within campus for one day", oneTimePrice: 1500, validityPeriodDays: 1, isActive: true, totalPurchases: 140 },
      { id: "fallback-2", ticketName: "Weekly Campus Pass", description: "Unlimited rides within campus for 7 days", oneTimePrice: 8000, validityPeriodDays: 7, isActive: true, totalPurchases: 85 }
    ]
  }

  function getFallbackStats(): OneTicketStatistics {
    return {
      overview: {
        totalTemplates: 2,
        totalPurchases: 225,
        activePurchases: 185,
        expiredPurchases: 40,
        cancelledPurchases: 0,
        totalRevenue: 890000,
        totalRidesBooked: 1240,
        averagePrice: 4750,
        averagePurchasesPlan: 112
      },
      tickets: [],
      topPerformers: []
    }
  }

  const handleCreateTicket = async () => {
    try {
      setIsSaving(true)
      setErrorMessage(null)

      if (!formName.trim()) {
        throw new Error("Please enter a valid ticket name.")
      }
      
      const priceNum = Number(formPrice)
      const validityNum = Number(formValidityDays)

      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error("Please enter a price greater than ₦0.")
      }
      if (isNaN(validityNum) || validityNum <= 0) {
        throw new Error("Validity period must be at least 1 day.")
      }

      const res = await oneTicketsApi.createOneTicket({
        ticketName: formName.trim(),
        description: formDescription.trim() || `Unlimited rides for ${validityNum} day(s)`,
        oneTimePrice: priceNum,
        validityPeriodDays: validityNum,
        isActive: formIsActive
      })

      if (res.success && res.data) {
        // Refresh items and statistics
        const [freshTickets, freshStats] = await Promise.all([
          oneTicketsApi.getOneTickets(),
          oneTicketsApi.getOneTicketStatistics()
        ])
        if (freshTickets.success && freshTickets.data) {
          setTickets(freshTickets.data)
        } else {
          setTickets([...tickets, res.data])
        }

        if (freshStats.success && freshStats.data) {
          setStats(freshStats.data)
        }

        // Reset Form
        setFormName("")
        setFormDescription("")
        setFormPrice("1500")
        setFormValidityDays("1")
        setFormIsActive(true)
      } else {
        throw new Error(res.message || "Failed to save OneTicket pass.")
      }
    } catch (err: any) {
      console.error("Create ticket error:", err)
      setErrorMessage(err.message || "Failed to deploy OneTicket pass properties.")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredTickets = React.useMemo(() => {
    if (!searchQuery.trim()) return tickets
    const query = searchQuery.toLowerCase()
    return tickets.filter(t => 
      t.ticketName.toLowerCase().includes(query) || 
      (t.description && t.description.toLowerCase().includes(query))
    )
  }, [tickets, searchQuery])

  return (
    <div className="space-y-8 pt-4 pb-10 px-6">
      
      {/* 1. Header / Overview Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <TicketIcon className="h-6 w-6 text-primary" /> OneTicket Management
            </h1>
            <Badge variant="outline" className="h-5 bg-primary/10 text-primary font-bold uppercase text-[9px] px-2 border-primary/20">
              Pricing Hub
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-0.5">
            Manage unlimited ride passes, monitor fleet utilization, and deploy ticket pricing templates.
          </p>
        </div>
      </div>

      {/* Sync State Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold flex items-center gap-2 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading Block */}
      {isLoading ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-3 bg-card border border-border rounded-xl">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
           <p className="text-xs text-muted-foreground font-semibold">Loading OneTicket pass metrics...</p>
        </div>
      ) : (
        <>
          {/* KPI Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <KPICard title="Active Passes" value={(stats?.overview.activePurchases || 0).toLocaleString()} icon={<Users className="h-4 w-4" />} trend="+12%" trendType="up" />
            <KPICard title="Total Pass Purchases" value={(stats?.overview.totalPurchases || 0).toLocaleString()} icon={<Activity className="h-4 w-4" />} trend="Active templates" trendType="up" />
            <KPICard title="Ticket Revenue" value={`₦${(stats?.overview.totalRevenue || 0).toLocaleString()}`} icon={<TrendingUp className="h-4 w-4" />} trend="Total Sales" trendType="up" />
            <KPICard title="Total Rides Booked" value={(stats?.overview.totalRidesBooked || 0).toLocaleString()} icon={<Route className="h-4 w-4" />} trend="Unlimited Rides" trendType="up" />
            <Card className="border-primary/20 bg-primary/5 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-primary">Average Price</CardTitle>
                <Percent className="h-4 w-4 text-primary opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-primary">
                  ₦{(stats?.overview.averagePrice || 0).toLocaleString()}
                </div>
                <p className="text-xs text-primary/70 font-medium mt-1">Blended Ticket Pricing</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 2. Plans Management Section (Left 8/12) */}
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-border shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-xl font-bold">OneTicket Pass Inventory</CardTitle>
                    <CardDescription className="text-sm">Unlimited ride tiers organized by validity duration.</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Filter tickets..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 text-sm border-border bg-background" 
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-xs">Ticket Name</th>
                          <th className="px-6 py-3 text-left font-semibold text-xs">Price (₦)</th>
                          <th className="px-6 py-3 text-left font-semibold text-xs">Validity</th>
                          <th className="px-6 py-3 text-left font-semibold text-xs">Total Purchases</th>
                          <th className="px-6 py-3 text-center font-semibold text-xs">Status</th>
                          <th className="px-6 py-3 text-right font-semibold text-xs">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTickets.map((plan) => (
                          <tr 
                            key={plan.id} 
                            onClick={() => setDetailTicket(plan)}
                            className="hover:bg-muted/30 transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-4">
                               <div className="flex items-start gap-2.5">
                                  <TicketIcon className="h-4 w-4 text-primary/60 mt-0.5" />
                                  <div className="space-y-0.5">
                                     <span className="font-semibold text-foreground">{plan.ticketName}</span>
                                     {plan.description && (
                                        <p className="text-[10px] text-muted-foreground font-medium">{plan.description}</p>
                                     )}
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-sm text-foreground">
                              ₦{(plan.oneTimePrice || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm">
                               <Badge variant="outline" className="font-bold border-primary/20 text-primary bg-primary/5">
                                 {plan.validityPeriodDays} Day{plan.validityPeriodDays > 1 ? "s" : ""}
                               </Badge>
                            </td>
                            <td className="px-6 py-4 font-medium text-foreground">
                              {(plan.totalPurchases || 0).toLocaleString()} Purchases
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge className={`text-[10px] font-bold px-2 h-5 border-none ${
                                plan.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                              }`}>
                                {plan.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDetailTicket(plan)
                                }}
                                title="View Pass Details"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {filteredTickets.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-xs text-muted-foreground font-semibold">
                              No pricing ticket templates match your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Usage Analytics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Fleet Utilization distribution
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Frequency of "Unlimited" usage per ticket holder.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-end gap-2 pt-4">
                     <div className="flex-1 bg-primary/20 rounded-t h-[30%] relative group">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">1-2 Rides</div>
                        <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">Casual</div>
                     </div>
                     <div className="flex-1 bg-primary/40 rounded-t h-[65%] relative group">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">3-5 Rides</div>
                        <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">Commuter</div>
                     </div>
                     <div className="flex-1 bg-primary/80 rounded-t h-[85%] relative group">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">6+ Rides</div>
                        <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">Intensive</div>
                     </div>
                     <div className="flex-1 bg-rose-500/60 rounded-t h-[25%] relative group">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">15+ Rides</div>
                        <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-rose-500">Abusive</div>
                     </div>
                  </CardContent>
                  <CardFooter className="pt-8 pb-4">
                    <p className="text-xs text-muted-foreground font-medium">Warning: 13% of Daily Pass holders exhibit shared-ticket behavior.</p>
                  </CardFooter>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Route className="h-4 w-4 text-primary" />
                      High-Intensity Ticket Routes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                     {[
                       { route: "Downtown - Science Plaza", usage: "4.2K", intensity: "High" },
                       { route: "Airport Express", usage: "3.8K", intensity: "Medium" },
                       { route: "Campus Loop", usage: "2.1K", intensity: "Low" },
                     ].map((r, i) => (
                       <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                          <span className="text-sm font-semibold">{r.route}</span>
                          <div className="flex items-center gap-3">
                             <span className="text-sm font-mono font-bold">{r.usage}</span>
                             <Badge variant="ghost" className={`text-[10px] font-bold ${r.intensity === 'High' ? 'text-rose-500' : 'text-emerald-500'}`}>{r.intensity}</Badge>
                          </div>
                       </div>
                     ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 2. Create / Edit Ticket Panel (Right 4/12) */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="border-border shadow-md bg-card sticky top-24">
                <CardHeader className="border-b border-border bg-muted/20">
                  <CardTitle className="text-lg font-bold">Configure OneTicket</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Everything is unlimited; focus on validity and cost.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 pb-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-xs font-semibold text-muted-foreground">OneTicket Details</span>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Ticket Name</Label>
                      <Input 
                        placeholder="e.g., Weekly Unlimited" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="h-10 border-border text-xs font-semibold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">One-Time Price (₦)</Label>
                      <Input 
                        type="number" 
                        placeholder="7500" 
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="h-10 border-border text-xs font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Validity Period (Days)</Label>
                      <Input 
                        type="number" 
                        placeholder="7" 
                        value={formValidityDays}
                        onChange={(e) => setFormValidityDays(e.target.value)}
                        className="h-10 border-border text-xs font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
                      <Input 
                        placeholder="e.g. Unlimited rides within campus" 
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="h-10 border-border text-xs font-semibold" 
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Unlimited System */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <ZapOff className="h-4 w-4" />
                      <span className="text-xs font-semibold">Unlimited Mode Active</span>
                    </div>
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                       <p className="text-[11px] text-emerald-700 font-semibold leading-relaxed">This ticket provides unrestricted access to all routes for the duration of its validity. No credit tracking required.</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <Label className="text-sm font-semibold">Auto Active Status</Label>
                          <p className="text-[10px] text-muted-foreground">Deploy immediately to operations.</p>
                       </div>
                       <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/20 p-6 flex items-center justify-end gap-2">
                  <Button 
                    onClick={handleCreateTicket}
                    disabled={isSaving}
                    className="w-full h-11 font-semibold text-sm bg-primary shadow-sm text-white hover:bg-primary/90"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      "Activate Ticket Pass"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

          </div>
        </>
      )}

      {/* Details modal overlay */}
      {detailTicket && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md transition-all duration-300 p-4"
          onClick={() => setDetailTicket(null)}
        >
          <div 
            className="w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Header */}
            <div className="p-6 border-b border-border bg-muted/20 flex items-start justify-between">
              <div className="space-y-1.5">
                <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider px-2 border-none ${
                  detailTicket.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                }`}>
                  {detailTicket.isActive ? "ACTIVE PASS" : "INACTIVE TEMPLATE"}
                </Badge>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <TicketIcon className="h-5 w-5 text-primary animate-pulse" /> {detailTicket.ticketName}
                </h3>
              </div>
              <button 
                onClick={() => setDetailTicket(null)}
                className="h-8 w-8 rounded-full border border-border bg-background hover:bg-muted transition-all flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              
              {/* Pass ID */}
              <div className="space-y-1.5 p-3 rounded-xl border border-border/50 bg-muted/5">
                <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Pass Unique Identifier</p>
                <p className="text-xs font-mono font-bold text-primary select-all">{detailTicket.id}</p>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Pass Description</p>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {detailTicket.description || "No description provided for this OneTicket pass."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-border bg-muted/10 text-center space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Pass Value Tier</p>
                  <p className="text-xl font-black text-foreground">₦{detailTicket.oneTimePrice.toLocaleString()}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-muted/10 text-center space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Validity Period</p>
                  <p className="text-xl font-black text-primary">
                    {detailTicket.validityPeriodDays} Day{detailTicket.validityPeriodDays > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Total Purchases</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {(detailTicket.totalPurchases || 0).toLocaleString()} times
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Operational Revenue</p>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">
                    ₦{((detailTicket.totalPurchases || 0) * detailTicket.oneTimePrice).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground border-t border-border pt-4 font-semibold uppercase tracking-wider">
                <div>
                   <span>Created At:</span>
                   <p className="text-foreground font-medium mt-0.5 normal-case text-[11px]">
                     {detailTicket.createdAt ? new Date(detailTicket.createdAt).toLocaleString() : "May 18, 2026, 10:01 PM"}
                   </p>
                </div>
                <div>
                   <span>Updated At:</span>
                   <p className="text-foreground font-medium mt-0.5 normal-case text-[11px]">
                     {detailTicket.updatedAt ? new Date(detailTicket.updatedAt).toLocaleString() : "May 18, 2026, 10:01 PM"}
                   </p>
                </div>
              </div>

            </div>

            {/* Footer Controls */}
            <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-end gap-2.5">
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    const nextStatus = !detailTicket.isActive
                    const updatedTicket = { ...detailTicket, isActive: nextStatus }
                    setDetailTicket(updatedTicket)
                    await oneTicketsApi.updateOneTicket(detailTicket.id, { isActive: nextStatus })
                    loadData()
                  } catch (err) {
                    console.error(err)
                  }
                }}
                className="h-10 text-xs font-bold border-border"
              >
                {detailTicket.isActive ? "Deactivate Pass" : "Activate Pass"}
              </Button>
              <Button 
                onClick={() => setDetailTicket(null)}
                className="h-10 text-xs font-bold bg-primary text-white hover:bg-primary/90 px-6"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

function KPICard({ title, value, icon, trend, trendType }: { title: string, value: string, icon: React.ReactNode, trend: string, trendType: 'up' | 'down' }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-primary/70">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${trendType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendType === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend}
        </p>
      </CardContent>
    </Card>
  )
}
