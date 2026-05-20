import { api } from "./client"

export type SubscriptionAddon = {
  id: string
  code: string
  name: string
  title: string
  description: string
  type: string
  price: number
  currency: string
  validityDays: number
  metadata: string[]
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export type CreateAddonRequest = Omit<
  SubscriptionAddon,
  "id" | "isDeleted" | "createdAt" | "updatedAt"
>

/**
 * Get all active or inactive subscription add-ons
 * GET /subscription-addons
 */
export async function getSubscriptionAddons(activeOnly?: boolean) {
  const query = activeOnly !== undefined ? `?active=${activeOnly}` : ""
  return api.get<SubscriptionAddon[]>(`/subscription-addons${query}`)
}

/**
 * Create a new subscription add-on
 * POST /subscription-addons
 */
export async function createSubscriptionAddon(data: CreateAddonRequest) {
  return api.post<SubscriptionAddon>("/subscription-addons", data)
}

/**
 * Update an existing subscription add-on
 * PUT /subscription-addons/{id}
 */
export async function updateSubscriptionAddon(id: string, data: Partial<CreateAddonRequest>) {
  return api.put<{ success: boolean; message: string; data?: SubscriptionAddon }>(
    `/subscription-addons/${id}`,
    data
  )
}

/**
 * Delete a subscription add-on
 * DELETE /subscription-addons/{id}
 */
export async function deleteSubscriptionAddon(id: string) {
  return api.delete<{ success: boolean; message: string }>(`/subscription-addons/${id}`)
}
