"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  ShieldCheck,
  Search, 
  Filter, 
  AlertTriangle, 
  History, 
  MessageSquare, 
  MoreHorizontal, 
  UserX, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Eye,
  Lock,
  Flag,
  ArrowRight
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const fraudAlerts = [
  { id: "FRD-901", user: "Thomas Anderson", type: "Shared Account Abuse", risk: "High", detected: "2h ago", description: "Simultaneous logins from Neo-Tokyo and London (VPN detected)." },
  { id: "FRD-902", user: "Cypher Reagan", type: "Payment Bypass Attempt", risk: "Critical", detected: "5h ago", description: "Injected local state to spoof subscription validity at Terminal 4." },
  { id: "FRD-903", user: "Trinity Moss", type: "Multiple Device Spike", risk: "Medium", detected: "1d ago", description: "Account accessed by 12 different devices in 24 hours." },
]

const disputes = [
  { id: "DIS-101", user: "Agent Smith", type: "Access Denied", status: "Pending", priority: "High", date: "May 4, 2026", message: "Valid subscription active but gate at Sector 7 rejected my QR code." },
  { id: "DIS-102", user: "Niobe Jada", type: "Billing Dispute", status: "In Review", priority: "Medium", date: "May 3, 2026", message: "Charged twice for the Monthly Elite pass after app crash." },
]

const incidentsList = [
  { time: "May 5, 14:24", type: "User Violation", desc: "Verbal abuse reported by driver RT-402", entity: "Thomas Anderson", status: "Resolved" },
  { time: "May 5, 12:10", type: "Op Incident", desc: "Unauthorized gate access attempt at Terminal 2", entity: "Sector 2 Gate", status: "In Review" },
  { time: "May 4, 18:45", type: "Safety Issue", desc: "Emergency exit tampering detected on BUS-88", entity: "BUS-88", status: "Pending" },
]

