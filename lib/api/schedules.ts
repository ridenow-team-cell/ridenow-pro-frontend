import { api } from "./client"

export interface ScheduleItem {
  id: string
  routeId: string
  name: string
  departureTime: string  // Format: "08:30 AM"
  date: string           // Format: "2026-06-01"
  isActive: boolean
  routeName?: string
  busId?: string
  driverId?: string
  driver?: {
    id: string
    firstName?: string
    lastName?: string
    name?: string
  }
  daysOfWeek?: string[]   // Keep for compatibility
  direction?: "to" | "from" // Keep for compatibility
  createdAt?: string
  updatedAt?: string
}

export interface CreateScheduleRequest {
  routeId: string
  name: string
  departureTime: string
  date: string
  isActive: boolean
}

export interface UpdateScheduleRequest {
  routeId?: string
  name?: string
  departureTime?: string
  date?: string
  isActive?: boolean
  busId?: string
  driverId?: string
}

export const schedulesApi = {
  getSchedules: () => {
    return api.get<ScheduleItem[]>("/schedules")
  },

  createSchedule: (data: CreateScheduleRequest) => {
    return api.post<ScheduleItem>("/schedules", data)
  },

  updateSchedule: (id: string, data: UpdateScheduleRequest) => {
    return api.put<ScheduleItem>(`/schedules/${id}`, data)
  },

  patchSchedule: (id: string, data: { busId?: string; driverId?: string; isActive?: boolean }) => {
    return api.patch<ScheduleItem>(`/schedules/${id}`, data)
  },

  deleteSchedule: (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/schedules/${id}`)
  }
}
