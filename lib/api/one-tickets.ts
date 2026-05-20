import { api } from "./client"

export interface OneTicketItem {
  id: string
  ticketName: string
  description: string
  oneTimePrice: number
  validityPeriodDays: number
  isActive: boolean
  totalPurchases?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateOneTicketRequest {
  ticketName: string
  description: string
  oneTimePrice: number
  validityPeriodDays: number
  isActive: boolean
}

export interface OneTicketOverview {
  totalTemplates: number
  totalPurchases: number
  activePurchases: number
  expiredPurchases: number
  cancelledPurchases: number
  totalRevenue: number
  totalRidesBooked: number
  averagePrice: number
  averagePurchasesPlan: number
}

export interface OneTicketStatItem {
  id: string
  ticketName: string
  oneTimePrice: number
  validityPeriodDays: number
  isActive: boolean
  totalPurchases: number
  totalRevenue: number
  activePurchases: number
  expiredPurchases: number
  cancelledPurchases: number
  totalRidesBooked: number
}

export interface OneTicketTopPerformer {
  id: string
  ticketName: string
  totalPurchases: number
  totalRevenue: number
  totalRides: number
}

export interface OneTicketStatistics {
  overview: OneTicketOverview
  tickets: OneTicketStatItem[]
  topPerformers: OneTicketTopPerformer[]
}

export const oneTicketsApi = {
  getOneTickets: () => {
    return api.get<OneTicketItem[]>("/one-tickets")
  },

  createOneTicket: (data: CreateOneTicketRequest) => {
    return api.post<OneTicketItem>("/one-tickets", data)
  },

  updateOneTicket: (id: string, data: Partial<CreateOneTicketRequest>) => {
    return api.put<OneTicketItem>(`/one-tickets/${id}`, data)
  },

  getOneTicketStatistics: () => {
    return api.get<OneTicketStatistics>("/one-tickets/statistics")
  }
}
