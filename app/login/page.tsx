"use client"

import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { motion } from "framer-motion"

const stats = [
  { label: "Active Drivers", value: "2,840" },
  { label: "Trips Today", value: "14,392" },
  { label: "Uptime", value: "99.9%" },
]

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#03081a]">
      {/* ── Animated mesh background ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* large glowing orbs */}
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#0066cc]/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[#0044aa]/25 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0055bb]/10 blur-[80px]" />
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Left panel – branding ── */}
      <div className="relative z-10 hidden flex-col justify-between p-12 lg:flex lg:w-[55%]">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066cc] shadow-lg shadow-[#0066cc]/40">
            <Image
              src="/logo.png"
              alt="RideNow"
              width={26}
              height={26}
              className="brightness-0 invert"
              style={{ height: "auto" }}
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            RideNow <span className="font-light text-white/50">Admin</span>
          </span>
        </motion.div>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-lg"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0066cc]">
            Fleet Command Center
          </p>
          <h1 className="mb-5 text-5xl font-extrabold leading-[1.1] tracking-tight text-white">
            Everything your{" "}
            <span className="bg-gradient-to-r from-[#3399ff] to-[#0066cc] bg-clip-text text-transparent">
              fleet needs
            </span>{" "}
            in one place.
          </h1>
          <p className="text-base leading-relaxed text-white/50">
            Real-time trip monitoring, driver management, revenue analytics and
            smart route optimisation — all from a single, powerful dashboard.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex gap-10"
        >
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="mt-0.5 text-xs font-medium text-white/40">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Bottom quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="border-l-2 border-[#0066cc]/60 pl-4"
        >
          <p className="text-sm italic text-white/40">
            &ldquo;RideNow has revolutionised our fleet management. The admin panel is
            intuitive, powerful, and a pleasure to use every day.&rdquo;
          </p>
          <footer className="mt-2 text-xs font-semibold text-white/30">
            — Alexander Wright, Operations Director
          </footer>
        </motion.blockquote>
      </div>

      {/* ── Right panel – login card ── */}
      <div className="relative z-10 flex w-full items-center justify-center p-6 lg:w-[45%]">
        {/* glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl md:p-10"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066cc]">
              <Image
                src="/logo.png"
                alt="RideNow"
                width={24}
                height={24}
                className="brightness-0 invert"
                style={{ height: "auto" }}
              />
            </div>
            <span className="text-lg font-bold text-white">RideNow Admin</span>
          </div>

          <LoginForm />
        </motion.div>
      </div>
    </div>
  )
}
