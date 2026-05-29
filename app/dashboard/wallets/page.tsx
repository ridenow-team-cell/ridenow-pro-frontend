"use client"

import * as React from "react"
import {
  Coins,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Search,
  Download,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  UserPlus
} from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  getWalletAnalytics,
  getWalletsList,
  adjustWalletBalance,
  toggleWalletStatus,
  type WalletData,
  type WalletAnalytics
} from "@/lib/api/wallets"

export default function ManageWalletsPage() {
  const [analytics, setAnalytics] = React.useState<WalletAnalytics | null>(null)
  const [wallets, setWallets] = React.useState<WalletData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")

  // Balance adjustment dialog state
  const [selectedWallet, setSelectedWallet] = React.useState<WalletData | null>(null)
  const [isAdjustOpen, setIsAdjustOpen] = React.useState(false)
  const [adjustType, setAdjustType] = React.useState<"credit" | "debit">("credit")
  const [adjustAmount, setAdjustAmount] = React.useState<number | "">("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(wallets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedWallets = wallets.slice(startIndex, endIndex)

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const [analyticsRes, walletsRes] = await Promise.all([
        getWalletAnalytics(),
        getWalletsList(),
      ])

      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data)
      }
      if (walletsRes.success && walletsRes.data) {
        setWallets(walletsRes.data)
      }
    } catch (err) {
      console.error("Error loading wallet details:", err)
      toast.error("Failed to load wallet dashboard data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = async (val: string) => {
    setSearch(val)
    setCurrentPage(1)
    try {
      const res = await getWalletsList(val)
      if (res.success && res.data) {
        setWallets(res.data)
      }
    } catch (err) {
      console.error("Failed to search wallets:", err)
    }
  }

  const handleAdjustBalance = (wallet: WalletData) => {
    setSelectedWallet(wallet)
    setAdjustType("credit")
    setAdjustAmount("")
    setIsAdjustOpen(true)
  }

  const submitAdjustment = async () => {
    if (!selectedWallet || !adjustAmount || adjustAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await adjustWalletBalance(selectedWallet.userId, Number(adjustAmount), adjustType)

      if (res.success && res.data) {
        toast.success(res.message)
        setIsAdjustOpen(false)

        // Refresh local items
        setWallets((prev) =>
          prev.map((w) => (w.id === selectedWallet.id ? res.data! : w))
        )

        // Reload analytics for updated balances
        const analyticsRes = await getWalletAnalytics()
        if (analyticsRes.success && analyticsRes.data) {
          setAnalytics(analyticsRes.data)
        }
      } else {
        toast.error(res.message || "Failed to adjust balance")
      }
    } catch (err) {
      console.error("Balance adjustment error:", err)
      const msg = err instanceof Error ? err.message : "An error occurred during adjustment"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (wallet: WalletData) => {
    const action = wallet.status === "Active" ? "Suspend" : "Activate"
    if (!confirm(`Are you sure you want to ${action} ${wallet.userName}'s wallet?`)) {
      return
    }

    try {
      const res = await toggleWalletStatus(wallet.userId)
      if (res.success && res.data) {
        toast.success(res.message)
        setWallets((prev) =>
          prev.map((w) => (w.id === wallet.id ? res.data! : w))
        )
      } else {
        toast.error(res.message || "Failed to toggle wallet status")
      }
    } catch (err) {
      console.error("Error toggling status:", err)
      const msg = err instanceof Error ? err.message : "An error occurred while updating status"
      toast.error(msg)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(val)
  }

  if (isLoading) {
    return <WalletLoadingScreen />
  }

  const platformBalance = analytics?.platformBalance ?? 0
  const amountSpent = analytics?.amountSpent ?? 0
  const activeWallets = analytics?.activeWallets ?? 0
  const spendingStats = analytics?.spendingStats ?? []

  return (
    <div className="space-y-7 pt-2 pb-12 px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">
            Wallet Infrastructure
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manage Wallets
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Admin ledger oversight, user balance adjustments, and platform spending analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">

        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Platform Balance */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-primary opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Platform Balance
              </p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1.5">
              {formatCurrency(platformBalance)}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">
              Total funds stored in system wallets
            </p>
          </CardContent>
        </Card>

        {/* Amount Spent */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Total Amount Spent
              </p>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1.5">
              {formatCurrency(amountSpent)}
            </div>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              ₦{(amountSpent / 1000).toFixed(0)}k cumulative purchases completed
            </p>
          </CardContent>
        </Card>

        {/* Active Wallets count */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-violet-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Active Wallets
              </p>
              <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1.5">
              {activeWallets} / {wallets.length}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">
              {wallets.length - activeWallets} suspended or inactive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spending Stats Chart */}
      <Card className="border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-base font-bold">Spending Stats</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Wallet deposits vs trip payments completed over the last 7 days.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> Deposits
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Spending
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="h-[280px] w-full px-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="depositGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066cc" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0066cc" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis
                  dataKey="day"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `₦${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.15)",
                    padding: "10px 14px",
                  }}
                  cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1.5, strokeDasharray: "4 4" }}
                  formatter={(val: any) => [formatCurrency(Number(val) || 0)]}
                />
                <Area
                  type="monotone"
                  dataKey="deposits"
                  stroke="#0066cc"
                  strokeWidth={2.5}
                  fill="url(#depositGrad)"
                  name="Deposits"
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#spendingGrad)"
                  name="Spent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Users Wallets Table Section */}
      <Card className="border-border/60 shadow-sm bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base font-bold">User Ledger Balances</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Audit list of all user balances, wallet states, and adjustment logs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search user name or email..."
                  className="pl-9 h-9 text-xs border-border/60"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/40">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    User / Entity
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Wallet ID
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Last Transaction
                  </th>
                  {/* <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {paginatedWallets.length > 0 ? (
                  paginatedWallets.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                              {(item.userName || "")
                                .split(" ")
                                .filter(Boolean)
                                .map((n) => n[0])
                                .join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight">{item.userName}</span>
                            <span className="text-xs text-muted-foreground">{item.userEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        {formatCurrency(item.balance)}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                        {formatCurrency(item.totalSpent)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          onClick={() => handleToggleStatus(item)}
                          className={`text-[9px] font-bold border-none px-2 h-5 cursor-pointer ${item.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                            : "bg-rose-500/10 text-rose-700 hover:bg-rose-500/20"
                            }`}
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {item.lastTransactionDate
                          ? new Date(item.lastTransactionDate).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                          : "N/A"}
                      </td>
                      {/* <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px] font-bold px-2.5 border-border hover:bg-primary hover:text-white transition-all"
                            onClick={() => handleAdjustBalance(item)}
                          >
                            Adjust Balance
                          </Button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <Coins className="h-12 w-12 mb-4 text-muted-foreground/40" />
                        <p className="text-sm font-bold uppercase tracking-widest mb-1">No wallets found</p>
                        <p className="text-xs">Adjust your search parameters and try again</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/5">
            <div className="text-xs text-muted-foreground font-medium">
              Showing {wallets.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, wallets.length)} of {wallets.length} wallets
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold px-3 border-border/60 bg-card hover:bg-muted"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold px-3 border-border/60 bg-card hover:bg-muted"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Balance Dialog (Shadcn Dialog Pattern) */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="sm:max-w-[425px] border border-border bg-card p-0 overflow-hidden rounded-2xl shadow-2xl">
          <DialogHeader className="p-6 border-b border-border bg-muted/20">
            <DialogTitle className="text-lg font-bold tracking-tight">Adjust Wallet Balance</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Select transaction type and amount to manually adjust {selectedWallet?.userName}'s balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Adjustment Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={adjustType === "credit" ? "default" : "outline"}
                  className="h-10 text-xs font-bold gap-1.5"
                  onClick={() => setAdjustType("credit")}
                >
                  <Plus className="h-3.5 w-3.5" /> Credit (Top-up)
                </Button>
                <Button
                  variant={adjustType === "debit" ? "default" : "outline"}
                  className="h-10 text-xs font-bold gap-1.5"
                  onClick={() => setAdjustType("debit")}
                >
                  <Minus className="h-3.5 w-3.5" /> Debit (Charge)
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Amount (₦)
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g. 5000"
                  className="h-10 pl-8 text-xs font-semibold focus-visible:ring-primary"
                  value={adjustAmount}
                  onChange={(e) =>
                    setAdjustAmount(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))
                  }
                />
                <span className="absolute left-3 top-3 text-[11px] font-bold text-slate-500">₦</span>
              </div>
            </div>
            {selectedWallet && (
              <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Current Balance:</span>
                  <span className="font-bold text-foreground">{formatCurrency(selectedWallet.balance)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Expected Balance:</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(
                      selectedWallet.balance +
                      (adjustType === "credit" ? Number(adjustAmount || 0) : -Number(adjustAmount || 0))
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="bg-muted/10 p-6 border-t border-border/40">
            <Button variant="outline" onClick={() => setIsAdjustOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={submitAdjustment} disabled={isSubmitting || adjustAmount === "" || adjustAmount <= 0}>
              {isSubmitting ? "Adjusting..." : "Submit Adjustment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function WalletLoadingScreen() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Syncing Wallet Gateway
          </span>
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">
            Syncing platform funds and subscriber ledgers...
          </p>
        </div>
      </div>
    </div>
  )
}
