"use client"

import * as React from "react"
import { 
  UserCheck, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  History, 
  ShieldAlert, 
  Phone, 
  MessageSquare,
  ChevronRight,
  User,
  Zap,
  Activity,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
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

// Mock Driver Data
const drivers = [
  { id: "DRV-001", name: "Alice Vance", status: "Active", rating: 4.9, completion: 98, incidents: 0, currentTrip: "TRP-1021", shift: "08:00 - 16:00" },
  { id: "DRV-002", name: "John Doe", status: "Active", rating: 4.7, completion: 94, incidents: 1, currentTrip: "TRP-0992", shift: "06:00 - 14:00" },
  { id: "DRV-003", name: "Sarah Connor", status: "Break", rating: 4.8, completion: 96, incidents: 0, currentTrip: "None", shift: "10:00 - 18:00" },
  { id: "DRV-004", name: "Mike Ross", status: "Offline", rating: 4.5, completion: 89, incidents: 3, currentTrip: "None", shift: "Night Shift" },
  { id: "DRV-005", name: "Emma Wilson", status: "Active", rating: 5.0, completion: 100, incidents: 0, currentTrip: "TRP-551", shift: "08:00 - 16:00" },
]

export default function DriverOpsPage() {
  const [selectedDriver, setSelectedDriver] = React.useState<any>(null)

  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <UserCheck className="h-7 w-7 text-primary" /> Driver Operations
          </h1>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Real-time performance auditing and fleet crew management.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" className="h-10 px-4 border-border font-semibold text-xs uppercase tracking-wider">
              Duty Roster
           </Button>
           <Button size="sm" className="h-10 px-6 font-semibold text-xs uppercase tracking-wider brand-gradient text-white shadow-lg shadow-primary/20">
              Onboard Driver
           </Button>
        </div>
      </div>

      {/* Driver Availability Board */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Drivers", val: "124", icon: User, color: "text-primary", bg: "bg-primary/5" },
          { title: "Active Now", val: "86", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "On Break", val: "12", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Avg Rating", val: "4.82", icon: Award, color: "text-primary", bg: "bg-primary/5" }
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 overflow-hidden">
        {/* Driver List Ledger */}
        <Card className="lg:col-span-2 border-border shadow-xl overflow-hidden flex flex-col">
           <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Crew Ledger</h3>
              <div className="relative w-48">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                 <Input placeholder="Search drivers..." className="pl-8 h-8 text-xs border-border bg-white" />
              </div>
           </div>
           <ScrollArea className="flex-1 max-h-[600px]">
              <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground border-b border-border sticky top-0 z-10">
                       <tr>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Driver Identity</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Performance</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Current Unit</th>
                          <th className="px-6 py-3 text-right"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {drivers.map((driver) => (
                          <tr 
                             key={driver.id} 
                             onClick={() => setSelectedDriver(driver)}
                             className={`hover:bg-muted/10 transition-colors cursor-pointer ${selectedDriver?.id === driver.id ? 'bg-primary/5' : ''}`}
                          >
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-primary">
                                      {driver.name.split(' ').map(n => n[0]).join('')}
                                   </div>
                                   <div>
                                      <p className="font-bold tracking-tight text-sm">{driver.name}</p>
                                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">{driver.id}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <Badge variant="outline" className={`font-semibold text-[10px] border-none px-2 h-5 ${
                                   driver.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                                   driver.status === 'Break' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                   {driver.status.toUpperCase()}
                                </Badge>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                   <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                   {driver.rating}
                                </div>
                             </td>
                             <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                                {driver.currentTrip === "None" ? "--" : driver.currentTrip}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                   <ChevronRight className="h-4 w-4" />
                                </Button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </ScrollArea>
        </Card>

        {/* Performance & Activity Detail */}
        <div className="space-y-6">
           <Card className="border-border shadow-xl overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-border bg-muted/10">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Crew Intelligence</h3>
              </div>
              
              <ScrollArea className="flex-1">
                 {selectedDriver ? (
                    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                       {/* Driver Profile Summary */}
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl">
                                {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                             </div>
                             <div>
                                <h2 className="text-2xl font-bold tracking-tight">{selectedDriver.name}</h2>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{selectedDriver.shift}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border text-primary"><Phone className="h-4 w-4" /></Button>
                             <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border text-primary"><MessageSquare className="h-4 w-4" /></Button>
                          </div>
                       </div>

                       {/* Performance Stats */}
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-muted/30 rounded-2xl space-y-2 border border-border/50">
                             <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Completion Rate</p>
                             <div className="flex items-end justify-between">
                                <p className="text-2xl font-black text-primary">{selectedDriver.completion}%</p>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mb-1" />
                             </div>
                             <Progress value={selectedDriver.completion} className="h-1" />
                          </div>
                          <div className="p-4 bg-muted/30 rounded-2xl space-y-2 border border-border/50">
                             <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Incident Tagging</p>
                             <div className="flex items-end justify-between">
                                <p className={`text-2xl font-black ${selectedDriver.incidents > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{selectedDriver.incidents}</p>
                                <ShieldAlert className={`h-4 w-4 ${selectedDriver.incidents > 0 ? 'text-rose-500' : 'text-emerald-500'} mb-1`} />
                             </div>
                             <div className="flex gap-1 pt-1">
                                {[1, 2, 3].map((_, i) => (
                                   <div key={i} className={`h-1 flex-1 rounded-full ${i < selectedDriver.incidents ? 'bg-rose-500' : 'bg-zinc-200'}`} />
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Driver Activity Timeline */}
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Duty Timeline</p>
                             <History className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                             {[
                                { time: "06:00 AM", event: "Shift Start", status: "Verified" },
                                { time: "08:15 AM", event: "Trip TRP-902 Completed", status: "Successful" },
                                { time: "10:30 AM", event: "Fuel Stop", status: "Unauthorized", critical: true },
                                { time: "12:00 PM", event: "Lunch Break", status: "Active" },
                             ].map((item, i) => (
                                <div key={i} className="pl-8 relative">
                                   <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white ${item.critical ? 'bg-rose-500' : 'bg-primary'}`} />
                                   <div className="flex items-center justify-between">
                                      <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.time}</p>
                                      <Badge variant="ghost" className={`text-[8px] font-bold ${item.critical ? 'text-rose-600' : 'text-muted-foreground'}`}>{item.status}</Badge>
                                   </div>
                                   <p className="text-xs font-bold tracking-tight">{item.event}</p>
                                </div>
                             ))}
                          </div>
                       </div>

                       {/* Action Tools */}
                       <div className="space-y-3 pt-4 border-t border-border">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Operational Actions</p>
                          <div className="grid grid-cols-2 gap-3">
                             <Button variant="outline" className="h-11 font-bold text-[10px] uppercase tracking-widest border-border hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all">
                                <AlertTriangle className="mr-2 h-3 w-3" /> Report Incident
                             </Button>
                             <Button variant="outline" className="h-11 font-bold text-[10px] uppercase tracking-widest border-border">
                                <TrendingUp className="mr-2 h-3 w-3" /> Performance
                             </Button>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-40">
                       <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                          <Activity className="h-12 w-12 text-muted-foreground" />
                       </div>
                       <div>
                          <p className="text-sm font-bold uppercase tracking-tight">Select Crew Member</p>
                          <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto">Click on a driver in the ledger to view performance auditing and live activity streams.</p>
                       </div>
                    </div>
                 )}
              </ScrollArea>
           </Card>
        </div>
      </div>
    </div>
  )
}
