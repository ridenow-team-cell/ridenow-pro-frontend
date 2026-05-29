"use client"

import * as React from "react"
import { getProfile, type UserProfile } from "@/lib/api/auth"
import { isAuthenticated, signOut } from "@/lib/auth"
import { ApiError } from "@/lib/api/client"

interface ProfileContextType {
  user: UserProfile | null
  isLoading: boolean
  error: Error | null
  refreshProfile: () => Promise<void>
}

const ProfileContext = React.createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  const fetchProfile = React.useCallback(async () => {
    if (!isAuthenticated()) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await getProfile()
      if (response.success && response.data) {
        setUser(response.data)
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      if (err instanceof ApiError) {
        if (
          err.status === 401 ||
          err.status === 404 ||
          err.message.toLowerCase().includes("user not found")
        ) {
          signOut()
          return
        }
      }
      setError(err instanceof Error ? err : new Error("Failed to fetch profile"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return (
    <ProfileContext.Provider
      value={{
        user,
        isLoading,
        error,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = React.useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
