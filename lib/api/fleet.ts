import { api } from "./client"

export type Bus = {
  id: string
  busNumber: string
  plateNumber: string
  name: string
  brand: string
  model: string
  year: number
  busType: string
  fuelType: string
  totalSeats: number
  standingCapacity: number
  currentLatitude: number
  currentLongitude: number
  lastLocationUpdate: string
  status: string
  isOnline: boolean
  mileageKm: number
  engineNumber: string
  chassisNumber: string
  insuranceExpiryDate: string
  roadWorthinessExpiry: string
  hasGps: boolean
  hasCamera: boolean
  hasWifi: boolean
  hasPanicButton: boolean
  cngInfo?: {
    cylinderCount: number
    cylinderCapacityLiters: number
    maxPressurePsi: number
    currentPressurePsi: number
    currentFuelLevelPercent: number
    estimatedRemainingKm: number
    lastRefillDate: string
    lastSafetyInspectionDate: string
    nextInspectionDue: string
  }
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export type BusListResponse = {
  buses: Bus[]
  limit: number
  page: number
  total: number
}

export type CreateBusRequest = {
  busNumber: string
  plateNumber: string
  name: string
  brand: string
  model: string
  year: number
  busType: string
  fuelType: string
  totalSeats: number
  standingCapacity: number
  engineNumber: string
  chassisNumber: string
  hasGps: boolean
  hasCamera: boolean
  hasWifi: boolean
  hasPanicButton: boolean
  cngInfo?: {
    cylinderCount: number
    cylinderCapacityLiters: number
    maxPressurePsi: number
  }
}

/**
 * Get all buses (paginated)
 * GET /fleet/buses
 */
export async function getBuses(params: { page?: number; limit?: number; status?: string } = {}) {
  const query = new URLSearchParams()
  if (params.page) query.append("page", params.page.toString())
  if (params.limit) query.append("limit", params.limit.toString())
  if (params.status) query.append("status", params.status)

  return api.get<BusListResponse>(`/fleet/buses?${query.toString()}`)
}

/**
 * Create a new bus
 * POST /fleet/buses
 */
export async function createBus(data: CreateBusRequest) {
  return api.post<Bus>("/fleet/buses", data)
}
