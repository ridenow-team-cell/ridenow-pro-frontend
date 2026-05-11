"use client"

import * as React from "react"
import { 
  FileText, 
  Search, 
  Download, 
  MoreHorizontal, 
  ExternalLink,
  Filter,
  Building2,
  User as UserIcon,
  CheckCircle2,
  ArrowUpRight
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const allInvoices = [
  { id: "INV-001", entity: "Sarah Connor", amount: "₦18,500.00", date: "May 1, 2026", status: "Paid", type: "Individual" },
  { id: "INV-002", entity: "John Wick", amount: "₦5,200.00", date: "May 3, 2026", status: "Paid", type: "Individual" },
  { id: "INV-003", entity: "Cyberdyne Systems", amount: "₦250,400.00", date: "Apr 28, 2026", status: "Paid", type: "Corporate" },
  { id: "INV-004", entity: "Ellen Ripley", amount: "₦25,000.00", date: "May 4, 2026", status: "Failed", type: "Individual" },
  { id: "INV-005", entity: "Weyland-Yutani Corp", amount: "₦1,240,000.00", date: "Apr 30, 2026", status: "Overdue", type: "Corporate" },
  { id: "INV-006", entity: "Marty McFly", amount: "₦15,000.00", date: "May 5, 2026", status: "Processing", type: "Individual" },
]

export default function InvoiceSystemPage() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Billing & Invoices
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Unified financial records for all individual commuters and corporate partners.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 border-border font-semibold">
            <Download className="mr-2 h-4 w-4" /> Bulk Export
          </Button>
          <Button size="sm" className="h-9 px-4 font-bold bg-primary">
            Generate New Invoice
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
         <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
               placeholder="Search by ID or Entity..." 
               className="pl-9 h-10 border-border bg-muted/20 rounded-lg"
            />
         </div>
         <Button variant="outline" size="sm" className="h-10 border-border gap-2 font-bold text-xs uppercase tracking-wider px-4">
            <Filter className="h-4 w-4" /> Advanced Filter
         </Button>
      </div>

      <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest">Invoice ID</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest">Billed To</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest">Type</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest">Date</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest">Amount</th>
                <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest">Status</th>
                <th className="px-6 py-3 text-right font-bold uppercase text-[10px] tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {allInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-primary">{inv.id}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        {inv.type === 'Corporate' ? <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> : <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="font-bold tracking-tight">{inv.entity}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter h-5 px-2">
                        {inv.type}
                     </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-medium">{inv.date}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{inv.amount}</td>
                  <td className="px-6 py-4">
                    <Badge className={`text-[9px] font-bold border-none uppercase px-2 h-5 tracking-wide ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 
                      inv.status === 'Failed' || inv.status === 'Overdue' ? 'bg-rose-500/10 text-rose-600' : 
                      'bg-amber-500/10 text-amber-600'
                    }`}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/revenue/invoices/${inv.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 font-bold text-[10px] uppercase">
                          Details <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 border-border">
                          <DropdownMenuLabel className="text-xs">Invoice Ops</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-xs font-medium">
                            <Download className="h-4 w-4" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-xs font-medium text-rose-600 font-bold">
                            Void Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
