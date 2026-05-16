import { api } from "./client"

export type SubscriptionPricingOption = {
  label: string
  durationDays: number
  baseCredit: number
  bonusPercentage: number
  bonusCredit: number
  price: number
  currency: string
  isPopular: boolean
}

export type SubscriptionPlan = {
  id: string
  planName: string
  description: string
  includedFeatures: string[]
  customFeatures: string[]
  availableAddOns: string[] | null
  pricingOptions: SubscriptionPricingOption[]
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export type CreatePlanRequest = {
  planName: string
  description: string
  includedFeatures: string[]
  customFeatures: string[]
  availableAddOns: string[]
  pricingOptions: SubscriptionPricingOption[]
  isActive: boolean
}

export type UserSubscription = {
  id: string
  userId: string
  planId: string
  pricingOption: SubscriptionPricingOption
  totalCredits: number
  remainingCredits: number
  usedCredits: number
  startDate: string
  endDate: string
  status: string
  autoRenew: boolean
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone_number: string
    role: string
  }
  plan: SubscriptionPlan
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Get all active subscription plans
 * GET /subscription-plans?active=true
 */
export async function getSubscriptionPlans(active: boolean = true) {
  return api.get<SubscriptionPlan[]>(`/subscription-plans?active=${active}`)
}

/**
 * Get a specific subscription plan
 * GET /subscription-plans/{id}
 */
export async function getSubscriptionPlan(id: string) {
  return api.get<SubscriptionPlan>(`/subscription-plans/${id}`)
}

/**
 * Create a new subscription plan
 * POST /subscription-plans
 */
export async function createSubscriptionPlan(data: CreatePlanRequest) {
  return api.post<SubscriptionPlan>("/subscription-plans", data)
}

/**
 * Update an existing subscription plan
 * PUT /subscription-plans/{id}
 */
export async function updateSubscriptionPlan(id: string, data: Partial<CreatePlanRequest>) {
  return api.put<{ message: string }> (`/subscription-plans/${id}`, data)
}

/**
 * Get subscription history (all subscriptions for all users)
 * GET /subscriptions/history
 */
export async function getSubscriptionHistory() {
  return api.get<UserSubscription[]>("/subscriptions/history")
}
