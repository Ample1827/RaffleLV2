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

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({ className, ...props }: UserRegisterFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const router = useRouter()
  const { toast } = useToast()

  const validateInputs = () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre es requerido",
      })
      return false
    }
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
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
      })
      return false
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Las contraseñas no coinciden",
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

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
        },
      })

      console.log("[v0] Signup response:", { data, error })

      if (error) {
        console.log("[v0] Signup error:", error.message)
        let errorMessage = "Error al crear la cuenta"

        if (error.message.includes("User already registered")) {
          errorMessage = "Ya existe una cuenta con este correo electrónico."
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres."
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Correo electrónico inválido."
        } else {
          errorMessage = `Error: ${error.message}`
        }

        toast({
          variant: "destructive",
          title: "Error al registrarse",
          description: errorMessage,
        })
      } else if (data?.user) {
        console.log("[v0] Signup successful for user:", data.user.id)

        toast({
          title: "¡Cuenta creada!",
          description: "Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.",
        })

        // Redirect to login with success message
        router.push("/login?message=Cuenta creada exitosamente. Revisa tu correo para confirmar.")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo crear la cuenta. Inténtalo de nuevo.",
        })
      }
    } catch (err) {
      console.error("[v0] Unexpected signup error:", err)
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description: "Error inesperado al crear la cuenta. Inténtalo de nuevo.",
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
            <Label className="sr-only" htmlFor="name">
              Nombre completo
            </Label>
            <Input
              id="name"
              placeholder="Nombre completo"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="focus:ring-2 focus:ring-amber-500"
            />
          </div>
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
              placeholder="Contraseña (mínimo 6 caracteres)"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="confirmPassword">
              Confirmar contraseña
            </Label>
            <Input
              id="confirmPassword"
              placeholder="Confirmar contraseña"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <Button
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 transition-all duration-200"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </div>
      </form>
    </div>
  )
}
