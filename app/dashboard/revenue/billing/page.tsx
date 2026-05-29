"use client"

import * as React from "react"
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  CreditCard,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  MoreHorizontal,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getBillingAnalytics, type BillingAnalytics } from "@/lib/api/analytics"

export default function BillingPage() {
  const [data, setData] = React.useState<BillingAnalytics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)

  const fetchBilling = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getBillingAnalytics()
      console.log("[BillingPage] API response:", JSON.stringify(res, null, 2))
      if (res.success && res.data) {
        // Handle possible double-nesting: some endpoints wrap body in { data: ... }
        const payload = (res.data as any)?.data ?? res.data
        setData(payload as BillingAnalytics)
      }
    } catch (err) {
      console.error("Failed to fetch billing analytics:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchBilling()
  }, [fetchBilling])

  // Reset page to 1 when search query changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const itemsPerPage = 8

  const filteredData = React.useMemo(() => {
    const recentData = data?.recentBillingActivity?.data
    if (!recentData) return []
    return recentData.filter((item) => {
      const query = searchQuery.toLowerCase()
      const userName = item.customerName ?? item.user ?? ""
      const planName = item.subscriptionPlan ?? item.method ?? ""
      const id = item.id ?? ""
      const status = item.status ?? ""
      return (
        userName.toLowerCase().includes(query) ||
        id.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query) ||
        planName.toLowerCase().includes(query)
      )
    })
  }, [data, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage

  const paginatedData = React.useMemo(() => {
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, startIndex, itemsPerPage])

  if (isLoading) {
    return <BillingLoadingScreen />
  }

  const { overview, recentBillingActivity } = data!

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="space-y-7 pt-2 pb-12 px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">Treasury Operations</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing Engine</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Automated subscription management, payment processing, and recovery oversight.</p>
        </div>

      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Successful Payments */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{overview.successfulPayments.title}</p>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1">{overview.successfulPayments.count.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground font-medium">Successfully processed this month</p>
          </CardContent>
        </Card>

        {/* Failed Payments */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-rose-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{overview.failedPayments.title}</p>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1">{overview.failedPayments.count.toLocaleString()}</div>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-tighter">Requires Manual recovery</p>
          </CardContent>
        </Card>

        {/* Pending Renewals */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-amber-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{overview.pendingRenewals.title}</p>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1">{overview.pendingRenewals.count.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground font-medium">Queue for the next 24-48 hours</p>
          </CardContent>
        </Card>

        {/* Auto-Renewal Rate */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-primary opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{overview.autoRenewalRate.title}</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1">{overview.autoRenewalRate.percentage}%</div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-600 font-bold uppercase">Healthy retention level</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Activity Section */}
      <Card className="border-border/60 shadow-sm bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base font-bold">{recentBillingActivity.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{recentBillingActivity.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9 h-9 text-xs border-border/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 border-border/60">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/40">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entity</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {paginatedData && paginatedData.length > 0 ? (
                  paginatedData.map((item, idx) => {
                    const userName = item.customerName ?? item.user ?? "Unknown User"
                    const planName = item.subscriptionPlan ?? item.method ?? "Standard Plan"
                    const formattedDate = item.timestamp || item.date
                      ? new Date(item.timestamp || item.date || "").toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                      : "N/A"
                    const statusLower = item.status.toLowerCase()
                    return (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-border/60">
                              <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                                {userName.split(' ').filter(Boolean).map(n => n[0]).join('') || 'RN'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-bold tracking-tight">{userName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{item.id.substring(0, 12)}</td>
                        <td className="px-6 py-4 text-sm font-bold">{formatCurrency(item.amount)}</td>

                        <td className="px-6 py-4">
                          <Badge
                            className={`text-[9px] font-bold border-none px-2 h-5 ${statusLower === 'success' || statusLower === 'successful' ? 'bg-emerald-500/10 text-emerald-700' :
                              statusLower === 'failed' ? 'bg-rose-500/10 text-rose-700' :
                                'bg-amber-500/10 text-amber-700'
                              }`}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-[11px] font-medium text-muted-foreground">
                          {formattedDate}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <CreditCard className="h-12 w-12 mb-4 text-muted-foreground/40" />
                        <p className="text-sm font-bold uppercase tracking-widest mb-1">No Recent activity</p>
                        <p className="text-xs">Live billing logs will appear here as they process</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border/40 bg-muted/10 px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(startIndex + itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredData.length}</span> transactions
            </p>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <p className="text-[10px] font-medium text-muted-foreground italic hidden sm:block">Live billing bridge connected</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs font-semibold px-3 border-border/60"
            >
              Previous
            </Button>
            <div className="text-xs font-semibold text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 text-xs font-semibold px-3 border-border/60"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function BillingLoadingScreen() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src="/logo.png"
            alt="RydeNow Logo"
            className="h-24 w-auto object-contain animate-breathing"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Connecting Billing Engine</span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">Syncing payment gateways & transaction history...</p>
        </div>
      </div>
    </div>
  )
}
