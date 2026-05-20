"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Bus,
  Mail,
  Shield,
  Activity,
  History,
  FileText,
  Plus,
  Ban,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  ArrowLeft,
  MoreVertical,
  Smartphone,
  MapPin,
  Star,
  Map,
  ShieldCheck,
  Zap,
  Download,
  AlertTriangle,
  Info,
  ShieldAlert,
  Calendar,
  Phone,
  CreditCard,
  ChevronRight
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock data fetcher for Driver
const getDriverData = (id: string) => {
  return {
    id,
    name: "Sarah Jenkins",
    email: "sarah.j@RydeNow.com",
    phone: "+234 812 345 6789",
    license: "FL-9921-2024",
    status: "On Duty",
    avatar: "/avatars/sarah.jpg",
    joinDate: "Jan 12, 2024",
    assignedFleet: "Electric Bus (EV-992-RP)",
    rating: 4.9,
    safetyScore: 98,
    metrics: {
      tripsTotal: 1240,
      hoursTotal: 185,
      onTimeRate: "99.2%",
      efficiency: "A+"
    }
  }
}

export default function DriverDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const driver = getDriverData(id)

  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/users/drivers">Drivers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Operator Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground font-semibold">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roster
          </Button>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border border-border shadow-sm">
                  <AvatarImage src={driver.avatar} alt={driver.name} />
                  <AvatarFallback className="bg-muted text-primary font-bold text-xl">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{driver.name}</h1>
                    <Badge variant="secondary" className="font-semibold bg-emerald-500/10 text-emerald-600 border-none">ELITE OPERATOR</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium"><Mail className="h-3.5 w-3.5" /> {driver.email}</span>
                    <span className="flex items-center gap-1.5 font-medium"><Phone className="h-3.5 w-3.5" /> {driver.phone}</span>
                    <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="h-3.5 w-3.5" /> {driver.license}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="font-semibold px-6 shadow-sm">Audit Performance</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="text-rose-600 font-semibold"><Ban className="mr-2 h-4 w-4" /> Suspend License</DropdownMenuItem>
                    <DropdownMenuItem className="font-medium"><History className="mr-2 h-4 w-4" /> Shift Logs</DropdownMenuItem>
                    <DropdownMenuItem className="font-medium"><Smartphone className="mr-2 h-4 w-4" /> Telemetry Access</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics & Fleet Assigned */}
        <div className="space-y-8">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border bg-muted/20">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fleet Assignment</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/10 bg-primary/5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Bus className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">Current Vehicle</p>
                  <p className="text-sm font-bold text-primary">{driver.assignedFleet}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">On-Duty Status</span>
                  <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold px-2">ON DUTY</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Shift Starts</span>
                  <span className="text-sm font-bold">06:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-zinc-950 text-white shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl" />
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Safety & Reliability</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-full border-2 border-primary flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{driver.metrics.efficiency}</span>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-bold">98.4/100</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Safety Score</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase">
                  <span>Customer Rating</span>
                  <span className="flex items-center gap-1 text-primary"><Star className="h-3 w-3 fill-primary" /> {driver.rating}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '92%' }} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-900/50 border-t border-zinc-800 p-4">
              <p className="text-[10px] text-zinc-400 font-medium">Last Incident: None detected in 180 days.</p>
            </CardFooter>
          </Card>
        </div>

        {/* Tabbed Performance Data */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="performance">
            <TabsList className="w-full justify-start h-11 bg-muted p-1 border border-border rounded-md mb-6">
              <TabsTrigger value="performance" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                <Activity className="h-3.5 w-3.5" /> Performance
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                <History className="h-3.5 w-3.5" /> Shift History
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> Compliance
              </TabsTrigger>
              <TabsTrigger value="payouts" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                <CreditCard className="h-3.5 w-3.5" /> Settlements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Total Trips</p>
                  <p className="text-3xl font-bold tracking-tight">{driver.metrics.tripsTotal.toLocaleString()}</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Total Hours</p>
                  <p className="text-3xl font-bold tracking-tight">{driver.metrics.hoursTotal}</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">On-Time Rate</p>
                  <p className="text-3xl font-bold tracking-tight text-emerald-600">{driver.metrics.onTimeRate}</p>
                </div>
              </div>

              <Card className="border-border shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-bold">Weekly Performance Insight</CardTitle>
                  <CardDescription className="text-xs">Driver frequency and route adherence trends.</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-end gap-3 pt-10 px-8 pb-10">
                  {[65, 82, 45, 90, 78, 62, 55].map((val, i) => (
                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t relative group">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary/60 rounded-t"
                        style={{ height: `${val}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}%
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/10 px-8 py-4">
                  <p className="text-[11px] text-muted-foreground font-medium">Note: Highest performance recorded during evening peak hours.</p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-[9px] font-bold uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-[9px] font-bold uppercase">Route corridor</th>
                        <th className="px-6 py-3 text-left text-[9px] font-bold uppercase">Duration</th>
                        <th className="px-6 py-3 text-right text-[9px] font-bold uppercase">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="px-6 py-4 font-semibold text-xs text-muted-foreground">May 0{i}, 2026</td>
                          <td className="px-6 py-4 font-bold text-xs">Kubwa Hub → UniAbuja</td>
                          <td className="px-6 py-4 font-medium text-xs">8h 12m</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 text-xs font-bold">
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> 5.0
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Credential Audit</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ComplianceItem label="Driving License" status="Verified" date="Exp: Jan 2027" />
                    <ComplianceItem label="Health Clearance" status="Verified" date="Exp: Dec 2024" />
                    <ComplianceItem label="Safety Training v4" status="Completed" date="May 2024" />
                    <ComplianceItem label="Background Check" status="Cleared" date="Jan 2024" />
                  </CardContent>
                </Card>
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Insurance Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-emerald-700">Comprehensive Cover</p>
                        <Badge className="bg-emerald-500 text-white border-none text-[8px] px-2 h-4">ACTIVE</Badge>
                      </div>
                      <p className="text-[10px] text-emerald-800/70 font-medium leading-relaxed">Policy: RP-FL-9921-X. Coverage includes operator liability and vehicle damage.</p>
                    </div>
                    <Button variant="outline" className="w-full h-10 font-semibold text-xs border-border">Update Documents</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ComplianceItem({ label, status, date }: { label: string, status: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
      <div className="space-y-0.5">
        <p className="text-xs font-bold">{label}</p>
        <p className="text-[10px] text-muted-foreground font-medium italic">{date}</p>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{status}</span>
      </div>
    </div>
  )
}
