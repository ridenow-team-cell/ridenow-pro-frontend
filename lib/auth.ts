/**
 * Token helpers — thin wrappers around localStorage + cookie so the key is
 * never hard-coded in multiple places, and Next.js middleware can read the
 * value server-side.
 *
 * All functions are safe to call during SSR (they no-op when window is unavailable).
 */

const TOKEN_KEY = "rn_token"

/** 7 days — matches a reasonable session window */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export function saveToken(token: string) {
  if (typeof window === "undefined") return
  // localStorage — for client-side reads
  localStorage.setItem(TOKEN_KEY, token)
  // Cookie — readable by Next.js middleware (edge runtime)
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  // Expire the cookie immediately
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

/** Call on sign-out — clears credentials and redirects to login */
export function signOut() {
  clearToken()
  window.location.href = "/login"
}
