import type { Metadata } from "next"
import Link from "next/link"
import { UserRegisterForm } from "@/components/auth/user-register-form"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Registrarse",
  description: "Crea una nueva cuenta",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <path d="m8 3 4 8 5-5v11H6V6l2-3z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Crear cuenta nueva</h2>
            <p className="mt-2 text-sm text-gray-600">Ingresa tus datos para crear tu cuenta</p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <UserRegisterForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
