import { api } from "./client"

// ── Types ──────────────────────────────────────────────────────────────────

export type SignInPayload = { identifier: string }
export type SignInResponse = { otp_debug?: string }

export type VerifyOtpPayload = { identifier: string; code: string }
export type VerifyOtpResponse = { token: string }

// ── Auth API calls ─────────────────────────────────────────────────────────

/**
 * Step 1 – request OTP
 * POST /auth/signin  { identifier }
 */
export async function requestOtp(identifier: string) {
  return api.post<SignInResponse>("/auth/signin", { identifier } satisfies SignInPayload)
}

/**
 * Step 2 – verify OTP and receive JWT
 * POST /auth/verify-otp  { identifier, code }
 */
export async function verifyOtp(identifier: string, code: string) {
  return api.post<VerifyOtpResponse>("/auth/verify-otp", {
    identifier,
    code,
  } satisfies VerifyOtpPayload)
}
