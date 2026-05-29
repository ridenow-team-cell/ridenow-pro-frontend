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
import { getSubscriptionPlans, createSubscriptionPlan, getSubscriptionHistory, type SubscriptionPlan, type UserSubscription } from "@/lib/api/subscriptions"
import { getSubscriptionAnalytics, getSubscriptionOpsAnalytics, type SubscriptionAnalytics, type SubscriptionOpsAnalytics } from "@/lib/api/analytics"

export default function PlanManagementPage() {
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([])
  const [subscriptions, setSubscriptions] = React.useState<UserSubscription[]>([])
  const [analytics, setAnalytics] = React.useState<SubscriptionAnalytics | null>(null)
  const [opsAnalytics, setOpsAnalytics] = React.useState<SubscriptionOpsAnalytics | null>(null)
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
      const [plansRes, analyticsRes, historyRes, opsRes] = await Promise.all([
        getSubscriptionPlans(),
        getSubscriptionAnalytics(),
        getSubscriptionHistory(),
        getSubscriptionOpsAnalytics()
      ])

      if (plansRes.success && plansRes.data) {
        setPlans(plansRes.data)
      }
      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data)
      }
      if (historyRes.success && historyRes.data) {
        setSubscriptions(historyRes.data)
      }
      if (opsRes.success && opsRes.data) {
        setOpsAnalytics(opsRes.data)
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

  const computedStats = React.useMemo(() => {
    const activeSubscribersCount = subscriptions.filter(s => s.status?.toUpperCase() === 'ACTIVE' || s.isActive).length

    // Growth change can be calculated or keep a static placeholder or fallback to analytics value
    const growthChange = analytics?.activeSubscribers?.change || 12

    const planCounts: Record<string, number> = {}
    subscriptions.forEach(s => {
      const name = s.plan?.planName || "Unknown Plan"
      planCounts[name] = (planCounts[name] || 0) + 1
    })
    let popularName = analytics?.popularPlan?.name || "N/A"
    let popularCount = 0
    Object.entries(planCounts).forEach(([name, count]) => {
      if (count > popularCount) {
        popularCount = count
        popularName = name
      }
    })
    const popularPercentage = subscriptions.length > 0
      ? Math.round((popularCount / subscriptions.length) * 100)
      : (analytics?.popularPlan?.percentage || 0)

    let mrr = 0
    subscriptions.forEach(s => {
      const isActive = s.status?.toUpperCase() === 'ACTIVE' || s.isActive
      if (isActive && s.pricingOption) {
        const duration = s.pricingOption.durationDays || 30
        const price = s.pricingOption.price || 0
        mrr += price * (30 / duration)
      }
    })
    const finalMrr = mrr > 0 ? mrr : (analytics?.monthlyRecurringRevenue?.amount || 0)

    return {
      activeSubscribers: {
        value: opsAnalytics?.activeSubscribers?.value ?? activeSubscribersCount.toLocaleString(),
        description: opsAnalytics?.activeSubscribers?.description ?? `+${growthChange}% Growth`
      },
      mostPopular: {
        value: opsAnalytics?.mostPopular?.value ?? popularName,
        description: opsAnalytics?.mostPopular?.description ?? `${popularPercentage}% of total userbase`
      },
      mrrEstimate: {
        value: opsAnalytics?.mrrEstimate?.value ?? `₦${finalMrr.toLocaleString()}`,
        description: opsAnalytics?.mrrEstimate?.description ?? "Monthly recurring revenue"
      }
    }
  }, [subscriptions, analytics, opsAnalytics])

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
            Configure subscription plans and specialized add-ons.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Link href="/dashboard/subscriptions/plans/new">
            <Button size="sm" className="h-9 px-4 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Create New Subscription Plan
            </Button>
          </Link>

        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Plan Summary Cards */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{computedStats.activeSubscribers.value}</div>
            <p className="text-[10px] text-emerald-600 mt-1 font-bold">{computedStats.activeSubscribers.description}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{computedStats.mostPopular.value}</div>
            <p className="text-[10px] text-primary font-bold mt-1">{computedStats.mostPopular.description}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">MRR Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{computedStats.mrrEstimate.value}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{computedStats.mrrEstimate.description}</p>
          </CardContent>
        </Card>
        <Card className="hidden border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Credits Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{(analytics?.totalCreditsIssued || 0).toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Total credits in circulation</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border pb-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider">RydeNow Subscription Plans</CardTitle>
                <CardDescription className="text-xs">Manage your official subscription tiers.</CardDescription>
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
                            {firstOption?.durationDays} Days
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

                        <Link href={`/dashboard/subscriptions/plans/new?edit=${plan.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-primary/80 px-3">
                            Edit Subscription Plan
                          </Button>
                        </Link>

                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-20 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No plans found</p>
                <p className="text-xs">Create your first subscription plan to get started.</p>
              </div>
            )}
          </div>
        </Card>
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
          alt="RydeNow Logo"
          className="h-24 w-auto object-contain animate-breathing"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Loading Plans</span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
