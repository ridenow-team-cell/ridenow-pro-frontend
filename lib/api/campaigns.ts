import { api } from "./client"

export type CampaignItem = {
  id: string
  name: string
  description: string
  code: string
  type: string
  status: "active" | "paused" | "archived" | string
  credit_bonus: number
  discount_pct: number
  max_discount: number
  total_redemptions: number
  uses_per_user: number
  current_redemptions: number
  audience: string
  start_date: string
  minimum_ride_amount: number
  is_active: boolean
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export type CreateCampaignRequest = {
  name: string
  description: string
  code: string
  type: string
  status: string
  creditBonus: number
  usesPerUser: number
  totalRedemptions: number
  minimumRideAmount: number
  audience: string
}

export type CampaignDetails = {
  campaign: CampaignItem
  performance: string
  redemption_count: number
  stats: {
    performance: string
    redemption_count: number
  }
  status: string
}

export type CampaignAnalytics = {
  total_users_reached: number
  redemption_rate: number
  total_credits_distributed: number
  rides_generated: number
  cac: number
  roi: number
  active_users_gained: number
}

/**
 * Get all campaigns filtered by status and type
 * GET /admin/campaigns
 */
export async function getCampaigns(status?: string, type?: string) {
  let query = ""
  const params: string[] = []
  if (status) params.push(`status=${status}`)
  if (type) params.push(`type=${type}`)
  if (params.length > 0) query = `?${params.join("&")}`

  return api.get<CampaignItem[]>(`/admin/campaigns${query}`)
}

/**
 * Get details and stats for a specific campaign
 * GET /admin/campaigns/{id}
 */
export async function getCampaignDetails(id: string) {
  return api.get<CampaignDetails>(`/admin/campaigns/${id}`)
}

/**
 * Create a new marketing campaign
 * POST /admin/campaigns
 */
export async function createCampaign(data: CreateCampaignRequest) {
  return api.post<CampaignItem>("/admin/campaigns", data)
}

/**
 * Update an existing campaign parameters
 * PUT /admin/campaigns/{id}
 */
export async function updateCampaign(id: string, data: Partial<CreateCampaignRequest>) {
  return api.put<CampaignItem>(`/admin/campaigns/${id}`, data)
}

/**
 * Activate a marketing campaign
 * POST /admin/campaigns/{id}/activate
 */
export async function activateCampaign(id: string) {
  return api.post<{ success: boolean }>(`/admin/campaigns/${id}/activate`, {})
}

/**
 * Pause a marketing campaign
 * POST /admin/campaigns/{id}/pause
 */
export async function pauseCampaign(id: string) {
  return api.post<{ success: boolean }>(`/admin/campaigns/${id}/pause`, {})
}

/**
 * Archive a marketing campaign
 * POST /admin/campaigns/{id}/archive
 */
export async function archiveCampaign(id: string) {
  return api.post<{ success: boolean }>(`/admin/campaigns/${id}/archive`, {})
}

/**
 * Get detailed ROI analytics for a campaign
 * GET /admin/campaigns/{id}/analytics
 */
export async function getCampaignAnalytics(id: string) {
  return api.get<CampaignAnalytics>(`/admin/campaigns/${id}/analytics`)
}
