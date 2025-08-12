"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Users, Ticket, Trophy, Star, Gift, Zap, CheckCircle, AlertCircle, Timer } from "lucide-react"

const activeDraws = [
  {
    id: 1,
    title: "Weekly Mega Draw",
    description: "Our biggest weekly draw with multiple prizes",
    prizes: ["Tesla Model S ($95,000)", "Vacation Package ($15,000)", "Cash Prize ($10,000)"],
    drawDate: "2024-01-15",
    drawTime: "8:00 PM EST",
    totalEntries: 15000,
    maxEntries: 20000,
    entryFee: 5,
    minTickets: 1,
    maxTickets: 100,
    status: "active",
    category: "mega",
    timeLeft: "3 days, 14 hours",
    userEntries: 0,
  },
  {
    id: 2,
    title: "Daily Cash Draw",
    description: "Quick daily draw with guaranteed cash prizes",
    prizes: ["$5,000 Cash", "$2,000 Cash", "$1,000 Cash"],
    drawDate: "2024-01-12",
    drawTime: "6:00 PM EST",
    totalEntries: 2500,
    maxEntries: 5000,
    entryFee: 2,
    minTickets: 1,
    maxTickets: 25,
    status: "active",
    category: "daily",
    timeLeft: "8 hours",
    userEntries: 3,
  },
  {
    id: 3,
    title: "Premium Luxury Draw",
    description: "Exclusive draw for premium prizes",
    prizes: ["Porsche 911 ($120,000)", "Rolex Collection ($25,000)", "Designer Jewelry ($10,000)"],
    drawDate: "2024-01-20",
    drawTime: "9:00 PM EST",
    totalEntries: 5000,
    maxEntries: 8000,
    entryFee: 25,
    minTickets: 2,
    maxTickets: 50,
    status: "active",
    category: "premium",
    timeLeft: "8 days, 5 hours",
    userEntries: 0,
  },
  {
    id: 4,
    title: "Electronics Bonanza",
    description: "Latest tech gadgets and electronics",
    prizes: ["MacBook Pro + iPhone Bundle", "Gaming Setup", "Smart Home Package"],
    drawDate: "2024-01-18",
    drawTime: "7:00 PM EST",
    totalEntries: 8000,
    maxEntries: 12000,
    entryFee: 8,
    minTickets: 1,
    maxTickets: 75,
    status: "active",
    category: "electronics",
    timeLeft: "6 days, 2 hours",
    userEntries: 5,
  },
  {
    id: 5,
    title: "Travel Adventure Draw",
    description: "Amazing travel experiences worldwide",
    prizes: ["Maldives Luxury Resort", "European Tour Package", "Adventure Sports Package"],
    drawDate: "2024-01-25",
    drawTime: "8:30 PM EST",
    totalEntries: 3500,
    maxEntries: 6000,
    entryFee: 12,
    minTickets: 1,
    maxTickets: 40,
    status: "active",
    category: "travel",
    timeLeft: "13 days, 10 hours",
    userEntries: 0,
  },
  {
    id: 6,
    title: "New Year Special",
    description: "Special draw to celebrate the new year",
    prizes: ["Dream House ($500,000)", "Luxury Car Collection", "Cash Bonanza ($100,000)"],
    drawDate: "2024-01-10",
    drawTime: "11:59 PM EST",
    totalEntries: 18000,
    maxEntries: 18000,
    entryFee: 50,
    minTickets: 5,
    maxTickets: 200,
    status: "closed",
    category: "special",
    timeLeft: "Draw completed",
    userEntries: 15,
  },
]

const drawCategories = [
  { id: "all", name: "All Draws", icon: Gift },
  { id: "mega", name: "Mega Draws", icon: Trophy },
  { id: "daily", name: "Daily Draws", icon: Clock },
  { id: "premium", name: "Premium", icon: Star },
  { id: "electronics", name: "Electronics", icon: Zap },
  { id: "travel", name: "Travel", icon: Calendar },
  { id: "special", name: "Special", icon: Gift },
]

