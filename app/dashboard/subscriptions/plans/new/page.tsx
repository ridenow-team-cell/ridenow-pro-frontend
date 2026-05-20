"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  Zap,
  Shield,
  ZapOff,
  CreditCard,
  Users,
  Clock,
  Armchair,
  Bell,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
  Smartphone,
  Wallet,
  BadgePercent,
  Loader2,
  Trash2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getSubscriptionPlans,
  getSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  type SubscriptionPlan,
  type CreatePlanRequest
} from "@/lib/api/subscriptions"

const ADD_ONS = [
  { id: "boost", name: "Priority Boost", price: 1000, icon: Zap, desc: "Jump to front of booking queue anytime" },
  { id: "insure", name: "Insurance Plus", price: 500, icon: Shield, desc: "Higher medical coverage & lost item protection" },
  { id: "auto", name: "Auto-Book", price: 1500, icon: Clock, desc: "Automatically reserves your daily seat" },
  { id: "buddy", name: "Buddy Share", price: 1500, icon: Users, desc: "Share credits with 1 friend" },
  { id: "extra", name: "Extra Ride Pack", price: 1000, icon: CreditCard, desc: "Quick top-up: 2,500 extra credits" },
  { id: "late", name: "Late Hold", price: 500, icon: Clock, desc: "Holds your seat for extra minutes if late" },
  { id: "seat", name: "Seat Lock", price: 1000, icon: Armchair, desc: "Lock same seat position daily" },
  { id: "alerts", name: "Smart Alerts", price: 300, icon: Bell, desc: "Notifications before booking opens" },
]

const COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ec4899", "#06b6d4"]

