"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
   ChevronLeft,
   Download,
   Printer,
   Share2,
   FileText,
   Building2,
   User,
   CheckCircle2,
   Clock,
   AlertCircle,
   CreditCard,
   History,
   ArrowRight,
   MoreHorizontal,
   ShieldCheck
} from "lucide-react"

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
   const router = useRouter()
   const invoiceId = params.id

   // Mock data based on the ID prefix/type
   const isCorporate = invoiceId.startsWith('C-') || invoiceId === 'INV-003' || invoiceId === 'INV-005'

   const invoice = {
      id: invoiceId,
      date: "May 1, 2026",
      dueDate: "May 15, 2026",
      status: invoiceId === 'INV-004' ? "Failed" : invoiceId === 'INV-005' ? "Overdue" : "Paid",
      entity: isCorporate ? "Cyberdyne Systems" : "Sarah Connor",
      email: isCorporate ? "billing@cyberdyne.io" : "s.connor@gmail.com",
      address: isCorporate ? "1024 Silicon Way, Gwarinpa, Abuja" : "Block 4, Flat 12, Kubwa Phase 2",
      items: [
         { desc: "Priority Commuter Plan (Monthly)", qty: isCorporate ? 45 : 1, price: 18500 },
         { desc: "Additional Credits Top-up", qty: isCorporate ? 10 : 0, price: 5000 },
         { desc: "Trip Insurance Premium", qty: isCorporate ? 45 : 1, price: 500 },
      ].filter(item => item.qty > 0),
      tax: 1387.50,
      total: isCorporate ? 882500 : 18500
   }

   return (
      <div className="space-y-6 pt-4 pb-20 max-w-5xl mx-auto">
         {/* Header / Actions */}
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4">
            <div className="flex items-center gap-3">
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-9 w-9 rounded-full border border-border"
               >
                  <ChevronLeft className="h-4 w-4" />
               </Button>
               <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                     <h1 className="text-xl font-bold tracking-tight">{invoice.id}</h1>
                     <Badge className={`text-[10px] font-bold border-none uppercase px-2 h-5 tracking-wide ${invoice.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' :
                        'bg-rose-500/10 text-rose-600'
                        }`}>
                        {invoice.status}
                     </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Generated on {invoice.date}</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="h-9 gap-2 font-bold text-xs uppercase border-border">
                  <Download className="h-3.5 w-3.5" /> PDF
               </Button>
               <Button variant="outline" size="sm" className="h-9 gap-2 font-bold text-xs uppercase border-border">
                  <Printer className="h-3.5 w-3.5" /> Print
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="icon" className="h-9 w-9 border-border rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                     <DropdownMenuLabel className="text-xs uppercase">Invoice Management</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="gap-2 text-xs font-medium"><Share2 className="h-4 w-4" /> Share with Entity</DropdownMenuItem>
                     <DropdownMenuItem className="gap-2 text-xs font-medium"><History className="h-4 w-4" /> Transaction Logs</DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="text-rose-600 font-bold gap-2 text-xs">Void Transaction</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         <div className="grid gap-6 md:grid-cols-3 px-4">
            {/* Left: Invoice Body */}
            <Card className="md:col-span-2 border-border shadow-sm rounded-xl bg-card overflow-hidden">
               <div className="p-8 space-y-12">
                  {/* Brand Header */}
                  <div className="flex justify-between items-start">
                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
                           <span className="text-lg font-bold tracking-tighter">RydeNow Pro</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                           RydeNow Logistics Limited<br />
                           Plot 14, Corporate Drive, Central Area<br />
                           Abuja, Nigeria.
                        </div>
                     </div>
                     <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount Due</p>
                        <p className="text-3xl font-bold tracking-tight">₦{invoice.total.toLocaleString()}</p>
                     </div>
                  </div>

                  {/* Billing Details */}
                  <div className="grid grid-cols-2 gap-12">
                     <div className="space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1">Billed To</p>
                        <div className="space-y-1">
                           <p className="text-sm font-bold">{invoice.entity}</p>
                           <p className="text-xs text-muted-foreground">{invoice.email}</p>
                           <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">{invoice.address}</p>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1">Invoice Details</p>
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground font-medium">Issue Date:</span>
                              <span className="font-bold">{invoice.date}</span>
                           </div>
                           <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground font-medium">Due Date:</span>
                              <span className="font-bold">{invoice.dueDate}</span>
                           </div>
                           <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground font-medium">Payment Method:</span>
                              <span className="font-bold">Visa Card (**** 4421)</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Itemized List */}
                  <div className="space-y-4">
                     <table className="w-full">
                        <thead>
                           <tr className="border-b border-border">
                              <th className="py-3 text-left text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Description</th>
                              <th className="py-3 text-center text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Qty</th>
                              <th className="py-3 text-right text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Price</th>
                              <th className="py-3 text-right text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Total</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                           {invoice.items.map((item, i) => (
                              <tr key={i}>
                                 <td className="py-4">
                                    <p className="text-sm font-bold tracking-tight">{item.desc}</p>
                                 </td>
                                 <td className="py-4 text-center text-xs font-semibold">{item.qty}</td>
                                 <td className="py-4 text-right text-xs font-semibold">₦{item.price.toLocaleString()}</td>
                                 <td className="py-4 text-right text-sm font-bold">₦{(item.qty * item.price).toLocaleString()}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Summary */}
                  <div className="flex justify-end">
                     <div className="w-full max-w-[240px] space-y-3 pt-6 border-t border-border">
                        <div className="flex justify-between text-xs">
                           <span className="text-muted-foreground font-medium">Subtotal</span>
                           <span className="font-bold">₦{(invoice.total - invoice.tax).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                           <span className="text-muted-foreground font-medium">Tax (7.5%)</span>
                           <span className="font-bold">₦{invoice.tax.toLocaleString()}</span>
                        </div>
                        <Separator className="bg-border/50" />
                        <div className="flex justify-between text-base">
                           <span className="font-bold">Total</span>
                           <span className="font-bold text-primary">₦{invoice.total.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="pt-12 text-center border-t border-border/50 border-dashed">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Thank you for commuting with RydeNow Pro</p>
                  </div>
               </div>
            </Card>

            {/* Right: Lifecycle & Details */}
            <div className="space-y-6">
               <Card className="border-border bg-slate-950 text-white rounded-xl shadow-lg">
                  <CardHeader className="pb-4 border-b border-white/10">
                     <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Lifecycle</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                     <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:h-[80%] before:w-[1px] before:bg-white/10">
                        <div className="relative pl-8 space-y-1">
                           <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-sm shadow-emerald-500/20" />
                           <p className="text-xs font-bold">Invoice Generated</p>
                           <p className="text-[10px] text-slate-400">May 1, 2026 at 09:42 AM</p>
                        </div>
                        <div className="relative pl-8 space-y-1">
                           <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-sm shadow-emerald-500/20" />
                           <p className="text-xs font-bold">Sent to Customer</p>
                           <p className="text-[10px] text-slate-400">May 1, 2026 at 09:45 AM</p>
                        </div>
                        <div className="relative pl-8 space-y-1">
                           <div className={`absolute left-0 top-1 h-4 w-4 rounded-full ${invoice.status === 'Paid' ? 'bg-emerald-500 border-4 border-slate-950' : 'bg-slate-700'} `} />
                           <p className="text-xs font-bold">Payment Received</p>
                           <p className="text-[10px] text-slate-400">{invoice.status === 'Paid' ? 'May 1, 2026 at 10:12 AM' : 'Pending Verification'}</p>
                        </div>
                     </div>

                     {invoice.status !== 'Paid' && (
                        <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider">
                           Send Payment Reminder
                        </Button>
                     )}
                  </CardContent>
               </Card>

               <div className="p-5 border border-border bg-card rounded-xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
                     <h3 className="text-xs font-bold uppercase tracking-wider">Transaction Security</h3>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                        <span>Payment Gateway</span>
                        <span className="font-bold text-foreground">Paystack (Secure)</span>
                     </div>
                     <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                        <span>Auth Code</span>
                        <span className="font-bold text-foreground">#AUTH-9921</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
