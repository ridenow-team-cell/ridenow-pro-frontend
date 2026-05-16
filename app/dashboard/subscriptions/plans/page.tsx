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
  Check,
  Loader2,
  ArrowRight,
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
import { getSubscriptionPlans, createSubscriptionPlan, type SubscriptionPlan } from "@/lib/api/subscriptions"
import { getSubscriptionAnalytics, type SubscriptionAnalytics } from "@/lib/api/analytics"

export default function PlanManagementPage() {
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([])
  const [analytics, setAnalytics] = React.useState<SubscriptionAnalytics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  
  // Quick Plan Form State (Sheet)
  const [newPlan, setNewPlan] = React.useState({
    name: "",
    duration: "30",
    price: "",
    credits: "",
    bonus: "0",
    insurance: {
      trip: false,
      stolenItems: false,
    }
  })

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const [plansRes, analyticsRes] = await Promise.all([
        getSubscriptionPlans(),
        getSubscriptionAnalytics()
      ])
      
      if (plansRes.success && plansRes.data) {
        setPlans(plansRes.data)
      }
      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data)
      }
    } catch (err) {
      console.error("Failed to fetch plan data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleQuickCreate = async () => {
    try {
      setIsCreating(true)
      const customFeatures = []
      if (newPlan.insurance.trip) customFeatures.push("Trip Insurance")
      if (newPlan.insurance.stolenItems) customFeatures.push("Stolen Item Protection")

      const payload = {
        planName: newPlan.name,
        description: `Quickly created ${newPlan.name} plan.`,
        includedFeatures: [],
        customFeatures: customFeatures,
        availableAddOns: [],
        pricingOptions: [
          {
            label: "Standard",
            durationDays: parseInt(newPlan.duration),
            baseCredit: parseInt(newPlan.credits || "0"),
            bonusPercentage: parseInt(newPlan.bonus || "0"),
            bonusCredit: Math.floor(parseInt(newPlan.credits || "0") * (parseInt(newPlan.bonus || "0") / 100)),
            price: parseFloat(newPlan.price || "0"),
            currency: "NGN",
            isPopular: false
          }
        ],
        isActive: true
      }

      const res = await createSubscriptionPlan(payload)
      if (res.success) {
        setIsCreateOpen(false)
        fetchData()
        // Reset form
        setNewPlan({
          name: "",
          duration: "30",
          price: "",
          credits: "",
          bonus: "0",
          insurance: { trip: false, stolenItems: false }
        })
      }
    } catch (err) {
      console.error("Quick create failed:", err)
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return <PlanLoadingScreen />
  }

  return (
    <div className="space-y-6 pt-4 pb-10 px-6">
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
                        <div className="space-y-2">
                          <Label htmlFor="credits" className="text-xs font-bold uppercase text-muted-foreground">Credits</Label>
                          <Input 
                            id="credits" 
                            type="number" 
                            placeholder="0" 
                            className="h-10 bg-muted/30 border-border"
                            value={newPlan.credits}
                            onChange={(e) => setNewPlan({...newPlan, credits: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Benefits */}
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
                  onClick={handleQuickCreate}
                  disabled={!newPlan.name || !newPlan.price || isCreating}
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Confirm & Create Plan
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Plan Summary Cards */}
        <Card className="border-border bg-card shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Subscribers</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">{analytics?.activeSubscribers?.count?.toLocaleString() || 0}</div>
              <p className="text-[10px] text-emerald-600 mt-1 font-bold">+{analytics?.activeSubscribers?.change || 0}% Growth</p>
           </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Most Popular</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">{analytics?.popularPlan?.name || "N/A"}</div>
              <p className="text-[10px] text-primary font-bold mt-1">{analytics?.popularPlan?.percentage || 0}% of total userbase</p>
           </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">MRR Estimate</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">₦{(analytics?.monthlyRecurringRevenue?.amount || 0).toLocaleString()}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">Monthly recurring revenue</p>
           </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Credits Issued</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold tracking-tight">{(analytics?.totalCreditsIssued || 0).toLocaleString()}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">Total credits in circulation</p>
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border pb-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">RideNow Credit Plans</CardTitle>
                  <CardDescription className="text-xs">Manage your official credit-based subscription tiers.</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold">{plans.length} Total Plans</Badge>
              </div>
            </CardHeader>
            <div className="divide-y divide-border">
              {plans.length > 0 ? (
                plans.map((plan) => {
                  const firstOption = plan.pricingOptions[0]
                  return (
                    <div key={plan.id} className="p-4 hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm leading-tight">{plan.planName}</p>
                                <p className="text-[10px] text-muted-foreground mt-1.5 font-medium uppercase tracking-tight">
                                  {firstOption?.durationDays} Days • Credits: {firstOption?.baseCredit.toLocaleString()}
                                </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-base">₦{firstOption?.price.toLocaleString()}</p>
                            <Badge variant="outline" className={`text-[9px] font-bold h-4 border-none uppercase tracking-wider ${plan.isActive ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700'}`}>
                              {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </Badge>
                          </div>
                      </div>
                      
                      {plan.customFeatures && plan.customFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {plan.customFeatures.map((feature, i) => (
                                <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 text-[9px] font-bold text-primary uppercase border border-primary/10">
                                  <Check className="h-2.5 w-2.5" />
                                  {feature}
                                </div>
                            ))}
                          </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-border/50">
                          <div className="flex items-center gap-2">
                            {firstOption?.isPopular && (
                              <Badge variant="secondary" className="font-bold text-[9px] uppercase gap-1 h-5 bg-amber-500/10 text-amber-700 border-none">
                                <Sparkles className="h-3 w-3" /> Popular Choice
                              </Badge>
                            )}
                            <Badge variant="secondary" className="font-bold text-[9px] uppercase gap-1 h-5 border-none">
                              {firstOption?.bonusPercentage > 0 ? `+${firstOption.bonusPercentage}% Bonus` : 'Standard'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Link href={`/dashboard/subscriptions/plans/new?edit=${plan.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                  <Settings2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-rose-600 hover:bg-transparent"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-20 text-center text-muted-foreground">
                   <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                   <p className="text-sm font-bold uppercase tracking-widest">No plans found</p>
                   <p className="text-xs">Create your first credit plan to get started.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border bg-card shadow-sm overflow-hidden">
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
                       <span className="text-[10px] font-bold text-zinc-400">Churn Risk</span>
                       <span className="text-[10px] font-bold text-emerald-500">{analytics?.churnRate?.percentage || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[12.5%]" />
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

function PlanLoadingScreen() {
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
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Accessing Credit Ledger</span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
