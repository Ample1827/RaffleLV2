"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, ArrowRight, Search, Filter, Car, Home, Plane, Smartphone, Gift, Trophy } from "lucide-react"

const allPrizes = [
  {
    id: 1,
    title: "Luxury Tesla Model S",
    value: 95000,
    image: "red-tesla-model-s.png",
    ticketPrice: 25,
    totalTickets: 5000,
    soldTickets: 3200,
    timeLeft: "5 days",
    status: "Hot",
    category: "automotive",
    description: "Brand new Tesla Model S with full self-driving capability and premium interior.",
  },
  {
    id: 2,
    title: "Dream Vacation to Maldives",
    value: 15000,
    image: "maldives-bungalow.png",
    ticketPrice: 10,
    totalTickets: 2000,
    soldTickets: 1800,
    timeLeft: "12 days",
    status: "Almost Sold Out",
    category: "travel",
    description: "7-day luxury resort stay in the Maldives with overwater bungalow and all meals included.",
  },
  {
    id: 3,
    title: "Apple MacBook Pro + iPhone Bundle",
    value: 5000,
    image: "placeholder-al9ry.png",
    ticketPrice: 5,
    totalTickets: 1500,
    soldTickets: 450,
    timeLeft: "20 days",
    status: "New",
    category: "electronics",
    description: "Latest MacBook Pro 16-inch with M3 chip plus iPhone 15 Pro Max.",
  },
  {
    id: 4,
    title: "Luxury Sports Car - Porsche 911",
    value: 120000,
    image: "luxury-sports-car.png",
    ticketPrice: 50,
    totalTickets: 3000,
    soldTickets: 1200,
    timeLeft: "15 days",
    status: "Premium",
    category: "automotive",
    description: "Brand new Porsche 911 Carrera S with premium package and custom paint.",
  },
  {
    id: 5,
    title: "Modern Dream House",
    value: 500000,
    image: "modern-house.png",
    ticketPrice: 100,
    totalTickets: 10000,
    soldTickets: 2500,
    timeLeft: "30 days",
    status: "Mega Prize",
    category: "real-estate",
    description: "Fully furnished 4-bedroom modern house with smart home technology.",
  },
  {
    id: 6,
    title: "Luxury Vacation Resort Package",
    value: 25000,
    image: "luxury-vacation-resort.png",
    ticketPrice: 15,
    totalTickets: 2500,
    soldTickets: 800,
    timeLeft: "18 days",
    status: "Exclusive",
    category: "travel",
    description: "14-day luxury resort package to Bora Bora with private villa and activities.",
  },
  {
    id: 7,
    title: "Cash Prize - $50,000",
    value: 50000,
    image: "cash-money-gold.png",
    ticketPrice: 20,
    totalTickets: 4000,
    soldTickets: 3500,
    timeLeft: "3 days",
    status: "Ending Soon",
    category: "cash",
    description: "Pure cash prize - $50,000 deposited directly to your account.",
  },
  {
    id: 8,
    title: "Gaming Setup Ultimate",
    value: 8000,
    image: "placeholder-grmu9.png",
    ticketPrice: 8,
    totalTickets: 1200,
    soldTickets: 300,
    timeLeft: "25 days",
    status: "New",
    category: "electronics",
    description: "Complete gaming setup with RTX 4090, 4K monitors, and premium peripherals.",
  },
]

const categories = [
  { id: "all", name: "All Categories", icon: Gift },
  { id: "automotive", name: "Automotive", icon: Car },
  { id: "real-estate", name: "Real Estate", icon: Home },
  { id: "travel", name: "Travel", icon: Plane },
  { id: "electronics", name: "Electronics", icon: Smartphone },
  { id: "cash", name: "Cash Prizes", icon: Trophy },
]

export function PrizeViewingSystem() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("value-desc")
  const [activeTab, setActiveTab] = useState("all")

  const filteredPrizes = allPrizes
    .filter((prize) => {
      const matchesSearch = prize.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || prize.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "value-desc":
          return b.value - a.value
        case "value-asc":
          return a.value - b.value
        case "time-asc":
          return Number.parseInt(a.timeLeft) - Number.parseInt(b.timeLeft)
        case "popularity":
          return b.soldTickets / b.totalTickets - a.soldTickets / a.totalTickets
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot":
        return "bg-red-500"
      case "Almost Sold Out":
        return "bg-orange-500"
      case "Ending Soon":
        return "bg-red-600"
      case "New":
        return "bg-green-500"
      case "Premium":
        return "bg-purple-500"
      case "Mega Prize":
        return "bg-gold"
      case "Exclusive":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search prizes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value-desc">Highest Value</SelectItem>
              <SelectItem value="value-asc">Lowest Value</SelectItem>
              <SelectItem value="time-asc">Ending Soon</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-white">
            <Filter className="h-4 w-4" />
            <span className="text-sm">{filteredPrizes.length} prizes found</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-900/50 border border-gray-700">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 data-[state=active]:bg-gold data-[state=active]:text-black"
                onClick={() => setSelectedCategory(category.id)}
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={activeTab} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrizes.map((prize) => (
              <Card
                key={prize.id}
                className="overflow-hidden border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:border-gold/50 transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img src={prize.image || "./placeholder.svg"} alt={prize.title} className="w-full h-48 object-cover" />
                  <Badge className={`absolute top-4 left-4 ${getStatusColor(prize.status)} text-white`}>
                    {prize.status}
                  </Badge>
                  <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-full font-bold">
                    ${prize.value.toLocaleString()}
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{prize.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{prize.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Ticket Price:</span>
                      <span className="font-bold text-gold">${prize.ticketPrice}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Time Left:
                      </span>
                      <span className="font-bold text-white">{prize.timeLeft}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Sold:
                      </span>
                      <span className="font-bold text-white">
                        {prize.soldTickets.toLocaleString()} / {prize.totalTickets.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(prize.soldTickets / prize.totalTickets) * 100}%` }}
                      />
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      {Math.round((prize.soldTickets / prize.totalTickets) * 100)}% sold
                    </div>
                  </div>

                  <Button className="w-full bg-gold hover:bg-gold/90 text-black font-semibold">
                    Buy Tickets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrizes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No prizes found matching your criteria</div>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-black"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
