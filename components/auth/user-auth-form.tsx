"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const ADMIN_EMAIL = "Adalromero99@gmail.com"
const ADMIN_PASSWORD = "182728"

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin session in localStorage
        localStorage.setItem("isAdmin", "true")
        localStorage.setItem("adminEmail", email)
        router.push("/admin")
        return
      }

      const supabase = createClient()

      console.log("[v0] Attempting login with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      console.log("[v0] Supabase response:", { data, error })

      if (error) {
        console.log("[v0] Authentication error:", error.message)
        setError(`Error de autenticación: ${error.message}`)
      } else if (data?.user) {
        console.log("[v0] Login successful for user:", data.user.id)
        // Clear admin flag for regular users
        localStorage.removeItem("isAdmin")
        localStorage.removeItem("adminEmail")

        const urlParams = new URLSearchParams(window.location.search)
        const hasTickets = urlParams.get("tickets") || sessionStorage.getItem("selectedTickets")

        if (hasTickets) {
          router.push("/resumen-boletos")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError("No se pudo autenticar. Verifica tus credenciales.")
      }
    } catch (err) {
      console.log("[v0] Unexpected error:", err)
      setError("Error inesperado al iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Correo electrónico
            </Label>
            <Input
              id="email"
              placeholder="correo@ejemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Contraseña
            </Label>
            <Input
              id="password"
              placeholder="Contraseña"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Sesión
          </Button>
        </div>
      </form>
    </div>
  )
}
