"use client"

import * as React from "react"
import { 
  Users, 
  Bus, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  UserCheck,
  Star,
  TrendingUp,
  MapPin
} from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserPortalPage() {
  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Identity Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Centralized control for passengers and fleet operators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Management Portal */}
        <Card className="border-border bg-card hover:shadow-md transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
          <CardHeader className="pb-4">
             <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
             </div>
             <CardTitle className="text-2xl font-bold">Customer Management</CardTitle>
             <CardDescription className="text-sm font-medium">
                Manage passenger accounts, subscription tiers, and boarding behavior.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 text-center p-3 rounded-lg bg-muted/50">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Base</p>
                   <p className="text-sm font-bold">12.8K</p>
                </div>
                <div className="space-y-1 text-center p-3 rounded-lg bg-muted/50">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Active</p>
                   <p className="text-sm font-bold">9.2K</p>
                </div>
                <div className="space-y-1 text-center p-3 rounded-lg bg-muted/50">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Growth</p>
                   <p className="text-sm font-bold text-emerald-600">+12%</p>
                </div>
             </div>
             <Button asChild className="w-full h-11 font-semibold text-sm shadow-sm group-hover:translate-x-1 transition-transform">
                <Link href="/dashboard/users/customers">
                   Open Passenger Database <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
             </Button>
          </CardContent>
        </Card>

        {/* Driver Management Portal */}
        <Card className="border-border bg-card hover:shadow-md transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <CardHeader className="pb-4">
             <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <Bus className="h-6 w-6" />
             </div>
             <CardTitle className="text-2xl font-bold">Driver Management</CardTitle>
             <CardDescription className="text-sm font-medium">
                Monitor fleet operators, safety ratings, and shift performance.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 text-center p-3 rounded-lg bg-muted/50">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Roster</p>
                   <p className="text-sm font-bold">142</p>
                </div>
                <div className="space-y-1 text-center p-3 rounded-lg bg-muted/50">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">On-Duty</p>
                   <p className="text-sm font-bold text-emerald-600">86</p>
                </div>
                <div className="space-y-1 text-center p-3 rounded-lg bg-muted/50">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg Rating</p>
                   <p className="text-sm font-bold flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> 4.8
                   </p>
                </div>
             </div>
             <Button asChild variant="outline" className="w-full h-11 font-semibold text-sm border-border group-hover:translate-x-1 transition-transform">
                <Link href="/dashboard/users/drivers">
                   Open Operator Roster <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
             </Button>
          </CardContent>
        </Card>
      </div>

      {/* Global Intelligence Section */}
      <Card className="border-border bg-muted/20 border-dashed">
         <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Identity Security Protocol</span>
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Ensure all identities are verified through our multi-step KYC process. Use the unified command center to manage cross-identity interactions and system-wide security audits.
               </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
               <div className="p-4 rounded-xl bg-background border border-border shadow-sm flex items-center gap-3">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">Uptime</p>
                     <p className="text-sm font-bold">99.9%</p>
                  </div>
               </div>
               <div className="p-4 rounded-xl bg-background border border-border shadow-sm flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">KYC Rate</p>
                     <p className="text-sm font-bold">100%</p>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  )
}
