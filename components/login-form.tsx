"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, ShieldCheck, Mail, KeyRound, ChevronLeft } from "lucide-react"
import { requestOtp, verifyOtp } from "@/lib/api/auth"
import { saveToken } from "@/lib/auth"
import { ApiError } from "@/lib/api/client"

// ── Step indicator ─────────────────────────────────────────────────────────

function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <span
      className={`h-1.5 rounded-full transition-all duration-500 ${
        done ? "w-6 bg-[#0066cc]" : active ? "w-6 bg-[#3399ff]" : "w-1.5 bg-white/20"
      }`}
    />
  )
}

// ── OTP digit input ────────────────────────────────────────────────────────

function OtpInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const digits = 6

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[i]) {
      const prev = document.getElementById(`otp-${i - 1}`)
      prev?.focus()
    }
  }

  function handleChange(i: number, char: string) {
    // Allow paste of full code
    if (char.length > 1) {
      const sanitised = char.replace(/\D/g, "").slice(0, digits)
      onChange(sanitised)
      const next = document.getElementById(`otp-${Math.min(sanitised.length, digits - 1)}`)
      next?.focus()
      return
    }
    if (!/^\d?$/.test(char)) return
    const arr = value.padEnd(digits, " ").split("")
    arr[i] = char || " "
    const next = char ? document.getElementById(`otp-${i + 1}`) : null
    next?.focus()
    onChange(arr.join("").trimEnd())
  }

  return (
    <div className="flex gap-2">
      {Array.from({ length: digits }).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={(e) => {
            e.preventDefault()
            handleChange(i, e.clipboardData.getData("text"))
          }}
          className="
            h-14 w-full rounded-xl border border-white/10 bg-white/5
            text-center text-xl font-bold text-white caret-[#3399ff]
            outline-none transition-all duration-200
            focus:border-[#0066cc]/70 focus:ring-2 focus:ring-[#0066cc]/25
            hover:border-white/20
          "
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  )
}

// ── Main form ──────────────────────────────────────────────────────────────

type Step = "email" | "otp"

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -32, opacity: 0 }),
}

export function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [direction, setDirection] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function goTo(next: Step, dir: number) {
    setDirection(dir)
    setError(null)
    setStep(next)
  }

  // ── Step 1: request OTP ────────────────────────────────────────────────

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await requestOtp(email.trim())
      goTo("otp", 1)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: verify OTP ─────────────────────────────────────────────────

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (otp.replace(/\s/g, "").length < 6) {
      setError("Please enter all 6 digits.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await verifyOtp(email.trim(), otp.replace(/\s/g, ""))
      if (res.data?.token) {
        saveToken(res.data.token)
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid code. Please try again.")
      setOtp("")
      document.getElementById("otp-0")?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#0066cc]/30 bg-[#0066cc]/10 px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#3399ff]" />
          <span className="text-xs font-medium text-[#3399ff]">Secure Admin Access</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h2>
        <p className="mt-1.5 text-sm text-white/40">
          Sign in to your RideNow admin account
        </p>
      </div>

      {/* Step dots */}
      <div className="mb-8 flex items-center gap-1.5">
        <StepDot active={step === "email"} done={step === "otp"} />
        <StepDot active={step === "otp"} done={false} />
      </div>

      {/* Animated step panels */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === "email" ? (
            <motion.form
              key="email-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onSubmit={handleEmailSubmit}
              className="space-y-5"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Mail className="h-5 w-5 text-[#3399ff]" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Enter your email</h3>
                <p className="mt-1 text-sm text-white/40">
                  We&apos;ll send a one-time code to verify your identity.
                </p>
              </div>

              {/* Email input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@ridenow.com"
                    className="
                      peer w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5
                      text-sm text-white placeholder:text-white/20
                      outline-none transition-all duration-200
                      focus:border-[#0066cc]/60 focus:ring-2 focus:ring-[#0066cc]/25
                      hover:border-white/20
                    "
                  />
                  <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 rounded-full bg-gradient-to-r from-[#0066cc] to-[#3399ff] transition-transform duration-300 peer-focus:scale-x-100" />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <SubmitButton loading={loading} label="Send code" />
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onSubmit={handleOtpSubmit}
              className="space-y-5"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <KeyRound className="h-5 w-5 text-[#3399ff]" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Check your inbox</h3>
                <p className="mt-1 text-sm text-white/40">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium text-white/70">{email}</span>
                </p>
              </div>

              {/* OTP inputs */}
              <OtpInput value={otp} onChange={setOtp} />

              {/* Resend */}
              <p className="text-xs text-white/30">
                Didn&apos;t receive it?{" "}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => { setOtp(""); requestOtp(email.trim()) }}
                  className="font-medium text-[#3399ff] transition-colors hover:text-white disabled:opacity-40"
                >
                  Resend code
                </button>
              </p>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <SubmitButton loading={loading} label="Verify & sign in" />

              {/* Back */}
              <button
                type="button"
                onClick={() => { setOtp(""); goTo("email", -1) }}
                className="flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Use a different email
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Shared submit button ───────────────────────────────────────────────────

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileTap={{ scale: 0.98 }}
      className="
        group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden
        rounded-xl bg-[#0066cc] py-3.5 text-sm font-semibold text-white
        shadow-lg shadow-[#0066cc]/30
        transition-all duration-200
        hover:bg-[#0055bb] hover:shadow-xl hover:shadow-[#0066cc]/40
        disabled:cursor-not-allowed disabled:opacity-60
      "
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Please wait…
          </motion.span>
        ) : (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            {label}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
