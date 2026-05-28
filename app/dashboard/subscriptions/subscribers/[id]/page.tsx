"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
   ChevronLeft,
   CreditCard,
   Calendar,
   Clock,
   User as UserIcon,
   Zap,
   ShieldCheck,
   ArrowRight,
   RefreshCw,
   Ban,
   Mail,
   History,
   TrendingUp,
   PieChart,
   Activity,
   Phone,
   Hash,
   BadgeCheck
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getSubscriptionHistory, type UserSubscription } from "@/lib/api/subscriptions"

export default function SubscriberDetailsPage() {
   const { id } = useParams()
   const router = useRouter()
   const [data, setData] = React.useState<UserSubscription | null>(null)
   const [isLoading, setIsLoading] = React.useState(true)

   React.useEffect(() => {
      async function fetchDetail() {
         try {
            setIsLoading(true)
            const res = await getSubscriptionHistory()
            if (res.success && res.data) {
               const detail = res.data.find(sub => sub.id === id)
               if (detail) {
                  setData(detail)
               }
            }
         } catch (err) {
            console.error("Failed to fetch subscriber detail:", err)
         } finally {
            setIsLoading(false)
         }
      }
      fetchDetail()
   }, [id])

   if (isLoading) {
      return <DetailLoadingScreen />
   }

   if (!data) {
      return (
         <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground font-bold uppercase tracking-widest">Subscription Ledger Entry Not Found</p>
            <Button variant="outline" onClick={() => router.back()}>Return to Directory</Button>
         </div>
      )
   }

   const { user, plan, pricingOption, status, remainingCredits, totalCredits, usedCredits, startDate, endDate, autoRenew } = data
   const usagePercentage = (usedCredits / totalCredits) * 100
   const remainingPercentage = (remainingCredits / totalCredits) * 100

   return (
      <div className="min-h-screen pb-20 px-6 pt-4 space-y-8">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="rounded-full h-10 w-10 border border-border/40 hover:bg-muted"
               >
                  <ChevronLeft className="h-5 w-5" />
               </Button>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <h1 className="text-2xl font-black tracking-tight text-foreground">Subscriber Intelligence</h1>
                     <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-bold uppercase h-5 tracking-widest">Live Profile</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Internal identity: {id}</p>
               </div>
            </div>

         </div>

         <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Identity & Plan Card */}
            <div className="lg:col-span-4 space-y-8">
               {/* User Profile Card */}
               <Card className="border-border/60 bg-card/80 shadow-sm overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary/10" />
                  <CardContent className="pt-8 pb-6">
                     <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 border-2 border-primary/20 p-1 mb-4">
                           <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black uppercase">
                              {user?.first_name?.[0] || ""}{user?.last_name?.[0] || "U"}
                           </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1.5 justify-center mb-1">
                           <h2 className="text-xl font-bold tracking-tight">{user?.first_name} {user?.last_name}</h2>
                           <BadgeCheck className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mb-4">{user?.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                           <Badge variant="secondary" className="bg-muted text-[10px] font-bold gap-1.5 h-6">
                              <UserIcon className="h-3 w-3" /> {user?.role?.toUpperCase() || "USER"}
                           </Badge>
                           <Badge variant="secondary" className="bg-muted text-[10px] font-bold gap-1.5 h-6">
                              <Hash className="h-3 w-3" /> {user?.id?.substring(0, 10) || "N/A"}
                           </Badge>
                        </div>
                     </div>

                     <Separator className="my-6 opacity-50" />

                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Mobile Bridge</span>
                           <span className="text-xs font-bold font-mono">{user?.phone_number || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Member Since</span>
                           <span className="text-xs font-bold">{new Date(data.createdAt).toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Active Plan Card (Phone Preview Style) */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                     <Activity className="h-4 w-4 text-primary" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Instrument</h3>
                  </div>

                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="relative rounded-[2rem] p-8 overflow-hidden shadow-2xl bg-[#3b82f6]"
                  >
                     {/* Abstract background shape */}
                     <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                     <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-black/10 rounded-full blur-2xl" />

                     <div className="relative z-10 flex flex-col gap-8">
                        <div className="flex justify-between items-start text-white">
                           <div>
                              <p className="text-[10px] font-bold uppercase opacity-80 mb-1">RydeNow Digital Pass</p>
                              <h3 className="text-2xl font-black tracking-tight leading-none">{plan?.planName || "Unknown Plan"}</h3>
                           </div>
                           <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                              <Zap className="h-5 w-5" />
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/20">
                           <div className="text-white">
                              <p className="text-[9px] font-bold opacity-70 uppercase mb-0.5">Expires On</p>
                              <p className="text-xs font-black tracking-tighter">{new Date(endDate).toLocaleDateString([], { dateStyle: 'long' })}</p>
                           </div>
                           <Badge className="bg-white text-[#3b82f6] text-[9px] font-black tracking-widest uppercase h-6">
                              {status.toUpperCase()}
                           </Badge>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>

            {/* Right Column: Analytics & Controls */}
            <div className="lg:col-span-8 space-y-8">
               {/* Subscription Stats */}
               <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border/60 bg-card/40 backdrop-blur-sm shadow-sm">
                     <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <RefreshCw className="h-4 w-4" />
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Renewal</span>
                        </div>
                        <div className="text-2xl font-black">{autoRenew ? "Enabled" : "Disabled"}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">Automatic billing status</p>
                     </CardContent>
                  </Card>
                  <Card className="border-border/60 bg-card/40 backdrop-blur-sm shadow-sm">
                     <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                              <PieChart className="h-4 w-4" />
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Yield Status</span>
                        </div>
                        <div className="text-2xl font-black">High</div>
                        <p className="text-[10px] text-emerald-600 mt-1 font-bold">Consistently active profile</p>
                     </CardContent>
                  </Card>
               </div>

               {/* Details & Logs */}
               <Card className="border-border/60 shadow-sm bg-card/80 overflow-hidden">
                  <CardHeader className="border-b border-border/40 pb-4">
                     <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base font-bold">Ledger Specifications</CardTitle>
                     </div>
                     <CardDescription className="text-xs">Detailed parameters for the current subscription cycle.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="grid md:grid-cols-2 divide-x divide-y md:divide-y-0 divide-border/40">
                        <div className="p-6 space-y-6">
                           <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Contract Period</h4>
                              <div className="flex items-center gap-4">
                                 <div className="flex-1 space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Initiated</p>
                                    <p className="text-sm font-bold">{new Date(startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                 </div>
                                 <ArrowRight className="h-4 w-4 text-muted-foreground opacity-30" />
                                 <div className="flex-1 space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Termination</p>
                                    <p className="text-sm font-bold">{new Date(endDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                 </div>
                              </div>
                           </div>
                           <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Included Ecosystem Benefits</h4>
                              <div className="grid grid-cols-1 gap-2">
                                 {plan?.customFeatures?.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                                       <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                       <span className="text-xs font-bold">{feature}</span>
                                    </div>
                                 )) || <p className="text-xs text-muted-foreground">No custom features included.</p>}
                              </div>
                           </div>
                        </div>
                        <div className="p-6 space-y-6 bg-muted/5">
                           <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Financial Overview</h4>
                              <div className="space-y-3">
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Plan Base Price</span>
                                    <span className="text-sm font-bold font-mono">₦{pricingOption.price.toLocaleString()}</span>
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Currency System</span>
                                    <span className="text-sm font-bold uppercase font-mono">{pricingOption.currency}</span>
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Plan Duration</span>
                                    <span className="text-sm font-bold">{pricingOption.durationDays} Days</span>
                                 </div>

                              </div>
                           </div>


                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   )
}

function DetailLoadingScreen() {
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
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Decoding Subscriber Ledger</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               </div>
               <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">Accessing historical mobility usage...</p>
            </div>
         </div>
      </div>
   )
}
