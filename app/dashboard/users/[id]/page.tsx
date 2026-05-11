"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
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
  ShieldAlert
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"

const activityData = [
  { day: "Mon", trips: 2 },
  { day: "Tue", trips: 4 },
  { day: "Wed", trips: 3 },
  { day: "Thu", trips: 5 },
  { day: "Fri", trips: 2 },
  { day: "Sat", trips: 1 },
  { day: "Sun", trips: 0 },
]

// Mock data fetcher
const getUserData = (id: string) => {
  return {
    id,
    name: "Thomas Anderson",
    email: "neo@matrix.io",
    phone: "+1 (555) 012-3456",
    location: "Neo-Tokyo, Sector 4",
    status: "Active",
    plan: "Elite Unlimited Pass",
    avatar: "/avatars/neo.jpg",
    joinDate: "Jan 12, 2024",
    lastLogin: "2 hours ago",
    totalTrips: 142,
    totalSpend: 842.50,
    loyaltyScore: "A+",
    trustScore: 98,
    metrics: {
      tripsThisMonth: 24,
      avgTripTime: "28m",
      onTimeRate: "98%",
      carbonSaved: "124kg"
    }
  }
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const user = getUserData(id)

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
                <BreadcrumbLink href="/dashboard/users">Users</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border border-border shadow-sm">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-muted text-primary font-bold text-xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                    <Badge variant="secondary" className="font-bold">VIP ELITE</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                    <span className="flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" /> {user.phone}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {user.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="font-semibold px-4">Edit Profile</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="text-rose-600 font-medium"><Ban className="mr-2 h-4 w-4" /> Suspend Account</DropdownMenuItem>
                    <DropdownMenuItem><Shield className="mr-2 h-4 w-4" /> Security Settings</DropdownMenuItem>
                    <DropdownMenuItem><Star className="mr-2 h-4 w-4" /> Loyalty Overrides</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics & Loyalty */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Operational Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Trips</p>
                  <p className="text-2xl font-bold">{user.totalTrips}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="text-2xl font-bold">${user.totalSpend.toFixed(0)}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Activity className="h-4 w-4" /> On-Time Rate</span>
                  <span className="font-bold text-emerald-600">{user.metrics.onTimeRate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Map className="h-4 w-4" /> Avg. Duration</span>
                  <span className="font-bold">{user.metrics.avgTripTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Zap className="h-4 w-4" /> CO2 Offset</span>
                  <span className="font-bold text-amber-600">{user.metrics.carbonSaved}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-zinc-950 text-white">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500">Trust Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-full border-2 border-primary flex items-center justify-center font-bold text-2xl text-primary">{user.loyaltyScore}</div>
                <div className="text-right">
                  <p className="text-sm font-bold">Emerald Tier</p>
                  <p className="text-[10px] text-zinc-500 uppercase">Verified User</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                  <span>Reliability Index</span>
                  <span>{user.trustScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${user.trustScore}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="subscription">
            <TabsList className="w-full justify-start h-11 bg-muted p-1 border border-border rounded-md mb-6">
              <TabsTrigger value="subscription" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                <CreditCard className="h-3.5 w-3.5" /> Subscription
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                <Activity className="h-3.5 w-3.5" /> Activity
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> Security
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1 gap-2 text-xs font-semibold uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5" /> Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="space-y-6">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">{user.plan}</CardTitle>
                    <CardDescription className="text-xs">Renewal: Jun 12, 2026</CardDescription>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none">ACTIVE</Badge>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/20 border border-border rounded">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Rate</p>
                      <p className="text-xl font-bold">$149/mo</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Renewal</p>
                      <p className="text-xl font-bold">Auto</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Member Since</p>
                      <p className="text-xl font-bold">2024</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Active Privileges</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {["Priority Boarding", "Global Zone Access", "Pro Wi-Fi", "Incident Insurance"].map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button size="sm" variant="outline">Override</Button>
                    <Button size="sm" variant="outline">Billing</Button>
                    <Button size="sm" variant="ghost" className="text-rose-600 ml-auto">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
               <Card className="border-border overflow-hidden">
                  <CardHeader className="bg-muted/20 border-b border-border">
                     <CardTitle className="text-sm font-bold uppercase tracking-widest">Recent Trips</CardTitle>
                  </CardHeader>
                  <table className="w-full text-sm">
                     <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                        <tr>
                           <th className="px-6 py-2 text-left text-[9px] font-bold uppercase">Route</th>
                           <th className="px-6 py-2 text-left text-[9px] font-bold uppercase">Time</th>
                           <th className="px-6 py-2 text-right text-[9px] font-bold uppercase">Fare</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {[1, 2, 3, 4, 5].map((i) => (
                           <tr key={i} className="hover:bg-muted/30">
                              <td className="px-6 py-3 font-medium text-xs">Downtown → Airport</td>
                              <td className="px-6 py-3 text-[11px] text-muted-foreground">May {12-i}, 08:45 AM</td>
                              <td className="px-6 py-3 text-right font-bold text-xs">$12.50</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-border">
                     <CardHeader>
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Authorized Devices</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-border bg-muted/20 rounded">
                           <div className="flex items-center gap-3">
                              <Smartphone className="h-4 w-4 text-primary" />
                              <span className="text-xs font-bold">iPhone 15 Pro</span>
                           </div>
                           <Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-700 border-none">ACTIVE</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border bg-muted/20 rounded">
                           <div className="flex items-center gap-3">
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs font-bold">MacBook Pro</span>
                           </div>
                           <Badge variant="outline" className="text-[8px] bg-muted border-none">2 DAYS AGO</Badge>
                        </div>
                     </CardContent>
                  </Card>
                  <Card className="border-rose-200 bg-rose-50/30">
                     <CardHeader>
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-rose-800 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Compliance</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-[11px] text-rose-700 leading-relaxed font-medium">No security violations detected. Account is currently in full compliance with ride-sharing protocols.</p>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Admin Notes</h3>
                  <Button size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest"><Plus className="mr-2 h-3.5 w-3.5" /> Add Entry</Button>
               </div>
               <div className="space-y-4">
                  {[1, 2].map((i) => (
                     <div key={i} className="border border-border rounded overflow-hidden">
                        <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center justify-between">
                           <span className="text-[10px] font-bold">Officer {100+i}</span>
                           <span className="text-[10px] text-muted-foreground">May {24-i}, 2026</span>
                        </div>
                        <div className="p-4">
                           <p className="text-xs text-muted-foreground leading-relaxed">
                              {i === 1 ? "User reported a minor app issue during route RT-4 validation. Issue was resolved with a cache reset." : "Manual adjustment of loyalty points as a goodwill gesture for service delay."}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