export default function CompliancePage() {
  const isZeroState = true

  // Filtered source arrays based on toggle
  const alerts: typeof fraudAlerts = []
  const userDisputes: typeof disputes = []
  const incidents: typeof incidentsList = []
  const auditLogsCount = 0

  return (
    <div className="space-y-6 pt-4 pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 border border-border rounded-xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-primary" /> Compliance & Risk Control
            </h1>
            <Badge variant="outline" className="bg-rose-500/10 border-rose-500/20 text-rose-600 font-bold uppercase text-[9px] px-2">
              Secured
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground pl-0.5 font-medium">
            Monitor platform integrity, investigate fraud, and resolve user disputes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" className="h-10 px-4 font-semibold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm">
            <Lock className="mr-2 h-4 w-4" />
            Security Lockdown
          </Button>
        </div>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* KPI Alert count */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Fraud Alerts</CardTitle>
            <ShieldAlert className={`h-4 w-4 ${isZeroState ? 'text-emerald-500' : 'text-rose-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold tracking-tight ${isZeroState ? 'text-emerald-600' : ''}`}>
              {isZeroState ? "0" : "24"}
            </div>
            {isZeroState ? (
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Platform secure</p>
            ) : (
              <p className="text-[10px] text-rose-600 font-bold mt-1">8 high priority</p>
            )}
          </CardContent>
        </Card>

        {/* KPI disputes count */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Open Disputes</CardTitle>
            <MessageSquare className={`h-4 w-4 ${isZeroState ? 'text-emerald-500' : 'text-orange-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold tracking-tight ${isZeroState ? 'text-emerald-600' : ''}`}>
              {isZeroState ? "0" : "12"}
            </div>
            {isZeroState ? (
              <p className="text-[10px] text-emerald-600 font-bold mt-1">All tickets cleared</p>
            ) : (
              <p className="text-[10px] text-muted-foreground mt-1">Average resolution: 4h</p>
            )}
          </CardContent>
        </Card>

        {/* KPI blocked count */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Blocked Accounts</CardTitle>
            <UserX className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {isZeroState ? "0" : "142"}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {isZeroState ? "No active locks" : "+3 today"}
            </p>
          </CardContent>
        </Card>

        {/* KPI trust score avg */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trust Score Avg</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {isZeroState ? "100.0" : "98.2"}
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">Excellent stability</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="fraud" className="w-full">
        <TabsList className="w-full justify-start h-11 bg-muted p-1 border border-border rounded-md mb-6">
          <TabsTrigger value="fraud" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            Fraud Detection
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="h-3.5 w-3.5" />
            Incident Ledger
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <History className="h-3.5 w-3.5" />
            Audit Trail
          </TabsTrigger>
          <TabsTrigger value="disputes" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="h-3.5 w-3.5" />
            Dispute Center
          </TabsTrigger>
        </TabsList>

        {/* Fraud Detection Tab */}
        <TabsContent value="fraud" className="space-y-4">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight">Subscription Security Alerts</h3>
              <Button variant="outline" size="sm" className="h-8 border-border" disabled={isZeroState}>Clear Low Priority</Button>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {alerts.map((alert) => (
                 <Card key={alert.id} className="border-border bg-card group overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                       <div className={`w-1.5 ${alert.risk === 'Critical' ? 'bg-rose-600' : alert.risk === 'High' ? 'bg-rose-400' : 'bg-orange-400'}`} />
                       <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                   <Badge variant="outline" className={`text-[10px] font-bold border-none uppercase ${alert.risk === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'}`}>
                                      {alert.risk} Risk
                                   </Badge>
                                   <span className="text-[10px] text-muted-foreground font-mono">{alert.id}</span>
                                </div>
                                <h4 className="text-base font-bold text-foreground">{alert.type}</h4>
                                <p className="text-sm text-muted-foreground max-w-2xl">{alert.description}</p>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="text-right">
                                   <p className="text-sm font-bold">{alert.user}</p>
                                   <p className="text-[10px] text-muted-foreground">{alert.detected}</p>
                                </div>
                                <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                         <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end" className="w-48 border-border">
                                      <DropdownMenuLabel>Alert Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> View Account</DropdownMenuItem>
                                      <DropdownMenuItem className="gap-2"><History className="h-4 w-4" /> IP Logs</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-rose-600 gap-2 font-semibold"><XCircle className="h-4 w-4" /> Suspend User</DropdownMenuItem>
                                   </DropdownMenuContent>
                                </DropdownMenu>
                             </div>
                          </div>
                       </div>
                    </div>
                 </Card>
              ))}

              {isZeroState && (
                <EmptyState 
                  icon={<ShieldCheck className="h-8 w-8 text-emerald-500 animate-bounce" />}
                  title="All Systems Secure"
                  description="No fraudulent logins, shared-ticket violations, or payment bypass spikes detected in the last 48 hours."
                  badgeText="Safe Operations"
                  badgeColor="bg-emerald-500/10 text-emerald-600"
                />
              )}
           </div>
        </TabsContent>

        {/* Incident Ledger Tab */}
        <TabsContent value="incidents" className="space-y-4">
           {isZeroState ? (
              <EmptyState 
                icon={<CheckCircle2 className="h-8 w-8 text-emerald-500 animate-pulse" />}
                title="Operations Running Smoothly"
                description="Every terminal gate, bus sensor, and driver beacon is operating within safe, validated margins."
                badgeText="Zero Logged Incidents"
                badgeColor="bg-emerald-500/10 text-emerald-600"
              />
           ) : (
             <Card className="border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-sm">
                      <thead className="bg-muted text-muted-foreground border-b border-border">
                         <tr>
                            <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left font-bold uppercase text-[9px] tracking-wider">Entity</th>
                            <th className="px-6 py-3 text-right font-bold uppercase text-[9px] tracking-wider">Resolution</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                         {incidents.map((incident, idx) => (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                               <td className="px-6 py-4 font-medium text-xs">{incident.time}</td>
                               <td className="px-6 py-4">
                                  <Badge variant="secondary" className="text-[10px] font-semibold">{incident.type.toUpperCase()}</Badge>
                                </td>
                               <td className="px-6 py-4 text-xs text-muted-foreground">{incident.desc}</td>
                               <td className="px-6 py-4 font-bold text-xs">{incident.entity}</td>
                               <td className="px-6 py-4 text-right">
                                  <Badge variant="outline" className={`text-[10px] font-bold border-none ${incident.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                                     {incident.status}
                                  </Badge>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </Card>
           )}
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search system logs..." className="pl-10 h-10 border-border" disabled={isZeroState} />
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="h-10 border-border px-4 bg-background" disabled={isZeroState}>Export Logs (JSON)</Button>
              </div>
           </div>
           
           {isZeroState ? (
              <EmptyState 
                icon={<History className="h-8 w-8 text-zinc-400" />}
                title="No Recent System Modifications"
                description="Platform settings, routes, and pricing tables remain locked and unmodified by admin personnel."
                badgeText="No Action Commits"
                badgeColor="bg-muted text-muted-foreground"
              />
           ) : (
             <Card className="border-border bg-card overflow-hidden">
                <div className="p-0">
                   <div className="bg-muted px-6 py-2 border-b border-border flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span className="w-40">Timestamp</span>
                      <span className="w-32">Actor</span>
                      <span className="flex-1">Action Event</span>
                      <span className="w-32 text-right">IP Address</span>
                   </div>
                   <div className="divide-y divide-border font-mono text-[11px]">
                      {[1, 2, 3, 4, 5, 6, 7, 8].slice(0, auditLogsCount).map((i) => (
                         <div key={i} className="px-6 py-3 flex items-center hover:bg-muted/10 transition-colors">
                            <span className="w-40 text-muted-foreground">2026-05-05 16:04:22</span>
                            <span className="w-32 font-bold text-primary">ADMIN-ALEX</span>
                            <span className="flex-1 text-foreground">MODIFIED_SUBSCRIPTION_PLAN <span className="text-muted-foreground opacity-50">{'{id: "PLN-003", val: 149.00}'}</span></span>
                            <span className="w-32 text-right text-muted-foreground">10.0.42.1{i}</span>
                         </div>
                      ))}
                   </div>
                </div>
                <div className="p-4 bg-muted/20 border-t border-border flex justify-center">
                   <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">Load Previous 500 Events</Button>
                </div>
             </Card>
           )}
        </TabsContent>

        {/* Dispute Center Tab */}
        <TabsContent value="disputes" className="space-y-6">
           {isZeroState ? (
              <EmptyState 
                icon={<MessageSquare className="h-8 w-8 text-primary animate-pulse" />}
                title="Zero Open Disputes"
                description="Outstanding customer queries, gate access reviews, and billing tickets are completely caught up."
                badgeText="Inbox Cleared"
                badgeColor="bg-primary/10 text-primary"
              />
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userDisputes.map((dispute) => (
                   <Card key={dispute.id} className="border-border bg-card">
                      <CardHeader className="border-b border-border pb-4 bg-muted/20">
                         <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className={`text-[9px] font-black border-none uppercase ${dispute.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'}`}>
                                  {dispute.priority} PRIORITY
                               </Badge>
                               <span className="text-[10px] text-muted-foreground font-mono">{dispute.id}</span>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground">{dispute.date}</span>
                         </div>
                         <CardTitle className="text-base font-bold">{dispute.type}: {dispute.user}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                         <div className="p-3 bg-muted/30 rounded border border-border italic text-sm text-muted-foreground">
                            "{dispute.message}"
                         </div>
                         <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2">
                               <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-[8px] bg-primary/10">JD</AvatarFallback>
                               </Avatar>
                               <span className="text-xs font-semibold">Assigned: John Doe</span>
                            </div>
                            <Badge variant="secondary" className="text-[10px] h-5">{dispute.status}</Badge>
                         </div>
                         <div className="flex gap-2 pt-4">
                            <Button className="h-9 px-4 font-bold text-xs flex-1">Take Action</Button>
                            <Button variant="outline" className="h-9 px-4 font-bold text-xs flex-1 border-border bg-background">Review History</Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 border-border border bg-background">
                               <ArrowRight className="h-4 w-4" />
                            </Button>
                         </div>
                      </CardContent>
                   </Card>
                ))}
             </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ icon, title, description, badgeText, badgeColor = "bg-primary/10 text-primary" }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  badgeText?: string,
  badgeColor?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-14 border border-dashed border-border/80 rounded-2xl bg-card/45 space-y-4 animate-in fade-in duration-300 shadow-sm py-16">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-primary shadow-inner">
        {icon}
      </div>
      <div className="space-y-2 max-w-sm">
        {badgeText && (
          <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 border-none px-2.5 py-0.5 ${badgeColor}`}>
            {badgeText}
          </Badge>
        )}
        <h4 className="text-base font-bold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed px-4">{description}</p>
      </div>
    </div>
  )
}
