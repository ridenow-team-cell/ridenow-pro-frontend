import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

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
          <Header />
          <main className="flex-1 p-8 lg:p-12 xl:p-16 max-w-full mx-auto w-full">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
