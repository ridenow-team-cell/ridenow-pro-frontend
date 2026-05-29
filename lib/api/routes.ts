import { api } from "./client"
import type { Bus } from "./fleet"

export interface RouteStop {
  busStopId: string
  order: number
  defaultFare: number
}

export interface RouteItem {
  id: string
  name: string
  code: string
  stops: RouteStop[]
  baseFare: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RouteOverview {
  totalRoutes: number
  totalTrips: number
  activeTrips: number
  completedTrips: number
  cancelledTrips: number
  totalBookings: number
  averageTripsPerRoute: number
  averageBookingsPerRoute: number
}

export interface RouteStatItem {
  id: string
  name: string
  code: string
  totalTrips: number
  activeTrips: number
  completedTrips: number
  cancelledTrips: number
  totalBookings: number
  schedulesCount: number
  baseFare: number
}

export interface TopPerformerItem {
  id: string
  name: string
  code: string
  totalBookings: number
  totalTrips: number
  loadFactor: number
}

export interface RouteStatistics {
  overview: RouteOverview
  routes: RouteStatItem[]
  topPerformers: TopPerformerItem[]
}

// Route Details Sub-Interfaces
export interface RouteDetailsSchedule {
  id: string
  routeId: string
  direction: string
  departureTime: string
  daysOfWeek: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RouteDetailsTrip {
  id: string
  routeId: string
  scheduleId: string
  busId: string
  driverId: string
  direction: string
  status: string
  tripDate: string
  currentLatitude: number
  currentLongitude: number
  lastLocationUpdate: string
  isActive: boolean
  driverName: string
  busName: string
  createdAt: string
  updatedAt: string
}

export interface RouteDetailsStats {
  totalTrips: number
  activeTrips: number
  completedTrips: number
  cancelledTrips: number
  totalBookings: number
  totalScheduledTrips: number
}

export interface RouteDetailsData {
  route: RouteItem
  schedules: RouteDetailsSchedule[]
  tripHistory: RouteDetailsTrip[]
  statistics: RouteDetailsStats
}

export interface CreateRouteRequest {
  name: string
  code: string
  baseFare: number
  stops: {
    busStopId: string
    order: number
    defaultFare: number
  }[]
  isActive: boolean
}

export const getRouteStatistics = () => {
  return api.get<RouteStatistics>("/routes/statistics")
}

export const getRoutesList = () => {
  return api.get<RouteItem[]>("/routes")
}

export const getRouteDetails = (id: string) => {
  return api.get<RouteDetailsData>(`/routes/${id}/details`)
}

export const getRouteBuses = (id: string) => {
  return api.get<{ buses: Bus[]; total: number }>(`/routes/${id}/buses`)
}

export const createRoute = (data: CreateRouteRequest) => {
  return api.post<RouteItem>("/routes", data)
}

export const routesApi = {
  getRouteStatistics,
  getRoutesList,
  getRouteDetails,
  getRouteBuses,
  createRoute,
}
