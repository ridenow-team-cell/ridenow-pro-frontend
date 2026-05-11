import { OperationsSidebar } from "@/components/operations-sidebar"
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
import { Bell, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <OperationsSidebar />
      <SidebarInset className="bg-background/50">
        <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="h-4 bg-border/60" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/operations" className="text-muted-foreground transition-colors hover:text-foreground">
                    Operations
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted-foreground/40" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-primary">Command Center</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 mr-4">
                 <Zap className="h-3 w-3 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Integrity: 100%</span>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted transition-all">
                <Search className="h-4 w-4" />
              </Button>
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
                 <span className="text-[10px] text-muted-foreground leading-none">Operations Director</span>
              </div>
          </div>
        </header>
        <main className="flex-1 p-8 lg:p-12 xl:p-16 max-w-full mx-auto w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
