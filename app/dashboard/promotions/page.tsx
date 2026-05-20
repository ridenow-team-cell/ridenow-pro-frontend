"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Tag, 
  Ticket, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Gift, 
  Zap, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Copy,
  Share2,
  X,
  Coins,
  ShieldCheck,
  AlertTriangle,
  RefreshCcw
} from "lucide-react"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
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
  getCampaigns, 
  CampaignItem, 
  activateCampaign, 
  pauseCampaign, 
  archiveCampaign, 
  getCampaignDetails, 
  getCampaignAnalytics,
  CampaignAnalytics,
  CampaignDetails 
} from "@/lib/api/campaigns"

const campaignVelocityData = [
  { day: "Mon", usage: 120, conversions: 45 },
  { day: "Tue", usage: 150, conversions: 52 },
  { day: "Wed", usage: 180, conversions: 61 },
  { day: "Thu", usage: 210, conversions: 78 },
  { day: "Fri", usage: 190, conversions: 65 },
  { day: "Sat", usage: 240, conversions: 92 },
  { day: "Sun", usage: 280, conversions: 110 },
]

export default function PromotionsPage() {
  const [campaigns, setCampaigns] = React.useState<CampaignItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all")

  // Details Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [modalDetails, setModalDetails] = React.useState<CampaignDetails | null>(null)
  const [modalAnalytics, setModalAnalytics] = React.useState<CampaignAnalytics | null>(null)
  const [isModalLoading, setIsModalLoading] = React.useState(false)
  const [modalError, setModalError] = React.useState<string | null>(null)

  // Copy success indicator
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  const fetchCampaigns = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await getCampaigns()
      if (res.success && res.data) {
        setCampaigns(res.data)
      } else {
        setError(res.message || "Failed to load campaigns")
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Failed to connect to campaigns backend database.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Open Modal details and load statistics concurrently
  const handleOpenDetails = async (id: string) => {
    setSelectedId(id)
    setIsModalOpen(true)
    setIsModalLoading(true)
    setModalError(null)
    setModalDetails(null)
    setModalAnalytics(null)

    try {
      const [detailsRes, analyticsRes] = await Promise.all([
        getCampaignDetails(id),
        getCampaignAnalytics(id)
      ])

      if (detailsRes.success && detailsRes.data) {
        setModalDetails(detailsRes.data)
      } else {
        setModalError(detailsRes.message || "Failed to load details.")
      }

      if (analyticsRes.success && analyticsRes.data) {
        setModalAnalytics(analyticsRes.data)
      }
    } catch (err: any) {
      console.error(err)
      setModalError(err?.message || "Failed to compile campaign performance parameters.")
    } finally {
      setIsModalLoading(false)
    }
  }

  // Lifecycle control handlers
  const handleActivate = async (id: string) => {
    try {
      const res = await activateCampaign(id)
      if (res.success) {
        // Refresh index
        await fetchCampaigns()
        // If modal is open for this campaign, reload details
        if (isModalOpen && selectedId === id) {
          handleOpenDetails(id)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handlePause = async (id: string) => {
    try {
      const res = await pauseCampaign(id)
      if (res.success) {
        await fetchCampaigns()
        if (isModalOpen && selectedId === id) {
          handleOpenDetails(id)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleArchive = async (id: string) => {
    try {
      const res = await archiveCampaign(id)
      if (res.success) {
        await fetchCampaigns()
        setIsModalOpen(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && campaign.status === "active"
    if (activeTab === "paused") return matchesSearch && campaign.status === "paused"
    if (activeTab === "archived") return matchesSearch && campaign.status === "archived"
    return matchesSearch
  })

  // SUM KPI statistics safely
  const activeCount = campaigns.filter(c => c.status === "active").length
  const totalRedemptionsCount = campaigns.reduce((acc, c) => acc + (c.current_redemptions || 0), 0)
  const totalDistributedCredits = campaigns.reduce((acc, c) => acc + ((c.current_redemptions || 0) * (c.credit_bonus || 0)), 0)

  // Find top performer code from active list
  const topActive = campaigns
    .filter(c => c.status === "active" && c.current_redemptions > 0)
    .sort((a, b) => b.current_redemptions - a.current_redemptions)[0]

  return (
    <div className="space-y-6 pt-4 pb-10 min-h-screen px-4 md:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 border border-border rounded-xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Gift className="h-6 w-6 text-primary animate-bounce-slow" /> Promotions & Growth
            </h1>
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-bold uppercase text-[9px] px-2">
              Marketing Hub
            </Badge>
          </div>
          <p className="text-sm font-medium text-muted-foreground pl-0.5">
            Manage discount campaigns, student credit bonuses, and organic growth referral systems.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button onClick={fetchCampaigns} variant="outline" size="sm" className="h-10 px-4 border-border font-medium text-xs bg-background">
            <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Refresh List
          </Button>
          <Link href="/dashboard/promotions/new">
            <Button size="sm" className="h-10 px-4 font-bold text-xs bg-primary text-white hover:bg-primary/90 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <RefreshCcw className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">Aggregating promotional schemas...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 shadow-inner">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Failed to Load Marketing Schemes</h3>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">{error}</p>
          </div>
          <Button onClick={fetchCampaigns} size="sm" className="h-9 px-4 font-bold text-xs bg-primary text-white shadow-sm">
            <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Reconnect Database
          </Button>
        </div>
      ) : (
        <>
          {/* Campaign Analytics Section */}
          <div className="grid gap-6 lg:grid-cols-7">
            <Card className="lg:col-span-5 border-border bg-card shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Campaign Velocity</CardTitle>
                  <CardDescription className="text-[10px] font-medium">Real-time conversions tracking across active promotions.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                   <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold px-2 h-5 text-[9px]">+24% GROWTH</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={campaignVelocityData}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600}}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', padding: '12px' }}
                        itemStyle={{ fontWeight: 600, fontSize: '12px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="conversions" 
                        name="Conversions"
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorUsage)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border bg-slate-950 text-white shadow-lg rounded-xl flex flex-col justify-between p-6">
              <div className="space-y-4">
                 <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Top Campaign</p>
                    <Badge className="bg-primary text-white border-none text-[8px] font-bold h-4">LEADER</Badge>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <p className="text-xl font-bold text-primary tracking-tight">{topActive ? topActive.code : "WELCOME500"}</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      {topActive ? `${topActive.current_redemptions} redemptions` : "No usages recorded yet"}
                    </p>
                 </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/10">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quick Stats</p>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-[9px] font-semibold text-slate-400">ACTIVE SCHEMES</p>
                       <p className="text-lg font-bold text-emerald-400">{activeCount}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-semibold text-slate-400">TOTAL USED</p>
                       <p className="text-lg font-bold">{totalRedemptionsCount}</p>
                    </div>
                 </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-muted/50 p-1 border border-border rounded-lg self-start">
                <TabsTrigger value="all" className="text-xs font-bold uppercase tracking-tight h-8 px-4 rounded-md">All Schemes</TabsTrigger>
                <TabsTrigger value="active" className="text-xs font-bold uppercase tracking-tight h-8 px-4 rounded-md">Active</TabsTrigger>
                <TabsTrigger value="paused" className="text-xs font-bold uppercase tracking-tight h-8 px-4 rounded-md">Paused</TabsTrigger>
                <TabsTrigger value="archived" className="text-xs font-bold uppercase tracking-tight h-8 px-4 rounded-md">Archived</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 max-w-sm w-full">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search campaigns..." 
                      className="pl-10 h-10 border-border bg-card rounded-lg font-medium" 
                    />
                 </div>
              </div>
            </div>

            <TabsContent value={activeTab} className="space-y-6 mt-0">
              <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
                {filteredCampaigns.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-12 space-y-3 bg-muted/10">
                     <Ticket className="h-10 w-10 text-muted-foreground animate-pulse" />
                     <h4 className="text-sm font-bold">No Campaigns Found</h4>
                     <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">There are no campaigns matching the current tabs or search filter parameters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                        <tr>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Campaign</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Type</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Reward Value</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Redemptions Cap</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                          <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest">Target</th>
                          <th className="px-6 py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredCampaigns.map((promo) => {
                          const percentUsed = promo.total_redemptions > 0 
                            ? Math.min(100, Math.round((promo.current_redemptions / promo.total_redemptions) * 100))
                            : 0

                          return (
                            <tr 
                              key={promo.id} 
                              className="hover:bg-muted/30 transition-colors cursor-pointer"
                              onClick={() => handleOpenDetails(promo.id)}
                            >
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-2">
                                   <span 
                                     onClick={() => handleOpenDetails(promo.id)}
                                     className="font-bold text-sm tracking-tight text-primary uppercase cursor-pointer hover:underline"
                                   >
                                     {promo.code}
                                   </span>
                                   <Button 
                                     variant="ghost" 
                                     size="icon" 
                                     onClick={() => handleCopyCode(promo.code)}
                                     className="h-7 w-7 text-muted-foreground hover:text-primary rounded-md shrink-0"
                                   >
                                      {copiedCode === promo.code ? (
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                   </Button>
                                   <div className="flex flex-col ml-1">
                                      <span className="text-xs font-bold text-foreground line-clamp-1">{promo.name}</span>
                                   </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-xs uppercase text-muted-foreground">{promo.type.replace("_", " ")}</td>
                              <td className="px-6 py-4 font-bold text-xs text-foreground">
                                {promo.credit_bonus > 0 ? `₦${promo.credit_bonus.toLocaleString()}` : "—"}
                              </td>
                              <td className="px-6 py-4 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
                                <div className="space-y-1.5 max-w-[240px]">
                                   <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                                      <span>{promo.current_redemptions.toLocaleString()} / {promo.total_redemptions.toLocaleString()} used</span>
                                      <span className="text-muted-foreground">{percentUsed}%</span>
                                   </div>
                                   <Progress value={percentUsed} className="h-1 bg-muted" />
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="secondary" className={`font-bold text-[9px] border-none px-2 h-5 uppercase tracking-wide ${
                                  promo.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                                  promo.status === 'paused' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                                }`}>
                                  {promo.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right font-semibold text-xs text-muted-foreground uppercase">{promo.audience.replace("_", " ")}</td>
                              <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 border-border">
                                       <DropdownMenuLabel className="text-xs">Campaign Control</DropdownMenuLabel>
                                       <DropdownMenuSeparator />
                                       <DropdownMenuItem onClick={() => handleOpenDetails(promo.id)} className="gap-2 text-xs font-medium"><BarChart3 className="h-4 w-4" /> Performance Stats</DropdownMenuItem>
                                       
                                       {promo.status === 'paused' && (
                                         <DropdownMenuItem onClick={() => handleActivate(promo.id)} className="gap-2 text-xs text-emerald-600 font-bold"><CheckCircle2 className="h-4 w-4" /> Activate Campaign</DropdownMenuItem>
                                       )}
                                       {promo.status === 'active' && (
                                         <DropdownMenuItem onClick={() => handlePause(promo.id)} className="gap-2 text-xs text-amber-600 font-bold"><Clock className="h-4 w-4" /> Pause Campaign</DropdownMenuItem>
                                       )}

                                       <DropdownMenuSeparator />
                                       <DropdownMenuItem onClick={() => handleArchive(promo.id)} className="text-rose-600 font-bold gap-2 text-xs"><XCircle className="h-4 w-4" /> Archive Scheme</DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Details & Live ROI Analytics Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative bg-card border border-border w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 p-5 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                    <Ticket className="h-5 w-5 text-primary" /> Campaign Performance Ledger
                  </h3>
                  {modalDetails && (
                    <Badge variant="secondary" className={`font-bold text-[9px] border-none px-2 uppercase ${
                      modalDetails.campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                      modalDetails.campaign.status === 'paused' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {modalDetails.campaign.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">ROI projections and lifecycle management panel.</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full border border-border"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isModalLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <RefreshCcw className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Syncing ledger variables...</p>
                </div>
              ) : modalError || !modalDetails ? (
                <div className="text-center py-10 space-y-2">
                  <AlertTriangle className="h-8 w-8 text-rose-600 mx-auto" />
                  <p className="text-sm font-bold">{modalError || "No campaign data returned"}</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left Column: Specs */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/60 pb-1.5">Campaign Specifications</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">CAMPAIGN NAME</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">{modalDetails.campaign.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">PROMO CODE</p>
                          <p className="text-xs font-extrabold text-primary uppercase mt-0.5 tracking-wider">{modalDetails.campaign.code}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">REWARD TYPE</p>
                          <p className="text-xs font-bold text-foreground mt-0.5 uppercase">{modalDetails.campaign.type.replace("_", " ")}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">CREDIT BONUS</p>
                          <p className="text-xs font-bold text-emerald-600 mt-0.5">₦{(modalDetails.campaign.credit_bonus || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">TARGET AUDIENCE</p>
                          <p className="text-xs font-bold text-foreground mt-0.5 uppercase">{modalDetails.campaign.audience.replace("_", " ")}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">USES PER USER</p>
                          <p className="text-xs font-bold text-foreground mt-0.5">{modalDetails.campaign.uses_per_user}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">MINIMUM RIDE TIER</p>
                          <p className="text-xs font-bold text-foreground mt-0.5">₦{(modalDetails.campaign.minimum_ride_amount || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <Separator className="bg-border/60" />
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <span className="font-bold text-muted-foreground">CREATED AT:</span>
                          <span className="ml-1 text-foreground font-semibold">{new Date(modalDetails.campaign.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="font-bold text-muted-foreground">LAST UPDATED:</span>
                          <span className="ml-1 text-foreground font-semibold">{new Date(modalDetails.campaign.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: ROI Analytics */}
                  <div className="space-y-4 bg-muted/20 border border-border p-5 rounded-xl">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-primary/20 pb-1.5 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" /> Marketing Campaign ROI
                    </h4>

                    {modalAnalytics ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-card border border-border rounded-lg">
                            <p className="text-[9px] font-extrabold text-muted-foreground uppercase">REACHED USERS</p>
                            <p className="text-base font-bold text-foreground mt-0.5">{modalAnalytics.total_users_reached.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-card border border-border rounded-lg">
                            <p className="text-[9px] font-extrabold text-muted-foreground uppercase">REDEMPTION RATE</p>
                            <p className="text-base font-bold text-primary mt-0.5">{modalAnalytics.redemption_rate}%</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-card border border-border rounded-lg">
                            <p className="text-[9px] font-extrabold text-muted-foreground uppercase">TOTAL DISTRIBUTED</p>
                            <p className="text-base font-bold text-emerald-600 mt-0.5">₦{(modalAnalytics.total_credits_distributed || 0).toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-card border border-border rounded-lg">
                            <p className="text-[9px] font-extrabold text-muted-foreground uppercase">RIDES GENERATED</p>
                            <p className="text-base font-bold text-foreground mt-0.5">{modalAnalytics.rides_generated.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-card border border-border rounded-lg">
                            <p className="text-[9px] font-extrabold text-muted-foreground uppercase">CAC</p>
                            <p className="text-base font-bold text-foreground mt-0.5">₦{(modalAnalytics.cac || 0).toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                            <p className="text-[9px] font-extrabold text-emerald-600 uppercase">ROI RATIO</p>
                            <p className="text-base font-black text-emerald-600 mt-0.5">+{modalAnalytics.roi}%</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                        <Coins className="h-8 w-8 text-muted-foreground/60 animate-bounce-slow" />
                        <p className="text-xs font-bold text-muted-foreground">ROI data pending redemption logs</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            {modalDetails && (
              <div className="border-t border-border/80 p-5 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleArchive(modalDetails.campaign.id)}
                    variant="outline" 
                    className="h-10 text-xs font-bold uppercase text-rose-600 border-rose-200 hover:bg-rose-600 hover:text-white"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Archive Campaign
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {modalDetails.campaign.status === 'active' ? (
                    <Button 
                      onClick={() => handlePause(modalDetails.campaign.id)}
                      className="h-10 text-xs font-bold uppercase bg-amber-500 text-white hover:bg-amber-600"
                    >
                      <Clock className="mr-2 h-4 w-4" /> Pause Campaign
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleActivate(modalDetails.campaign.id)}
                      className="h-10 text-xs font-bold uppercase bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Activate Campaign
                    </Button>
                  )}
                  <Button 
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 text-xs font-bold uppercase bg-foreground text-background hover:opacity-90"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