export function DrawEntrySystem() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [entryAmounts, setEntryAmounts] = useState<Record<number, number>>({})
  const [activeTab, setActiveTab] = useState("active")

  const filteredDraws = activeDraws.filter((draw) => {
    if (selectedCategory === "all") return true
    return draw.category === selectedCategory
  })

  const activeDrawsFiltered = filteredDraws.filter((draw) => draw.status === "active")
  const closedDrawsFiltered = filteredDraws.filter((draw) => draw.status === "closed")

  const handleEntryChange = (drawId: number, amount: number) => {
    setEntryAmounts((prev) => ({ ...prev, [drawId]: amount }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      case "ending-soon":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = drawCategories.find((cat) => cat.id === category)
    return categoryData ? categoryData.icon : Gift
  }

  const renderDrawCard = (draw: any) => {
    const IconComponent = getCategoryIcon(draw.category)
    const entryAmount = entryAmounts[draw.id] || draw.minTickets
    const totalCost = entryAmount * draw.entryFee
    const progressPercentage = (draw.totalEntries / draw.maxEntries) * 100

    return (
      <Card
        key={draw.id}
        className="overflow-hidden border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:border-gold/50 transition-all duration-300"
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/20 rounded-lg">
                <IconComponent className="h-6 w-6 text-gold" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">{draw.title}</CardTitle>
                <CardDescription className="text-gray-400">{draw.description}</CardDescription>
              </div>
            </div>
            <Badge className={`${getStatusColor(draw.status)} text-white`}>
              {draw.status === "active" ? "Active" : "Closed"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Prizes */}
          <div>
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />
              Prizes
            </h4>
            <div className="space-y-1">
              {draw.prizes.map((prize: string, index: number) => (
                <div key={index} className="text-sm text-gray-300 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                  {prize}
                </div>
              ))}
            </div>
          </div>

          {/* Draw Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Draw Date:</span>
              </div>
              <div className="text-white font-medium">{draw.drawDate}</div>
              <div className="text-white font-medium">{draw.drawTime}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Timer className="h-4 w-4" />
                <span>Time Left:</span>
              </div>
              <div className="text-white font-medium">{draw.timeLeft}</div>
            </div>
          </div>

          {/* Entry Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Entries
              </span>
              <span className="text-white text-sm">
                {draw.totalEntries.toLocaleString()} / {draw.maxEntries.toLocaleString()}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-right text-xs text-gray-400 mt-1">{progressPercentage.toFixed(1)}% filled</div>
          </div>

          {/* User's Current Entries */}
          {draw.userEntries > 0 && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">You have {draw.userEntries} entries in this draw</span>
              </div>
            </div>
          )}

          {/* Entry Form */}
          {draw.status === "active" && (
            <div className="space-y-3 pt-2 border-t border-gray-700">
              <div>
                <Label htmlFor={`entries-${draw.id}`} className="text-white text-sm">
                  Number of Entries
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id={`entries-${draw.id}`}
                    type="number"
                    min={draw.minTickets}
                    max={draw.maxTickets}
                    value={entryAmount}
                    onChange={(e) => handleEntryChange(draw.id, Number.parseInt(e.target.value) || draw.minTickets)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <div className="text-sm text-gray-400">${draw.entryFee} each</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Min: {draw.minTickets} | Max: {draw.maxTickets}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-white">Total Cost:</span>
                <span className="text-gold font-bold text-lg">${totalCost}</span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4">
          {draw.status === "active" ? (
            <Button className="w-full bg-gold hover:bg-gold/90 text-black font-semibold">
              <Ticket className="mr-2 h-4 w-4" />
              Enter Draw - ${totalCost}
            </Button>
          ) : (
            <Button disabled className="w-full bg-gray-600 text-gray-400 cursor-not-allowed">
              <AlertCircle className="mr-2 h-4 w-4" />
              Draw Closed
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {drawCategories.map((category) => {
          const IconComponent = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-gold text-black hover:bg-gold/90"
                  : "border-gray-600 text-gray-300 hover:border-gold hover:text-gold"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {category.name}
            </Button>
          )
        })}
      </div>

      {/* Tabs for Active/Closed Draws */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-700">
          <TabsTrigger value="active" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Active Draws ({activeDrawsFiltered.length})
          </TabsTrigger>
          <TabsTrigger value="closed" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Closed Draws ({closedDrawsFiltered.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{activeDrawsFiltered.map(renderDrawCard)}</div>
          {activeDrawsFiltered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No active draws in this category</div>
              <Button
                onClick={() => setSelectedCategory("all")}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-black"
              >
                View All Categories
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{closedDrawsFiltered.map(renderDrawCard)}</div>
          {closedDrawsFiltered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No closed draws in this category</div>
              <Button
                onClick={() => setSelectedCategory("all")}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-black"
              >
                View All Categories
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
