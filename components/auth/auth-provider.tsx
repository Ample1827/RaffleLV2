"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  const checkAdminStatus = (user: User | null) => {
    if (!user) {
      setIsAdmin(false)
      return false
    }

    // Check if user is the hardcoded admin
    const adminStatus = user.email === "Adalromero99@gmail.com" || localStorage.getItem("isAdmin") === "true"
    setIsAdmin(adminStatus)
    return adminStatus
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setSession(session)
        setUser(session?.user ?? null)
        checkAdminStatus(session?.user ?? null)

        console.log("[v0] Auth initialized:", {
          hasSession: !!session,
          userEmail: session?.user?.email,
          isAdmin: checkAdminStatus(session?.user ?? null),
        })
      } catch (error) {
        console.error("[v0] Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[v0] Auth state changed:", event, {
        hasSession: !!session,
        userEmail: session?.user?.email,
      })

      setSession(session)
      setUser(session?.user ?? null)
      checkAdminStatus(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_OUT") {
        localStorage.removeItem("isAdmin")
        localStorage.removeItem("adminEmail")
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    console.log("[v0] Signing out user")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("adminEmail")
    setIsAdmin(false)
    await supabase.auth.signOut()
  }

  return <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>{children}</AuthContext.Provider>
}
