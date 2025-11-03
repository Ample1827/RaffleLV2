import { Ticket, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4 md:mb-6">
              <Ticket className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
              <span className="text-xl md:text-2xl font-bold">RifaPro</span>
            </div>
            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 leading-relaxed">
              La plataforma de rifas más confiable con más de 50,000 ganadores felices. Estamos comprometidos con el
              juego limpio, la transparencia y premios que cambian vidas.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a href="#" className="bg-gray-800 p-2 md:p-3 rounded-full hover:bg-purple-600 transition-colors">
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 md:p-3 rounded-full hover:bg-purple-600 transition-colors">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 md:p-3 rounded-full hover:bg-purple-600 transition-colors">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 md:p-3 rounded-full hover:bg-purple-600 transition-colors">
                <Youtube className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/buy-tickets"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Comprar Boletos
                </Link>
              </li>
              <li>
                <Link
                  href="/#como-funciona"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Mis Compras
                </Link>
              </li>
              <li>
                <Link
                  href="/#premios"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Premios
                </Link>
              </li>
              <li>
                <Link
                  href="/#contacto"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">Soporte</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="https://wa.me/5212216250235?text=Hola,%20necesito%20ayuda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a
                  href="https://www.gamblingsite.com/terms-of-service/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a
                  href="https://supabase.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5212216250235?text=Hola,%20tengo%20una%20pregunta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © 2025 RifaPro. Todos los derechos reservados. Con licencia y regulado.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              <span className="text-gray-400 text-xs md:text-sm">🔒 SSL Seguro</span>
              <span className="text-gray-400 text-xs md:text-sm">✓ Juego Limpio Certificado</span>
              <span className="text-gray-400 text-xs md:text-sm">🏆 Premiado</span>
            </div>
          </div>
          <div className="mt-4 md:mt-6 text-center">
            <Link href="/admin" className="text-gray-500 hover:text-gray-300 text-xs transition-colors underline">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
