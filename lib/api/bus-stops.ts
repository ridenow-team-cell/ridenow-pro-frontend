import { api, ApiResponse } from "./client"

export interface Landmark {
  name: string
  distance: number
}

export interface BusStop {
  id: string
  name: string
  code: string
  description: string
  bannerImage: string
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  country: string
  geoHash: string
  routeIds: string[]
  landmarks: Landmark[] | null
  currentPassengers: number
  todayPassengers: number
  averageWaitTimeMinutes: number
  hasCCTV: boolean
  isSafeZone: boolean
  radiusMeters: number
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface BusStopsResponse {
  bus_stops: BusStop[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface CreateBusStopRequest {
  name: string
  code: string
  description: string
  bannerImage: string
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  country: string
  radiusMeters: number
  hasCCTV: boolean
  isSafeZone: boolean
  landmarks?: Landmark[]
}

export interface UpdateBusStopRequest extends Partial<CreateBusStopRequest> {}

export interface BusStopFilters {
  page?: number
  limit?: number
  search?: string
  city?: string
  isActive?: boolean
}

export interface BusStopAnalytics {
  totalStops: number
  activeStops: number
  inactiveStops: number
  safeZones: number
  cctvCoverage: number
  totalTodayPassengers: number
  averageWaitTime: number
  clusters: {
    city: string
    stopCount: number
    avgWaitTime: number
  }[]
}

export const busStopsApi = {
  getBusStops: (filters: BusStopFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.limit) params.append("limit", filters.limit.toString())
    if (filters.search) params.append("search", filters.search)
    if (filters.city) params.append("city", filters.city)
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString())

    const query = params.toString()
    return api.get<BusStopsResponse>(`/bus-stops${query ? `?${query}` : ""}`)
  },

  getBusStopAnalytics: () => {
    return api.get<BusStopAnalytics>("/bus-stops/analytics")
  },

  getBusStop: (id: string) => {
    return api.get<BusStop>(`/bus-stops/${id}`)
  },

  createBusStop: (data: CreateBusStopRequest) => {
    return api.post<BusStop>("/bus-stops", data)
  },

  updateBusStop: (id: string, data: UpdateBusStopRequest) => {
    return api.patch<BusStop>(`/bus-stops/${id}`, data)
  },

  updateBusStopStatus: (id: string, isActive: boolean) => {
    return api.patch<{ success: boolean; message: string }>(`/bus-stops/${id}/status`, { isActive })
  },
}
