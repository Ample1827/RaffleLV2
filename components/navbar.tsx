"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Ticket } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-black/90 backdrop-blur-xl border-b border-gold/20 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Ticket className="h-8 w-8 text-gold" />
            <span className="text-2xl font-bold text-white">RafflePro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-300 hover:text-gold transition-colors duration-300">
              How It Works
            </a>
            <a href="#prizes" className="text-gray-300 hover:text-gold transition-colors duration-300">
              Prizes
            </a>
            <a href="#buy-tickets" className="text-gray-300 hover:text-gold transition-colors duration-300">
              Buy Tickets
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-gold transition-colors duration-300">
              Reviews
            </a>
            <a href="#contact" className="text-gray-300 hover:text-gold transition-colors duration-300">
              Contact
            </a>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent transition-all duration-300"
              >
                Login
              </Button>
            </Link>
            <Button className="bg-gold hover:bg-gold/90 text-black font-semibold transition-all duration-300">
              Get Started
            </Button>
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
              <a href="#how-it-works" className="text-gray-300 hover:text-gold transition-colors duration-300">
                How It Works
              </a>
              <a href="#prizes" className="text-gray-300 hover:text-gold transition-colors duration-300">
                Prizes
              </a>
              <a href="#buy-tickets" className="text-gray-300 hover:text-gold transition-colors duration-300">
                Buy Tickets
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-gold transition-colors duration-300">
                Reviews
              </a>
              <a href="#contact" className="text-gray-300 hover:text-gold transition-colors duration-300">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent transition-all duration-300 w-full"
                  >
                    Login
                  </Button>
                </Link>
                <Button className="bg-gold hover:bg-gold/90 text-black font-semibold transition-all duration-300">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