export default function NewCreditPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")

  const [presets, setPresets] = React.useState<SubscriptionPlan[]>([])
  const [isLoadingPresets, setIsLoadingPresets] = React.useState(true)
  const [selectedPresetId, setSelectedPresetId] = React.useState<string | null>(null)
  const [isPublishing, setIsPublishing] = React.useState(false)

  const [form, setForm] = React.useState({
    id: "",
    name: "",
    description: "",
    price: "0",
    credits: "0",
    bonus: "0",
    customFeatures: [] as string[],
    includedFeatures: [] as string[],
    selectedAddOns: [] as string[],
    isActive: true,
    color: COLORS[1]
  })

  // Fetch presets
  React.useEffect(() => {
    async function loadPresets() {
      try {
        setIsLoadingPresets(true)
        const res = await getSubscriptionPlans()
        if (res.success && res.data) {
          setPresets(res.data)

          // If editing or if we have plans, select the first one as preset
          if (editId) {
            const planToEdit = res.data.find(p => p.id === editId)
            if (planToEdit) {
              populateFormFromPlan(planToEdit)
            } else {
              // Fetch specifically if not in active list
              const singleRes = await getSubscriptionPlan(editId)
              if (singleRes.success && singleRes.data) {
                populateFormFromPlan(singleRes.data)
              }
            }
          } else if (res.data.length > 0) {
            // populateFormFromPlan(res.data[0])
          }
        }
      } catch (err) {
        console.error("Failed to load presets:", err)
      } finally {
        setIsLoadingPresets(false)
      }
    }
    loadPresets()
  }, [editId])

  const populateFormFromPlan = (plan: SubscriptionPlan) => {
    setSelectedPresetId(plan.id)
    const firstOption = plan.pricingOptions[0] || { price: 0, baseCredit: 0, bonusPercentage: 0 }

    setForm({
      id: plan.id,
      name: plan.planName,
      description: plan.description,
      price: firstOption.price.toString(),
      credits: firstOption.baseCredit.toString(),
      bonus: firstOption.bonusPercentage.toString(),
      customFeatures: plan.customFeatures || [],
      includedFeatures: plan.includedFeatures || [],
      selectedAddOns: plan.availableAddOns || [],
      isActive: plan.isActive,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    })
  }

  const handlePresetSelect = async (plan: SubscriptionPlan) => {
    setSelectedPresetId(plan.id)
    populateFormFromPlan(plan)
  }

  const toggleAddOn = (id: string) => {
    setForm(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(id)
        ? prev.selectedAddOns.filter(a => a !== id)
        : [...prev.selectedAddOns, id]
    }))
  }

  const handleAddFeature = () => {
    setForm(prev => ({
      ...prev,
      customFeatures: [...prev.customFeatures, "New Feature"]
    }))
  }

  const handleRemoveFeature = (index: number) => {
    setForm(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((_, i) => i !== index)
    }))
  }

  const handlePublish = async () => {
    try {
      setIsPublishing(true)

      const payload: CreatePlanRequest = {
        planName: form.name,
        description: form.description,
        includedFeatures: form.includedFeatures,
        customFeatures: form.customFeatures,
        availableAddOns: form.selectedAddOns,
        pricingOptions: [
          {
            label: "Standard",
            durationDays: 30,
            baseCredit: parseInt(form.credits),
            bonusPercentage: parseInt(form.bonus),
            bonusCredit: Math.floor(parseInt(form.credits) * (parseInt(form.bonus) / 100)),
            price: parseFloat(form.price),
            currency: "NGN",
            isPopular: true
          }
        ],
        isActive: form.isActive
      }

      let res
      if (form.id) {
        res = await updateSubscriptionPlan(form.id, payload)
      } else {
        res = await createSubscriptionPlan(payload)
      }

      if (res.success) {
        // Success feedback
        router.push("/dashboard/subscriptions/plans")
      }
    } catch (err) {
      console.error("Failed to publish plan:", err)
    } finally {
      setIsPublishing(false)
    }
  }

  const totalCredits = parseInt(form.credits || "0")
  const bonusPercentage = parseInt(form.bonus || "0")
  const bonusCredits = Math.floor(totalCredits * (bonusPercentage / 100))
  const finalCredits = totalCredits + bonusCredits

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{form.id ? "Edit Credit Plan" : "Create Credit Plan"}</h1>
              <p className="text-xs text-muted-foreground font-medium">{form.id ? "Update existing plan properties" : "Design a custom RydeNow credit offering"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-8" disabled={isPublishing}>
              Save Draft
            </Button>
            <Button
              size="sm"
              className="font-bold uppercase tracking-wider text-[10px] h-8 bg-primary"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
              {form.id ? "Update Plan" : "Publish Plan"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-8 px-4">
        <div className="grid gap-8 lg:grid-cols-12">

          {/* Left Column: Editor */}
          <div className="lg:col-span-8 space-y-8">

            {/* Presets */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select a Base Preset</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {isLoadingPresets ? (
                  [1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)
                ) : (
                  presets.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handlePresetSelect(plan)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg ${selectedPresetId === plan.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/50"
                        }`}
                    >
                      {selectedPresetId === plan.id && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm animate-in zoom-in-50">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <Badge variant="outline" className="text-[9px] font-bold border-primary/30 text-primary">
                          ₦{plan.pricingOptions[0]?.price.toLocaleString() || "0"}
                        </Badge>
                      </div>
                      <p className="font-bold text-sm truncate">{plan.planName}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{plan.description}</p>
                    </button>
                  ))
                )}
                <button
                  onClick={() => {
                    setSelectedPresetId(null)
                    setForm({
                      id: "",
                      name: "New Plan",
                      description: "",
                      price: "0",
                      credits: "0",
                      bonus: "0",
                      customFeatures: [],
                      includedFeatures: [],
                      selectedAddOns: [],
                      isActive: true,
                      color: COLORS[0]
                    })
                  }}
                  className="p-4 rounded-2xl border-2 border-dashed border-border bg-transparent flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Plus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">Blank Slate</span>
                </button>
              </div>
            </section>

            {/* Core Configuration */}
            <section className="space-y-6 bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest">Plan Identity & Economics</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Plan Name</Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Weekly Pro"
                    className="h-11 bg-muted/20 border-border focus:ring-primary text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Price (₦)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground font-bold">₦</span>
                    <Input
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      type="number"
                      className="h-11 pl-8 bg-muted/20 border-border focus:ring-primary text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Base Credits</Label>
                  <Input
                    value={form.credits}
                    onChange={e => setForm({ ...form, credits: e.target.value })}
                    type="number"
                    className="h-11 bg-muted/20 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Bonus Credits (%)</Label>
                  <div className="relative">
                    <Input
                      value={form.bonus}
                      onChange={e => setForm({ ...form, bonus: e.target.value })}
                      type="number"
                      className="h-11 pr-8 bg-muted/20 border-border"
                    />
                    <span className="absolute right-3 top-3 text-muted-foreground font-bold">%</span>
                  </div>
                </div>
                <div className="flex flex-col justify-end p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">Total Value</p>
                  <p className="text-lg font-black text-primary leading-none">{finalCredits.toLocaleString()} <span className="text-[10px] font-bold opacity-70">CREDITS</span></p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Description</Label>
                <Input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short summary of the plan's value proposition"
                  className="h-11 bg-muted/20 border-border"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Active Status</p>
                  <p className="text-[10px] text-muted-foreground">If disabled, this plan won't be visible to users.</p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(val) => setForm({ ...form, isActive: val })}
                />
              </div>
            </section>

            {/* Features Editor */}
            <section className="space-y-4 bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Included Features</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] font-bold uppercase text-primary h-7"
                  onClick={handleAddFeature}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Custom
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {form.customFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 group">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <Input
                      value={feature}
                      onChange={e => {
                        const newFeatures = [...form.customFeatures]
                        newFeatures[i] = e.target.value
                        setForm({ ...form, customFeatures: newFeatures })
                      }}
                      className="h-8 bg-transparent border-none p-0 text-xs font-medium focus-visible:ring-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFeature(i)}
                    >
                      <Trash2 className="h-3 w-3 text-rose-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* Add-ons Configuration */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Available Add-ons</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {ADD_ONS.map((addon) => (
                  <div
                    key={addon.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${form.selectedAddOns.includes(addon.id)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${form.selectedAddOns.includes(addon.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                        <addon.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">{addon.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5">{addon.desc}</p>
                        <p className="text-[11px] font-black text-primary mt-1">₦{addon.price.toLocaleString()}/mo</p>
                      </div>
                    </div>
                    <Switch
                      checked={form.selectedAddOns.includes(addon.id)}
                      onCheckedChange={() => toggleAddOn(addon.id)}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Live App Preview</h2>
              </div>

              {/* Phone Frame */}
              <div className="relative w-[320px] h-[640px] bg-zinc-950 rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-20" />

                {/* App Content */}
                <div className="h-full w-full bg-background overflow-y-auto no-scrollbar pt-10 pb-6 px-5 space-y-6">

                  {/* App Header */}
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ChevronLeft className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest">Plan Details</p>
                    <div className="h-8 w-8" />
                  </div>

                  {/* Plan Card Preview */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-3xl p-6 overflow-hidden shadow-xl"
                    style={{ backgroundColor: form.color }}
                  >
                    {/* Abstract background shape */}
                    <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-black/10 rounded-full blur-2xl" />

                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex justify-between items-start text-white">
                        <div>
                          <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Credit Plan</p>
                          <h3 className="text-2xl font-black tracking-tight leading-none">{form.name || "Untitled Plan"}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <CreditCard className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-3xl font-black text-white">{finalCredits.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Total Credits Included</p>
                      </div>

                      <Separator className="bg-white/20" />

                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <p className="text-[9px] font-bold opacity-70 uppercase mb-0.5">Price</p>
                          <p className="text-lg font-black leading-none">₦{parseInt(form.price || "0").toLocaleString()}</p>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-white text-[10px] font-black tracking-widest uppercase" style={{ color: form.color }}>
                          {parseInt(form.bonus || "0") > 0 ? `+${form.bonus}% Bonus` : "Standard"}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Features in App */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">What's included</p>
                    {form.customFeatures.length > 0 ? (
                      form.customFeatures.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 py-1">
                          <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check className="h-2.5 w-2.5 text-primary" />
                          </div>
                          <p className="text-[11px] font-medium leading-tight">{feature}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic pl-1">No features defined yet.</p>
                    )}
                  </div>

                  {/* Add-ons in App */}
                  {form.selectedAddOns.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Active Add-ons</p>
                      {form.selectedAddOns.map((id) => {
                        const addon = ADD_ONS.find(a => a.id === id)
                        if (!addon) return null
                        return (
                          <div key={id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-3">
                              <addon.icon className="h-3.5 w-3.5 text-primary" />
                              <p className="text-[11px] font-bold">{addon.name}</p>
                            </div>
                            <p className="text-[10px] font-black text-primary">₦{addon.price}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Purchase Button */}
                  <div className="pt-4">
                    <Button
                      className="w-full h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                      style={{ backgroundColor: form.color }}
                    >
                      Choose this Plan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-3xl bg-card border border-border text-center">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Cost / Trip</p>
                  <p className="text-sm font-black">₦{finalCredits > 0 ? Math.round(parseInt(form.price || "0") / (finalCredits / 500)) : 0}</p>
                  <p className="text-[8px] text-muted-foreground mt-0.5 italic">Estimated</p>
                </div>
                <div className="p-4 rounded-3xl bg-card border border-border text-center">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Daily Capacity</p>
                  <p className="text-sm font-black">{Math.floor(finalCredits / 500)}</p>
                  <p className="text-[8px] text-muted-foreground mt-0.5 italic">Total Trips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
