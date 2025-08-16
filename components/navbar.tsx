"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Ticket } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // If we're on the home page, scroll to contact section
    if (pathname === "/") {
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // If we're on another page, navigate to home page with contact hash
      router.push("/#contact")
    }

    // Close mobile menu if open
    setIsOpen(false)
  }

  return (
    <nav className="bg-black/90 backdrop-blur-xl border-b border-gold/20 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Ticket className="h-8 w-8 text-gold" />
            <span className="text-2xl font-bold text-white">RafflePro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/buy-tickets" className="text-gray-300 hover:text-gold transition-colors duration-300">
              Comprar Boletos
            </Link>
            <Link href="/verify-tickets" className="text-gray-300 hover:text-gold transition-colors duration-300">
              Verificar Boletos
            </Link>
            <Link href="/pagos" className="text-gray-300 hover:text-gold transition-colors duration-300">
              Pagos
            </Link>
            <button
              onClick={handleContactClick}
              className="text-gray-300 hover:text-gold transition-colors duration-300"
            >
              Contacto
            </button>
            <Link href="/login">
              <Button className="bg-white text-black hover:bg-gray-100 transition-all duration-300 shadow-lg">
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-gold transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gold/20">
            <div className="flex flex-col space-y-4">
              <Link
                href="/buy-tickets"
                className="text-gray-300 hover:text-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Comprar Boletos
              </Link>
              <Link
                href="/verify-tickets"
                className="text-gray-300 hover:text-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Verificar Boletos
              </Link>
              <Link
                href="/pagos"
                className="text-gray-300 hover:text-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Pagos
              </Link>
              <button
                onClick={handleContactClick}
                className="text-gray-300 hover:text-gold transition-colors duration-300 text-left"
              >
                Contacto
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button className="bg-white text-black hover:bg-gray-100 transition-all duration-300 w-full shadow-lg">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
