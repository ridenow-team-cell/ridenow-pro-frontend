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
      count?: number
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
      revenue?: number
      value?: number
      percentage: number
      color?: string
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
      customerName?: string
      user?: string
      subscriptionPlan?: string
      method?: string
      amount: number
      status: string
      date?: string
      timestamp?: string
      timeAgo?: string
      currency?: string
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

export type SubscriptionOpsAnalytics = {
  activeSubscribers: {
    title: string
    value: string
    description: string
  }
  mostPopular: {
    title: string
    value: string
    description: string
  }
  mrrEstimate: {
    title: string
    value: string
    description: string
  }
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
 * Get subscription ops analytics
 * GET /analytics/subscription-ops
 */
export async function getSubscriptionOpsAnalytics() {
  return api.get<SubscriptionOpsAnalytics>("/analytics/subscription-ops")
}

/**
 * Get fleet analytics
 * GET /analytics/fleet
 */
export async function getFleetAnalytics() {
  return api.get<FleetAnalytics>("/analytics/fleet")
}

export type ReportData = {
  overview: {
    monthlyRecurringRevenue: {
      title: string
      amount: number
      currency: string
      formatted: string
      change: {
        value: number
        type: "increase" | "decrease"
        label: string
      }
    }
    subscriberChurnRate: {
      title: string
      unit: string
      change: {
        value: number
        type: "increase" | "decrease"
        label: string
      }
    }
    newSubscriptions: {
      title: string
      count: number
      label: string
    }
  }
  revenueVsChurn: {
    title: string
    description: string
    data: Array<{
      month: string
      revenue: number
      churn: number
    }>
    yAxis: {
      revenueMax: number
      churnMax: number
    }
  }
  routeProfitabilityIndex: {
    title: string
    description: string
    data: Array<{
      name: string
      profit: number
      costs: number
    }> | null
    topPerformers: Array<{
      name: string
      roi: number
      profit: number
    }> | null
  }
  fleetStatusDistribution: {
    title: string
    categories: string[]
    assetUtilization: {
      mostUsedBuses: Array<{
        name: string
        utilization: string
      }> | null
      underutilizedRoutes: Array<{
        route: string
        avgLoad: number
      }> | null
    }
  }
  passengerDemandFlow: {
    title: string
    description: string
    timeLabels: string[]
    demand: number[]
    insights: {
      peakHour: string
      peakNote: string
      schedulingAdvice: {
        title: string
        description: string
      }
    }
  }
}

/**
 * Get reports and analytics data
 * GET /analytics/report
 */
export async function getAnalyticsReport() {
  return api.get<ReportData>("/analytics/report")
}
