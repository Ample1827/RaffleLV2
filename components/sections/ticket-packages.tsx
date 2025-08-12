"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Ticket, Star, Zap, Crown, Sparkles } from "lucide-react"

const ticketPackages = [
  { id: 1, tickets: 1, price: 5, popular: false, icon: Ticket, color: "from-gray-600 to-gray-700" },
  { id: 2, tickets: 5, price: 20, popular: false, icon: Ticket, color: "from-blue-600 to-blue-700", discount: 20 },
  { id: 3, tickets: 10, price: 35, popular: true, icon: Star, color: "from-purple-600 to-purple-700", discount: 30 },
  { id: 4, tickets: 15, price: 50, popular: false, icon: Zap, color: "from-green-600 to-green-700", discount: 33 },
  {
    id: 5,
    tickets: 20,
    price: 60,
    popular: false,
    icon: Sparkles,
    color: "from-orange-600 to-orange-700",
    discount: 40,
  },
  { id: 6, tickets: 25, price: 70, popular: false, icon: Crown, color: "from-red-600 to-red-700", discount: 44 },
  { id: 7, tickets: 50, price: 125, popular: false, icon: Crown, color: "from-pink-600 to-pink-700", discount: 50 },
  {
    id: 8,
    tickets: 100,
    price: 200,
    popular: false,
    icon: Crown,
    color: "from-yellow-600 to-yellow-700",
    discount: 60,
  },
  {
    id: 9,
    tickets: 125,
    price: 225,
    popular: false,
    icon: Crown,
    color: "from-indigo-600 to-indigo-700",
    discount: 64,
  },
  { id: 10, tickets: 150, price: 250, popular: false, icon: Crown, color: "from-teal-600 to-teal-700", discount: 67 },
  { id: 11, tickets: 200, price: 300, popular: false, icon: Crown, color: "from-cyan-600 to-cyan-700", discount: 70 },
  {
    id: 12,
    tickets: 250,
    price: 350,
    popular: false,
    icon: Crown,
    color: "from-emerald-600 to-emerald-700",
    discount: 72,
  },
  { id: 13, tickets: 500, price: 600, popular: false, icon: Crown, color: "from-amber-600 to-amber-700", discount: 76 },
  { id: 14, tickets: 1000, price: 1000, popular: false, icon: Crown, color: "from-gold to-yellow-600", discount: 80 },
]

export function TicketPackages() {
  const [customTickets, setCustomTickets] = useState("")
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)

  const calculateCustomPrice = (tickets: number) => {
    if (tickets <= 0) return 0
    if (tickets === 1) return 5
    if (tickets <= 10) return Math.floor(tickets * 4)
    if (tickets <= 50) return Math.floor(tickets * 3.5)
    if (tickets <= 100) return Math.floor(tickets * 3)
    if (tickets <= 500) return Math.floor(tickets * 2.5)
    return Math.floor(tickets * 2)
  }

  const customPrice = calculateCustomPrice(Number.parseInt(customTickets) || 0)

  return (
    <div className="space-y-8">
      {/* Predefined Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ticketPackages.map((pkg) => {
          const IconComponent = pkg.icon
          const originalPrice = pkg.tickets * 5
          const savings = originalPrice - pkg.price

          return (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedPackage === pkg.id
                  ? "border-gold shadow-lg shadow-gold/20"
                  : "border-gray-700 hover:border-gold/50"
              } ${pkg.popular ? "ring-2 ring-gold" : ""}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <Badge className="absolute top-2 right-2 bg-gold text-black font-semibold">Most Popular</Badge>
              )}

              <CardHeader className={`bg-gradient-to-r ${pkg.color} text-white`}>
                <div className="flex items-center justify-between">
                  <IconComponent className="h-8 w-8" />
                  <div className="text-right">
                    <CardTitle className="text-2xl font-bold">{pkg.tickets}</CardTitle>
                    <CardDescription className="text-gray-200">
                      {pkg.tickets === 1 ? "Ticket" : "Tickets"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 bg-gray-900">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gold">${pkg.price}</span>
                    {pkg.discount && (
                      <div className="text-right">
                        <div className="text-sm text-gray-400 line-through">${originalPrice}</div>
                        <div className="text-sm text-green-400">Save ${savings}</div>
                      </div>
                    )}
                  </div>
                  {pkg.discount && (
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      {pkg.discount}% OFF
                    </Badge>
                  )}
                  <p className="text-sm text-gray-400">${(pkg.price / pkg.tickets).toFixed(2)} per ticket</p>
                </div>
              </CardContent>

              <CardFooter className="p-6 bg-gray-900">
                <Button
                  className={`w-full transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? "bg-gold hover:bg-gold/90 text-black"
                      : "bg-gray-700 hover:bg-gold hover:text-black text-white"
                  }`}
                >
                  {selectedPackage === pkg.id ? "Selected" : "Select Package"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Custom Package */}
      <Card className="border-2 border-gold bg-gray-900">
        <CardHeader className="bg-gradient-to-r from-gold to-yellow-600 text-black">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Custom Package
          </CardTitle>
          <CardDescription className="text-gray-800">Choose your own number of tickets</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-tickets" className="text-white">
                Number of Tickets
              </Label>
              <Input
                id="custom-tickets"
                type="number"
                min="1"
                max="10000"
                value={customTickets}
                onChange={(e) => setCustomTickets(e.target.value)}
                placeholder="Enter number of tickets"
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {customTickets && Number.parseInt(customTickets) > 0 && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Total Price:</span>
                  <span className="text-2xl font-bold text-gold">${customPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Price per ticket:</span>
                  <span>${(customPrice / Number.parseInt(customTickets)).toFixed(2)}</span>
                </div>
                {Number.parseInt(customTickets) > 1 && (
                  <div className="flex justify-between items-center text-sm text-green-400">
                    <span>You save:</span>
                    <span>${Number.parseInt(customTickets) * 5 - customPrice}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6">
          <Button
            className="w-full bg-gold hover:bg-gold/90 text-black font-semibold"
            disabled={!customTickets || Number.parseInt(customTickets) <= 0}
          >
            Select Custom Package
          </Button>
        </CardFooter>
      </Card>

      {/* Purchase Button */}
      {(selectedPackage || (customTickets && Number.parseInt(customTickets) > 0)) && (
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-gold to-yellow-600 hover:from-gold/90 hover:to-yellow-600/90 text-black font-bold px-12 py-4 text-lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  )
}
