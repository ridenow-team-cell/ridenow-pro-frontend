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
   Bus,
   Star,
   Clock,
   ShieldCheck,
   ChevronRight
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

const driversData = [
   {
      id: "DRV-9021",
      name: "Sarah Jenkins",
      email: "sarah.j@RydeNow.com",
      fleet: "Electric Bus (EV-992)",
      status: "On Duty",
      rating: 4.9,
      trips: 1240,
      hours: 185,
      joinDate: "Jan 2024",
      avatar: "/avatars/sarah.jpg"
   },
   {
      id: "DRV-9022",
      name: "Marcus Miller",
      email: "marcus.m@RydeNow.com",
      fleet: "Minivan (MV-441)",
      status: "Off Duty",
      rating: 4.7,
      trips: 850,
      hours: 142,
      joinDate: "Feb 2024",
      avatar: "/avatars/marcus.jpg"
   },
   {
      id: "DRV-9023",
      name: "Elena Gilbert",
      email: "elena.g@RydeNow.com",
      fleet: "Electric Bus (EV-102)",
      status: "On Duty",
      rating: 4.8,
      trips: 2100,
      hours: 320,
      joinDate: "Dec 2023",
      avatar: "/avatars/elena.jpg"
   },
   {
      id: "DRV-9024",
      name: "Alex Rivera",
      email: "alex.r@RydeNow.com",
      fleet: "Standard (ST-882)",
      status: "Suspended",
      rating: 3.2,
      trips: 42,
      hours: 12,
      joinDate: "Mar 2024",
      avatar: "/avatars/alex.jpg"
   },
]

const getStatusBadge = (status: string) => {
   switch (status) {
      case "On Duty":
         return <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/5 px-2 py-0 h-5 text-[10px] font-semibold">ON DUTY</Badge>
      case "Off Duty":
         return <Badge variant="outline" className="border-slate-500/50 text-slate-500 bg-slate-500/5 px-2 py-0 h-5 text-[10px] font-semibold">OFF DUTY</Badge>
      case "Suspended":
         return <Badge variant="outline" className="border-rose-500/50 text-rose-500 bg-rose-500/5 px-2 py-0 h-5 text-[10px] font-semibold">SUSPENDED</Badge>
      default:
         return <Badge variant="outline" className="px-2 py-0 h-5 text-[10px] font-semibold">{status.toUpperCase()}</Badge>
   }
}

export default function DriverManagementPage() {
   return (
      <div className="space-y-8 pt-4 pb-10">
         {/* Page Header */}
         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
               <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Driver Management
               </h1>
               <p className="text-sm text-muted-foreground">
                  Manage fleet operators, track performance metrics, and audit driving logs.
               </p>
            </div>
            <div className="flex items-center gap-2 pt-2 md:pt-0">
               <Button variant="outline" size="sm" className="h-9 px-4 border-border font-semibold text-xs">
                  <Download className="mr-2 h-4 w-4" />
                  Export Roster
               </Button>
               <Button size="sm" className="h-9 px-4 font-semibold text-xs shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Driver
               </Button>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <KPICard title="Total Operators" value="142" icon={<Users className="h-4 w-4" />} trend="+4" trendType="up" />
            <KPICard title="Active On-Duty" value="86" icon={<Bus className="h-4 w-4" />} trend="72%" trendType="up" />
            <KPICard title="Avg Fleet Rating" value="4.8" icon={<Star className="h-4 w-4" />} trend="+0.2" trendType="up" />
            <KPICard title="Safety Incidents" value="2" icon={<ShieldAlert className="h-4 w-4" />} trend="-40%" trendType="down" />
         </div>

         {/* Search & Filters */}
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                  placeholder="Search by ID, name, or fleet license..."
                  className="pl-10 h-10 border-border bg-muted/20"
               />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
               <Button variant="outline" className="h-10 border-border gap-2 font-semibold text-xs px-4">
                  <Filter className="h-4 w-4" />
                  Filter Operators
               </Button>
            </div>
         </div>

         {/* Driver Roster Card */}
         <Card className="border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                     <tr>
                        <th className="px-6 py-3 text-left font-semibold text-xs">Operator Identity</th>
                        <th className="px-6 py-3 text-left font-semibold text-xs">Assigned Fleet</th>
                        <th className="px-6 py-3 text-left font-semibold text-xs">Performance</th>
                        <th className="px-6 py-3 text-left font-semibold text-xs">Status</th>
                        <th className="px-6 py-3 text-right font-semibold text-xs">Controls</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {driversData.map((driver) => (
                        <tr key={driver.id} className="hover:bg-muted/30 transition-colors">
                           <td className="px-6 py-4">
                              <Link href={`/dashboard/users/drivers/${driver.id}`} className="flex items-center gap-3 group">
                                 <Avatar className="h-10 w-10 border border-border group-hover:border-primary transition-colors">
                                    <AvatarImage src={driver.avatar} alt={driver.name} />
                                    <AvatarFallback className="bg-muted text-primary text-xs font-bold">
                                       {driver.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <p className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{driver.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{driver.id}</p>
                                 </div>
                              </Link>
                           </td>
                           <td className="px-6 py-4">
                              <div className="space-y-1">
                                 <p className="font-semibold text-xs">{driver.fleet}</p>
                                 <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {driver.hours}h logged this month
                                 </p>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-6">
                                 <div className="space-y-0.5">
                                    <p className="text-[9px] text-muted-foreground font-semibold">Rating</p>
                                    <div className="flex items-center gap-1 font-bold text-xs">
                                       <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                       {driver.rating}
                                    </div>
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="text-[9px] text-muted-foreground font-semibold">Total Trips</p>
                                    <p className="text-xs font-bold tabular-nums">{driver.trips.toLocaleString()}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              {getStatusBadge(driver.status)}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                       <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="text-xs font-bold px-2 py-1.5">Driver Controls</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                       <Link href={`/dashboard/users/drivers/${driver.id}`} className="gap-2 font-medium text-xs">
                                          <UserIcon className="h-3.5 w-3.5" /> Profile Dossier
                                       </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 font-medium text-xs">
                                       <History className="h-3.5 w-3.5" /> Viewing Driving Logs
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 font-medium text-xs">
                                       <ShieldCheck className="h-3.5 w-3.5" /> Safety Review
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-rose-600 gap-2 font-semibold text-xs">
                                       <XCircle className="h-3.5 w-3.5" /> Suspend License
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
               <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Showing {driversData.length} of 142 operators</p>
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
