/**
 * RideNow API Base Client
 * All API calls funnel through here for consistent headers, error handling, and auth token injection.
 */

// In the browser use the same-origin proxy so CORS is never an issue.
// On the server (SSR / Route Handlers) call the backend directly.
const BASE_URL =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "https://ridenow-pro-api.onrender.com/api/v1")
    : "/api/proxy"

export type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`

  // Inject auth token when available (client-side only)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rn_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  const res = await fetch(url, { ...options, headers })
  const json = (await res.json()) as any

  // If the response follows the standard ApiResponse format
  if (json && typeof json === "object" && "success" in json) {
    if (!res.ok || !json.success) {
      throw new ApiError(res.status, json.message ?? "An unexpected error occurred", json)
    }
    return json as ApiResponse<T>
  }

  // Otherwise, if it's a 2xx response, treat the whole body as the data
  if (res.ok) {
    return {
      success: true,
      message: "Success",
      data: json as T
    }
  }

  throw new ApiError(res.status, "An unexpected error occurred", json)
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "DELETE" }),
}
