import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Bell, Search } from "lucide-react"
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden">
        {/* Background Layer with low opacity */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: "url('/bg-rn.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="relative z-10 flex flex-col flex-1">

          <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/40 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground transition-colors" />
              <Separator orientation="vertical" className="h-4 bg-border/60" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-muted-foreground/40" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted transition-all">
                <Search className="h-4 w-4" />
              </Button>

              <Sheet modal={false}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted transition-all">
                    <Activity className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent hideOverlay className="!w-[620px] !max-w-[620px] p-0 border-l border-border/60 shadow-2xl flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between px-7 pt-8 pb-5 border-b border-border/50 shrink-0">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <SheetTitle className="text-lg font-bold tracking-tight">Operational Activity</SheetTitle>
                      </div>
                      <SheetDescription className="text-xs text-muted-foreground pl-[42px]">
                        Live feed of system events, dispatches & alerts
                      </SheetDescription>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Live</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 overflow-y-auto px-7 py-6">
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border/60" />

                      <div className="space-y-0">

                        {/* Event 1 */}
                        <div className="relative flex gap-5 pb-8">
                          <div className="relative z-10 shrink-0 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-sm font-bold leading-tight">Fleet RT-12 Dispatched</p>
                              <span className="shrink-0 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">2 min ago</span>
                            </div>
                            <div className="bg-muted/50 border border-border/50 rounded-xl p-3.5 space-y-2">
                              <p className="text-xs text-muted-foreground leading-relaxed">Driver <span className="font-semibold text-foreground">Sarah Jenkins</span> commenced Route Express-01 from <span className="font-semibold text-foreground">Central Hub → Westfield Terminal</span>.</p>
                              <div className="flex items-center gap-3 pt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700">Fleet Dispatch</span>
                                <span className="text-[10px] text-muted-foreground">Vehicle ID: BUS-044</span>
                                <span className="text-[10px] text-muted-foreground">ETA: 32 min</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Event 2 */}
                        <div className="relative flex gap-5 pb-8">
                          <div className="relative z-10 shrink-0 h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                            <AlertCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-sm font-bold leading-tight">High Traffic Detected</p>
                              <span className="shrink-0 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">12 min ago</span>
                            </div>
                            <div className="bg-muted/50 border border-border/50 rounded-xl p-3.5 space-y-2">
                              <p className="text-xs text-muted-foreground leading-relaxed">Route <span className="font-semibold text-foreground">Express-01</span> is experiencing significant congestion near <span className="font-semibold text-foreground">North Junction</span>. Estimated delay of 15 minutes.</p>
                              <div className="flex items-center gap-3 pt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700">Traffic Alert</span>
                                <span className="text-[10px] text-muted-foreground">Severity: Medium</span>
                                <span className="text-[10px] text-muted-foreground">Affected: 2 routes</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Event 3 */}
                        <div className="relative flex gap-5 pb-8">
                          <div className="relative z-10 shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-sm font-bold leading-tight">Shift Completed</p>
                              <span className="shrink-0 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">1 hr ago</span>
                            </div>
                            <div className="bg-muted/50 border border-border/50 rounded-xl p-3.5 space-y-2">
                              <p className="text-xs text-muted-foreground leading-relaxed">Driver <span className="font-semibold text-foreground">Marcus Miller</span> completed an 8-hour shift. Total distance covered: <span className="font-semibold text-foreground">142 km</span> across 6 routes.</p>
                              <div className="flex items-center gap-3 pt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">Shift Log</span>
                                <span className="text-[10px] text-muted-foreground">Rating: 4.9★</span>
                                <span className="text-[10px] text-muted-foreground">Incidents: 0</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Event 4 */}
                        <div className="relative flex gap-5 pb-8">
                          <div className="relative z-10 shrink-0 h-8 w-8 rounded-full bg-rose-500 flex items-center justify-center shadow-md shadow-rose-500/20">
                            <AlertCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-sm font-bold leading-tight">GPS Signal Lost</p>
                              <span className="shrink-0 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">2 hr ago</span>
                            </div>
                            <div className="bg-muted/50 border border-border/50 rounded-xl p-3.5 space-y-2">
                              <p className="text-xs text-muted-foreground leading-relaxed">Vehicle <span className="font-semibold text-foreground">BUS-031</span> lost GPS signal for 4 minutes near the <span className="font-semibold text-foreground">Downtown Tunnel</span>. Signal auto-restored.</p>
                              <div className="flex items-center gap-3 pt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700">System Alert</span>
                                <span className="text-[10px] text-muted-foreground">Duration: 4 min</span>
                                <span className="text-[10px] text-emerald-600 font-semibold">Resolved</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Event 5 */}
                        <div className="relative flex gap-5">
                          <div className="relative z-10 shrink-0 h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center shadow-md shadow-violet-500/20">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-sm font-bold leading-tight">New Subscriber</p>
                              <span className="shrink-0 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">3 hr ago</span>
                            </div>
                            <div className="bg-muted/50 border border-border/50 rounded-xl p-3.5 space-y-2">
                              <p className="text-xs text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">Emily Okafor</span> subscribed to the <span className="font-semibold text-foreground">Monthly Pass</span> plan. Payment processed successfully via Stripe.</p>
                              <div className="flex items-center gap-3 pt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-700">Revenue</span>
                                <span className="text-[10px] text-muted-foreground">Plan: Monthly</span>
                                <span className="text-[10px] text-muted-foreground">₦4,500/mo</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-7 py-4 border-t border-border/50 shrink-0">
                    <button className="w-full text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                      View all activity logs →
                    </button>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="relative">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted transition-all">
                  <Bell className="h-4 w-4" />
                </Button>
                <span className="absolute top-2 right-2.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </div>
              <Separator orientation="vertical" className="h-4 mx-1 bg-border/60" />
              <div className="hidden sm:flex flex-col items-end gap-0.5 mr-1">
                <span className="text-xs font-semibold leading-none">Alex Johnson</span>
                <span className="text-[10px] text-muted-foreground leading-none">System Admin</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 lg:p-12 xl:p-16 max-w-full mx-auto w-full">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
