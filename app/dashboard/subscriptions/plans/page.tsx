"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Plus, 
  Settings2, 
  MapPin, 
  Users, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  Trash2,
  Copy,
  Zap,
  Shield,
  Package,
  Battery,
  Leaf,
  Check
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialPlans = [
  { 
    id: "P-001", 
    name: "Flex Rider", 
    duration: "Credit-Based", 
    price: "₦5,000", 
    tier: "Basic", 
    access: "Standard Seats", 
    active: 450,
    features: ["10,000 Credits", "Seat booking per trip", "Pay-as-you-go"]
  },
  { 
    id: "P-002", 
    name: "Daily Mover", 
    duration: "Credit-Based", 
    price: "₦10,000", 
    tier: "Standard", 
    access: "Priority Booking", 
    active: 1200,
    features: ["22,000 Credits (+20% Bonus)", "Trip Insurance", "Peak-hour Access"]
  },
  { 
    id: "P-003", 
    name: "Always On Seat", 
    duration: "Credit-Based", 
    price: "₦15,000", 
    tier: "Priority", 
    access: "Guaranteed Seat", 
    active: 320,
    features: ["36,000 Credits (+40% Bonus)", "Auto-book Option", "Enhanced Insurance"]
  },
]

export default function PlanManagementPage() {
  const [plans, setPlans] = React.useState(initialPlans)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  
  // Quick Plan Form State (Sheet)
  const [newPlan, setNewPlan] = React.useState({
    name: "",
    duration: "Monthly",
    price: "",
    tier: "Regular",
    access: "Unlimited",
    insurance: {
      trip: false,
      stolenItems: false,
      batteryFailure: false,
      carbonOffset: true
    }
  })

  const handleCreatePlan = () => {
    const id = `P-00${plans.length + 1}`
    const planToAdd = {
      ...newPlan,
      id,
      price: `₦${parseFloat(newPlan.price || "0").toLocaleString()}`,
      active: 0,
      features: [
        newPlan.insurance.trip && "Trip Insurance",
        newPlan.insurance.stolenItems && "Stolen Item Protection",
        newPlan.insurance.batteryFailure && "Battery Range Guarantee",
        newPlan.insurance.carbonOffset && "Carbon Offset Certificate"
      ].filter(Boolean) as string[]
    }
    setPlans([planToAdd, ...plans])
    setIsCreateOpen(false)
    // Reset form
    setNewPlan({
      name: "",
      duration: "Monthly",
      price: "",
      tier: "Regular",
      access: "Unlimited",
      insurance: {
        trip: false,
        stolenItems: false,
        batteryFailure: false,
        carbonOffset: true
      }
    })
  }

  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Plan Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure Credit-based subscriptions and specialized add-ons.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Link href="/dashboard/subscriptions/plans/new">
            <Button size="sm" className="h-9 px-4 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Design Credit Plan
            </Button>
          </Link>
          
          <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-4 font-semibold border-border">
                <Plus className="mr-2 h-4 w-4" />
                Quick Plan
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[450px] flex flex-col p-0 border-l border-border bg-card">
              <SheetHeader className="p-6 border-b border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                   <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-primary" />
                   </div>
                   <SheetTitle className="text-xl font-bold">Quick Plan Builder</SheetTitle>
                </div>
                <SheetDescription className="text-xs text-muted-foreground">
                  Quickly add a standard plan. For complex credit logic, use the "Design Credit Plan" page.
                </SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-8 py-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                       <span className="h-1 w-1 rounded-full bg-primary" /> General Information
                    </h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Plan Name</Label>
                        <Input 
                          id="name" 
                          placeholder="e.g. Weekly Mover" 
                          className="h-10 bg-muted/30 border-border focus:ring-primary"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="duration" className="text-xs font-bold uppercase text-muted-foreground">Duration</Label>
                          <Select 
                            value={newPlan.duration} 
                            onValueChange={(v) => setNewPlan({...newPlan, duration: v})}
                          >
                            <SelectTrigger id="duration" className="h-10 bg-muted/30 border-border">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Daily">Daily</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-xs font-bold uppercase text-muted-foreground">Base Price (₦)</Label>
                          <Input 
                            id="price" 
                            type="number" 
                            placeholder="0" 
                            className="h-10 bg-muted/30 border-border"
                            value={newPlan.price}
                            onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Electric Fleet Insurance Options */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                       <span className="h-1 w-1 rounded-full bg-primary" /> Core Benefits
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between p-4 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="flex gap-3">
                           <div className="mt-0.5 h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <Shield className="h-4 w-4" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-sm font-bold leading-none">Trip Insurance</p>
                              <p className="text-[11px] text-muted-foreground leading-tight">Covers full refund for cancelled trips.</p>
                           </div>
                        </div>
                        <Switch 
                          checked={newPlan.insurance.trip}
                          onCheckedChange={(v) => setNewPlan({
                            ...newPlan, 
                            insurance: {...newPlan.insurance, trip: v}
                          })}
                        />
                      </div>

                      <div className="flex items-start justify-between p-4 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="flex gap-3">
                           <div className="mt-0.5 h-8 w-8 rounded bg-orange-500/10 flex items-center justify-center text-orange-500">
                              <Package className="h-4 w-4" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-sm font-bold leading-none">Stolen Item Protection</p>
                              <p className="text-[11px] text-muted-foreground leading-tight">Up to ₦50,000 coverage.</p>
                           </div>
                        </div>
                        <Switch 
                          checked={newPlan.insurance.stolenItems}
                          onCheckedChange={(v) => setNewPlan({
                            ...newPlan, 
                            insurance: {...newPlan.insurance, stolenItems: v}
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <SheetFooter className="p-6 border-t border-border bg-muted/20">
                <Button 
                  className="w-full h-11 text-sm font-bold uppercase tracking-widest"
                  onClick={handleCreatePlan}
                  disabled={!newPlan.name || !newPlan.price}
                >
                  Confirm & Create Plan
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Plan Summary Cards */}
        <Card className="border-border bg-card">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Active Plans</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">{plans.length}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">Across {new Set(plans.map(p => p.tier)).size} pricing tiers</p>
           </CardContent>
        </Card>
        <Card className="border-border bg-card">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Most Popular</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">Daily Mover</div>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">52% of total userbase</p>
           </CardContent>
        </Card>
        <Card className="border-border bg-card">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Credits Issued</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">4.2M</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">Across all active plans</p>
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="border-b border-border pb-4 bg-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">RideNow Credit Plans</CardTitle>
              <CardDescription className="text-xs">Manage your official credit-based subscription tiers.</CardDescription>
            </CardHeader>
            <div className="divide-y divide-border">
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 hover:bg-muted/30 transition-colors group">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Zap className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="font-bold text-sm leading-tight">{plan.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium uppercase tracking-tight">{plan.duration} • {plan.tier} Tier</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-base">{plan.price}</p>
                         <Badge variant="outline" className="text-[9px] font-bold h-4 border-none bg-muted uppercase tracking-wider">{plan.active} USERS</Badge>
                      </div>
                   </div>
                   
                   {plan.features && plan.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                         {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 text-[9px] font-bold text-primary uppercase border border-primary/10">
                               <Check className="h-2.5 w-2.5" />
                               {feature}
                            </div>
                         ))}
                      </div>
                   )}

                   <div className="flex items-center justify-between mt-4 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                         <Badge variant="secondary" className="font-bold text-[9px] uppercase gap-1 h-5">
                            <MapPin className="h-3 w-3" /> {plan.access}
                         </Badge>
                         <Badge variant="secondary" className="font-bold text-[9px] uppercase gap-1 h-5">
                            <Users className="h-3 w-3" /> {plan.tier} ONLY
                         </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Copy className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Settings2 className="h-4 w-4" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-rose-600 hover:bg-transparent"
                           onClick={() => setPlans(plans.filter(p => p.id !== plan.id))}
                         >
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="h-5 w-5 text-primary" />
                 <CardTitle className="text-sm font-bold uppercase tracking-wider">Credit Engine Settings</CardTitle>
              </div>
              <CardDescription className="text-xs">Define global credit logic and value rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                 <div className="flex flex-col gap-1 border-l-2 border-primary pl-4 py-1">
                    <p className="text-xs font-bold uppercase tracking-tight">Credit Conversion</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">1 Trip ≈ 400–500 credits. Deducted on booking.</p>
                 </div>
                 <div className="flex flex-col gap-1 border-l-2 border-muted-foreground/30 pl-4 py-1">
                    <p className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Pricing Policy</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">No surge, no hidden pricing. Pure credit-based model.</p>
                 </div>
              </div>

              <div className="p-5 bg-zinc-950 text-white rounded shadow-xl border border-zinc-800">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 text-primary">Revenue Intel</span>
                    <Badge className="bg-primary/20 text-primary text-[8px] font-black h-4 px-1.5 border-none">PLAN PERFORMANCE</Badge>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-zinc-400">Bonus Absorption</span>
                       <span className="text-[10px] font-bold text-emerald-500">24.5%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[24.5%]" />
                    </div>
                    <p className="text-[9px] text-zinc-500 leading-relaxed italic">
                      "Plans with bonuses higher than 20% show a 3x increase in user retention over 90 days."
                    </p>
                    <Link href="/dashboard/subscriptions/plans/new" className="block">
                      <Button 
                        className="w-full h-9 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 mt-2"
                      >
                         Design New Tier <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
