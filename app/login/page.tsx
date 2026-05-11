import Image from "next/image"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 lg:justify-start">
          <a href="#" className="flex items-center gap-2 font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Image
                src="/logo.png"
                alt="RideNow Logo"
                width={32}
                height={32}
                className="brightness-0 invert"
              />
            </div>
            <span className="text-xl tracking-tight">RideNow Admin</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary to-primary-foreground/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40" />
        <div className="relative z-10 flex h-full flex-col p-10 text-white">
          <div className="mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg font-medium italic">
                &ldquo;RideNow has revolutionized our fleet management. The admin panel is intuitive, powerful, and a pleasure to use every day.&rdquo;
              </p>
              <footer className="text-sm font-semibold">— Alexander Wright, Operations Director</footer>
            </blockquote>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    </div>
  )
}
