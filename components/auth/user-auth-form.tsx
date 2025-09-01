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

  const validateInputs = () => {
    if (!email.trim()) {
      setError("El correo electrónico es requerido")
      return false
    }
    if (!email.includes("@")) {
      setError("Ingresa un correo electrónico válido")
      return false
    }
    if (!password) {
      setError("La contraseña es requerida")
      return false
    }
    return true
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setError("")

    if (!validateInputs()) {
      return
    }

    setIsLoading(true)

    try {
      const isAdmin = email === ADMIN_EMAIL

      if (isAdmin && password === ADMIN_PASSWORD) {
        console.log("[v0] Admin login successful")
        localStorage.setItem("isAdmin", "true")
        localStorage.setItem("adminEmail", email)
        router.push("/admin")
        return
      } else if (isAdmin && password !== ADMIN_PASSWORD) {
        setError("Contraseña de administrador incorrecta")
        setIsLoading(false)
        return
      }

      const supabase = createClient()
      console.log("[v0] Attempting Supabase login with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      console.log("[v0] Supabase response:", { data, error })

      if (error) {
        console.log("[v0] Authentication error:", error.message)
        let errorMessage = "Error de autenticación"
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciales incorrectas. Verifica tu correo y contraseña."
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Confirma tu correo electrónico antes de iniciar sesión."
        } else {
          errorMessage = `Error: ${error.message}`
        }
        setError(errorMessage)
      } else if (data?.user) {
        console.log("[v0] Login successful for user:", data.user.id)
        // Clear admin flags for regular users
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
      console.error("[v0] Unexpected error:", err)
      setError("Error inesperado al iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">{error}</div>}
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
              className="focus:ring-2 focus:ring-amber-500"
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
              className="focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <Button
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 transition-all duration-200"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </div>
      </form>
    </div>
  )
}
