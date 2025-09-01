"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Check for admin in localStorage
        const adminFlag = localStorage.getItem("isAdmin")
        const adminEmail = localStorage.getItem("adminEmail")
        const isAdminUser = adminFlag === "true" && adminEmail === "Adalromero99@gmail.com"

        setSession(session)
        setUser(session?.user ?? null)
        setIsAdmin(isAdminUser)

        // Auto-redirect based on auth state
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname

          if (isAdminUser && currentPath === "/login") {
            router.push("/admin")
          } else if (session?.user && currentPath === "/login") {
            router.push("/dashboard")
          } else if (!session?.user && !isAdminUser && (currentPath === "/dashboard" || currentPath === "/admin")) {
            router.push("/login")
          }
        }
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      // Check admin status when auth state changes
      const adminFlag = localStorage.getItem("isAdmin")
      const adminEmail = localStorage.getItem("adminEmail")
      setIsAdmin(adminFlag === "true" && adminEmail === "Adalromero99@gmail.com")

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("adminEmail")
    setIsAdmin(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>{children}</AuthContext.Provider>
}
