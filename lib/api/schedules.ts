import { api } from "./client"

export interface ScheduleItem {
  id: string
  routeId: string
  direction: "to" | "from"
  departureTime: string  // Format: "06:30 AM" or "08:00 AM" or "05:00 PM"
  daysOfWeek: string[]   // e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  isActive: boolean
  routeName?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateScheduleRequest {
  routeId: string
  direction: "to" | "from"
  departureTime: string
  daysOfWeek: string[]
  isActive: boolean
}

export interface UpdateScheduleRequest {
  routeId?: string
  direction?: "to" | "from"
  departureTime?: string
  daysOfWeek?: string[]
  isActive?: boolean
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

  deleteSchedule: (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/schedules/${id}`)
  }
}
