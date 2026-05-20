"use client"

import * as React from "react"
import { 
  Calendar as CalendarIcon,
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Trash2, 
  ArrowLeftRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Play,
  Pause,
  Info,
  Layers,
  Activity,
  Award,
  Users,
  Bus,
  UserCheck,
  Loader2,
  AlertCircle
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { routesApi, RouteItem } from "@/lib/api/routes"
import { schedulesApi, ScheduleItem } from "@/lib/api/schedules"

// Helper time converters between 12-hour AM/PM and 24-hour HH:MM
const convertTo24Hour = (timeStr: string) => {
  if (!timeStr) return "08:00"
  if (timeStr.includes(":") && !timeStr.toUpperCase().includes("AM") && !timeStr.toUpperCase().includes("PM")) {
    return timeStr.trim()
  }
  const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i)
  if (!match) return "08:00"
  let hours = parseInt(match[1], 10)
  const minutes = match[2]
  const ampm = match[3].toUpperCase()
  if (ampm === "PM" && hours < 12) hours += 12
  if (ampm === "AM" && hours === 12) hours = 0
  return `${hours.toString().padStart(2, "0")}:${minutes}`
}

const convertTo12Hour = (time24: string) => {
  if (!time24) return "08:00 AM"
  const [hStr, mStr] = time24.split(":")
  let hours = parseInt(hStr, 10)
  const minutes = mStr || "00"
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // 0 becomes 12
  return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`
}

const getEndTimeFor24h = (start24: string) => {
  if (!start24) return "09:30"
  const [hStr, mStr] = start24.split(":")
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  
  // Add 1 hour and 30 minutes duration for visual slotting
  const newMinutes = (m + 30) % 60
  const carryHour = Math.floor((m + 30) / 60)
  const newHour = (h + 1 + carryHour) % 24
  
  return `${newHour.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const WEEKDAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const WEEKDAY_INIT = ["M", "T", "W", "T", "F", "S", "S"]

const PRESET_BUSES = [
  { id: "BUS-101", name: "M-04 (Toyota Coaster - 22 Seats)" },
  { id: "BUS-102", name: "M-11 (Hyundai County - 18 Seats)" },
  { id: "BUS-103", name: "M-02 (Toyota HiAce - 14 Seats)" },
  { id: "BUS-104", name: "M-09 (Toyota Coaster - 22 Seats)" }
]

const PRESET_DRIVERS = [
  { id: "DRV-201", name: "Abubakar Garba (Senior Pilot)" },
  { id: "DRV-202", name: "John Bello (Standard Pilot)" },
  { id: "DRV-203", name: "Emeka Okoro (Senior Pilot)" },
  { id: "DRV-204", name: "Blessing Harrison (Standard Pilot)" }
]

export default function FleetSchedulesPage() {
  // Real database entities state
  const [routesList, setRoutesList] = React.useState<RouteItem[]>([])
  const [schedules, setSchedules] = React.useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // Split-screen editor/details states
  const [selectedScheduleId, setSelectedScheduleId] = React.useState<string | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)

  // Editor form states
  const [formRouteId, setFormRouteId] = React.useState("")
  const [formDirection, setFormDirection] = React.useState<"to" | "from" >("to")
  const [formStartTime, setFormStartTime] = React.useState("08:00")
  const [formDaysOfWeek, setFormDaysOfWeek] = React.useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
  const [formIsActive, setFormIsActive] = React.useState(true)

  // Local illustrative assignments (stored locally on client)
  const [formMonitorName, setFormMonitorName] = React.useState("Officer Abubakar")
  const [formBusId, setFormBusId] = React.useState("BUS-101")
  const [formDriverId, setFormDriverId] = React.useState("DRV-201")

  // Calendar states
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date("2026-05-18"))
  const [calendarView, setCalendarView] = React.useState<"day" | "week" | "month" | "year">("day")
  const [currentTime, setCurrentTime] = React.useState(new Date())

  const calendarScrollRef = React.useRef<HTMLDivElement>(null)

  // Fetch real backend data
  const loadData = async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      
      const [routesRes, schedulesRes] = await Promise.all([
        routesApi.getRoutesList(),
        schedulesApi.getSchedules()
      ])

      if (routesRes.success && routesRes.data) {
        setRoutesList(routesRes.data)
        if (routesRes.data.length > 0) {
          setFormRouteId(routesRes.data[0].id)
        }
      }
      
      if (schedulesRes.success && schedulesRes.data) {
        setSchedules(schedulesRes.data)
      } else {
        // Fallback simulated data if empty database list
        setSchedules(getMockFallbackSchedules())
      }
    } catch (err: any) {
      console.error("Scheduler fetch error:", err)
      setErrorMessage("Operations database unavailable. Displaying simulated logistics schedules.")
      setSchedules(getMockFallbackSchedules())
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  // Real-time ticking for red vertical marker
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Scroll to active range (6:00 AM)
  React.useEffect(() => {
    if (calendarScrollRef.current) {
      calendarScrollRef.current.scrollTop = 360
    }
  }, [])

  // Mock Fallbacks
  function getMockFallbackSchedules(): ScheduleItem[] {
    return [
      {
        id: "sch-1",
        routeId: "6a0b4a66fe0f0092c1bdb258",
        direction: "to",
        departureTime: "06:30 AM",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        isActive: true,
        routeName: "Lekki - Ajah Express"
      },
      {
        id: "sch-2",
        routeId: "6a0b4a66fe0f0092c1bdb258",
        direction: "from",
        departureTime: "05:00 PM",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        isActive: true,
        routeName: "Lekki - Ajah Express"
      }
    ]
  }

  // Helper calendar constants & methods
  const HOURS = Array.from({ length: 24 }, (_, i) => i)

  const formatHourLabel = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
  }

  const formatTimeRange = (start: string, end: string) => {
    const parseTime = (tStr: string) => {
      if (!tStr) return ""
      const [h, m] = tStr.split(":").map(Number)
      const ampm = h >= 12 ? "PM" : "AM"
      const displayH = h % 12 === 0 ? 12 : h % 12
      return `${displayH}:${m.toString().padStart(2, '0')}${ampm}`
    }
    return `${parseTime(start)} - ${parseTime(end)}`
  }

  const getPeakColorClasses = (type: string) => {
    switch (type) {
      case "Morning":
        return "bg-indigo-50/95 text-indigo-700 border-indigo-200 border-l-4 border-l-indigo-600 hover:bg-indigo-100/50 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800"
      case "Evening":
        return "bg-emerald-50/95 text-emerald-700 border-emerald-200 border-l-4 border-l-emerald-600 hover:bg-emerald-100/50 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800"
      case "Off-Peak":
        return "bg-slate-50/95 text-slate-700 border-slate-200 border-l-4 border-l-slate-600 hover:bg-slate-100/50 dark:bg-slate-900/40 dark:text-slate-200"
      case "Night":
        return "bg-violet-50/95 text-violet-700 border-violet-200 border-l-4 border-l-violet-600 hover:bg-violet-100/50 dark:bg-violet-950/40"
      default:
        return "bg-blue-50/95 text-blue-700 border-blue-200 border-l-4 border-l-blue-600 hover:bg-blue-100/50"
    }
  }

  const getPeakBadgeColor = (type: string) => {
    switch (type) {
      case "Morning":
        return "bg-indigo-500/10 text-indigo-700 border-indigo-500/20"
      case "Evening":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
      case "Off-Peak":
        return "bg-slate-500/10 text-slate-700 border-slate-500/20"
      case "Night":
        return "bg-violet-500/10 text-violet-700 border-violet-500/20"
      default:
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
    }
  }

  const formatCalendarDate = (date: Date) => {
    if (calendarView === "day") {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    } else if (calendarView === "week") {
      const start = calendarDays[0]
      const end = calendarDays[6]
      if (start && end) {
        if (start.getMonth() === end.getMonth()) {
          return `${start.toLocaleDateString("en-US", { month: "long" })} ${start.getFullYear()}`
        }
        return `${start.toLocaleDateString("en-US", { month: "short" })} - ${end.toLocaleDateString("en-US", { month: "short" })} ${end.getFullYear()}`
      }
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else if (calendarView === "month") {
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      })
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric"
      })
    }
  }

  const formatDateString = (date: Date) => {
    const y = date.getFullYear()
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Days calculations for Week View
  const calendarDays = React.useMemo(() => {
    if (calendarView === "day") {
      return [currentDate]
    }
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [currentDate, calendarView])

  // Month calculation days for Month View
  const monthDays = React.useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    const startPadding = firstDayOfMonth.getDay() 
    const days: Date[] = []
    
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i))
    }
    
    const totalDays = lastDayOfMonth.getDate()
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i))
    }
    
    const remainingPadding = 42 - days.length
    for (let i = 1; i <= remainingPadding; i++) {
      days.push(new Date(year, month + 1, i))
    }
    
    return days
  }, [currentDate])

  // Year months helper for Year View
  const yearMonths = React.useMemo(() => {
    const year = currentDate.getFullYear()
    return Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(year, i, 1)
      const firstDay = new Date(year, i, 1)
      const lastDay = new Date(year, i + 1, 0)
      const startPadding = firstDay.getDay()
      
      const days: (Date | null)[] = []
      for (let pad = 0; pad < startPadding; pad++) {
        days.push(null)
      }
      for (let dayNum = 1; dayNum <= lastDay.getDate(); dayNum++) {
        days.push(new Date(year, i, dayNum))
      }
      return {
        name: monthDate.toLocaleDateString("en-US", { month: "long" }),
        monthIndex: i,
        days
      }
    })
  }, [currentDate])

  const navigateNext = () => {
    const next = new Date(currentDate)
    if (calendarView === "day") {
      next.setDate(next.getDate() + 1)
    } else if (calendarView === "week") {
      next.setDate(next.getDate() + 7)
    } else if (calendarView === "month") {
      next.setMonth(next.getMonth() + 1)
    } else if (calendarView === "year") {
      next.setFullYear(next.getFullYear() + 1)
    }
    setCurrentDate(next)
  }

  const navigatePrev = () => {
    const prev = new Date(currentDate)
    if (calendarView === "day") {
      prev.setDate(prev.getDate() - 1)
    } else if (calendarView === "week") {
      prev.setDate(prev.getDate() - 7)
    } else if (calendarView === "month") {
      prev.setMonth(prev.getMonth() - 1)
    } else if (calendarView === "year") {
      prev.setFullYear(prev.getFullYear() - 1)
    }
    setCurrentDate(prev)
  }

  // Active Schedule item selection
  const selectedSchedule = React.useMemo(() => {
    return schedules.find(s => s.id === selectedScheduleId) || null
  }, [schedules, selectedScheduleId])

  const selectScheduleItem = (item: ScheduleItem) => {
    setSelectedScheduleId(item.id)
    setIsEditing(false)
  }

  // Actions
  const handleCreateButtonClick = () => {
    setSelectedScheduleId(null)
    setIsEditing(true)
    
    // Pre-fill defaults
    if (routesList.length > 0) {
      setFormRouteId(routesList[0].id)
    }
    setFormDirection("to")
    setFormStartTime("08:00")
    setFormDaysOfWeek(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
    setFormIsActive(true)
    
    // Illustrative monitors
    setFormMonitorName("Officer Abubakar")
    setFormBusId("BUS-101")
    setFormDriverId("DRV-201")
  }

  const handleEditActiveClick = () => {
    if (selectedSchedule) {
      setIsEditing(true)
      setFormRouteId(selectedSchedule.routeId)
      setFormDirection(selectedSchedule.direction)
      setFormStartTime(convertTo24Hour(selectedSchedule.departureTime))
      setFormDaysOfWeek(selectedSchedule.daysOfWeek)
      setFormIsActive(selectedSchedule.isActive)
      
      // Illustrative defaults
      setFormMonitorName("Officer Abubakar")
      setFormBusId("BUS-101")
      setFormDriverId("DRV-201")
    }
  }

  const handleDeleteActiveClick = async () => {
    if (!selectedScheduleId) return
    try {
      setIsSaving(true)
      setErrorMessage(null)

      if (selectedScheduleId.startsWith("sch-")) {
        // Simulated local deletion
        setSchedules(schedules.filter(s => s.id !== selectedScheduleId))
        setSelectedScheduleId(null)
        setIsEditing(false)
        return
      }

      const res = await schedulesApi.deleteSchedule(selectedScheduleId)
      if (res.success) {
        // reload
        const schedulesRes = await schedulesApi.getSchedules()
        if (schedulesRes.success && schedulesRes.data) {
          setSchedules(schedulesRes.data)
        }
        setSelectedScheduleId(null)
        setIsEditing(false)
      } else {
        throw new Error(res.message || "Failed to remove schedule.")
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage("Failed to remove active corridor schedule from server.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveForm = async () => {
    try {
      setIsSaving(true)
      setErrorMessage(null)

      if (!formRouteId) {
        throw new Error("Please select an active route corridor.")
      }
      if (formDaysOfWeek.length === 0) {
        throw new Error("Please select at least one day of the week for recurrence.")
      }

      const departure12h = convertTo12Hour(formStartTime)

      let res;
      if (selectedScheduleId && !selectedScheduleId.startsWith("sch-")) {
        res = await schedulesApi.updateSchedule(selectedScheduleId, {
          routeId: formRouteId,
          direction: formDirection,
          departureTime: departure12h,
          daysOfWeek: formDaysOfWeek,
          isActive: formIsActive
        })
      } else {
        res = await schedulesApi.createSchedule({
          routeId: formRouteId,
          direction: formDirection,
          departureTime: departure12h,
          daysOfWeek: formDaysOfWeek,
          isActive: formIsActive
        })
      }

      if (res.success && res.data) {
        // reload fresh list
        const schedulesRes = await schedulesApi.getSchedules()
        if (schedulesRes.success && schedulesRes.data) {
          setSchedules(schedulesRes.data)
        } else {
          // Local state update
          if (selectedScheduleId) {
            setSchedules(schedules.map(s => s.id === selectedScheduleId ? { ...s, routeId: formRouteId, direction: formDirection, departureTime: departure12h, daysOfWeek: formDaysOfWeek, isActive: formIsActive } : s))
          } else {
            setSchedules([...schedules, { ...res.data, routeName: routesList.find(r => r.id === formRouteId)?.name }])
          }
        }
        setIsEditing(false)
        setSelectedScheduleId(res.data.id)
      } else {
        throw new Error(res.message || "Invalid database response.")
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "Failed to commit schedule properties.")
    } finally {
      setIsSaving(false)
    }
  }

  // Grid hourly catcher helper
  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const totalMinutes = clickY

    let hour = Math.floor(totalMinutes / 60)
    let minute = Math.floor((totalMinutes % 60) / 15) * 15

    if (hour < 0) hour = 0
    if (hour > 23) hour = 23

    const startTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    
    let clickDayName = currentDate.toLocaleDateString("en-US", { weekday: "long" })

    if (calendarView === "week") {
      const clickX = e.clientX - rect.left
      const colWidth = rect.width / 7
      const colIdx = Math.floor(clickX / colWidth)
      if (colIdx >= 0 && colIdx < 7) {
        clickDayName = calendarDays[colIdx].toLocaleDateString("en-US", { weekday: "long" })
      }
    }

    setSelectedScheduleId(null)
    setIsEditing(true)
    
    if (routesList.length > 0) {
      setFormRouteId(routesList[0].id)
    }
    setFormDirection("to")
    setFormStartTime(startTimeStr)
    setFormDaysOfWeek([clickDayName])
    setFormIsActive(true)
    setFormMonitorName("Officer Abubakar")
    setFormBusId("BUS-101")
    setFormDriverId("DRV-201")
  }

  // Today marker metrics
  const isViewingToday = React.useMemo(() => {
    const todayStr = "2026-05-18"
    if (calendarView === "day") {
      return formatDateString(currentDate) === todayStr
    } else {
      return calendarDays.some(d => formatDateString(d) === todayStr)
    }
  }, [currentDate, calendarView, calendarDays])

  const currentRedLineTop = React.useMemo(() => {
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    return (hours * 60) + minutes
  }, [currentTime])

  const stats = React.useMemo(() => {
    const active = schedules.filter(s => s.isActive).length
    return { active, total: schedules.length }
  }, [schedules])

  return (
    <div className="space-y-6 pt-4 pb-20">
      
      {/* Header Panel */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" /> Fleet Scheduler Command
            </h1>
            <Badge variant="outline" className="h-5 bg-primary/10 text-primary font-bold uppercase text-[9px] px-2 border-primary/20">
              Operations Hub
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium pl-0.5">
            Orchestrate daily corridor runs, schedule drivers/vehicles, and assign monitor supervisors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateButtonClick}
            disabled={isLoading || isSaving}
            className="h-10 px-5 font-bold text-xs bg-primary shadow hover:bg-primary/90 flex items-center gap-2 rounded-lg text-white"
          >
            <Plus className="h-4 w-4" /> Create Schedule
          </Button>
        </div>
      </div>

      {/* API Feedback banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold flex items-center gap-2 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Split Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
         
         {/* Left 8 Columns: Visual Calendar Panel */}
         <div className="lg:col-span-8 space-y-4">
            <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
               
               {/* Grid Header & Controls */}
               <div className="p-4 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-muted/20">
                  <div className="flex items-center gap-2">
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentDate(new Date("2026-05-18"))}
                        className="h-8 text-xs font-bold border-border"
                     >
                        Today
                     </Button>
                     <div className="flex items-center">
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           onClick={navigatePrev}
                           className="h-8 w-8 rounded-full"
                        >
                           <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           onClick={navigateNext}
                           className="h-8 w-8 rounded-full"
                        >
                           <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Button>
                     </div>
                     <span className="text-sm font-bold pl-2 text-foreground">
                        {formatCalendarDate(currentDate)}
                     </span>
                  </div>
                  <div className="flex items-center gap-1.5 self-end">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background p-0.5 shadow-sm">
                         {["day", "week", "month", "year"].map((v: any) => (
                            <button
                               key={v}
                               type="button"
                               onClick={() => setCalendarView(v)}
                               className={`px-3 py-1 text-xs font-bold rounded-md transition-all uppercase tracking-wider text-[9px] ${
                                  calendarView === v 
                                    ? "bg-primary text-white shadow-sm" 
                                    : "text-muted-foreground hover:text-foreground"
                               }`}
                            >
                               {v}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Loading overlay */}
                {isLoading ? (
                  <div className="h-[520px] flex flex-col items-center justify-center gap-3">
                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     <p className="text-xs text-muted-foreground font-semibold">Synchronizing with Logistics API...</p>
                  </div>
                ) : (
                  <>
                    {/* Day & Week View Ticks */}
                    {(calendarView === "day" || calendarView === "week") && (
                       <>
                          <div className="grid grid-cols-[80px_1fr] border-b border-border/50 bg-muted/10">
                             <div className="border-r border-border/50 py-3 flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                GMT+01
                             </div>
                             <div className={`grid ${calendarView === "day" ? "grid-cols-1" : "grid-cols-7"} divide-x divide-border/50`}>
                                {calendarDays.map((day, idx) => {
                                   const isToday = formatDateString(day) === "2026-05-18"
                                   return (
                                      <div key={idx} className="py-3 flex flex-col items-center justify-center gap-1">
                                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            {day.toLocaleDateString("en-US", { weekday: "short" })}
                                         </span>
                                         <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            isToday 
                                              ? "bg-primary text-white shadow-sm ring-2 ring-primary/20 animate-pulse" 
                                              : "text-muted-foreground hover:bg-muted/50"
                                         }`}>
                                            {day.getDate()}
                                         </div>
                                      </div>
                                   )
                                })}
                             </div>
                          </div>

                          <div className="h-[520px] overflow-y-auto relative grid grid-cols-[80px_1fr]" ref={calendarScrollRef}>
                             
                             {/* Hour labels */}
                             <div className="border-r border-border/50 bg-muted/5 relative">
                                {HOURS.map((hour) => (
                                   <div 
                                      key={hour} 
                                      className="h-[60px] border-b border-border/20 pr-3 flex items-start justify-end pt-1.5 text-[10px] font-bold text-muted-foreground"
                                   >
                                      {formatHourLabel(hour)}
                                   </div>
                                ))}
                             </div>

                             {/* Visual columns and schedule items */}
                             <div className="relative">
                                {HOURS.map((hour) => (
                                   <div key={hour} className="h-[60px] border-b border-border/20 pointer-events-none w-full" />
                                ))}

                                {/* Click grid catcher */}
                                <div className="absolute inset-0 z-0 cursor-pointer text-foreground" onClick={handleGridClick} />

                                {/* Live Time Indicator */}
                                {isViewingToday && (
                                   <div 
                                      className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                                      style={{ top: `${currentRedLineTop}px` }}
                                   >
                                      <div className="h-2 w-2 rounded-full bg-rose-500 -ml-1 border border-background shadow" />
                                      <div className="h-[1.5px] flex-1 bg-rose-500" />
                                    </div>
                                )}

                                {/* Plotted Schedule Blocks */}
                                <div className={`absolute inset-0 z-10 grid ${calendarView === "day" ? "grid-cols-1" : "grid-cols-7"} divide-x divide-border/20 h-full pointer-events-none`}>
                                   {calendarDays.map((day, colIdx) => {
                                      const dayStr = formatDateString(day)
                                      const dayOfWeekName = day.toLocaleDateString("en-US", { weekday: "long" })
                                      
                                      const daySchedules = schedules.filter(s => {
                                        return s.daysOfWeek && s.daysOfWeek.includes(dayOfWeekName)
                                      })

                                      return (
                                         <div key={colIdx} className="relative h-full">
                                            {daySchedules.map((item) => {
                                               const start24 = convertTo24Hour(item.departureTime)
                                               const end24 = getEndTimeFor24h(start24)

                                               const [sh, sm] = start24.split(":").map(Number)
                                               const [eh, em] = end24.split(":").map(Number)
                                               
                                               const top = (sh * 60) + sm
                                               const duration = ((eh * 60) + em) - top
                                               const height = Math.max(65, duration)

                                               const peakGroup = sh < 12 ? "Morning" : sh >= 16 && sh < 20 ? "Evening" : sh >= 20 || sh < 6 ? "Night" : "Off-Peak"
                                               const colorClasses = getPeakColorClasses(peakGroup)
                                               const isSelected = selectedScheduleId === item.id

                                               const matchedRouteName = item.routeName || routesList.find(r => r.id === item.routeId)?.name || "Lekki - Ajah Corridor"

                                               return (
                                                  <div
                                                     key={item.id}
                                                     onClick={(e) => {
                                                        e.stopPropagation()
                                                        selectScheduleItem(item)
                                                     }}
                                                     style={{ 
                                                        top: `${top}px`, 
                                                        height: `${height}px`,
                                                     }}
                                                     className={`absolute left-1.5 right-1.5 rounded-lg border p-2.5 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 pointer-events-auto ${colorClasses} ${
                                                        isSelected 
                                                          ? "ring-2 ring-primary border-primary scale-[1.01]" 
                                                          : "hover:scale-[1.005] opacity-95"
                                                     } ${!item.isActive ? "opacity-45 border-dashed border-slate-300" : ""}`}
                                                  >
                                                     <div className="min-w-0">
                                                        <div className="flex items-center justify-between gap-1">
                                                           <p className="text-[10px] font-extrabold truncate leading-tight uppercase tracking-wider text-slate-800">
                                                              {matchedRouteName}
                                                           </p>
                                                           {!item.isActive && (
                                                              <span className="text-[7px] bg-slate-500/20 text-slate-600 font-bold px-1 rounded uppercase tracking-wide">Offline</span>
                                                           )}
                                                        </div>
                                                        <p className="text-[8px] font-bold opacity-80 truncate mt-0.5 flex items-center gap-1 uppercase tracking-wider">
                                                           <MapPin className="h-2.5 w-2.5 shrink-0 opacity-70 text-primary" /> 
                                                           Direction: {item.direction === "to" ? "Outbound Hub" : "Inbound Return"}
                                                        </p>
                                                        
                                                        {/* Optional illustrators */}
                                                        <div className="text-[7.5px] font-bold uppercase mt-1.5 flex flex-wrap items-center gap-1 opacity-90 border-t border-current/10 pt-1 text-slate-500">
                                                           <span>🚌 M-04 (Toyota Coaster)</span>
                                                           <span>👤 Pilot: Abubakar</span>
                                                        </div>
                                                     </div>
                                                     <div className="flex items-center justify-between text-[8px] font-bold mt-1 opacity-90 pt-1 border-t border-dashed border-current/10 text-slate-600">
                                                        <span className="truncate max-w-[80px]">👮 Officer Abubakar</span>
                                                        <span>{formatTimeRange(start24, end24)}</span>
                                                     </div>
                                                  </div>
                                               )
                                            })}
                                         </div>
                                      )
                                   })}
                                </div>
                             </div>
                          </div>
                       </>
                    )}

                    {/* Month View Grid */}
                    {calendarView === "month" && (
                       <div className="flex flex-col">
                          <div className="grid grid-cols-7 border-b border-border bg-muted/10">
                             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                                <div key={dayName} className="py-2.5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-r border-border/10 last:border-r-0">
                                   {dayName}
                                </div>
                             ))}
                          </div>
                          
                          <div className="grid grid-cols-7 divide-x divide-y divide-border/40 border-b border-border min-h-[520px]">
                             {monthDays.map((day, idx) => {
                                const dayStr = formatDateString(day)
                                const dayOfWeekName = day.toLocaleDateString("en-US", { weekday: "long" })
                                const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                                const isToday = dayStr === "2026-05-18"
                                
                                const daySchedules = schedules.filter(s => {
                                  return s.daysOfWeek && s.daysOfWeek.includes(dayOfWeekName)
                                })
                                
                                return (
                                   <div 
                                      key={idx} 
                                      onClick={() => {
                                         setCurrentDate(day)
                                         handleCreateButtonClick()
                                         setFormDaysOfWeek([dayOfWeekName])
                                      }}
                                      className={`min-h-[90px] p-2 flex flex-col justify-between hover:bg-muted/10 cursor-pointer transition-all ${
                                         isCurrentMonth ? "bg-card" : "bg-muted/5 opacity-45"
                                      }`}
                                   >
                                      <div className="flex items-center justify-between">
                                         <span className={`text-[10px] font-extrabold rounded-full h-5 w-5 flex items-center justify-center ${
                                            isToday 
                                              ? "bg-primary text-white shadow-sm font-black ring-2 ring-primary/20 animate-pulse" 
                                              : "text-muted-foreground"
                                         }`}>
                                            {day.getDate()}
                                         </span>
                                         {daySchedules.length > 0 && (
                                            <span className="text-[7.5px] bg-primary/10 text-primary font-bold px-1.5 rounded-full uppercase tracking-tight">
                                               {daySchedules.length} Run{daySchedules.length > 1 ? "s" : ""}
                                            </span>
                                         )}
                                      </div>
                                      
                                      <div className="space-y-1 mt-2 max-h-[60px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                         {daySchedules.map((item) => {
                                            const start24 = convertTo24Hour(item.departureTime)
                                            const [sh] = start24.split(":").map(Number)
                                            const peakGroup = sh < 12 ? "Morning" : sh >= 16 && sh < 20 ? "Evening" : sh >= 20 || sh < 6 ? "Night" : "Off-Peak"
                                            
                                            const badgeStyle = getPeakBadgeColor(peakGroup)
                                            const isSelected = selectedScheduleId === item.id
                                            const routeDisplayName = item.routeName || routesList.find(r => r.id === item.routeId)?.name || "Express Run"
                                            
                                            return (
                                               <div
                                                  key={item.id}
                                                  onClick={(e) => {
                                                     e.stopPropagation()
                                                     selectScheduleItem(item)
                                                  }}
                                                  className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded border truncate flex items-center justify-between gap-1 transition-all ${badgeStyle} ${
                                                     isSelected ? "ring-1 ring-primary border-primary scale-[1.02]" : "hover:scale-[1.01]"
                                                  }`}
                                               >
                                                  <span className="truncate flex-1 uppercase tracking-wider">{routeDisplayName}</span>
                                                  <span className="shrink-0 opacity-70 text-[7px] font-bold">{item.departureTime.split(" ")[0]}</span>
                                               </div>
                                            )
                                         })}
                                      </div>
                                   </div>
                                )
                             })}
                          </div>
                       </div>
                    )}

                    {/* Year View Grid */}
                    {calendarView === "year" && (
                       <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-muted/5 min-h-[520px] overflow-y-auto">
                          {yearMonths.map((mObj, mIdx) => {
                             const hasActiveRuns = schedules.length > 0
                             
                             return (
                                <div 
                                   key={mIdx} 
                                   className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3 hover:shadow-md transition-all"
                                >
                                   <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                      <button 
                                         type="button"
                                         onClick={() => {
                                            const newDate = new Date(currentDate)
                                            newDate.setMonth(mObj.monthIndex)
                                            setCurrentDate(newDate)
                                            setCalendarView("month")
                                         }}
                                         className="text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary hover:underline flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer"
                                      >
                                         📅 {mObj.name}
                                      </button>
                                      {hasActiveRuns && (
                                         <span className="h-2 w-2 rounded-full bg-emerald-500 shadow animate-pulse" />
                                      )}
                                   </div>
                                   
                                   <div className="grid grid-cols-7 text-center gap-y-1">
                                      {["S", "M", "T", "W", "T", "F", "S"].map((dLabel, dIdx) => (
                                         <span key={dIdx} className="text-[8px] font-bold text-muted-foreground">{dLabel}</span>
                                      ))}
                                      
                                      {mObj.days.map((dayObj, dIdx) => {
                                         if (!dayObj) return <span key={dIdx} className="text-[9px]" />
                                         
                                         const dayStr = formatDateString(dayObj)
                                         const dayOfWeekName = dayObj.toLocaleDateString("en-US", { weekday: "long" })
                                         const isToday = dayStr === "2026-05-18"
                                         
                                         const hasRuns = schedules.some(s => s.daysOfWeek && s.daysOfWeek.includes(dayOfWeekName))
                                         
                                         return (
                                            <button
                                               key={dIdx}
                                               type="button"
                                               onClick={() => {
                                                  setCurrentDate(dayObj)
                                                  setCalendarView("day")
                                               }}
                                               className={`text-[9px] font-semibold h-4 w-4 rounded-full flex items-center justify-center mx-auto transition-all ${
                                                  isToday 
                                                    ? "bg-primary text-white font-extrabold shadow-sm ring-2 ring-primary/20"
                                                    : hasRuns
                                                    ? "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30"
                                                    : "text-muted-foreground/80 hover:bg-muted"
                                               }`}
                                            >
                                               {dayObj.getDate()}
                                            </button>
                                         )
                                      })}
                                   </div>
                                </div>
                             )
                          })}
                       </div>
                    )}
                  </>
                )}
             </div>
          </div>

         {/* Right 4 Columns: Context Panel (Schedules Details / Editor) */}
         <div className="lg:col-span-4 space-y-6">
            
            {/* Context Header */}
            <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden border-t-4 border-t-primary">
               
               {isEditing ? (
                  /* EDITOR PANEL MODE */
                  <>
                     <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                           <Layers className="h-4 w-4 text-primary" /> {selectedScheduleId ? "Edit Corridor Run" : "Schedule Corridor Run"}
                        </CardTitle>
                        <CardDescription className="text-[11px] font-medium">Configure route timing and supervisor allocation.</CardDescription>
                     </CardHeader>
                     
                     <CardContent className="p-6 space-y-4">
                        
                        {/* Route Select dropdown */}
                        <div className="space-y-1.5">
                           <Label className="text-[10px] font-bold uppercase text-muted-foreground">Select Active Corridor Route</Label>
                           <Select value={formRouteId} onValueChange={setFormRouteId}>
                              <SelectTrigger className="h-10 text-xs font-semibold border-border bg-muted/20 text-foreground">
                                 <SelectValue placeholder="Select Route Corridor..." />
                              </SelectTrigger>
                              <SelectContent>
                                 {routesList.map(route => (
                                    <SelectItem key={route.id} value={route.id} className="text-xs font-semibold">
                                       {route.name} ({route.code})
                                    </SelectItem>
                                 ))}
                                 {routesList.length === 0 && (
                                    <SelectItem value="RT-fallback" disabled className="text-xs font-medium">No active routes found</SelectItem>
                                 )}
                              </SelectContent>
                           </Select>
                        </div>

                        {/* Direction Segmented Control Outbound/Inbound */}
                        <div className="space-y-1.5">
                           <Label className="text-[10px] font-bold uppercase text-muted-foreground">Operational Direction</Label>
                           <div className="grid grid-cols-2 gap-2 p-1 bg-muted/20 border border-border rounded-xl">
                              <Button
                                 type="button"
                                 variant={formDirection === "to" ? "default" : "ghost"}
                                 size="sm"
                                 onClick={() => setFormDirection("to")}
                                 className="h-8 text-[10px] font-bold rounded-lg uppercase tracking-wider"
                              >
                                 Outbound (To Hub)
                              </Button>
                              <Button
                                 type="button"
                                 variant={formDirection === "from" ? "default" : "ghost"}
                                 size="sm"
                                 onClick={() => setFormDirection("from")}
                                 className="h-8 text-[10px] font-bold rounded-lg uppercase tracking-wider"
                              >
                                 Inbound (Return)
                              </Button>
                           </div>
                        </div>

                        {/* Timing Block */}
                        <div className="space-y-1.5">
                           <Label className="text-[10px] font-bold uppercase text-muted-foreground">Departure Time (24h clock)</Label>
                           <Input 
                              type="time"
                              value={formStartTime}
                              onChange={(e) => setFormStartTime(e.target.value)}
                              className="h-10 text-xs font-bold border-border bg-background text-foreground"
                           />
                           <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">
                              Converts automatically to: <span className="font-extrabold text-primary">{convertTo12Hour(formStartTime)}</span> database string format.
                           </p>
                        </div>

                        {/* Weekday capsules checklist */}
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase text-muted-foreground">Recurrence Days</Label>
                           <div className="flex justify-between items-center gap-1 p-2 bg-muted/25 border border-border rounded-xl">
                              {WEEKDAYS.map((day, idx) => {
                                 const isSelected = formDaysOfWeek.includes(day)
                                 return (
                                    <button
                                       key={day}
                                       type="button"
                                       onClick={() => {
                                          if (formDaysOfWeek.includes(day)) {
                                             if (formDaysOfWeek.length > 1) {
                                                setFormDaysOfWeek(formDaysOfWeek.filter(d => d !== day))
                                             }
                                          } else {
                                             setFormDaysOfWeek([...formDaysOfWeek, day])
                                          }
                                       }}
                                       className={`h-7 w-7 rounded-full text-[9px] font-bold border transition-all flex items-center justify-center ${
                                          isSelected 
                                            ? "bg-primary text-white border-primary shadow-sm" 
                                            : "bg-background text-muted-foreground border-border hover:bg-muted"
                                       }`}
                                       title={day}
                                    >
                                       {WEEKDAY_INIT[idx]}
                                    </button>
                                 )
                              })}
                           </div>
                        </div>

                        {/* Status Active toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10">
                           <div className="space-y-0.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Schedule Online Status</p>
                              <p className="text-[9px] text-muted-foreground font-medium">Passenger bookings use this status.</p>
                           </div>
                           <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                           <Button 
                              onClick={handleSaveForm}
                              disabled={isSaving}
                              className="flex-1 h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-lg"
                           >
                              {isSaving ? (
                                 <Loader2 className="h-4 w-4 animate-spin mx-auto text-white" />
                              ) : selectedScheduleId ? (
                                 "Update Configuration"
                              ) : (
                                 "Deploy Schedule"
                              )}
                           </Button>
                           <Button 
                              variant="outline"
                              onClick={() => {
                                 setIsEditing(false)
                              }}
                              className="h-10 text-xs font-bold border-border rounded-lg"
                           >
                              Cancel
                           </Button>
                        </div>
                     </CardContent>
                  </>
               ) : selectedSchedule ? (
                  /* SCHEDULE DETAILS DISPLAY MODE */
                  <>
                     <CardHeader className="border-b border-border bg-muted/20">
                        <div className="flex items-center justify-between">
                           <Badge variant="outline" className="h-5 text-[8px] font-bold uppercase border-none px-2 shrink-0 bg-primary/10 text-primary">
                              Corridor Schedule
                           </Badge>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-muted-foreground">{selectedSchedule.isActive ? "ONLINE" : "OFFLINE"}</span>
                              <Switch 
                                 checked={selectedSchedule.isActive} 
                                 onCheckedChange={async (v) => {
                                    try {
                                       setSchedules(schedules.map(s => s.id === selectedSchedule.id ? { ...s, isActive: v } : s))
                                       if (!selectedSchedule.id.startsWith("sch-")) {
                                          await schedulesApi.updateSchedule(selectedSchedule.id, { isActive: v })
                                       }
                                    } catch (err) {
                                       console.error(err)
                                    }
                                 }}
                                 className="scale-75"
                              />
                           </div>
                        </div>
                        <CardTitle className="text-base font-bold leading-tight text-foreground pt-3">
                           {selectedSchedule.routeName || routesList.find(r => r.id === selectedSchedule.routeId)?.name || "Lekki - Ajah Corridor Express"}
                        </CardTitle>
                        <CardDescription className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                           Identifier: {selectedSchedule.id}
                        </CardDescription>
                     </CardHeader>

                     <CardContent className="p-6 space-y-6">
                        
                        <div className="space-y-4">
                           <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/5">
                              <MapPin className="h-4 w-4 text-primary mt-0.5" />
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-bold uppercase text-muted-foreground">Route Directional Sector</p>
                                 <p className="text-xs font-semibold text-foreground uppercase tracking-wider text-[10px]">
                                    {selectedSchedule.direction === "to" ? "➡️ Outbound (To Hub)" : "⬅️ Inbound (Return)"}
                                 </p>
                              </div>
                           </div>

                           <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/5">
                              <Clock className="h-4 w-4 text-primary mt-0.5" />
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-bold uppercase text-muted-foreground">Timing Parameters</p>
                                 <p className="text-xs font-extrabold text-primary">
                                    {selectedSchedule.departureTime} Departure
                                 </p>
                                 <div className="flex flex-wrap gap-1 mt-1.5">
                                    {selectedSchedule.daysOfWeek?.map((day) => (
                                       <Badge key={day} variant="outline" className="text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wide bg-background">
                                          {day.substring(0, 3)}
                                       </Badge>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/5">
                              <User className="h-4 w-4 text-primary mt-0.5" />
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-bold uppercase text-muted-foreground">Monitor Supervisor</p>
                                 <p className="text-xs font-semibold text-foreground">Officer Abubakar</p>
                                 <span className="text-[9px] text-emerald-600 font-bold uppercase flex items-center gap-1 mt-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected to operations comms
                                 </span>
                              </div>
                           </div>
                        </div>

                        {/* Dynamic operational status intelligence panel */}
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                           <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-primary animate-pulse" />
                              <h4 className="text-[10px] font-extrabold uppercase text-primary">Logistics Intelligence</h4>
                           </div>
                           <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                              This schedule recurrence operates on <span className="font-extrabold text-foreground">{selectedSchedule.daysOfWeek?.length} week days</span>. Passenger booking holds are updated in real-time. Associated trips automatically instantiate at <span className="font-extrabold text-foreground">{selectedSchedule.departureTime}</span> under the command panel of assigned pilot Abubakar.
                           </p>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                           <Button 
                              onClick={handleEditActiveClick}
                              className="flex-1 h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-lg"
                           >
                              Edit Schedule Details
                           </Button>
                           <Button 
                              variant="outline"
                              onClick={handleDeleteActiveClick}
                              className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 border-border rounded-lg flex items-center justify-center"
                              title="Delete schedule run"
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     </CardContent>
                  </>
               ) : (
                  /* IDLE / EMPTY STATE MODE */
                  <>
                     <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                           <Award className="h-4 w-4 text-primary" /> Fleet Logistics Intelligence
                        </CardTitle>
                        <CardDescription className="text-[11px] font-medium">Operational overview and scheduling stats.</CardDescription>
                     </CardHeader>

                     <CardContent className="p-6 space-y-6">
                        
                        <div className="grid grid-cols-2 gap-2">
                           <div className="p-3 rounded-lg border border-border/60 bg-muted/10 text-center">
                              <p className="text-[8px] font-bold text-muted-foreground uppercase">Active Schedules</p>
                              <p className="text-xl font-bold pt-1">{stats.active} <span className="text-[10px] text-muted-foreground font-medium">/ {stats.total}</span></p>
                           </div>
                           <div className="p-3 rounded-lg border border-border/60 bg-muted/10 text-center">
                              <p className="text-[8px] font-bold text-muted-foreground uppercase">Monitors Active</p>
                              <p className="text-xl font-bold pt-1">1</p>
                           </div>
                        </div>

                        <div className="p-4 rounded-xl border border-border/60 bg-muted/5 space-y-2">
                           <div className="flex items-center gap-1 text-primary">
                              <Info className="h-3.5 w-3.5" />
                              <p className="text-[10px] font-extrabold uppercase">Scheduling Tips</p>
                           </div>
                           <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                              Select any schedule run block on the calendar grid to view detailed route links, assign supervisors, and modify operational times.
                           </p>
                           <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                              You can also <span className="font-bold text-primary">click any empty cell on the hourly grid</span> to quickly snap and pre-fill a schedule for that day and hour!
                           </p>
                        </div>

                        <div className="pt-2">
                           <Button
                              onClick={handleCreateButtonClick}
                              className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2"
                           >
                              <Plus className="h-4 w-4" /> Create Route Schedule
                           </Button>
                        </div>
                     </CardContent>
                  </>
               )}
            </Card>

            {/* Quick System Logic Badge */}
            <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 space-y-2">
               <div className="flex items-center gap-2 text-amber-500">
                  <ShieldAlert className="h-4 w-4" />
                  <h4 className="text-[10px] font-bold uppercase">Corridor Logic Notification</h4>
               </div>
               <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                  Schedules linked to deactivated routes will automatically pause passenger booking. Assigned monitors are notified immediately via their mobile operational panels when their runs start.
               </p>
            </div>
         </div>
      </div>
    </div>
  )
}
