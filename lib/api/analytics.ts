import { api } from "./client"

export type DashboardAnalytics = {
  analytics: {
    revenueTotal: number
    newUsers: number
    peakDay: string
    chart: Array<{
      day: string
      revenue: number
      users: number
    }>
    registrations: {
      total: number
      data: Array<{
        id: string
        fullName: string
        role: string
        status: string
        createdAt: string
        avatarColor: string
      }>
    }
  }
}

export type RevenueAnalytics = {
  summary: {
    weeklyRevenue: {
      title: string
      currency: string
      amount: number
      change: {
        value: number
        type: string
        label: string
      }
    }
    monthlyForecast: {
      title: string
      currency: string
      status: string
      progress: number
    }
    transactions: {
      title: string
      period: string
      total?: number
    }
    settlements: {
      title: string
      frequency: string
      processing: string
    }
  }
  revenueTrend: {
    title: string
    description: string
    currency: string
    data: Array<{
      day: string
      revenue: number
    }>
    yAxis: {
      min: number
      max: number
      step: number
    }
  }
  revenueByPlan: {
    title: string
    description: string
    filters: string[]
    activeFilter: string
    data: Array<{
      plan: string
      revenue: number
      percentage: number
      color: string
    }>
  }
}

export type BillingAnalytics = {
  overview: {
    successfulPayments: {
      title: string
      count: number
    }
    failedPayments: {
      title: string
      count: number
    }
    pendingRenewals: {
      title: string
      count: number
    }
    autoRenewalRate: {
      title: string
      percentage: number
    }
  }
  recentBillingActivity: {
    title: string
    description: string
    data: Array<{
      id: string
      user: string
      amount: number
      status: string
      date: string
      method: string
    }> | null
  }
}

export type SubscriptionAnalytics = {
  activeSubscribers: {
    count: number
    change: number
  }
  monthlyRecurringRevenue: {
    amount: number
    currency: string
    change: number
  }
  churnRate: {
    percentage: number
    trend: "improving" | "declining"
  }
  popularPlan: {
    name: string
    percentage: number
  }
  totalCreditsIssued: number
}

export type FleetAnalytics = {
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

/**
 * Get dashboard analytics
 * GET /analytics/dashboard
 */
export async function getDashboardAnalytics() {
  return api.get<DashboardAnalytics>("/analytics/dashboard")
}

/**
 * Get revenue analytics
 * GET /analytics/revenue
 */
export async function getRevenueAnalytics() {
  return api.get<RevenueAnalytics>("/analytics/revenue")
}

/**
 * Get billing analytics
 * GET /analytics/billing
 */
export async function getBillingAnalytics() {
  return api.get<BillingAnalytics>("/analytics/billing")
}

/**
 * Get subscription analytics
 * GET /analytics/subscriptions
 */
export async function getSubscriptionAnalytics() {
  return api.get<SubscriptionAnalytics>("/analytics/subscriptions")
}

/**
 * Get fleet analytics
 * GET /analytics/fleet
 */
export async function getFleetAnalytics() {
  return api.get<FleetAnalytics>("/analytics/fleet")
}
