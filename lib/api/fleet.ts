import { api } from "./client"

export interface CNGInfo {
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

export interface Bus {
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
  cngInfo: CNGInfo
  assignedDriverId?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface BusesResponse {
  buses: Bus[]
  limit: number
  page: number
  total: number
}

export interface FleetAnalytics {
  totalFleet: {
    title: string
    count: number
    description: string
  }
  operational: {
    title: string
    count: number
    percentage: number
    description: string
  }
  inService: {
    title: string
    count: number
    description: string
  }
  drivers: {
    title: string
    count: number
  }
}

export interface RefillRequest {
  busId: string
  stationName: string
  quantityKg: number
  costPerKg: number
  totalCost: number
  pressureAfterRefill: number
}

export interface InspectionRequest {
  busId: string
  inspectorName: string
  cylinderCondition: string
  leakDetected: boolean
  status: string
  notes: string
}

export interface Refill {
  id: string
  busId: string
  stationName: string
  stationLocation: string
  fuelType: string
  quantityKg: number
  costPerKg: number
  totalCost: number
  pressureBeforeRefill: number
  pressureAfterRefill: number
  mileageAtRefill: number
  estimatedRangeAfterRefill: number
  refilledBy: string
  receiptImage: string
  createdAt: string
}

export interface Inspection {
  id: string
  busId: string
  inspectionDate: string
  inspectorName: string
  cylinderCondition: string
  leakDetected: boolean
  pressureRegulatorStatus: string
  valveCondition: string
  status: string
  notes: string
  nextInspectionDate: string
  createdAt: string
}

export interface RefillsResponse {
  refills: Refill[]
  total: number
  limit: number
  page: number
}

export interface InspectionsResponse {
  inspections: Inspection[]
  total: number
  limit: number
  page: number
}

export const getBuses = (params: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
  const query = new URLSearchParams()
  if (params.page) query.append("page", params.page.toString())
  if (params.limit) query.append("limit", params.limit.toString())
  if (params.status) query.append("status", params.status)
  if (params.search) query.append("search", params.search)
  
  return api.get<BusesResponse>(`/fleet/buses?${query.toString()}`)
}

export const getFleetAnalytics = () => {
  return api.get<FleetAnalytics>("/analytics/fleet")
}

export const recordRefill = (data: RefillRequest) => {
  return api.post("/fleet/refills", data)
}

export const recordInspection = (data: InspectionRequest) => {
  return api.post("/fleet/inspections", data)
}

export const getBus = (id: string) => {
  return api.get<Bus>(`/fleet/buses/${id}`)
}

export const updateBus = (id: string, data: { status?: string; mileageKm?: number; assignedDriverId?: string; routeId?: string }) => {
  return api.patch(`/fleet/buses/${id}`, data)
}

export const getBusRefills = (id: string) => {
  return api.get<RefillsResponse>(`/fleet/refills?busId=${id}`)
}

export const getBusInspections = (id: string) => {
  return api.get<InspectionsResponse>(`/fleet/buses/${id}/inspections`)
}

export interface CreateBusRequest {
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

export const createBus = (data: CreateBusRequest) => {
  return api.post<any>("/fleet/buses", data)
}

export const fleetApi = {
  getBuses,
  getFleetAnalytics,
  recordRefill,
  recordInspection,
  getBus,
  updateBus,
  getBusRefills,
  getBusInspections,
  createBus
}
