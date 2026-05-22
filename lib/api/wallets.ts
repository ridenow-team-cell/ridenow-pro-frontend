import { api, ApiResponse } from "./client"

export type WalletData = {
  id: string
  userId: string
  userName: string
  userEmail: string
  balance: number
  status: "Active" | "Suspended"
  lastTransactionDate: string
  totalSpent: number
}

export type TransactionData = {
  id: string
  walletId: string
  userId: string
  user: string
  email: string
  type: "Top-up" | "Trip Payment" | "Refund" | "Service Fee"
  amount: number
  status: "Success" | "Pending" | "Failed"
  date: string
  method: string
}

export type WalletAnalytics = {
  platformBalance: number
  amountSpent: number
  activeWallets: number
  totalWallets: number
  spendingStats: Array<{
    day: string
    spent: number
    deposits: number
  }>
}

// Fetch wallet analytics
export async function getWalletAnalytics(): Promise<ApiResponse<WalletAnalytics>> {
  return api.get<WalletAnalytics>("/wallets/analytics")
}

// Fetch list of user wallets
export async function getWalletsList(search?: string): Promise<ApiResponse<WalletData[]>> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ""
  return api.get<WalletData[]>(`/wallets${query}`)
}

// Fetch transaction history
export async function getWalletTransactionsList(
  search?: string,
  type?: string,
  status?: string
): Promise<ApiResponse<TransactionData[]>> {
  const params = new URLSearchParams()
  if (search) params.append("search", search)
  if (type && type !== "All") params.append("type", type)
  if (status && status !== "All") params.append("status", status)
  
  const query = params.toString() ? `?${params.toString()}` : ""
  return api.get<TransactionData[]>(`/wallets/transactions${query}`)
}

// Adjust user wallet balance
export async function adjustWalletBalance(
  userId: string,
  amount: number,
  type: "credit" | "debit"
): Promise<ApiResponse<WalletData>> {
  return api.post<WalletData>(`/wallets/${userId}/adjust`, { amount, type })
}

// Toggle wallet status
export async function toggleWalletStatus(userId: string): Promise<ApiResponse<WalletData>> {
  return api.post<WalletData>(`/wallets/${userId}/toggle-status`, {})
}
