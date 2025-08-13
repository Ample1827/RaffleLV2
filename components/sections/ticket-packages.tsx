"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export function TicketPackages() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [luckyNumberAmount, setLuckyNumberAmount] = useState("")
  const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([])
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [showLuckyDialog, setShowLuckyDialog] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [purchaseForm, setPurchaseForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    state: "",
    promoCode: "",
  })

  const handlePackageSelect = (packageId: number) => {
    setSelectedPackage(packageId)
  }

  const handleBuyNow = () => {
    setShowPurchaseDialog(true)
  }

  const handleFormChange = (field: string, value: string) => {
    setPurchaseForm((prev) => ({ ...prev, [field]: value }))
  }

  const applyPromoCode = () => {
    alert(`Applying promo code: ${purchaseForm.promoCode}`)
  }

  const handleCancel = () => {
    setShowPurchaseDialog(false)
    setPurchaseForm({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      state: "",
      promoCode: "",
    })
  }

  const handlePayNow = () => {
    alert("Processing payment...")
  }

  const generateLuckyNumbers = () => {
    const amount = Number.parseInt(luckyNumberAmount) || 0
    if (amount <= 0 || amount > 10000) return

    setIsGenerating(true)

    // Casino slot animation delay
    setTimeout(() => {
      const numbers = new Set<string>()
      while (numbers.size < amount) {
        const randomNum = Math.floor(Math.random() * 10000)
        numbers.add(randomNum.toString().padStart(4, "0"))
      }

      setGeneratedNumbers(Array.from(numbers))
      setSelectedTickets(Array.from(numbers))
      setIsGenerating(false)
    }, 3000) // 3 second animation
  }

  const toggleTicketSelection = (ticketNumber: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketNumber) ? prev.filter((t) => t !== ticketNumber) : [...prev, ticketNumber],
    )
  }

  const generateTicketNumbers = (sectionIndex: number) => {
    const startNum = sectionIndex * 1000
    const tickets = []

    for (let i = 0; i < 1000; i++) {
      const ticketNumber = startNum + i
      tickets.push({
        number: ticketNumber.toString().padStart(4, "0"),
        available: true, // All tickets are now available
      })
    }

    return tickets
  }

  const handlePurchaseFromTable = (sectionTickets: string[]) => {
    const selectedFromSection = selectedTickets.filter((ticket) => sectionTickets.includes(ticket))
    if (selectedFromSection.length > 0) {
      setShowPurchaseDialog(true)
    }
  }

  const getSelectedPackageInfo = () => {
    return ticketPackages.find((pkg) => pkg.id === selectedPackage)
  }

  const handleSaveAndBuyLucky = () => {
    setShowLuckyDialog(false)
    setShowPurchaseDialog(true)
  }

  return (
    <div className="space-y-8">
      <style jsx>{`
        @keyframes rainbow-glow {
          0% { box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000; }
          16.66% { box-shadow: 0 0 20px #ff8000, 0 0 40px #ff8000, 0 0 60px #ff8000; }
          33.33% { box-shadow: 0 0 20px #ffff00, 0 0 40px #ffff00, 0 0 60px #ffff00; }
          50% { box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00; }
          66.66% { box-shadow: 0 0 20px #0080ff, 0 0 40px #0080ff, 0 0 60px #0080ff; }
          83.33% { box-shadow: 0 0 20px #8000ff, 0 0 40px #8000ff, 0 0 60px #8000ff; }
          100% { box-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000; }
        }
        
        @keyframes slot-spin {
          0% { transform: rotateY(0deg); }
          25% { transform: rotateY(90deg); }
          50% { transform: rotateY(180deg); }
          75% { transform: rotateY(270deg); }
          100% { transform: rotateY(360deg); }
        }
        
        .rainbow-glow {
          animation: rainbow-glow 2s linear infinite;
          border: 3px solid transparent;
          background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0000);
          background-size: 400% 400%;
          animation: rainbow-glow 2s linear infinite, gradient-shift 3s ease infinite;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .slot-animation {
          animation: slot-spin 0.5s linear infinite;
        }
      `}</style>

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
              onClick={() => handlePackageSelect(pkg.id)}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    if (selectedPackage === pkg.id) {
                      handleBuyNow()
                    } else {
                      handlePackageSelect(pkg.id)
                    }
                  }}
                >
                  {selectedPackage === pkg.id ? "Buy Now" : "Select Package"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <Dialog open={showLuckyDialog} onOpenChange={setShowLuckyDialog}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rainbow-glow text-white font-bold px-16 py-8 text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              style={{
                background: "linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0000)",
                backgroundSize: "400% 400%",
              }}
              data-lucky-numbers-trigger
            >
              <Shuffle className="h-8 w-8 mr-4" />
              Draw Lucky Numbers
              <Sparkles className="h-8 w-8 ml-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-white border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-slate-800 mb-4">
                🎰 Lucky Number Generator 🎰
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label htmlFor="lucky-amount" className="text-slate-700 text-lg font-semibold">
                  How many tickets do you want to generate?
                </Label>
                <Input
                  id="lucky-amount"
                  type="number"
                  min="1"
                  max="10000"
                  value={luckyNumberAmount}
                  onChange={(e) => setLuckyNumberAmount(e.target.value)}
                  placeholder="Enter number of tickets"
                  className="mt-2 bg-slate-50 border-slate-200 text-slate-700 focus:border-amber-400 text-lg p-4"
                />
              </div>

              {isGenerating && (
                <div className="text-center py-8">
                  <div className="text-6xl slot-animation mb-4">🎰</div>
                  <div className="text-xl font-bold text-amber-600 mb-2">Generating Lucky Numbers...</div>
                  <div className="text-slate-600">🍀 Good luck is coming your way! 🍀</div>
                </div>
              )}

              {generatedNumbers.length > 0 && !isGenerating && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎉 Your Lucky Numbers! 🎉</div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg max-h-40 overflow-y-auto">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {generatedNumbers.map((number) => (
                          <Badge key={number} className="bg-amber-500 text-white text-lg px-3 py-1">
                            {number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="text-lg font-semibold text-slate-800">Total: {generatedNumbers.length} tickets</div>
                    <div className="text-xl font-bold text-amber-600">Price: ${generatedNumbers.length * 20}</div>
                  </div>

                  <Button
                    onClick={handleSaveAndBuyLucky}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 text-lg"
                  >
                    Save and Buy Now 🛒
                  </Button>
                </div>
              )}

              {!isGenerating && generatedNumbers.length === 0 && (
                <Button
                  onClick={generateLuckyNumbers}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 text-lg"
                  disabled={!luckyNumberAmount || Number.parseInt(luckyNumberAmount) <= 0}
                >
                  <Shuffle className="h-6 w-6 mr-2" />
                  Generate Lucky Numbers! 🎲
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-2xl bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 mb-2">Summary of tickets to reserve</DialogTitle>
            <p className="text-slate-600">Review the selected tickets and complete the form to continue.</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Selected Tickets Summary */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-700 mb-2">
                {selectedPackage ? getSelectedPackageInfo()?.tickets : selectedTickets.length} Selected Tickets
              </h3>
              {selectedPackage && (
                <p className="text-slate-600">
                  Package: {getSelectedPackageInfo()?.tickets} tickets for ${getSelectedPackageInfo()?.price}
                </p>
              )}
              {selectedTickets.length > 0 && !selectedPackage && (
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {selectedTickets.map((ticket) => (
                    <Badge key={ticket} variant="secondary" className="text-xs">
                      {ticket}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={purchaseForm.firstName}
                  onChange={(e) => handleFormChange("firstName", e.target.value)}
                  className="mt-1 bg-slate-50 border-slate-200"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={purchaseForm.lastName}
                  onChange={(e) => handleFormChange("lastName", e.target.value)}
                  className="mt-1 bg-slate-50 border-slate-200"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-slate-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={purchaseForm.phoneNumber}
                  onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                  className="mt-1 bg-slate-50 border-slate-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-slate-700">
                  State
                </Label>
                <Select value={purchaseForm.state} onValueChange={(value) => handleFormChange("state", value)}>
                  <SelectTrigger className="mt-1 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 max-h-60">
                    {usStates.map((state) => (
                      <SelectItem key={state} value={state} className="hover:bg-slate-50">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="promoCode" className="text-slate-700">
                  Promo Code
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="promoCode"
                    value={purchaseForm.promoCode}
                    onChange={(e) => handleFormChange("promoCode", e.target.value)}
                    className="bg-slate-50 border-slate-200"
                    placeholder="Enter promo code"
                  />
                  <Button
                    onClick={applyPromoCode}
                    variant="outline"
                    className="border-slate-200 hover:bg-amber-50 hover:border-amber-300 bg-transparent"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tickets:</span>
                  <span className="font-medium">
                    {selectedPackage ? getSelectedPackageInfo()?.tickets : selectedTickets.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Price per ticket:</span>
                  <span className="font-medium">$20.00</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="font-semibold text-slate-800">Total:</span>
                  <span className="font-bold text-amber-600 text-lg">
                    ${selectedPackage ? getSelectedPackageInfo()?.price : selectedTickets.length * 20}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-slate-200 hover:bg-slate-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayNow}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                Pay Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            const availableTickets = 1000

            return (
              <Dialog key={i}>
                <DialogTrigger asChild>
                  <Card
                    className="bg-slate-50 border-slate-200 hover:border-amber-400 transition-all duration-300 cursor-pointer hover:scale-105 shadow-md hover:shadow-lg"
                    data-section={i}
                  >
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
                            style={{ width: `100%` }}
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
                          variant="outline"
                          size="sm"
                          className={`h-8 text-xs ${
                            selectedTickets.includes(ticket.number)
                              ? "bg-amber-500 text-white border-amber-500"
                              : "border-slate-300 text-slate-700 bg-white hover:bg-amber-500 hover:text-white hover:border-amber-500"
                          }`}
                          onClick={() => toggleTicketSelection(ticket.number)}
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

      {selectedTickets.length > 0 && !selectedPackage && (
        <div className="text-center space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h4 className="text-amber-700 font-semibold mb-2">Selected Tickets: {selectedTickets.length}</h4>
            <p className="text-slate-700">Total: ${selectedTickets.length * 20}</p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-12 py-4 text-lg shadow-lg"
            onClick={() => setShowPurchaseDialog(true)}
          >
            Save and Buy Selected Tickets
          </Button>
        </div>
      )}
    </div>
  )
}
