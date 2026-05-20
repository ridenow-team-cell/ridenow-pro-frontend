"use client"

import * as React from "react"
import {
  Plus,
  Search,
  Filter,
  Loader2,
  Sparkles,
  Cpu,
  Trash2,
  Settings2,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  CreditCard,
  AlertTriangle,
  Check,
  Tags,
  Calendar,
  X,
  HelpCircle,
  Eye,
  Info
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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

import {
  getSubscriptionAddons,
  createSubscriptionAddon,
  updateSubscriptionAddon,
  deleteSubscriptionAddon,
  type SubscriptionAddon
} from "@/lib/api/addons"

const ADDON_TYPES = [
  { value: "feature_benefit", label: "Feature Benefit" },
  { value: "ride_privilege", label: "Ride Privilege" },
  { value: "support_upgrade", label: "Support Upgrade" },
  { value: "insurance_cover", label: "Insurance Cover" },
  { value: "other", label: "Other Upgrade" }
]

export default function AddonsManagementPage() {
  const [addons, setAddons] = React.useState<SubscriptionAddon[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")

  // Form state
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({
    code: "",
    name: "",
    title: "",
    description: "",
    type: "feature_benefit",
    price: 500,
    currency: "NGN",
    validityDays: 30,
    isActive: true
  })
  
  // Metadata state (interactive tags list)
  const [metadataList, setMetadataList] = React.useState<string[]>([])
  const [currentTag, setCurrentTag] = React.useState("")

  const loadAddons = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getSubscriptionAddons()
      if (res.success && res.data) {
        setAddons(res.data)
      } else {
        toast.error("Could not fetch subscription add-ons.")
      }
    } catch (err) {
      console.error("Failed to load subscription addons:", err)
      toast.error("Failed to load subscription add-ons. Check connection.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadAddons()
  }, [loadAddons])

  // Reset form helper
  const resetForm = () => {
    setEditingId(null)
    setForm({
      code: "",
      name: "",
      title: "",
      description: "",
      type: "feature_benefit",
      price: 500,
      currency: "NGN",
      validityDays: 30,
      isActive: true
    })
    setMetadataList([])
    setCurrentTag("")
  }

  // Handle Dialog Open state changes
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  // Populate form for Editing
  const startEdit = (addon: SubscriptionAddon) => {
    setEditingId(addon.id)
    setForm({
      code: addon.code,
      name: addon.name,
      title: addon.title || addon.name,
      description: addon.description,
      type: addon.type || "feature_benefit",
      price: addon.price,
      currency: addon.currency || "NGN",
      validityDays: addon.validityDays || 30,
      isActive: addon.isActive
    })
    setMetadataList(addon.metadata || [])
    setCurrentTag("")
    setIsDialogOpen(true)
  }

  // Metadata tags management
  const addMetadataTag = () => {
    const trimmed = currentTag.trim()
    if (!trimmed) return
    if (metadataList.includes(trimmed)) {
      toast.warning("This benefit detail is already listed.")
      return
    }
    setMetadataList([...metadataList, trimmed])
    setCurrentTag("")
  }

  const removeMetadataTag = (index: number) => {
    setMetadataList(metadataList.filter((_, i) => i !== index))
  }

  // Quick Inline Status Toggle
  const toggleAddonStatus = async (addon: SubscriptionAddon) => {
    try {
      const updatedStatus = !addon.isActive
      
      // Update local state first (optimistic update)
      setAddons(prev =>
        prev.map(item => (item.id === addon.id ? { ...item, isActive: updatedStatus } : item))
      )
      
      const payload = {
        code: addon.code,
        name: addon.name,
        title: addon.title || addon.name,
        description: addon.description,
        type: addon.type,
        price: addon.price,
        currency: addon.currency || "NGN",
        validityDays: addon.validityDays || 30,
        metadata: addon.metadata || [],
        isActive: updatedStatus
      }

      const res = await updateSubscriptionAddon(addon.id, payload)
      if (res.success) {
        toast.success(`"${addon.name}" is now ${updatedStatus ? "Active" : "Paused"}.`)
      } else {
        // Rollback state on failure
        setAddons(prev =>
          prev.map(item => (item.id === addon.id ? { ...item, isActive: !updatedStatus } : item))
        )
        toast.error(res.message || "Failed to update status on server.")
      }
    } catch (err) {
      console.error("Status toggle error:", err)
      // Rollback
      setAddons(prev =>
        prev.map(item => (item.id === addon.id ? { ...item, isActive: !addon.isActive } : item))
      )
      toast.error("An error occurred. Rolled back status change.")
    }
  }

  // Delete Action
  const handleDelete = async (id: string, name: string) => {
    try {
      setIsDeleting(id)
      const res = await deleteSubscriptionAddon(id)
      if (res.success) {
        toast.success(`Add-on "${name}" deleted successfully.`)
        // Filter out locally
        setAddons(prev => prev.filter(item => item.id !== id))
      } else {
        toast.error(res.message || "Failed to delete add-on.")
      }
    } catch (err) {
      console.error("Delete addon error:", err)
      toast.error("Failed to delete add-on.")
    } finally {
      setIsDeleting(null)
    }
  }

  // Create / Update Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validations
    if (!form.code.trim()) {
      toast.error("Add-on Code is required.")
      return
    }
    if (!form.name.trim()) {
      toast.error("Add-on Name is required.")
      return
    }
    if (form.price < 0) {
      toast.error("Price must be 0 or higher.")
      return
    }
    if (form.validityDays <= 0) {
      toast.error("Validity Days must be at least 1 day.")
      return
    }

    try {
      setIsSaving(true)
      const payload = {
        code: form.code.trim().toUpperCase().replace(/\s+/g, "_"),
        name: form.name.trim(),
        title: (form.title.trim() || form.name.trim()),
        description: form.description.trim(),
        type: form.type,
        price: Number(form.price),
        currency: form.currency,
        validityDays: Number(form.validityDays),
        metadata: metadataList,
        isActive: form.isActive
      }

      if (editingId) {
        // Edit Action
        const res = await updateSubscriptionAddon(editingId, payload)
        if (res.success) {
          toast.success(`Add-on "${payload.name}" updated successfully.`)
          setIsDialogOpen(false)
          resetForm()
          loadAddons()
        } else {
          toast.error(res.message || "Failed to update add-on.")
        }
      } else {
        // Create Action
        const res = await createSubscriptionAddon(payload)
        if (res.success) {
          toast.success(`New add-on "${payload.name}" created successfully.`)
          setIsDialogOpen(false)
          resetForm()
          loadAddons()
        } else {
          toast.error("Failed to create new add-on.")
        }
      }
    } catch (err) {
      console.error("Form submit error:", err)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSaving(false)
    }
  }

  // Filtered addons list
  const filteredAddons = addons.filter(addon => {
    const code = (addon.code || "").toLowerCase()
    const name = (addon.name || "").toLowerCase()
    const desc = (addon.description || "").toLowerCase()
    const search = searchTerm.toLowerCase()

    const matchesSearch = code.includes(search) || name.includes(search) || desc.includes(search)
    
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? addon.isActive
        : !addon.isActive

    const matchesType = typeFilter === "all" ? true : addon.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Summary Metrics calculations
  const totalCount = addons.length
  const activeCount = addons.filter(a => a.isActive).length
  const averageCost = totalCount > 0 ? Math.round(addons.reduce((sum, a) => sum + (a.price || 0), 0) / totalCount) : 0
  const uniqueTypes = new Set(addons.map(a => a.type || "other")).size

  // Addon Icon mapping helper
  const getAddonIcon = (type: string) => {
    switch (type) {
      case "insurance_cover":
        return <Shield className="h-5 w-5 text-emerald-500" />
      case "ride_privilege":
        return <Zap className="h-5 w-5 text-amber-500" />
      case "support_upgrade":
        return <Cpu className="h-5 w-5 text-blue-500" />
      default:
        return <Tags className="h-5 w-5 text-purple-500" />
    }
  }

  if (isLoading) {
    return <AddonsLoadingScreen />
  }

  return (
    <div className="space-y-6 pt-4 pb-12 px-6">
      
      {/* Premium Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
            Add-on Management
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Formulate premium modules, trip insurance, and passenger ride boosters.
          </p>
        </div>
        
        <div className="flex items-center gap-3 pt-2 md:pt-0">
          <Button 
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="h-10 px-5 font-bold text-xs bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] flex items-center gap-1.5 rounded-xl border border-primary/10"
          >
            <Plus className="h-4 w-4" />
            Create Add-on
          </Button>
        </div>
      </div>

      {/* Analytics/Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Tags className="h-16 w-16 text-foreground" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{totalCount}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-semibold flex items-center gap-1">
              <Info className="h-3 w-3" /> Configured modules
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Check className="h-16 w-16 text-foreground" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Add-ons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-emerald-600">{activeCount}</div>
            <p className="text-[10px] text-emerald-600 mt-1 font-bold">
              {totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}% Operational rate
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <CreditCard className="h-16 w-16 text-foreground" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">₦{averageCost.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Standard 30-day base yield</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Sparkles className="h-16 w-16 text-foreground" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-blue-500">{uniqueTypes}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Unique benefit classes</p>
          </CardContent>
        </Card>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search by code, title, or details..."
            className="pl-10 h-11 bg-card/60 border-border/60 text-sm focus-visible:ring-primary rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Filter:</span>
          </div>

          <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
            <SelectTrigger className="h-10 w-[140px] bg-card/60 border-border/60 text-xs font-semibold rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-xs font-semibold">All Statuses</SelectItem>
              <SelectItem value="active" className="text-xs font-semibold">Active Only</SelectItem>
              <SelectItem value="inactive" className="text-xs font-semibold">Paused Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)}>
            <SelectTrigger className="h-10 w-[160px] bg-card/60 border-border/60 text-xs font-semibold rounded-xl">
              <SelectValue placeholder="Add-on Type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-xs font-semibold">All Categories</SelectItem>
              {ADDON_TYPES.map(t => (
                <SelectItem key={t.value} value={t.value} className="text-xs font-semibold">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* Grid of Addon Cards */}
      <AnimatePresence mode="popLayout">
        {filteredAddons.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAddons.map((addon) => {
              const borderLeftColor = addon.isActive ? "border-l-primary" : "border-l-rose-500"
              const statusBg = addon.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"
              
              return (
                <motion.div
                  key={addon.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`border border-border/60 bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden border-l-4 ${borderLeftColor} shadow-md group flex flex-col justify-between h-full hover:shadow-xl hover:border-primary/20 hover:scale-[1.01] transition-all`}>
                    
                    <CardHeader className="pb-3 border-b border-border/30 bg-muted/5 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-sm">
                            {getAddonIcon(addon.type)}
                          </div>
                          <div>
                            <CardTitle className="text-sm font-bold tracking-tight text-foreground leading-tight">
                              {addon.name}
                            </CardTitle>
                            <span className="text-[9px] font-mono text-muted-foreground tracking-tighter uppercase font-bold">
                              Code: {addon.code}
                            </span>
                          </div>
                        </div>

                        <Badge 
                          variant="outline" 
                          onClick={() => toggleAddonStatus(addon)}
                          className={`text-[9px] font-black tracking-widest cursor-pointer px-2 border-none h-5 select-none ${statusBg}`}
                        >
                          {addon.isActive ? "ACTIVE" : "PAUSED"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 flex-1 space-y-4">
                      
                      <div className="space-y-1">
                        <p className="text-[11px] text-muted-foreground leading-relaxed min-h-[38px] font-medium">
                          {addon.description || "No description configured."}
                        </p>
                        <div className="flex items-center gap-3 pt-2 text-[10px] text-muted-foreground font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground/70" />
                            {addon.validityDays || 30} Days Validity
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-border" />
                          <span className="flex items-center gap-1 uppercase tracking-tight">
                            <Cpu className="h-3 w-3 text-muted-foreground/70" />
                            {ADDON_TYPES.find(t => t.value === addon.type)?.label || "Other Upgrade"}
                          </span>
                        </div>
                      </div>

                      {/* Benefits tags list */}
                      {addon.metadata && addon.metadata.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Core Benefits</div>
                          <div className="flex flex-wrap gap-1.5">
                            {addon.metadata.map((meta, i) => (
                              <div 
                                key={i} 
                                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary uppercase"
                              >
                                <Check className="h-2.5 w-2.5 text-primary" />
                                {meta}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </CardContent>

                    <CardContent className="p-5 pt-0 border-t border-border/30 bg-muted/5 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Price Tier</span>
                        <div className="text-xl font-black text-foreground mt-0.5">
                          ₦{addon.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => startEdit(addon)}
                          className="h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg"
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={isDeleting === addon.id}
                          onClick={() => {
                            if (confirm(`Are you absolutely sure you want to delete the "${addon.name}" add-on? This action is irreversible.`)) {
                              handleDelete(addon.id, addon.name)
                            }
                          }}
                          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg"
                        >
                          {isDeleting === addon.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>

                      </div>
                    </CardContent>

                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-20 bg-card/30 border border-border/60 rounded-3xl text-center shadow-sm"
          >
            <Tags className="h-14 w-14 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-base font-bold text-foreground uppercase tracking-widest">No Add-ons Configured</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm font-medium">
              Create modular bundles, seat configuration settings, or emergency coverage packages.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
              size="sm" 
              className="mt-6 font-bold bg-primary hover:bg-primary/90 text-xs px-4"
            >
              Configure First Add-on
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Shadcn Dialog Modal for Adding & Editing Add-ons */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[550px] p-0 border border-border bg-card overflow-hidden rounded-2xl shadow-2xl">
          
          <DialogHeader className="p-6 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight text-left">
                  {editingId ? "Modify Module Design" : "Design Specialized Add-on"}
                </DialogTitle>
                <DialogDescription className="text-xs font-semibold text-muted-foreground mt-0.5 text-left">
                  {editingId ? "Amend details and target variables of this subscription block." : "Configure code, category metadata, and price points."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col justify-between overflow-hidden">
            <ScrollArea className="max-h-[60vh] px-6">
              <div className="space-y-6 py-6">
                
                {/* Section 1: Identity */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Module Identity
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Unique Code</Label>
                      <Input
                        id="code"
                        placeholder="e.g. PRIORITY_BOOST"
                        className="h-10 bg-muted/20 border-border uppercase font-mono text-xs focus-visible:ring-primary"
                        value={form.code}
                        disabled={!!editingId}
                        onChange={(e) => setForm({ ...form, code: e.target.value.replace(/[^A-Za-z0-9_]/g, "").toUpperCase() })}
                      />
                      <p className="text-[8px] text-muted-foreground font-medium">Alphanumeric & underscores only.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Category Class</Label>
                      <Select 
                        value={form.type} 
                        onValueChange={(val) => setForm({ ...form, type: val })}
                      >
                        <SelectTrigger className="h-10 bg-muted/20 border-border text-xs font-bold focus:ring-primary rounded-lg">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {ADDON_TYPES.map(t => (
                            <SelectItem key={t.value} value={t.value} className="text-xs font-semibold">
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Module Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Priority Boost"
                        className="h-10 bg-muted/20 border-border text-xs font-bold focus-visible:ring-primary"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Display Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Priority Boost Pro"
                        className="h-10 bg-muted/20 border-border text-xs font-semibold focus-visible:ring-primary"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Description Details</Label>
                    <textarea
                      id="description"
                      placeholder="Explain features, usage thresholds, and values clearly to drivers and riders..."
                      className="w-full min-h-[80px] p-3 rounded-lg bg-muted/20 border border-border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 2: Values & Validity */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Cost & Validity Configuration
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Cost Value (₦)</Label>
                      <div className="relative">
                        <Input
                          id="price"
                          type="number"
                          placeholder="500"
                          className="h-10 bg-muted/20 border-border pl-8 text-xs font-bold focus-visible:ring-primary"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: Math.max(0, Number(e.target.value) || 0) })}
                        />
                        <span className="absolute left-3 top-3 text-[10px] font-bold text-slate-500">₦</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="validity" className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Validity Duration</Label>
                      <div className="relative">
                        <Input
                          id="validity"
                          type="number"
                          placeholder="30"
                          className="h-10 bg-muted/20 border-border pr-12 text-xs font-bold focus-visible:ring-primary"
                          value={form.validityDays}
                          onChange={(e) => setForm({ ...form, validityDays: Math.max(1, Number(e.target.value) || 1) })}
                        />
                        <span className="absolute right-3 top-3 text-[9px] font-bold text-slate-500 uppercase">DAYS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Benefits Tag List Manager */}
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Core Benefits Checklist
                    </h3>
                    <Badge variant="secondary" className="text-[8px] font-black">{metadataList.length} Listed</Badge>
                  </div>

                  <div className="space-y-3">
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. Higher medical coverage"
                        className="h-9 text-xs bg-muted/10 border-border focus-visible:ring-primary"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addMetadataTag()
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={addMetadataTag} 
                        className="h-9 px-4 font-bold text-xs bg-muted hover:bg-muted/80 text-foreground border border-border"
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-3 rounded-lg border border-border/60 bg-muted/10 min-h-[60px]">
                      {metadataList.length > 0 ? (
                        metadataList.map((tag, i) => (
                          <div 
                            key={i} 
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-[9px] font-bold text-foreground uppercase tracking-tight shadow-sm"
                          >
                            <span>{tag}</span>
                            <button 
                              type="button" 
                              onClick={() => removeMetadataTag(i)} 
                              className="text-muted-foreground hover:text-rose-500 focus:outline-none"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center w-full text-[9px] text-muted-foreground/60 font-semibold italic">
                          No benefit keywords listed yet. Type detail and click Add.
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Section 4: Operational Settings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Operational Settings
                  </h3>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground leading-none">Activate / Run Module</p>
                      <p className="text-[9px] text-muted-foreground font-medium mt-1">If paused, riders cannot view or purchase this add-on.</p>
                    </div>
                    <Switch
                      checked={form.isActive}
                      onCheckedChange={(val) => setForm({ ...form, isActive: val })}
                    />
                  </div>
                </div>

              </div>
            </ScrollArea>

            <DialogFooter className="p-6 border-t border-border bg-muted/20">
              <div className="flex gap-3 w-full justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="h-11 text-xs font-bold uppercase tracking-widest border-border px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="h-11 text-xs font-bold uppercase tracking-widest bg-primary px-8"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {editingId ? "Save Changes" : "Confirm Design"}
                </Button>
              </div>
            </DialogFooter>
          </form>

        </DialogContent>
      </Dialog>

    </div>
  )
}

function AddonsLoadingScreen() {
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
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Accessing Modular Ledger</span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">Syncing active features & emergency coverage options...</p>
        </div>
      </div>
    </div>
  )
}
