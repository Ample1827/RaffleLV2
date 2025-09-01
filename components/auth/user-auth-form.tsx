"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const ADMIN_EMAIL = "Adalromero99@gmail.com"
const ADMIN_PASSWORD = "182728"

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const router = useRouter()
  const { toast } = useToast()

  const validateInputs = () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El correo electrónico es requerido",
      })
      return false
    }
    if (!email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ingresa un correo electrónico válido",
      })
      return false
    }
    if (!password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña es requerida",
      })
      return false
    }
    return true
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()

    if (!validateInputs()) {
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log("[v0] Admin login detected")

        // Try to sign in admin with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        })

        if (error) {
          console.log("[v0] Admin Supabase auth failed, creating admin session manually")
          // If admin doesn't exist in Supabase, create local admin session
          localStorage.setItem("isAdmin", "true")
          localStorage.setItem("adminEmail", email)
          toast({
            title: "Éxito",
            description: "Bienvenido, Administrador",
          })
          router.push("/admin")
          return
        } else if (data?.user) {
          console.log("[v0] Admin authenticated via Supabase")
          localStorage.setItem("isAdmin", "true")
          localStorage.setItem("adminEmail", email)
          toast({
            title: "Éxito",
            description: "Bienvenido, Administrador",
          })
          router.push("/admin")
          return
        }
      }

      console.log("[v0] Attempting regular user login with email:", email)

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
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Demasiados intentos. Espera un momento antes de intentar de nuevo."
        } else {
          errorMessage = `Error: ${error.message}`
        }

        toast({
          variant: "destructive",
          title: "Error de autenticación",
          description: errorMessage,
        })
      } else if (data?.user) {
        console.log("[v0] Login successful for user:", data.user.id)

        // Clear any admin flags for regular users
        localStorage.removeItem("isAdmin")
        localStorage.removeItem("adminEmail")

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        })

        const urlParams = new URLSearchParams(window.location.search)
        const hasTickets = urlParams.get("tickets") || sessionStorage.getItem("selectedTickets")

        if (hasTickets) {
          router.push("/resumen-boletos")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo autenticar. Verifica tus credenciales.",
        })
      }
    } catch (err) {
      console.error("[v0] Unexpected error:", err)
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description: "Error inesperado al iniciar sesión. Inténtalo de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
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
