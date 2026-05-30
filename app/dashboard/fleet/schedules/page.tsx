"use client"

import * as React from "react"
import { 
  Calendar as CalendarIcon,
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Bus as BusIcon,
  UserCheck,
  Layers
} from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { routesApi, RouteItem } from "@/lib/api/routes"
import { schedulesApi, ScheduleItem } from "@/lib/api/schedules"
import { driverApi, Driver } from "@/lib/api/drivers"
import { fleetApi, Bus } from "@/lib/api/fleet"

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

const getPeakColorClasses = (peakGroup: string) => {
  switch (peakGroup) {
    case "Morning":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50"
    case "Evening":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
    case "Night":
      return "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900/50"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800/50"
  }
}

const formatWeekRange = (date: Date) => {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  start.setDate(diff)
  
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  const startDay = start.getDate()
  const startMonth = start.toLocaleDateString("en-US", { month: "short" })
  
  const endDay = end.getDate()
  const endMonth = end.toLocaleDateString("en-US", { month: "short" })
  const endYear = end.getFullYear()
  
  if (start.getMonth() === end.getMonth()) {
    return `${startDay} - ${endDay} ${endMonth} ${endYear}`
  }
  return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`
}

const formatHeaderMonthYear = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function FleetSchedulesPage() {
  // Real database entities state
  const [routesList, setRoutesList] = React.useState<RouteItem[]>([])
  const [schedules, setSchedules] = React.useState<ScheduleItem[]>([])
  const [driversList, setDriversList] = React.useState<Driver[]>([])
  const [busesList, setBusesList] = React.useState<Bus[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // Detail Modal Assignments State
  const [assignDriverId, setAssignDriverId] = React.useState("")
  const [assignBusId, setAssignBusId] = React.useState("")
  const [updatingDriver, setUpdatingDriver] = React.useState(false)
  const [updatingBus, setUpdatingBus] = React.useState(false)

  // Modal open states
  const [selectedScheduleId, setSelectedScheduleId] = React.useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  // Editor form states
  const [formName, setFormName] = React.useState("Morning Shuttle Schedule")
  const [formRouteId, setFormRouteId] = React.useState("")
  const [formStartTime, setFormStartTime] = React.useState("08:00")
  const [formDate, setFormDate] = React.useState("2026-05-18")
  const [formIsActive, setFormIsActive] = React.useState(true)
  const [formBusId, setFormBusId] = React.useState("")
  const [formDriverId, setFormDriverId] = React.useState("")

  // Calendar states
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date("2026-05-18"))
  const [calendarView, setCalendarView] = React.useState<"day" | "week" | "month">("day")
  const [currentTime, setCurrentTime] = React.useState(new Date())

  const calendarScrollRef = React.useRef<HTMLDivElement>(null)

  // Fetch real backend data
  const loadData = async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      
      const [routesRes, schedulesRes, driversRes, busesRes] = await Promise.all([
        routesApi.getRoutesList(),
        schedulesApi.getSchedules(),
        driverApi.getDrivers(),
        fleetApi.getBuses({ limit: 100 })
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
        setSchedules(getMockFallbackSchedules())
      }

      if (driversRes.success && driversRes.data) {
        setDriversList(driversRes.data)
      }

      if (busesRes.success && busesRes.data) {
        setBusesList(busesRes.data.buses)
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

  // Active Schedule item selection
  const selectedSchedule = React.useMemo(() => {
    return schedules.find(s => s.id === selectedScheduleId) || null
  }, [schedules, selectedScheduleId])

  // Sync assignDriverId and assignBusId state with selected schedule's values
  React.useEffect(() => {
    if (selectedSchedule) {
      setAssignDriverId(selectedSchedule.driverId || "")
      setAssignBusId(selectedSchedule.busId || "")
    } else {
      setAssignDriverId("")
      setAssignBusId("")
    }
  }, [selectedScheduleId, selectedSchedule])

  const handleAssignDriver = async () => {
    if (!selectedScheduleId) return
    try {
      setUpdatingDriver(true)
      const targetDriverId = assignDriverId === "none" ? "" : assignDriverId
      const res = await schedulesApi.patchSchedule(selectedScheduleId, { driverId: targetDriverId })
      if (res.success) {
        const schedulesRes = await schedulesApi.getSchedules()
        if (schedulesRes.success && schedulesRes.data) {
          setSchedules(schedulesRes.data)
        }
      } else {
        alert(res.message || "Failed to assign driver.")
      }
    } catch (err) {
      console.error(err)
      alert("An unexpected error occurred while assigning driver.")
    } finally {
      setUpdatingDriver(false)
    }
  }

  const handleAssignBus = async () => {
    if (!selectedScheduleId) return
    try {
      setUpdatingBus(true)
      const targetBusId = assignBusId === "none" ? "" : assignBusId
      const res = await schedulesApi.patchSchedule(selectedScheduleId, { busId: targetBusId })
      if (res.success) {
        const schedulesRes = await schedulesApi.getSchedules()
        if (schedulesRes.success && schedulesRes.data) {
          setSchedules(schedulesRes.data)
        }
      } else {
        alert(res.message || "Failed to assign bus.")
      }
    } catch (err) {
      console.error(err)
      alert("An unexpected error occurred while assigning bus.")
    } finally {
      setUpdatingBus(false)
    }
  }

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
        name: "Morning Shuttle Schedule",
        departureTime: "06:30 AM",
        date: "2026-05-18",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        isActive: true,
        routeName: "Lekki - Ajah Express"
      },
      {
        id: "sch-2",
        routeId: "6a0b4a66fe0f0092c1bdb258",
        name: "Evening Return Corridor Run",
        departureTime: "05:00 PM",
        date: "2026-05-18",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        isActive: true,
        routeName: "Lekki - Ajah Express"
      }
    ]
  }

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

  const navigateNext = () => {
    const next = new Date(currentDate)
    if (calendarView === "day") {
      next.setDate(next.getDate() + 1)
    } else if (calendarView === "week") {
      next.setDate(next.getDate() + 7)
    } else if (calendarView === "month") {
      next.setMonth(next.getMonth() + 1)
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
    }
    setCurrentDate(prev)
  }

  const selectScheduleItem = (item: ScheduleItem) => {
    setSelectedScheduleId(item.id)
    setIsDetailOpen(true)
  }

  // Actions
  const handleCreateButtonClick = () => {
    setSelectedScheduleId(null)
    setIsFormOpen(true)
    setIsDetailOpen(false)
    
    setFormName("Morning Shuttle Schedule")
    if (routesList.length > 0) {
      setFormRouteId(routesList[0].id)
    }
    setFormStartTime("08:00")
    setFormDate(formatDateString(currentDate))
    setFormIsActive(true)
    setFormBusId("")
    setFormDriverId("")
  }

  const handleEditActiveClick = () => {
    if (selectedSchedule) {
      setIsDetailOpen(false)
      setIsFormOpen(true)
      setFormName(selectedSchedule.name || "Morning Shuttle Schedule")
      setFormRouteId(selectedSchedule.routeId)
      setFormStartTime(convertTo24Hour(selectedSchedule.departureTime))
      setFormDate(selectedSchedule.date || formatDateString(currentDate))
      setFormIsActive(selectedSchedule.isActive)
      setFormBusId(selectedSchedule.busId || "")
      setFormDriverId(selectedSchedule.driverId || "")
    }
  }

  const handleDeleteActiveClick = async () => {
    if (!selectedScheduleId) return
    try {
      setIsSaving(true)
      setErrorMessage(null)

      if (selectedScheduleId.startsWith("sch-")) {
        setSchedules(schedules.filter(s => s.id !== selectedScheduleId))
        setSelectedScheduleId(null)
        setIsDetailOpen(false)
        return
      }

      const res = await schedulesApi.deleteSchedule(selectedScheduleId)
      if (res.success) {
        const schedulesRes = await schedulesApi.getSchedules()
        if (schedulesRes.success && schedulesRes.data) {
          setSchedules(schedulesRes.data)
        }
        setSelectedScheduleId(null)
        setIsDetailOpen(false)
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

      const departure12h = convertTo12Hour(formStartTime)

      let res;
      if (selectedScheduleId && !selectedScheduleId.startsWith("sch-")) {
        res = await schedulesApi.updateSchedule(selectedScheduleId, {
          routeId: formRouteId,
          name: formName,
          departureTime: departure12h,
          date: formDate,
          isActive: formIsActive
        })
        if (res.success && res.data) {
          // Update vehicle and pilot assignment via PATCH
          await schedulesApi.patchSchedule(selectedScheduleId, {
            busId: formBusId || undefined,
            driverId: formDriverId || undefined
          })
        }
      } else {
        res = await schedulesApi.createSchedule({
          routeId: formRouteId,
          name: formName,
          departureTime: departure12h,
          date: formDate,
          isActive: formIsActive
        })
        if (res.success && res.data) {
          // Assign vehicle and pilot to newly created schedule via PATCH
          await schedulesApi.patchSchedule(res.data.id, {
            busId: formBusId || undefined,
            driverId: formDriverId || undefined
          })
        }
      }

      if (res.success && res.data) {
        const schedulesRes = await schedulesApi.getSchedules()
        if (schedulesRes.success && schedulesRes.data) {
          setSchedules(schedulesRes.data)
        } else {
          // Local state fallback update
          if (selectedScheduleId) {
            setSchedules(schedules.map(s => s.id === selectedScheduleId ? { 
              ...s, 
              routeId: formRouteId, 
              name: formName, 
              departureTime: departure12h, 
              date: formDate, 
              isActive: formIsActive, 
              busId: formBusId || undefined, 
              driverId: formDriverId || undefined 
            } : s))
          } else {
            setSchedules([...schedules, { 
              ...res.data, 
              routeName: routesList.find(r => r.id === formRouteId)?.name,
              busId: formBusId || undefined,
              driverId: formDriverId || undefined
            }])
          }
        }
        setIsFormOpen(false)
        setSelectedScheduleId(res.data.id)
        setIsDetailOpen(true)
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

  // Grid hourly click handler
  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const totalMinutes = clickY

    let hour = Math.floor(totalMinutes / 60)
    let minute = Math.floor((totalMinutes % 60) / 15) * 15

    if (hour < 0) hour = 0
    if (hour > 23) hour = 23

    const startTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    
    let clickDayStr = formatDateString(currentDate)
    if (calendarView === "week") {
      const clickX = e.clientX - rect.left
      const colWidth = rect.width / 7
      const colIdx = Math.floor(clickX / colWidth)
      if (colIdx >= 0 && colIdx < 7) {
        clickDayStr = formatDateString(calendarDays[colIdx])
      }
    }

    setSelectedScheduleId(null)
    setIsFormOpen(true)
    setIsDetailOpen(false)
    
    setFormName("Morning Shuttle Schedule")
    if (routesList.length > 0) {
      setFormRouteId(routesList[0].id)
    }
    setFormStartTime(startTimeStr)
    setFormDate(clickDayStr)
    setFormIsActive(true)
    setFormBusId("")
    setFormDriverId("")
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

  return (
    <div className="space-y-6 pt-4 pb-20 max-w-full mx-auto px-2">
      {/* Redesigned Premium Calendar Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border border-border shadow-sm">
        {/* Left Side: Month/Year, Today button, navigation arrows */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {formatHeaderMonthYear(currentDate)}
          </h1>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date("2026-05-18"))}
            className="h-8 px-4 text-xs font-bold border-border bg-background rounded-lg hover:bg-muted"
          >
            Today
          </Button>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={navigatePrev}
              className="h-8 w-8 rounded-lg border-border hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={navigateNext}
              className="h-8 w-8 rounded-lg border-border hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </Button>
          </div>
        </div>

        {/* Right Side: View Selector tabs, Date Range Badge, Create Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Day / Week / Month tab toggles */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background p-0.5 shadow-sm">
             {(["day", "week", "month"] as const).map((v) => (
                <button
                   key={v}
                   type="button"
                   onClick={() => setCalendarView(v)}
                   className={`px-4 py-1 text-xs font-bold rounded-md transition-all uppercase tracking-wider text-[9.5px] ${
                      calendarView === v 
                        ? "bg-primary text-white shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                   }`}
                >
                   {v}
                </button>
             ))}
          </div>

          {/* Date Range Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg bg-card text-xs font-bold text-foreground shadow-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {calendarView === "day"
                ? currentDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                : calendarView === "week"
                ? formatWeekRange(currentDate)
                : currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
              }
            </span>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreateButtonClick}
            disabled={isLoading || isSaving}
            className="h-9 px-4 font-bold text-xs bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 rounded-lg shadow-sm"
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

      {/* Full-width visual calendar grid */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden w-full">
         
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
                               <div key={idx} className={`py-3 flex flex-col items-center justify-center gap-1 ${
                                  isToday ? "bg-primary/[0.04]" : ""
                               }`}>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-primary font-extrabold" : "text-muted-foreground"}`}>
                                     {day.toLocaleDateString("en-US", { weekday: "short" })}
                                  </span>
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                     isToday 
                                       ? "bg-primary text-white shadow-sm ring-2 ring-primary/20" 
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
                               {/* Indicator tag on the left ruler */}
                               <div className="absolute -left-[80px] bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-30 transform -translate-y-1/2">
                                 {currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).replace(" ", "")}
                               </div>
                               {/* Blue line matching the image */}
                               <div className="h-1.5 w-1.5 rounded-full bg-primary -ml-[3px] z-30" />
                               <div className="h-[1px] flex-1 bg-primary" />
                             </div>
                         )}

                         {/* Plotted Schedule Blocks */}
                         <div className={`absolute inset-0 z-10 grid ${calendarView === "day" ? "grid-cols-1" : "grid-cols-7"} divide-x divide-border/20 h-full pointer-events-none`}>
                            {calendarDays.map((day, colIdx) => {
                               const dayStr = formatDateString(day)
                               const dayOfWeekName = day.toLocaleDateString("en-US", { weekday: "long" })
                               const isToday = dayStr === "2026-05-18"
                               
                               const daySchedules = schedules.filter(s => {
                                 return s.date === dayStr || (s.daysOfWeek && s.daysOfWeek.includes(dayOfWeekName))
                               })

                               // Precompute top, height and end for each schedule item
                               const computedSchedules = daySchedules.map(item => {
                                 const start24 = convertTo24Hour(item.departureTime)
                                 const end24 = getEndTimeFor24h(start24)

                                 const [sh, sm] = start24.split(":").map(Number)
                                 const [eh, em] = end24.split(":").map(Number)
                                 
                                 const top = (sh * 60) + sm
                                 const duration = ((eh * 60) + em) - top
                                 const height = Math.max(65, duration)

                                 return {
                                   item,
                                   start24,
                                   end24,
                                   sh,
                                   top,
                                   height,
                                   end: top + height
                                 }
                               })

                               // Sort by top ascending
                               computedSchedules.sort((a, b) => a.top - b.top)

                               // Group into clusters of overlapping items
                               const clusters: any[][] = []
                               let currentCluster: any[] = []
                               let currentClusterMaxEnd = 0

                               computedSchedules.forEach(sched => {
                                 if (currentCluster.length === 0) {
                                   currentCluster.push(sched)
                                   currentClusterMaxEnd = sched.end
                                 } else if (sched.top < currentClusterMaxEnd) {
                                   currentCluster.push(sched)
                                   currentClusterMaxEnd = Math.max(currentClusterMaxEnd, sched.end)
                                 } else {
                                   clusters.push(currentCluster)
                                   currentCluster = [sched]
                                   currentClusterMaxEnd = sched.end
                                 }
                               })
                               if (currentCluster.length > 0) {
                                 clusters.push(currentCluster)
                               }

                               // Assign column index to each item in each cluster
                               const positionedSchedules: any[] = []

                               clusters.forEach(cluster => {
                                 const colEndTimes: number[] = []
                                 const clusterItems = cluster.map(sched => {
                                   let colIdx = -1
                                   for (let i = 0; i < colEndTimes.length; i++) {
                                     if (colEndTimes[i] <= sched.top) {
                                       colIdx = i
                                       break
                                     }
                                   }
                                   if (colIdx === -1) {
                                     colIdx = colEndTimes.length
                                     colEndTimes.push(sched.end)
                                   } else {
                                     colEndTimes[colIdx] = sched.end
                                   }
                                   return {
                                     ...sched,
                                     colIdx
                                   }
                                 })

                                 const totalCols = colEndTimes.length
                                 clusterItems.forEach(sched => {
                                   positionedSchedules.push({
                                     item: sched.item,
                                     start24: sched.start24,
                                     end24: sched.end24,
                                     sh: sched.sh,
                                     top: sched.top,
                                     height: sched.height,
                                     left: (sched.colIdx / totalCols) * 100,
                                     width: (1 / totalCols) * 100
                                   })
                                 })
                               })

                               return (
                                  <div key={colIdx} className={`relative h-full ${isToday ? "bg-primary/[0.01]" : ""}`}>
                                     {positionedSchedules.map(({ item, start24, end24, sh, top, height, left, width }) => {
                                        const peakGroup = sh < 12 ? "Morning" : sh >= 16 && sh < 20 ? "Evening" : sh >= 20 || sh < 6 ? "Night" : "Off-Peak"
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
                                                 left: `calc(${left}% + 1.5px)`,
                                                 width: `calc(${width}% - 3px)`,
                                              }}
                                              className={`absolute rounded-xl border border-border/60 bg-card/85 backdrop-blur-sm p-3.5 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 pointer-events-auto hover:scale-[1.01] hover:-translate-y-0.5 ${
                                                 calendarView === "day" ? "max-w-md md:max-w-lg" : ""
                                              } ${
                                                 isSelected 
                                                   ? "ring-2 ring-primary border-primary" 
                                                   : ""
                                              } ${!item.isActive ? "opacity-50 border-dashed" : ""}`}
                                           >
                                              {/* Left accent bar based on peak hours */}
                                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                                 peakGroup === "Morning" ? "bg-indigo-600 animate-pulse" :
                                                 peakGroup === "Evening" ? "bg-emerald-600 animate-pulse" :
                                                 peakGroup === "Night" ? "bg-violet-600 animate-pulse" :
                                                 "bg-slate-500"
                                              }`} />

                                              <div className="pl-2.5 h-full flex flex-col justify-between min-w-0">
                                                 {/* Top line: Time badge & status tag */}
                                                 <div className="flex items-center justify-between gap-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide ${
                                                       peakGroup === "Morning" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300" :
                                                       peakGroup === "Evening" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" :
                                                       peakGroup === "Night" ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300" :
                                                       "bg-slate-100 text-slate-800 dark:bg-slate-850 dark:text-slate-300"
                                                    }`}>
                                                       {formatTimeRange(start24, end24)}
                                                    </span>
                                                    {!item.isActive && (
                                                       <span className="text-[7.5px] bg-muted text-muted-foreground font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">Offline</span>
                                                    )}
                                                 </div>

                                                 {/* Title: Schedule Run Name */}
                                                 <p className="text-xs font-extrabold text-foreground tracking-wide mt-2 truncate uppercase">
                                                    {item.name || matchedRouteName}
                                                 </p>
                                                 
                                                 {/* Details: Vehicle & Driver */}
                                                 <div className="mt-auto pt-2 flex flex-wrap gap-x-3 gap-y-1 items-center text-[9px] font-bold text-muted-foreground">
                                                    <span className="flex items-center gap-1 min-w-0 truncate">
                                                       <BusIcon className="h-3 w-3 text-primary shrink-0" />
                                                       <span className="truncate">
                                                          {item.busId ? (busesList.find(b => b.id === item.busId)?.name || "Bus Assigned") : "No Bus"}
                                                       </span>
                                                    </span>
                                                    <span className="flex items-center gap-1 min-w-0 truncate">
                                                       <User className="h-3 w-3 text-primary shrink-0" />
                                                       <span className="truncate">
                                                          {item.driver ? (item.driver.firstName || item.driver.name) : item.driverId ? (driversList.find(d => d.id === item.driverId)?.first_name || 'Assigned') : 'Unassigned'}
                                                       </span>
                                                    </span>
                                                 </div>
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
                           return s.date === dayStr || (s.daysOfWeek && s.daysOfWeek.includes(dayOfWeekName))
                         })
                         
                         return (
                            <div 
                               key={idx} 
                               onClick={() => {
                                  setCurrentDate(day)
                                  handleCreateButtonClick()
                                  setFormDate(dayStr)
                               }}
                               className={`min-h-[90px] p-2 flex flex-col justify-between hover:bg-muted/10 cursor-pointer transition-all ${
                                  isCurrentMonth ? "bg-card" : "bg-muted/5 opacity-45"
                               }`}
                            >
                               <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-extrabold rounded-full h-5 w-5 flex items-center justify-center ${
                                     isToday 
                                       ? "bg-primary text-white shadow-sm font-black ring-2 ring-primary/20" 
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
                                     const colorClasses = getPeakColorClasses(peakGroup)
                                     const isSelected = selectedScheduleId === item.id
                                     const routeDisplayName = item.routeName || routesList.find(r => r.id === item.routeId)?.name || "Express Run"
                                     
                                     return (
                                        <div
                                           key={item.id}
                                           onClick={(e) => {
                                              e.stopPropagation()
                                              selectScheduleItem(item)
                                           }}
                                           className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded border truncate flex items-center justify-between gap-1 transition-all ${colorClasses} ${
                                              isSelected ? "ring-1 ring-primary border-primary scale-[1.02]" : "hover:scale-[1.01]"
                                           }`}
                                        >
                                           <span className="truncate flex-1 uppercase tracking-wider">{item.name || routeDisplayName}</span>
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
           </>
         )}
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md bg-card border border-border shadow-lg rounded-xl overflow-hidden p-0 animate-in fade-in-50 duration-200">
          <div className="p-6 space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                  Corridor Schedule Run
                </span>
                <DialogTitle className="text-xl font-bold text-foreground mt-2 leading-tight">
                  {selectedSchedule?.name || selectedSchedule?.routeName || routesList.find(r => r.id === selectedSchedule?.routeId)?.name || "Lekki - Ajah Corridor"}
                </DialogTitle>
                <p className="text-[10px] font-semibold text-muted-foreground mt-1">
                  Schedule ID: {selectedSchedule?.id}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  {selectedSchedule?.isActive ? "ONLINE" : "OFFLINE"}
                </span>
                <Switch 
                   checked={selectedSchedule?.isActive ?? false} 
                   onCheckedChange={async (v) => {
                      if (!selectedSchedule) return
                      try {
                         setSchedules(schedules.map(s => s.id === selectedSchedule.id ? { ...s, isActive: v } : s))
                         if (!selectedSchedule.id.startsWith("sch-")) {
                            await schedulesApi.patchSchedule(selectedSchedule.id, { isActive: v })
                         }
                      } catch (err) {
                         console.error(err)
                      }
                   }}
                   className="scale-75"
                />
              </div>
            </div>

            {/* Info Fields */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/5">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Route Corridor</p>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {routesList.find(r => r.id === selectedSchedule?.routeId)?.name || "Assigned Corridor Route"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/5">
                <Clock className="h-4 w-4 text-primary mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Timing & Date Parameters</p>
                  <p className="text-xs font-extrabold text-primary">
                    {selectedSchedule?.departureTime} Departure
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground">DATE:</span>
                    <Badge variant="outline" className="text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wide bg-background border-border text-foreground">
                      {selectedSchedule?.date}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Bus Assignment Section */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/5">
                <BusIcon className="h-4 w-4 text-primary mt-0.5" />
                <div className="space-y-0.5 w-full">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Assigned Fleet Vehicle (Bus)</p>
                  
                  {selectedSchedule?.busId ? (
                    <p className="text-xs font-bold text-foreground">
                       {(() => {
                          const b = busesList.find(x => x.id === selectedSchedule.busId);
                          return b ? `${b.name} (${b.plateNumber})` : `Bus ID: ${selectedSchedule.busId}`;
                       })()}
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-muted-foreground italic">No bus assigned</p>
                  )}

                  <div className="flex items-center gap-2 mt-2 w-full">
                    <select
                       className="h-8 px-2 rounded-lg border border-border bg-card text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                       value={assignBusId}
                       onChange={(e) => setAssignBusId(e.target.value)}
                    >
                       <option value="">Choose Bus...</option>
                       <option value="none">None (Unassign)</option>
                       {busesList.map(b => (
                          <option key={b.id} value={b.id}>
                             {b.name} ({b.plateNumber})
                          </option>
                       ))}
                    </select>
                    <Button
                       size="sm"
                       className="h-8 px-3 text-[10px] font-bold bg-primary shrink-0 text-white rounded-lg"
                       disabled={updatingBus}
                       onClick={handleAssignBus}
                    >
                       {updatingBus ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                       ) : (
                          "Assign"
                       )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Driver Assignment Section */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/5">
                <UserCheck className="h-4 w-4 text-primary mt-0.5" />
                <div className="space-y-0.5 w-full">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Assigned Pilot / Driver</p>
                  
                  {selectedSchedule?.driver ? (
                    <p className="text-xs font-bold text-foreground">
                       {selectedSchedule.driver.firstName || selectedSchedule.driver.name} {selectedSchedule.driver.lastName || ''}
                    </p>
                  ) : selectedSchedule?.driverId ? (
                    <p className="text-xs font-bold text-foreground">
                       {(() => {
                          const d = driversList.find(x => x.id === selectedSchedule.driverId);
                          return d ? `${d.first_name} ${d.last_name}` : `Driver ID: ${selectedSchedule.driverId}`;
                       })()}
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-muted-foreground italic">No pilot assigned</p>
                  )}

                  <div className="flex items-center gap-2 mt-2 w-full">
                    <select
                       className="h-8 px-2 rounded-lg border border-border bg-card text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                       value={assignDriverId}
                       onChange={(e) => setAssignDriverId(e.target.value)}
                    >
                       <option value="">Choose Driver...</option>
                       <option value="none">None (Unassign)</option>
                       {driversList.map(d => (
                          <option key={d.id} value={d.id}>
                             {d.first_name} {d.last_name}
                          </option>
                       ))}
                    </select>
                    <Button
                       size="sm"
                       className="h-8 px-3 text-[10px] font-bold bg-primary shrink-0 text-white rounded-lg"
                       disabled={updatingDriver}
                       onClick={handleAssignDriver}
                    >
                       {updatingDriver ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                       ) : (
                          "Assign"
                       )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button 
                onClick={handleEditActiveClick}
                className="flex-1 h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-lg"
              >
                Edit Config
              </Button>
              <Button 
                variant="outline"
                onClick={handleDeleteActiveClick}
                className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 border-border rounded-lg flex items-center justify-center"
                title="Delete run"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsDetailOpen(false)}
                className="h-10 text-xs font-bold border-border rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md bg-card border border-border shadow-lg rounded-xl overflow-hidden p-0 animate-in fade-in-50 duration-200">
          <DialogHeader className="p-6 border-b border-border bg-muted/20">
            <DialogTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              {selectedScheduleId ? "Edit Corridor Run" : "Schedule Corridor Run"}
            </DialogTitle>
            <DialogDescription className="text-[11px] font-medium text-muted-foreground">
              Configure route timing, date, and pilot allocation.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            {/* Schedule Name */}
            <div className="space-y-1.5">
               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Schedule Run Name</Label>
               <Input 
                  type="text"
                  placeholder="e.g. Morning Shuttle Schedule"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-10 text-xs font-semibold border-border bg-background text-foreground"
               />
            </div>

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

            {/* Departure Timing Block */}
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

            {/* Operation Date picker */}
            <div className="space-y-1.5">
               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Operation Date</Label>
               <Input 
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="h-10 text-xs font-bold border-border bg-background text-foreground"
               />
            </div>

            {/* Bus Select dropdown */}
            <div className="space-y-1.5">
               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Assign Bus/Vehicle</Label>
               <Select value={formBusId || "none"} onValueChange={(val) => setFormBusId(val === "none" ? "" : val)}>
                  <SelectTrigger className="h-10 text-xs font-semibold border-border bg-muted/20 text-foreground">
                     <SelectValue placeholder="Assign Bus to Corridor..." />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="none" className="text-xs font-semibold text-muted-foreground">None (Unassigned)</SelectItem>
                     {busesList.map(bus => (
                        <SelectItem key={bus.id} value={bus.id} className="text-xs font-semibold">
                           {bus.name} ({bus.plateNumber})
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            {/* Driver Select dropdown */}
            <div className="space-y-1.5">
               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Assign Pilot/Driver</Label>
               <Select value={formDriverId || "none"} onValueChange={(val) => setFormDriverId(val === "none" ? "" : val)}>
                  <SelectTrigger className="h-10 text-xs font-semibold border-border bg-muted/20 text-foreground">
                     <SelectValue placeholder="Assign Pilot to Corridor..." />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="none" className="text-xs font-semibold text-muted-foreground">None (Unassigned)</SelectItem>
                     {driversList.map(drv => (
                        <SelectItem key={drv.id} value={drv.id} className="text-xs font-semibold">
                           {drv.first_name} {drv.last_name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
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
            <div className="flex items-center gap-2 pt-4 border-t border-border">
               <Button 
                  onClick={handleSaveForm}
                  disabled={isSaving}
                  className="flex-1 h-10 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg"
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
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-10 text-xs font-bold border-border rounded-lg text-foreground"
               >
                  Cancel
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
