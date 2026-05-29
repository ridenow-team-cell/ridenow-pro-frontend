"use client"

import * as React from "react"
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  BadgeCent,
  Tag
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  getWalletTransactionsList,
  type TransactionData
} from "@/lib/api/wallets"

export default function WalletTransactionsPage() {
  const [transactions, setTransactions] = React.useState<TransactionData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("All")
  const [statusFilter, setStatusFilter] = React.useState("All")

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = transactions.slice(startIndex, endIndex)

  const fetchTransactions = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getWalletTransactionsList(search, typeFilter, statusFilter)
      if (res.success && res.data) {
        setTransactions(res.data)
      }
    } catch (err) {
      console.error("Failed to load transactions:", err)
      toast.error("Failed to load transaction ledger")
    } finally {
      setIsLoading(false)
    }
  }, [search, typeFilter, statusFilter])

  React.useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleExport = () => {
    if (transactions.length === 0) {
      toast.warning("No transactions to export")
      return
    }

    try {
      // Create CSV content
      const headers = ["Transaction ID", "User", "Email", "Type", "Amount (NGN)", "Status", "Date", "Method"]
      const rows = transactions.map((t) => [
        t.id,
        t.user,
        t.email,
        t.type,
        t.amount,
        t.status,
        t.date,
        t.method
      ])

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `wallet_transactions_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Ledger exported successfully")
    } catch (err) {
      console.error("Failed to export ledger:", err)
      toast.error("Export failed")
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Calculate quick stats from current display
  const totalVolume = transactions
    .filter((t) => t.status === "Success")
    .reduce((acc, curr) => acc + curr.amount, 0)
  const successCount = transactions.filter((t) => t.status === "Success").length
  const failedCount = transactions.filter((t) => t.status === "Failed").length

  return (
    <div className="space-y-7 pt-2 pb-12 px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">
            Wallet Auditing
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Wallet Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Comprehensive audit logs of all wallet top-ups, trips paid, and refunds issued.
          </p>
        </div>
        <div className="flex items-center gap-2">

        </div>
      </div>

      {/* Transaction Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Volume */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-primary opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-semibold">
                Processed Volume
              </p>
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight mb-1">
              {formatCurrency(totalVolume)}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">
              Successful transactions in view
            </p>
          </CardContent>
        </Card>

        {/* Success Count */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-semibold">
                Success Payments
              </p>
              <div className="h-7 w-7 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight mb-1">
              {successCount}
            </div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
              Settled successfully
            </p>
          </CardContent>
        </Card>

        {/* Failed Count */}
        <Card className="border-border/60 bg-card/80 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-rose-500 opacity-60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-semibold">
                Failed Payments
              </p>
              <div className="h-7 w-7 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-600">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight mb-1">
              {failedCount}
            </div>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-tighter">
              Declined or aborted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Ledger Table */}
      <Card className="border-border/60 shadow-sm bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search ID, user name, email..."
                className="pl-9 h-9 text-xs border-border/60"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Filter className="h-3 w-3" /> Filters:
              </div>

              {/* Type Select */}
              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  setTypeFilter(val)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-9 w-36 bg-card border-border/60 text-xs font-semibold rounded-lg">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="All" className="text-xs">All Types</SelectItem>
                  <SelectItem value="Top-up" className="text-xs">Top-ups</SelectItem>
                  <SelectItem value="Trip Payment" className="text-xs">Trip Payments</SelectItem>
                  <SelectItem value="Refund" className="text-xs">Refunds</SelectItem>
                  <SelectItem value="Service Fee" className="text-xs">Service Fees</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Select */}
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-9 w-36 bg-card border-border/60 text-xs font-semibold rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="All" className="text-xs">All Statuses</SelectItem>
                  <SelectItem value="Success" className="text-xs">Success</SelectItem>
                  <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
                  <SelectItem value="Failed" className="text-xs">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/40">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    User
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Type
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Gateway/Method
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
                        <span className="text-xs font-semibold text-muted-foreground">Loading ledger...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  paginatedTransactions.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                              {item.user
                                .split(" ")
                                .filter(Boolean)
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight">{item.user}</span>
                            <span className="text-xs text-muted-foreground">{item.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                        {item.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-foreground">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                        {item.method}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`text-[9px] font-bold border-none px-2 h-5 ${item.status === "Success"
                              ? "bg-emerald-500/10 text-emerald-700"
                              : item.status === "Failed"
                                ? "bg-rose-500/10 text-rose-700"
                                : "bg-amber-500/10 text-amber-700"
                            }`}
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <CreditCard className="h-12 w-12 mb-4 text-muted-foreground/40" />
                        <p className="text-sm font-bold uppercase tracking-widest mb-1">No Transactions found</p>
                        <p className="text-xs">Verify your search and filters or clear filters to view ledger</p>
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
              Showing {transactions.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, transactions.length)} of {transactions.length} transactions
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
        <CardFooter className="bg-muted/10 px-6 py-3 border-t border-border/40 flex items-center justify-between">
          <p className="text-[10px] font-medium text-muted-foreground italic">
            Ledger contains live transactions processed today • Last updated just now
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
