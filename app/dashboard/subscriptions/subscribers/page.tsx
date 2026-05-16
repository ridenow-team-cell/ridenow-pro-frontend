"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  User as UserIcon, 
  Clock, 
  ShieldAlert, 
  CheckCircle2,
  XCircle,
  Mail,
  History,
  FileEdit,
  ArrowUpRight,
  ChevronRight,
  Download,
  ExternalLink
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSubscriptionHistory, type UserSubscription } from "@/lib/api/subscriptions"

export default function SubscriberListPage() {
  const [data, setData] = React.useState<UserSubscription[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  const fetchHistory = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getSubscriptionHistory()
      if (res.success && res.data) {
        setData(res.data)
      }
    } catch (err) {
      console.error("Failed to fetch subscription history:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const filteredData = data.filter(sub => {
    const userName = sub.user ? `${sub.user.first_name || ""} ${sub.user.last_name || ""}`.toLowerCase() : ""
    const userEmail = sub.user?.email?.toLowerCase() || ""
    const subId = sub.id?.toLowerCase() || ""
    const search = searchTerm.toLowerCase()
    
    return userName.includes(search) || userEmail.includes(search) || subId.includes(search)
  })

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    switch (s) {
      case "active":
        return <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/5 uppercase text-[9px] font-bold">Active</Badge>
      case "pending":
      case "pending renewal":
        return <Badge variant="outline" className="border-amber-500/50 text-amber-500 bg-amber-500/5 uppercase text-[9px] font-bold">Pending</Badge>
      case "suspended":
        return <Badge variant="outline" className="border-rose-500/50 text-rose-500 bg-rose-500/5 uppercase text-[9px] font-bold">Suspended</Badge>
      case "expired":
        return <Badge variant="outline" className="border-zinc-500/50 text-zinc-500 bg-zinc-500/5 uppercase text-[9px] font-bold">Expired</Badge>
      default:
        return <Badge variant="outline" className="uppercase text-[9px] font-bold">{status}</Badge>
    }
  }

  if (isLoading) {
    return <SubscriberLoadingScreen />
  }

  return (
    <div className="space-y-6 pt-4 pb-12 px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Subscriber Management
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Monitor subscription status, renewal cycles, and user eligibility.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium border-border/60 hover:bg-muted text-xs">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Flagged Users
          </Button>
          <Button size="sm" className="h-9 px-4 font-bold text-xs shadow-lg shadow-primary/20 bg-primary">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between gap-4">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
               placeholder="Search by name, email, or ID..." 
               className="pl-9 h-10 bg-card/50 border-border/50 text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 border-border/50 gap-2 font-medium text-sm">
               <Filter className="h-4 w-4" /> Filter
            </Button>
         </div>
      </div>

      {/* Subscribers Table */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Subscriber</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Active Plan</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Credits Left</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Expiry</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredData.length > 0 ? (
                filteredData.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-full border border-border/40">
                          <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black uppercase">
                            {sub.user?.first_name?.[0] || ""}{sub.user?.last_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold tracking-tight text-sm leading-none">
                            {sub.user ? `${sub.user.first_name} ${sub.user.last_name}` : "Unknown User"}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                            {sub.user?.email || "No email available"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="font-bold text-sm text-foreground">{sub.plan?.planName || "Unknown Plan"}</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-1 font-mono uppercase tracking-tighter">ID: {sub.id?.substring(sub.id.length - 8) || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between w-24">
                           <span className="text-[10px] font-bold">{sub.remainingCredits.toLocaleString()}</span>
                           <span className="text-[9px] text-muted-foreground opacity-60">/ {sub.totalCredits.toLocaleString()}</span>
                        </div>
                        <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-primary transition-all duration-500" 
                              style={{ width: `${(sub.remainingCredits / sub.totalCredits) * 100}%` }}
                           />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-[11px] font-bold uppercase tracking-tighter">
                          {new Date(sub.endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/subscriptions/subscribers/${sub.id}`}>
                          <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest gap-1.5 border-border/60">
                             View Details <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5">Subscriber Management</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-xs font-medium">
                              <UserIcon className="h-3.5 w-3.5" /> User Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-xs font-medium">
                              <FileEdit className="h-3.5 w-3.5" /> Adjust Credits
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-xs font-medium">
                              <History className="h-3.5 w-3.5" /> Usage Logs
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-xs font-medium text-rose-500">
                              <XCircle className="h-3.5 w-3.5" /> Deactivate Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                       <Users className="h-12 w-12 mb-4" />
                       <p className="text-sm font-bold uppercase tracking-widest mb-1">No subscribers found</p>
                       <p className="text-xs">Your active subscription pool will appear here</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Live Subscriber Stream • Total: {data.length}</p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest" disabled>Prev</Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">Next</Button>
           </div>
        </div>
      </Card>
    </div>
  )
}

function SubscriberLoadingScreen() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <img 
          src="/logo.png" 
          alt="RideNow Logo" 
          className="h-24 w-auto object-contain animate-breathing"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Mapping Subscriber Identities</span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">Syncing active credits & renewal states...</p>
        </div>
      </div>
    </div>
  )
}
