"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  User as UserIcon, 
  ShieldAlert, 
  CheckCircle2,
  XCircle,
  Mail,
  History,
  FileEdit,
  ArrowUpRight,
  TrendingUp,
  Download,
  Users,
  Send,
  UserCheck,
  Globe,
  Bell,
  Info,
  Trash2,
  Zap,
  MessageSquare,
  Plus,
  Ticket,
  CreditCard
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const customersData = [
  { 
    id: "USR-4021", 
    name: "Thomas Anderson", 
    email: "neo@matrix.io", 
    plan: "Elite Unlimited", 
    status: "Active", 
    trips: 142,
    joinDate: "Jan 2024",
    avatar: "/avatars/neo.jpg" 
  },
  { 
    id: "USR-4022", 
    name: "Trinity Moss", 
    email: "trinity@matrix.io", 
    plan: "Student Weekly", 
    status: "Active", 
    trips: 89,
    joinDate: "Feb 2024",
    avatar: "/avatars/trinity.jpg" 
  },
  { 
    id: "USR-4023", 
    name: "Morpheus Lawrence", 
    email: "captain@nebuchadnezzar.net", 
    plan: "Corporate Pass", 
    status: "Active", 
    trips: 215,
    joinDate: "Dec 2023",
    avatar: "/avatars/morpheus.jpg" 
  },
  { 
    id: "USR-4024", 
    name: "Cypher Reagan", 
    email: "cypher@traitor.com", 
    plan: "Regular Monthly", 
    status: "Suspended", 
    trips: 42,
    joinDate: "Mar 2024",
    avatar: "/avatars/cypher.jpg" 
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/5 px-2 py-0 h-5 text-[10px] font-semibold">ACTIVE</Badge>
    case "Suspended":
      return <Badge variant="outline" className="border-rose-500/50 text-rose-500 bg-rose-500/5 px-2 py-0 h-5 text-[10px] font-semibold">SUSPENDED</Badge>
    case "Flagged":
      return <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/5 px-2 py-0 h-5 text-[10px] font-semibold">FLAGGED</Badge>
    default:
      return <Badge variant="outline" className="px-2 py-0 h-5 text-[10px] font-semibold">{status.toUpperCase()}</Badge>
  }
}

export default function CustomerManagementPage() {
  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Customer Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor subscriber behavior, manage ticket tiers, and oversee platform growth.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 border-border font-semibold text-xs">
            <Download className="mr-2 h-4 w-4" />
            Export Base
          </Button>
          <Button size="sm" className="h-9 px-4 font-semibold text-xs shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Passengers" value="12,845" icon={<Users className="h-4 w-4" />} trend="+12%" trendType="up" />
        <KPICard title="Elite OneTickets" value="4,210" icon={<Ticket className="h-4 w-4" />} trend="32%" trendType="up" />
        <KPICard title="Retention Rate" value="98.2%" icon={<UserCheck className="h-4 w-4" />} trend="+0.4%" trendType="up" />
        <KPICard title="Revenue MTD" value="₦14.2M" icon={<TrendingUp className="h-4 w-4" />} trend="+₦2.1M" trendType="up" />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input 
              placeholder="Search customers..." 
              className="pl-10 h-10 border-border bg-muted/20"
           />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Button variant="outline" className="h-10 border-border gap-2 font-semibold text-xs px-4">
              <Filter className="h-4 w-4" /> 
              Filter Audience
           </Button>
        </div>
      </div>

      {/* Customer Roster Card */}
      <Card className="border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
           <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                 <tr>
                    <th className="px-6 py-3 text-left font-semibold text-xs">Customer Identity</th>
                    <th className="px-6 py-3 text-left font-semibold text-xs">Pass Tier</th>
                    <th className="px-6 py-3 text-left font-semibold text-xs">Utilization</th>
                    <th className="px-6 py-3 text-left font-semibold text-xs">Status</th>
                    <th className="px-6 py-3 text-right font-semibold text-xs">Controls</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {customersData.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                       <td className="px-6 py-4">
                          <Link href={`/dashboard/users/customers/${user.id}`} className="flex items-center gap-3 group">
                             <Avatar className="h-10 w-10 border border-border group-hover:border-primary transition-colors">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-muted text-primary text-xs font-bold">
                                   {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{user.email}</p>
                             </div>
                          </Link>
                       </td>
                       <td className="px-6 py-4">
                          <div className="space-y-1">
                             <p className="font-semibold text-xs">{user.plan}</p>
                             <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">{user.id}</p>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-6">
                             <div className="space-y-0.5">
                                <p className="text-[9px] text-muted-foreground font-semibold uppercase">Total Trips</p>
                                <p className="text-xs font-bold tabular-nums">{user.trips}</p>
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[9px] text-muted-foreground font-semibold uppercase">Joined</p>
                                <p className="text-xs font-bold uppercase">{user.joinDate}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          {getStatusBadge(user.status)}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                   <MoreHorizontal className="h-4 w-4" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="text-xs font-bold px-2 py-1.5">Executive Controls</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                   <Link href={`/dashboard/users/customers/${user.id}`} className="gap-2 font-medium text-xs">
                                      <UserIcon className="h-3.5 w-3.5" /> Profile Dossier
                                   </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 font-medium text-xs">
                                   <Mail className="h-3.5 w-3.5" /> Send Private Alert
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 font-medium text-xs">
                                   <CreditCard className="h-3.5 w-3.5" /> Billing History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-rose-600 gap-2 font-semibold text-xs">
                                   <XCircle className="h-3.5 w-3.5" /> Suspend Access
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
        <CardFooter className="p-4 bg-muted/20 border-t border-border flex items-center justify-between">
           <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Base Records: {customersData.length} indexed</p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 font-semibold text-[10px] px-3">Prev</Button>
              <Button variant="outline" size="sm" className="h-8 font-semibold text-[10px] px-3">Next</Button>
           </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function KPICard({ title, value, icon, trend, trendType }: { title: string, value: string, icon: React.ReactNode, trend: string, trendType: 'up' | 'down' }) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded bg-muted/50 flex items-center justify-center text-primary/70">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${trendType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendType === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
          {trend}
        </p>
      </CardContent>
    </Card>
  )
}
