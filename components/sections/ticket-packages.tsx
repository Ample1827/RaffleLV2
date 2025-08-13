"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Zap, Sparkles, Shuffle, ShoppingCart } from "lucide-react"

const ticketPackages = [
  {
    id: 1,
    tickets: 10,
    price: 200,
    originalPrice: 250,
    popular: true,
    icon: Star,
    color: "from-amber-400 to-amber-500",
  },
  {
    id: 2,
    tickets: 15,
    price: 325,
    originalPrice: 375,
    popular: false,
    icon: Zap,
    color: "from-emerald-400 to-emerald-500",
  },
  {
    id: 3,
    tickets: 20,
    price: 400,
    originalPrice: 500,
    popular: false,
    icon: Sparkles,
    color: "from-rose-400 to-rose-500",
  },
]

export function TicketPackages() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [luckyNumberAmount, setLuckyNumberAmount] = useState("")
  const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([])

  const generateLuckyNumbers = () => {
    const amount = Number.parseInt(luckyNumberAmount) || 0
    if (amount <= 0 || amount > 10000) return

    const numbers = new Set<string>()
    while (numbers.size < amount) {
      const randomNum = Math.floor(Math.random() * 10000)
      numbers.add(randomNum.toString().padStart(4, "0"))
    }

    setGeneratedNumbers(Array.from(numbers))
    setSelectedTickets(Array.from(numbers))
  }

  const toggleTicketSelection = (ticketNumber: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketNumber) ? prev.filter((t) => t !== ticketNumber) : [...prev, ticketNumber],
    )
  }

  // Generate detailed ticket numbers for a section
  const generateTicketNumbers = (sectionIndex: number) => {
    const startNum = sectionIndex * 1000
    const tickets = []

    for (let i = 0; i < 1000; i++) {
      const ticketNumber = startNum + i
      const isAvailable = Math.random() > 0.2 // 80% chance of being available
      tickets.push({
        number: ticketNumber.toString().padStart(4, "0"),
        available: isAvailable,
      })
    }

    return tickets
  }

  const handlePurchaseFromTable = (sectionTickets: string[]) => {
    const selectedFromSection = selectedTickets.filter((ticket) => sectionTickets.includes(ticket))
    if (selectedFromSection.length > 0) {
      // Handle purchase logic here
      alert(`Purchasing ${selectedFromSection.length} tickets: ${selectedFromSection.join(", ")}`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ticketPackages.map((pkg) => {
          const IconComponent = pkg.icon
          const savings = pkg.originalPrice - pkg.price

          return (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 cursor-pointer bg-white shadow-lg ${
                selectedPackage === pkg.id
                  ? "border-amber-500 shadow-xl shadow-amber-200"
                  : "border-slate-200 hover:border-amber-300"
              } ${pkg.popular ? "ring-2 ring-amber-400" : ""}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <Badge className="absolute top-2 right-2 bg-amber-500 text-white font-semibold">Most Popular</Badge>
              )}

              <CardHeader className={`bg-gradient-to-r ${pkg.color} text-white`}>
                <div className="flex items-center justify-between">
                  <IconComponent className="h-8 w-8" />
                  <div className="text-right">
                    <CardTitle className="text-2xl font-bold">{pkg.tickets}</CardTitle>
                    <CardDescription className="text-white/90">Tickets</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 bg-white">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-amber-600">${pkg.price}</span>
                    <div className="text-right">
                      <div className="text-sm text-slate-400 line-through">${pkg.originalPrice}</div>
                      <div className="text-sm text-emerald-600">Save ${savings}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    {Math.round((savings / pkg.originalPrice) * 100)}% OFF
                  </Badge>
                  <p className="text-sm text-slate-500">${(pkg.price / pkg.tickets).toFixed(2)} per ticket</p>
                </div>
              </CardContent>

              <CardFooter className="p-6 bg-white">
                <Button
                  className={`w-full transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-700 border border-slate-200"
                  }`}
                >
                  {selectedPackage === pkg.id ? "Selected" : "Select Package"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white border-amber-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-400 to-amber-500 text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Shuffle className="h-6 w-6" />
            Draw Lucky Numbers
          </CardTitle>
          <CardDescription className="text-white/90">Generate random ticket numbers</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="lucky-amount" className="text-slate-700 text-sm">
                Number of Tickets
              </Label>
              <Input
                id="lucky-amount"
                type="number"
                min="1"
                max="10000"
                value={luckyNumberAmount}
                onChange={(e) => setLuckyNumberAmount(e.target.value)}
                placeholder="Enter amount"
                className="mt-1 bg-slate-50 border-slate-200 text-slate-700 focus:border-amber-400"
              />
            </div>
            <Button
              onClick={generateLuckyNumbers}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              disabled={!luckyNumberAmount || Number.parseInt(luckyNumberAmount) <= 0}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>

          {generatedNumbers.length > 0 && (
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="text-amber-700 font-semibold mb-2">Generated Numbers:</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {generatedNumbers.map((number) => (
                  <Badge key={number} className="bg-amber-500 text-white">
                    {number}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Available <span className="text-amber-600">Ticket Numbers</span>
          </h2>
          <p className="text-slate-600">10,000 tickets available - Choose your lucky numbers!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, i) => {
            const startNum = i * 1000
            const endNum = startNum + 999
            const availableTickets = Math.floor(Math.random() * 200) + 800

            return (
              <Dialog key={i}>
                <DialogTrigger asChild>
                  <Card className="bg-slate-50 border-slate-200 hover:border-amber-400 transition-all duration-300 cursor-pointer hover:scale-105 shadow-md hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-slate-700 text-center">
                        {startNum.toString().padStart(4, "0")} - {endNum.toString().padStart(4, "0")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">{availableTickets}</div>
                        <div className="text-sm text-slate-500">Available</div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(availableTickets / 1000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[80vh] bg-white border-slate-200">
                  <DialogHeader>
                    <DialogTitle className="text-amber-600 text-xl">
                      Tickets {startNum.toString().padStart(4, "0")} - {endNum.toString().padStart(4, "0")}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-10 gap-2 p-4">
                      {generateTicketNumbers(i).map((ticket) => (
                        <Button
                          key={ticket.number}
                          variant={ticket.available ? "outline" : "secondary"}
                          size="sm"
                          className={`h-8 text-xs ${
                            ticket.available
                              ? selectedTickets.includes(ticket.number)
                                ? "bg-amber-500 text-white border-amber-500"
                                : "border-slate-300 text-slate-700 bg-white hover:bg-amber-500 hover:text-white hover:border-amber-500"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                          disabled={!ticket.available}
                          onClick={() => ticket.available && toggleTicketSelection(ticket.number)}
                        >
                          {ticket.number}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-slate-300 bg-white rounded"></div>
                        <span className="text-slate-600">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-200 rounded"></div>
                        <span className="text-slate-600">Sold</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded"></div>
                        <span className="text-slate-600">Selected</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-amber-600 font-semibold">{availableTickets} tickets available</p>
                      {selectedTickets.filter((ticket) => {
                        const ticketNum = Number.parseInt(ticket)
                        return ticketNum >= startNum && ticketNum <= endNum
                      }).length > 0 && (
                        <Button
                          onClick={() => handlePurchaseFromTable(generateTicketNumbers(i).map((t) => t.number))}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Purchase Selected
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          })}
        </div>
      </div>

      {(selectedPackage || selectedTickets.length > 0) && (
        <div className="text-center space-y-4">
          {selectedTickets.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h4 className="text-amber-700 font-semibold mb-2">Selected Tickets: {selectedTickets.length}</h4>
              <p className="text-slate-700">Total: ${selectedTickets.length * 20}</p>
            </div>
          )}
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-12 py-4 text-lg shadow-lg"
          >
            {selectedTickets.length > 0 ? "Save and Buy Selected Tickets" : "Proceed to Checkout"}
          </Button>
        </div>
      )}
    </div>
  )
}
