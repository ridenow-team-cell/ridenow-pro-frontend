import { api } from "./client"

export interface Driver {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  date_of_birth: string
  heard_about_us: string
  role: string
  created_at: string
  updated_at: string
}

export interface DriverPerformance {
  driverId: string
  fullName: string
  tripsCompleted: number
  rating: number
  status: string
  lastTripDate: string
}

export interface DriverAnalytics {
  overview: {
    totalDrivers: { title: string; count: number }
    activeDrivers: { title: string; count: number; percentage: number }
    avgRating: { title: string; rating: number }
    topPerformer: { title: string; fullName: string }
  }
  performance: DriverPerformance[]
}

export interface Route {
  id: string
  name: string
  code: string
  baseFare: number
}

export interface Trip {
  id: string
  routeId: string
  busId: string
  driverId: string
  status: string
  tripDate: string
  route: Route
  schedule: {
    departureTime: string
    direction: string
  }
}

export interface DriverProfile {
  driver: Driver
  assignedBus: any // Can use Bus interface if imported
  trips: Trip[]
  activeTrip: Trip | null
  stats: DriverPerformance
}

export const driverApi = {
  getDrivers: () => {
    return api.get<Driver[]>("/drivers")
  },

  getDriverAnalytics: () => {
    return api.get<DriverAnalytics>("/drivers/analytics")
  },

  getDriverProfile: (id: string) => {
    return api.get<DriverProfile>(`/drivers/${id}/profile`)
  }
}
