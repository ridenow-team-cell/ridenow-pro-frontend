"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  ChevronLeft,
  Tag,
  Ticket,
  Users,
  Calendar,
  Zap,
  Target,
  BarChart3,
  ShieldCheck,
  Check,
  Info,
  Gift,
  MousePointerClick,
  Sparkles
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function NewCampaignPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)
  const [promoCode, setPromoCode] = React.useState("")

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPromoCode(result)
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      router.push("/dashboard/promotions")
    }, 1500)
  }

  return (
    <div className="space-y-6 pt-4 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Campaign Designer
            </h1>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase text-[10px] px-2 h-5">
              Draft
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-11">
            Build specialized growth loops and discount structures for the campus ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 px-4 font-semibold border-border" onClick={() => router.back()}>
            Discard
          </Button>
          <Button size="sm" className="h-9 px-6 font-semibold bg-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Syncing..." : "Launch Campaign"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-8 space-y-6">
           {/* Core Identity */}
           <Card className="border-border bg-card shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                 <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" /> Campaign Parameters
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">Campaign Name</Label>
                    <Input placeholder="e.g. 2024 Semester Kickoff" className="h-10 bg-muted/20 border-border font-medium" />
                 </div>
                 <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-muted-foreground uppercase">Reward Type</Label>
                       <Select defaultValue="credits">
                          <SelectTrigger className="h-10 bg-muted/20">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="credits">Credit Bonus (₦)</SelectItem>
                             <SelectItem value="percentage">Percentage Discount (%)</SelectItem>
                             <SelectItem value="free_rides">Free Ride Passes</SelectItem>
                             <SelectItem value="sub_extension">Subscription Extension</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-muted-foreground uppercase">Reward Value</Label>
                       <div className="relative">
                          <Input type="number" placeholder="500" className="h-10 bg-muted/20 border-border font-bold pr-12" />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-muted-foreground">CR</span>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3 pt-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">Promotion Code</Label>
                    <div className="flex gap-2">
                       <Input 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="e.g. WELCOME24" 
                        className="h-11 bg-muted/10 border-border font-bold text-lg tracking-widest text-primary uppercase" 
                       />
                       <Button variant="outline" className="h-11 px-4 gap-2 font-bold text-xs uppercase" onClick={generateCode}>
                          <Zap className="h-4 w-4 text-amber-500" /> Auto-Gen
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Targeting & Rules */}
           <Card className="border-border bg-card shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                 <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Audience Targeting
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-muted-foreground uppercase">Target Audience</Label>
                       <Select defaultValue="all">
                          <SelectTrigger className="h-10 bg-muted/20">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="all">All Active Users</SelectItem>
                             <SelectItem value="new">First-Time Users Only</SelectItem>
                             <SelectItem value="churned">Inactive (30+ Days)</SelectItem>
                             <SelectItem value="priority">Priority Plan Members</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-muted-foreground uppercase">School Restriction</Label>
                       <Select defaultValue="any">
                          <SelectTrigger className="h-10 bg-muted/20">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="any">All Campuses</SelectItem>
                             <SelectItem value="uniabuja">UNIABUJA Main</SelectItem>
                             <SelectItem value="baze">Baze University</SelectItem>
                             <SelectItem value="nile">Nile University</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>

                 <Separator className="bg-border/50" />

                 <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                       <Label className="text-xs font-bold text-muted-foreground uppercase">Usage Constraints</Label>
                       <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/5">
                             <div className="space-y-0.5">
                                <p className="text-[11px] font-bold uppercase">Total Redemptions</p>
                                <p className="text-[10px] text-muted-foreground">Overall cap for campaign</p>
                             </div>
                             <Input type="number" defaultValue="1000" className="h-8 w-20 bg-background border-border font-bold text-xs" />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/5">
                             <div className="space-y-0.5">
                                <p className="text-[11px] font-bold uppercase">Uses Per User</p>
                                <p className="text-[10px] text-muted-foreground">Limit per student</p>
                             </div>
                             <Input type="number" defaultValue="1" className="h-8 w-20 bg-background border-border font-bold text-xs" />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <Label className="text-xs font-bold text-muted-foreground uppercase">Validity Period</Label>
                       <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Start Date</p>
                                <div className="relative">
                                   <Calendar className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                                   <Input type="date" className="h-8 pl-7 text-[10px] font-bold" />
                                </div>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">End Date</p>
                                <div className="relative">
                                   <Calendar className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                                   <Input type="date" className="h-8 pl-7 text-[10px] font-bold" />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Preview & Intelligence */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-border bg-slate-950 text-white rounded-xl shadow-xl overflow-hidden">
              <CardHeader className="border-b border-white/10 pb-4">
                 <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">Campaign Projection</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Reach</p>
                       <p className="text-2xl font-bold tracking-tight">~14,500 Students</p>
                       <Progress value={65} className="h-1 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Est. Conversion</p>
                          <p className="text-base font-bold">12.4%</p>
                       </div>
                       <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Cost/Acq.</p>
                          <p className="text-base font-bold">₦420</p>
                       </div>
                    </div>
                 </div>
                 <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                    <div className="flex items-center gap-2">
                       <Info className="h-3.5 w-3.5 text-primary" />
                       <p className="text-[10px] font-bold uppercase tracking-wider text-primary">System Insight</p>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      Based on UNIABUJA historical data, credit-based rewards perform <span className="font-bold text-white">18% better</span> than percentage discounts.
                    </p>
                 </div>
                 <Button className="w-full h-11 text-xs font-bold uppercase bg-primary hover:bg-primary/90 rounded-lg shadow-sm">
                    Simulate Campaign
                 </Button>
              </CardContent>
           </Card>

           <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" />
                 <h3 className="text-xs font-bold uppercase tracking-wider">Fraud Protection</h3>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                       <MousePointerClick className="h-3.5 w-3.5 text-muted-foreground" />
                       <span className="text-[11px] font-medium">Device Fingerprinting</span>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                       <Users className="h-3.5 w-3.5 text-muted-foreground" />
                       <span className="text-[11px] font-medium">Verified Phone Required</span>
                    </div>
                    <Switch defaultChecked />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
