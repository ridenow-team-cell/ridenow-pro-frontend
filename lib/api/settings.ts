import { api } from "./client"

export type OperationsSettings = {
  id?: string
  cancellationPolicy: {
    cancellationFeePercent: number
    freeCancellationWindowHours: number
  }
  operatingHours: {
    openingTime: string
    closingTime: string
    operatingDays: string[]
  }
  fleetSafetySettings: {
    maxSpeedKmh: number
    maxPaidTripsPerUserPerDay: number
    maxFreeTripsPerUserPerDay: number
  }
  isActive: boolean
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

export type OrganizationSettings = {
  id?: string
  supportDetails: {
    phoneNumber: string
    email: string
    helpCenterUrl: string
  }
  legalSettings: {
    termsOfServiceUrl: string
    privacyPolicyUrl: string
    lastUpdatedDate?: string
  }
  isActive: boolean
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Get operations settings
 * GET /settings/operations
 */
export async function getOperationsSettings() {
  return api.get<OperationsSettings>("/settings/operations")
}

/**
 * Update operations settings
 * PUT /settings/operations
 */
export async function updateOperationsSettings(data: Partial<OperationsSettings>) {
  // Only send the fields required for update as per curl
  const payload = {
    cancellationPolicy: data.cancellationPolicy,
    operatingHours: data.operatingHours,
    fleetSafetySettings: data.fleetSafetySettings,
    isActive: data.isActive
  }
  return api.put<{ message: string }>("/settings/operations", payload)
}

/**
 * Get organization settings
 * GET /settings/organization
 */
export async function getOrganizationSettings() {
  return api.get<OrganizationSettings>("/settings/organization")
}

/**
 * Update organization settings
 * PUT /settings/organization
 */
export async function updateOrganizationSettings(data: Partial<OrganizationSettings>) {
  // Only send the fields required for update as per curl
  const payload = {
    supportDetails: data.supportDetails,
    legalSettings: data.legalSettings,
    isActive: data.isActive
  }
  return api.put<{ message: string }>("/settings/organization", payload)
}
