"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  User as UserIcon, 
  Clock, 
  ShieldAlert, 
  CheckCircle2,
  XCircle,
  Mail,
  History,
  FileEdit
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const subscribers = [
  { 
    id: "SUB-1024", 
    name: "Thomas Anderson", 
    email: "neo@matrix.io", 
    plan: "Unlimited Monthly", 
    status: "Active", 
    expiry: "Jun 12, 2026",
    avatar: "/avatars/neo.jpg" 
  },
  { 
    id: "SUB-1025", 
    name: "Trinity Moss", 
    email: "trinity@matrix.io", 
    plan: "Student Weekly", 
    status: "Active", 
    expiry: "May 15, 2026",
    avatar: "/avatars/trinity.jpg" 
  },
  { 
    id: "SUB-1026", 
    name: "Morpheus Lawrence", 
    email: "captain@nebuchadnezzar.net", 
    plan: "Corporate Pass", 
    status: "Pending Renewal", 
    expiry: "May 5, 2026",
    avatar: "/avatars/morpheus.jpg" 
  },
  { 
    id: "SUB-1027", 
    name: "Cypher Reagan", 
    email: "cypher@traitor.com", 
    plan: "Regular Monthly", 
    status: "Suspended", 
    expiry: "Expired",
    avatar: "/avatars/cypher.jpg" 
  },
  { 
    id: "SUB-1028", 
    name: "Agent Smith", 
    email: "smith@system.gov", 
    plan: "Corporate Unlimited", 
    status: "Expired", 
    expiry: "May 1, 2026",
    avatar: "/avatars/smith.jpg" 
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/5">Active</Badge>
    case "Pending Renewal":
      return <Badge variant="outline" className="border-amber-500/50 text-amber-500 bg-amber-500/5">Pending</Badge>
    case "Suspended":
      return <Badge variant="outline" className="border-rose-500/50 text-rose-500 bg-rose-500/5">Suspended</Badge>
    case "Expired":
      return <Badge variant="outline" className="border-zinc-500/50 text-zinc-500 bg-zinc-500/5">Expired</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function SubscriberListPage() {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Subscriber Management
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Monitor subscription status, renewal cycles, and user eligibility.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2 md:pt-0">
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium border-border/60 hover:bg-muted">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Flagged Users
          </Button>
          <Button size="sm" className="h-9 px-4 font-semibold shadow-lg shadow-primary/20">
            Export Subscriber Data
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
               placeholder="Search by name, email, or ID..." 
               className="pl-9 h-10 bg-card/50 border-border/50"
            />
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 border-border/50 gap-2 font-medium">
               <Filter className="h-4 w-4" /> Filter
            </Button>
         </div>
      </div>

      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Subscriber</th>
                <th className="px-6 py-4 text-left font-semibold">Subscription Plan</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Expiry Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-muted/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-full border border-border/40">
                        <AvatarImage src={sub.avatar} alt={sub.name} />
                        <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
                           {sub.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold tracking-tight text-sm leading-none">{sub.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5">{sub.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-medium text-sm text-foreground">{sub.plan}</p>
                     <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase">{sub.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(sub.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                       <Clock className="h-3 w-3" />
                       <span className="text-xs font-medium">{sub.expiry}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Subscriber Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                           <UserIcon className="h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                           <FileEdit className="h-4 w-4" /> Edit Subscription
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                           <History className="h-4 w-4" /> Access History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                           <Mail className="h-4 w-4" /> Send Notification
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {sub.status === "Active" ? (
                           <DropdownMenuItem className="text-rose-500 gap-2">
                              <XCircle className="h-4 w-4" /> Suspend Access
                           </DropdownMenuItem>
                        ) : (
                           <DropdownMenuItem className="text-emerald-500 gap-2">
                              <CheckCircle2 className="h-4 w-4" /> Restore Access
                           </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between">
           <p className="text-xs text-muted-foreground">Showing 5 of 12,450 subscribers</p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">Next</Button>
           </div>
        </div>
      </Card>
    </div>
  )
}
