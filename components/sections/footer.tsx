import { Ticket, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Ticket className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold">RafflePro</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The most trusted raffle platform with over 50,000 happy winners. We're committed to fair play,
              transparency, and life-changing prizes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Current Raffles
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Winners Gallery
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Responsible Gaming
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 RafflePro. All rights reserved. Licensed and regulated.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">🔒 SSL Secured</span>
              <span className="text-gray-400 text-sm">✓ Fair Play Certified</span>
              <span className="text-gray-400 text-sm">🏆 Award Winning</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
