"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
  BadgePercent
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

const PRESET_PLANS = [
  {
    id: "basic",
    name: "Flex Rider",
    price: 5000,
    credits: 10000,
    bonus: 0,
    color: "#22c55e",
    tagline: "For light users who just need occasional rides",
    features: [
      "Pay-as-you-go rides",
      "Seat booking per trip",
      "Access to remaining seats",
      "Real-time availability view"
    ]
  },
  {
    id: "standard",
    name: "Daily Mover",
    price: 10000,
    credits: 22000,
    bonus: 20,
    color: "#3b82f6",
    tagline: "For consistent students & staff",
    features: [
      "Lower cost per ride",
      "Priority booking (before Basic users)",
      "Peak-hour access advantage",
      "Trip insurance on every ride",
      "Usage insights (see trips left)"
    ]
  },
  {
    id: "priority",
    name: "Always On Seat",
    price: 15000,
    credits: 36000,
    bonus: 40,
    color: "#a855f7",
    tagline: "For serious commuters who don’t want uncertainty",
    features: [
      "Best value per ride",
      "First access to booking (highest priority)",
      "Reserved seat slots on every trip",
      "Enhanced trip insurance",
      "Auto-book option (lock your daily seat)",
      "Zero stress commuting"
    ]
  }
]

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

export default function NewCreditPlanPage() {
  const router = useRouter()
  const [selectedPreset, setSelectedPreset] = React.useState(PRESET_PLANS[1])
  const [form, setForm] = React.useState({
    name: PRESET_PLANS[1].name,
    price: PRESET_PLANS[1].price.toString(),
    credits: PRESET_PLANS[1].credits.toString(),
    bonus: PRESET_PLANS[1].bonus.toString(),
    features: PRESET_PLANS[1].features,
    selectedAddOns: [] as string[]
  })

  const handlePresetSelect = (preset: typeof PRESET_PLANS[0]) => {
    setSelectedPreset(preset)
    setForm({
      name: preset.name,
      price: preset.price.toString(),
      credits: preset.credits.toString(),
      bonus: preset.bonus.toString(),
      features: preset.features,
      selectedAddOns: []
    })
  }

  const toggleAddOn = (id: string) => {
    setForm(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(id)
        ? prev.selectedAddOns.filter(a => a !== id)
        : [...prev.selectedAddOns, id]
    }))
  }

  const totalCredits = parseInt(form.credits || "0")
  const bonusPercentage = parseInt(form.bonus || "0")
  const finalCredits = totalCredits // Treat the provided number as the final total

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
              <h1 className="text-lg font-bold tracking-tight">Create Credit Plan</h1>
              <p className="text-xs text-muted-foreground font-medium">Design a custom RideNow credit offering</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider text-[10px] h-8">
              Save Draft
            </Button>
            <Button size="sm" className="font-bold uppercase tracking-wider text-[10px] h-8 bg-primary">
              Publish Plan
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
                {PRESET_PLANS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
                      selectedPreset.id === preset.id 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {selectedPreset.id === preset.id && (
                      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm animate-in zoom-in-50">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                       <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${preset.color}20`, color: preset.color }}>
                          <CreditCard className="h-4 w-4" />
                       </div>
                       <Badge variant="outline" className="text-[9px] font-bold" style={{ borderColor: preset.color, color: preset.color }}>
                          ₦{preset.price.toLocaleString()}
                       </Badge>
                    </div>
                    <p className="font-bold text-sm">{preset.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{preset.tagline}</p>
                  </button>
                ))}
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
                    onChange={e => setForm({...form, name: e.target.value})}
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
                      onChange={e => setForm({...form, price: e.target.value})}
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
                    onChange={e => setForm({...form, credits: e.target.value})}
                    type="number"
                    className="h-11 bg-muted/20 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Bonus Credits (%)</Label>
                  <div className="relative">
                    <Input 
                      value={form.bonus} 
                      onChange={e => setForm({...form, bonus: e.target.value})}
                      type="number"
                      className="h-11 pr-8 bg-muted/20 border-border"
                    />
                    <span className="absolute right-3 top-3 text-muted-foreground font-bold">%</span>
                  </div>
                </div>
                <div className="flex flex-col justify-end p-3 rounded-xl bg-primary/5 border border-primary/20">
                   <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">Total Value</p>
                   <p className="text-lg font-black text-primary leading-none">{(parseInt(form.credits || "0")).toLocaleString()} <span className="text-[10px] font-bold opacity-70">CREDITS</span></p>
                </div>
              </div>
            </section>

            {/* Features Editor */}
            <section className="space-y-4 bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Included Features</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-primary h-7">
                  <Plus className="h-3 w-3 mr-1" /> Add Custom
                </Button>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2">
                {form.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 group">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <Input 
                      value={feature} 
                      onChange={e => {
                        const newFeatures = [...form.features]
                        newFeatures[i] = e.target.value
                        setForm({...form, features: newFeatures})
                      }}
                      className="h-8 bg-transparent border-none p-0 text-xs font-medium focus-visible:ring-0"
                    />
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZapOff className="h-3 w-3 text-muted-foreground" />
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
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      form.selectedAddOns.includes(addon.id) 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        form.selectedAddOns.includes(addon.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
                    style={{ backgroundColor: selectedPreset.color }}
                  >
                    {/* Abstract background shape */}
                    <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-black/10 rounded-full blur-2xl" />
                    
                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex justify-between items-start text-white">
                        <div>
                          <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Credit Plan</p>
                          <h3 className="text-2xl font-black tracking-tight leading-none">{form.name}</h3>
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
                         <div className="px-3 py-1.5 rounded-full bg-white text-[10px] font-black tracking-widest uppercase" style={{ color: selectedPreset.color }}>
                            {parseInt(form.bonus || "0") > 0 ? `+${form.bonus}% Bonus` : "Standard"}
                         </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Features in App */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">What's included</p>
                    {form.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 py-1">
                        <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-primary" />
                        </div>
                        <p className="text-[11px] font-medium leading-tight">{feature}</p>
                      </div>
                    ))}
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
                      style={{ backgroundColor: selectedPreset.color }}
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
                    <p className="text-sm font-black">₦{Math.round(parseInt(form.price || "0") / (finalCredits / 500))}</p>
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
