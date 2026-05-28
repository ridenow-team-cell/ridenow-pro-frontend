import { api } from "./client"

export interface OperationalTrip {
  id: string
  busId: string
  busName: string
  routeId: string
  routeName: string
  driverId: string
  driverName: string
  scheduledTime: string
  status: "scheduled" | "active" | "completed" | "delayed" | "cancelled"
  passengerCount: number
  capacity: number
  tripDate: string
}

export const getOperationalTrips = () => {
  return api.get<OperationalTrip[]>("/trips/operational")
}

export const tripsApi = {
  getOperationalTrips,
}
