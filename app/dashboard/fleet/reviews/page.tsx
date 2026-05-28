"use client"

import * as React from "react"
import { 
  Star, 
  Search, 
  MessageSquare, 
  RefreshCw, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Send, 
  Reply, 
  Flag, 
  Percent, 
  Check
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { api } from "@/lib/api/client"

interface Review {
  id: string
  tripId: string
  userId: string
  driverId: string
  tripRating: number
  driverRating: number
  comment: string
  status: string
  refunded: boolean
  refundAmount?: number
  refundTransactionId?: string
  adminResponse?: string
  createdAt: string
  updatedAt: string
  // Virtual UI properties generated dynamically:
  passenger_name?: string
  passenger_avatar?: string
  passenger_phone?: string
  target_type?: "Driver" | "Staff"
  driver_name?: string
  driver_avatar?: string
  driver_rating?: number
  vehicle?: string
  rating: number
  sentiment?: "Positive" | "Neutral" | "Negative"
  tags: string[]
  created_at: string
  replied: boolean
  reply_text?: string
  refund_offered?: boolean
  refund_amount?: number
  flagged?: boolean
}

interface RatingListItem {
  id: string
  tripId: string
  userId: string
  driverId: string
  tripRating: number
  driverRating: number
  comment: string
  status: string
  refunded: boolean
  refundAmount?: number
  refundTransactionId?: string
  adminResponse?: string
  createdAt: string
  updatedAt: string
}

interface RatingsListResponse {
  list: RatingListItem[]
  page: number
  limit: number
  total: number
}

interface Passenger {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  date_of_birth?: string
  heard_about_us?: string
  role?: string
  is_suspended?: boolean
  is_verified?: boolean
}

interface Driver {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  date_of_birth?: string
  heard_about_us?: string
  role?: string
  is_suspended?: boolean
  is_verified?: boolean
}

interface Trip {
  id: string
  routeId: string
  scheduleId?: string
  busId?: string
  driverId?: string
  direction?: string
  status?: string
  tripDate?: string
  isActive?: boolean
  driverName?: string
  busName?: string
  createdAt?: string
  updatedAt?: string
}

interface RatingDetail {
  rating: RatingListItem
  passenger: Passenger
  driver: Driver
  trip: Trip
}

export default function TripReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null)
  const [selectedDetail, setSelectedDetail] = React.useState<RatingDetail | null>(null)
  const [detailLoading, setDetailLoading] = React.useState(false)
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [ratingFilter, setRatingFilter] = React.useState<string>("ALL")
  const [sentimentFilter, setSentimentFilter] = React.useState<string>("ALL")
  const [tagFilter, setTagFilter] = React.useState<string>("ALL")
  const [targetFilter, setTargetFilter] = React.useState<string>("ALL")

  // Pagination
  const ITEMS_PER_PAGE = 4
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, ratingFilter, sentimentFilter, tagFilter, targetFilter])

  // Reply Modal State
  const [isReplyOpen, setIsReplyOpen] = React.useState(false)
  const [replyText, setReplyText] = React.useState("")

  // Refund Modal State
  const [isRefundOpen, setIsRefundOpen] = React.useState(false)
  const [refundAmount, setRefundAmount] = React.useState("500")

  // Fetch Ratings from Backend
  const fetchRatings = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get<RatingsListResponse>("/admin/ratings?page=1&limit=100")
      if (response.success && response.data) {
        const list = response.data.list || []
        
        // Map to Review structure
        const mappedList: Review[] = list.map((item) => {
          const rating = item.tripRating
          const avg = (item.tripRating + item.driverRating) / 2
          const sentiment = avg >= 4 ? "Positive" : avg >= 3 ? "Neutral" : "Negative"
          
          const tags: string[] = []
          if (item.tripRating === 5) tags.push("Excellent Trip")
          if (item.driverRating === 5) tags.push("Great Driver")
          if (item.tripRating <= 2) tags.push("Service Issue")
          if (item.driverRating <= 2) tags.push("Driver Conduct")
          if (item.refunded) tags.push("Refunded")
          if (item.comment?.toLowerCase().includes("clean")) tags.push("Clean Vehicle")
          if (item.comment?.toLowerCase().includes("late") || item.comment?.toLowerCase().includes("time")) tags.push("Punctuality")
          if (item.comment?.toLowerCase().includes("route") || item.comment?.toLowerCase().includes("map")) tags.push("Navigation")
          if (item.comment?.toLowerCase().includes("ac") || item.comment?.toLowerCase().includes("hot")) tags.push("AC Issue")

          return {
            ...item,
            rating,
            sentiment,
            tags,
            passenger_name: `Rider (${item.userId.substring(0, 8)})`,
            passenger_avatar: "R",
            passenger_phone: "N/A",
            target_type: item.driverId ? "Driver" : "Staff",
            driver_name: item.driverId ? `Driver (${item.driverId.substring(0, 8)})` : undefined,
            driver_avatar: "D",
            driver_rating: item.driverRating,
            created_at: new Date(item.createdAt).toLocaleDateString(),
            replied: !!item.adminResponse,
            reply_text: item.adminResponse,
            refund_offered: item.refunded,
            refund_amount: item.refundAmount
          }
        })
        setReviews(mappedList)
      } else {
        toast.error("Failed to retrieve ratings feed.")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(`Error loading ratings: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchRatings()
  }, [fetchRatings])

  // Fetch single rating details
  const fetchRatingDetail = async (id: string) => {
    setDetailLoading(true)
    setSelectedDetail(null)
    try {
      const response = await api.get<RatingDetail>(`/admin/ratings/${id}`)
      if (response.success && response.data) {
        setSelectedDetail(response.data)
        
        // Update name details dynamically in list item
        const detail = response.data
        setReviews(prev => prev.map(r => {
          if (r.id === id) {
            return {
              ...r,
              passenger_name: `${detail.passenger?.first_name || ""} ${detail.passenger?.last_name || ""}`.trim() || `Rider (${detail.rating.userId.substring(0, 8)})`,
              passenger_avatar: detail.passenger?.first_name ? detail.passenger.first_name[0].toUpperCase() : "R",
              passenger_phone: detail.passenger?.phone_number || "N/A",
              driver_name: detail.driver?.first_name ? `${detail.driver.first_name} ${detail.driver.last_name}` : (detail.trip?.driverName || "Driver"),
              driver_avatar: detail.driver?.first_name ? detail.driver.first_name[0].toUpperCase() : "D",
              vehicle: detail.trip?.busName || "City Express"
            }
          }
          return r
        }))

        // Also update selectedReview representation
        setSelectedReview(prev => {
          if (!prev || prev.id !== id) return prev
          return {
            ...prev,
            passenger_name: `${detail.passenger?.first_name || ""} ${detail.passenger?.last_name || ""}`.trim() || `Rider (${detail.rating.userId.substring(0, 8)})`,
            passenger_avatar: detail.passenger?.first_name ? detail.passenger.first_name[0].toUpperCase() : "R",
            passenger_phone: detail.passenger?.phone_number || "N/A",
            driver_name: detail.driver?.first_name ? `${detail.driver.first_name} ${detail.driver.last_name}` : (detail.trip?.driverName || "Driver"),
            driver_avatar: detail.driver?.first_name ? detail.driver.first_name[0].toUpperCase() : "D",
            vehicle: detail.trip?.busName || "City Express",
            replied: !!detail.rating.adminResponse,
            reply_text: detail.rating.adminResponse,
            refund_offered: detail.rating.refunded,
            refund_amount: detail.rating.refundAmount,
            status: detail.rating.status
          }
        })
      } else {
        toast.error("Failed to retrieve rating details.")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(`Error loading details: ${err.message}`)
    } finally {
      setDetailLoading(false)
    }
  }

  React.useEffect(() => {
    if (selectedReview) {
      fetchRatingDetail(selectedReview.id)
    } else {
      setSelectedDetail(null)
    }
  }, [selectedReview?.id])

  // Statistics
  const totalReviewsCount = reviews.length
  const avgRating = totalReviewsCount > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviewsCount).toFixed(2) : "0.00"
  const positiveSentimentPct = totalReviewsCount > 0 ? Math.round(
    (reviews.filter(r => r.sentiment === "Positive").length / totalReviewsCount) * 100
  ) : 0
  const actionRequiredCount = reviews.filter(r => r.rating <= 2 && !r.replied).length

  // All unique tags collected
  const allTags = Array.from(new Set(reviews.flatMap(r => r.tags)))

  // Handle Actions
  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReview) return
    
    try {
      const response = await api.post<any>(`/admin/ratings/${selectedReview.id}/respond`, {
        response: replyText
      })
      if (response.success) {
        toast.success(`Reply transmitted successfully to ${selectedReview.passenger_name}`)
        setIsReplyOpen(false)
        setReplyText("")
        await fetchRatings()
        await fetchRatingDetail(selectedReview.id)
      } else {
        toast.error(response.message || "Failed to post response.")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(`Error posting response: ${err.message}`)
    }
  }

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReview) return

    try {
      const response = await api.post<any>(`/admin/ratings/${selectedReview.id}/refund`, {
        amount: Number(refundAmount)
      })
      if (response.success) {
        toast.success(`Refund credit of ₦${refundAmount} credited to ${selectedReview.passenger_name}'s wallet.`)
        setIsRefundOpen(false)
        await fetchRatings()
        await fetchRatingDetail(selectedReview.id)
      } else {
        toast.error(response.message || "Failed to authorize refund.")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(`Error authorizing refund: ${err.message}`)
    }
  }

  const handleResolveReview = async () => {
    if (!selectedReview) return

    try {
      const response = await api.patch<any>(`/admin/ratings/${selectedReview.id}/status`, {
        status: "resolved"
      })
      if (response.success) {
        toast.success("Review status resolved successfully.")
        await fetchRatings()
        await fetchRatingDetail(selectedReview.id)
      } else {
        toast.error(response.message || "Failed to resolve status.")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(`Error updating status: ${err.message}`)
    }
  }

  const handleFlagReview = (review: Review) => {
    setReviews(prev => prev.map(r => {
      if (r.id === review.id) {
        return { ...r, flagged: !r.flagged }
      }
      return r
    }))

    setSelectedReview(prev => {
      if (prev && prev.id === review.id) {
        return { ...prev, flagged: !prev.flagged }
      }
      return prev
    })

    if (!review.flagged) {
      toast.warning(`Review ${review.id} flagged for compliance board investigation.`)
    } else {
      toast.success(`Flag removed from review ${review.id}.`)
    }
  }

  // Filter Logic
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.passenger_name && r.passenger_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.driver_name && r.driver_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRating = ratingFilter === "ALL" || r.rating.toString() === ratingFilter
    const matchesSentiment = sentimentFilter === "ALL" || r.sentiment === sentimentFilter
    const matchesTag = tagFilter === "ALL" || r.tags.includes(tagFilter)
    const matchesTarget = targetFilter === "ALL" || r.target_type === targetFilter

    return matchesSearch && matchesRating && matchesSentiment && matchesTag && matchesTarget
  })

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE)
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="flex flex-col h-full bg-background text-foreground p-6 gap-6">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground uppercase">Trip Reviews & Quality Feed</h1>
          <p className="text-xs text-muted-foreground">
            Monitor rider satisfaction, sentiment trends, and execute dispute recovery credits.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          fetchRatings()
          toast.success("Feed telemetry re-indexed successfully.")
        }} className="h-9 gap-2 font-bold text-xs uppercase tracking-wider">
          <RefreshCw className="h-3.5 w-3.5" /> Re-index Telemetry
        </Button>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Avg Rating Card */}
        <Card className="bg-card border-border/80 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-bold uppercase tracking-wider">Average Rating</span>
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">{avgRating}</span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +0.04% vs last week
            </div>
          </CardContent>
        </Card>

        {/* Total Reviews Card */}
        <Card className="bg-card border-border/80 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Reviews</span>
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">{totalReviewsCount}</span>
              <span className="text-xs text-muted-foreground">recorded</span>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              100% telemetry response rate
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis Card */}
        <Card className="bg-card border-border/80 shadow-sm relative overflow-hidden">
          <CardContent className="p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-bold uppercase tracking-wider">Positive Sentiment</span>
              <Percent className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">{positiveSentimentPct}%</span>
              <span className="text-xs text-muted-foreground">overall</span>
            </div>
            <div className="text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Action Required
            </div>
          </CardContent>
        </Card>

        {/* Action Required Card */}
        <Card className="bg-card border-rose-200 shadow-sm relative overflow-hidden bg-rose-500/[0.02]">
          <CardContent className="p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-[10px] font-bold uppercase tracking-wider">Dispute Follow-up</span>
              <AlertTriangle className="h-4 w-4 text-rose-600 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2 text-rose-950">
              <span className="text-3xl font-extrabold text-rose-600">{actionRequiredCount}</span>
              <span className="text-xs text-rose-700 font-semibold">unresolved negative</span>
            </div>
            <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
              Requires reply or refund credit
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
        
        {/* Left Side: Filter and Review List Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden h-full">
          
          {/* Search & Filter Header Card */}
          <Card className="bg-card border-border/80 shadow-sm shrink-0">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter reviews by Trip ID, passenger, driver, comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9 bg-background border-border"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-muted-foreground">Rating Star</label>
                  <select
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none text-foreground h-8"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="ALL">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-muted-foreground">Sentiment</label>
                  <select
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none text-foreground h-8"
                    value={sentimentFilter}
                    onChange={(e) => setSentimentFilter(e.target.value)}
                  >
                    <option value="ALL">All Sentiments</option>
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-muted-foreground">Quality Issue Tag</label>
                  <select
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none text-foreground h-8"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                  >
                    <option value="ALL">All Issue Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-muted-foreground">Target Type</label>
                  <select
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none text-foreground h-8"
                    value={targetFilter}
                    onChange={(e) => setTargetFilter(e.target.value)}
                  >
                    <option value="ALL">All Targets</option>
                    <option value="Driver">Driver Reviews</option>
                    <option value="Staff">Staff Reviews</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scrollable Feed */}
          <ScrollArea className="flex-1 bg-card border border-border/80 rounded-xl">
            <div className="p-4 flex flex-col gap-3">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="h-10 w-10 text-muted-foreground/30 animate-spin mb-2" />
                  <p className="text-xs font-bold uppercase text-muted-foreground">Loading Ratings Feed...</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <p className="text-xs font-bold uppercase text-muted-foreground">No Reviews Found</p>
                  <p className="text-[10px] text-muted-foreground max-w-xs mt-1">Try modifying your filters or search keywords.</p>
                </div>
              ) : (
                paginatedReviews.map((review) => {
                  const isSelected = selectedReview?.id === review.id
                  return (
                    <div 
                      key={review.id}
                      onClick={() => setSelectedReview(review)}
                      className={`p-4 rounded-lg border transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? "border-primary bg-primary/[0.02]" 
                          : "border-border/50 hover:border-border bg-muted/5 hover:bg-muted/15"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">{review.passenger_name}</span>
                            <span className="text-[9px] font-mono text-muted-foreground">{review.created_at}</span>
                            <Badge variant="outline" className={`text-[8px] font-bold uppercase tracking-wider h-4 ${
                              review.target_type === "Driver" 
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
                                : "bg-violet-500/10 text-violet-500 border-violet-500/20"
                            }`}>
                              {review.target_type}
                            </Badge>
                            {review.flagged && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[8px] font-extrabold uppercase px-1.5 py-0 h-4">
                                Flagged
                              </Badge>
                            )}
                          </div>
                          
                          {/* Stars Row */}
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < review.rating 
                                    ? "text-amber-500 fill-amber-500" 
                                    : "text-muted/40"
                                  }`} 
                              />
                            ))}
                          </div>
                        </div>

                        <Badge 
                          variant="outline"
                          className={`text-[9px] font-extrabold uppercase px-2 h-5 border ${
                            review.sentiment === "Positive" ? "border-emerald-200 text-emerald-700 bg-emerald-50/50" :
                            review.sentiment === "Negative" ? "border-rose-200 text-rose-700 bg-rose-50/50" :
                            "border-amber-200 text-amber-700 bg-amber-50/50"
                          }`}
                        >
                          {review.sentiment}
                        </Badge>
                      </div>

                      <p className="text-xs text-foreground mt-2 line-clamp-2 italic">
                        "{review.comment}"
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/30">
                        <div className="flex flex-wrap gap-1">
                          {review.tags.map(tag => (
                            <span key={tag} className="text-[8px] font-bold uppercase tracking-wide bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground">
                          Trip: <span className="font-mono font-bold text-foreground">{review.tripId}</span>
                          {review.replied && (
                            <span className="flex items-center gap-0.5 text-emerald-600 font-bold ml-1">
                              <Check className="h-3 w-3" /> Replied
                            </span>
                          )}
                          {review.refund_offered && (
                            <span className="flex items-center gap-0.5 text-blue-600 font-bold ml-1">
                              <DollarSign className="h-3 w-3" /> Refunded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-border/20 pt-3 shrink-0">
            <div className="text-[10px] text-muted-foreground font-semibold">
              Showing {filteredReviews.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)} of {filteredReviews.length} entries
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                className="h-8 px-2.5 text-xs font-bold uppercase tracking-wider"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      className="h-8 w-8 text-xs font-bold"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                className="h-8 px-2.5 text-xs font-bold uppercase tracking-wider"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Focus Pane */}
        <div className="lg:col-span-5 h-full overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden border-border bg-card flex flex-col h-full">
            {selectedReview ? (
              <div className="flex flex-col h-full overflow-hidden">
                
                {/* Header */}
                <div className="p-6 border-b flex items-start justify-between bg-muted/5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-muted-foreground">{selectedReview.id}</span>
                      <Badge variant="outline" className="border-border text-[9px] uppercase font-bold">
                        Trip ID: {selectedReview.tripId}
                      </Badge>
                    </div>
                    <h2 className="text-base font-extrabold tracking-tight">Review Details</h2>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`h-8 w-8 ${selectedReview.flagged ? "bg-amber-50 border-amber-200 text-amber-600" : ""}`}
                    onClick={() => handleFlagReview(selectedReview)}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>

                {/* Details Scroll Area */}
                <ScrollArea className="flex-1">
                  {detailLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                      <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
                      <p className="text-xs text-muted-foreground">Fetching complete customer details...</p>
                    </div>
                  ) : (
                    <div className="p-6 flex flex-col gap-6">
                      
                      {/* Stars & Comment */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4.5 w-4.5 ${
                                  i < selectedReview.rating 
                                    ? "text-amber-500 fill-amber-500" 
                                    : "text-muted/40"
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{selectedReview.created_at}</span>
                        </div>
                        <p className="text-xs text-foreground bg-muted/40 p-3.5 rounded-lg border border-border/40 italic leading-relaxed">
                          "{selectedReview.comment}"
                        </p>
                      </div>

                      {/* Parties Section */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transit Parties</h4>
                        <div className="grid grid-cols-1 gap-3">
                          
                          {/* Rider Card */}
                          <Card className="shadow-none border-border/50 bg-muted/10">
                            <CardContent className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                  {selectedReview.passenger_avatar}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-foreground">{selectedReview.passenger_name}</span>
                                  <span className="text-[9px] text-muted-foreground font-mono">{selectedReview.passenger_phone !== "N/A" ? selectedReview.passenger_phone : (selectedDetail?.passenger?.phone_number || "No Phone")}</span>
                                </div>
                              </div>
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[8px] uppercase tracking-wider h-5">Rider</Badge>
                            </CardContent>
                          </Card>

                          {/* Target Specific Card */}
                          {selectedReview.target_type === "Driver" ? (
                            <Card className="shadow-none border-border/50 bg-muted/10">
                              <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                    {selectedReview.driver_avatar}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground">{selectedReview.driver_name}</span>
                                    <span className="text-[9px] text-muted-foreground font-mono">Rating: ★ {selectedReview.driver_rating}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <Badge className="bg-blue-50 text-blue-700 border border-blue-100 font-extrabold text-[8px] uppercase tracking-wider h-5">Driver</Badge>
                                  <span className="text-[9px] text-muted-foreground font-mono">{selectedReview.vehicle || selectedDetail?.trip?.busName || "City Express"}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card className="shadow-none border-border/50 bg-muted/10">
                              <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                                    S
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground">Support Terminal Staff</span>
                                    <span className="text-[9px] text-muted-foreground font-mono">Transit Corridor Terminal</span>
                                  </div>
                                </div>
                                <Badge className="bg-violet-50 text-violet-700 border border-violet-100 font-extrabold text-[8px] uppercase tracking-wider h-5">Staff</Badge>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>

                      {/* Details Meta Grid */}
                      {selectedDetail && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trip Details</h4>
                          <Card className="shadow-none border-border/50 bg-muted/5 p-4 text-xs space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bus Name:</span>
                              <span className="font-semibold">{selectedDetail.trip?.busName || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Direction:</span>
                              <span className="font-semibold uppercase">{selectedDetail.trip?.direction || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Trip Date:</span>
                              <span className="font-semibold">{selectedDetail.trip?.tripDate ? new Date(selectedDetail.trip.tripDate).toLocaleString() : "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Trip Status:</span>
                              <Badge variant="outline" className="text-[9px] font-bold h-4.5 uppercase">{selectedDetail.trip?.status || "N/A"}</Badge>
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* Timeline logs */}
                      <div className="space-y-3.5">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Action Timeline</h4>
                        <div className="relative border-l border-border/80 pl-4 ml-2.5 py-1 space-y-4">
                          
                          {/* Feed Ingested */}
                          <div className="relative text-xs space-y-1">
                            <div className="absolute -left-[21px] mt-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                            <p className="font-bold text-foreground">Review Received</p>
                            <p className="text-[10px] text-muted-foreground">Ingested through Mobile App portal feed.</p>
                          </div>

                          {/* Flagged Log */}
                          {selectedReview.flagged && (
                            <div className="relative text-xs space-y-1 text-amber-700">
                              <div className="absolute -left-[21px] mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-2 border-background" />
                              <p className="font-bold">Compliance Flag Raised</p>
                              <p className="text-[10px] text-amber-600/90">Flagged review locked for compliance assessment.</p>
                            </div>
                          )}

                          {/* Refund Log */}
                          {selectedReview.refund_offered && (
                            <div className="relative text-xs space-y-1 text-blue-700">
                              <div className="absolute -left-[21px] mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-background" />
                              <p className="font-bold">Refund Credit Issued</p>
                              <p className="text-[10px] text-blue-600/90">Offer of ₦{selectedReview.refund_amount} credited to customer balance.</p>
                            </div>
                          )}

                          {/* Response Log */}
                          {selectedReview.replied && (
                            <div className="relative text-xs space-y-1 text-emerald-700">
                              <div className="absolute -left-[21px] mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                              <p className="font-bold">Support Reply Dispatched</p>
                              <p className="text-[10px] text-emerald-600/90 italic">"{selectedReview.reply_text}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Footer Action Console */}
                <div className="p-4 border-t bg-muted/5 flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider h-9"
                    onClick={() => {
                      setReplyText(selectedReview.replied ? selectedReview.reply_text || "" : "")
                      setIsReplyOpen(true)
                    }}
                    disabled={detailLoading}
                  >
                    <Reply className="mr-1.5 h-3.5 w-3.5" /> 
                    {selectedReview.replied ? "Update Reply" : "Reply to Rider"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50 text-blue-700 font-bold text-xs h-9 px-3"
                    onClick={() => setIsRefundOpen(true)}
                    disabled={detailLoading}
                  >
                    <DollarSign className="mr-1 h-3.5 w-3.5" /> Refund/Credit
                  </Button>
                  {selectedReview.status !== "resolved" && selectedReview.status !== "refunded" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-bold text-xs h-9 px-3"
                      onClick={handleResolveReview}
                      disabled={detailLoading}
                    >
                      <Check className="mr-1 h-3.5 w-3.5" /> Resolve
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-card border-none">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Star className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground">Select a Review</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2 leading-relaxed">
                  Choose a review card from the feed stream to trigger a customer reply, compliance flag, or wallet refund.
                </p>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Reply Modal */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="sm:max-w-[425px] border-border bg-card">
          <DialogHeader>
            <DialogTitle>Send Customer Feedback Response</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              This message will be dispatched via SMS and Mobile Push notification to {selectedReview?.passenger_name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReply} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Rider Recipient</label>
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between text-xs">
                <span className="font-bold">{selectedReview?.passenger_name}</span>
                <span className="font-mono text-muted-foreground">{selectedReview?.passenger_phone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="replyContent" className="text-[10px] font-bold uppercase text-muted-foreground">Message Body</label>
              <Textarea 
                id="replyContent"
                placeholder="Type your support message here..."
                className="min-h-[100px] text-xs"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReplyOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-wider text-xs">
                <Send className="h-3.5 w-3.5" /> Dispatch Reply
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Refund Credit Modal */}
      <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
        <DialogContent className="sm:max-w-[400px] border-border bg-card">
          <DialogHeader>
            <DialogTitle>Authorize Support Wallet Credit</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Credit a recovery bonus directly to the rider's wallet balance as goodwill compensation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRefund} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Rider Recipient</label>
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between text-xs">
                <span className="font-bold">{selectedReview?.passenger_name}</span>
                <span className="font-mono text-muted-foreground">{selectedReview?.passenger_phone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="refundAmountInput" className="text-[10px] font-bold uppercase text-muted-foreground">Recovery Amount (₦)</label>
              <Input 
                id="refundAmountInput"
                type="number"
                min="100"
                max="5000"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRefundOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-50 text-white font-bold uppercase tracking-wider text-xs">
                Authorize Credit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
