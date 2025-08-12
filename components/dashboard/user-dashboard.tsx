"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Ticket,
  Trophy,
  CreditCard,
  History,
  User,
  TrendingUp,
  Calendar,
  DollarSign,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { PaymentForm } from "@/components/dashboard/payment-form"

const userStats = {
  totalTickets: 247,
  activeEntries: 12,
  totalSpent: 1250,
  prizesWon: 3,
  winRate: 12.5,
}

const userTickets = [
  {
    id: 1,
    drawTitle: "Weekly Mega Draw",
    ticketNumbers: ["A001234", "A001235", "A001236"],
    purchaseDate: "2024-01-10",
    status: "active",
    drawDate: "2024-01-15",
    prizeValue: "$95,000",
  },
  {
    id: 2,
    drawTitle: "Daily Cash Draw",
    ticketNumbers: ["B005678", "B005679", "B005680"],
    purchaseDate: "2024-01-11",
    status: "active",
    drawDate: "2024-01-12",
    prizeValue: "$5,000",
  },
  {
    id: 3,
    drawTitle: "Electronics Bonanza",
    ticketNumbers: ["C012345", "C012346", "C012347", "C012348", "C012349"],
    purchaseDate: "2024-01-09",
    status: "active",
    drawDate: "2024-01-18",
    prizeValue: "$8,000",
  },
  {
    id: 4,
    drawTitle: "New Year Special",
    ticketNumbers: ["D098765", "D098766"],
    purchaseDate: "2024-01-05",
    status: "completed",
    drawDate: "2024-01-10",
    prizeValue: "$500,000",
    result: "No win",
  },
]

const purchaseHistory = [
  {
    id: 1,
    date: "2024-01-11",
    description: "Daily Cash Draw - 3 tickets",
    amount: 6,
    status: "completed",
    paymentMethod: "Stripe",
  },
  {
    id: 2,
    date: "2024-01-10",
    description: "Weekly Mega Draw - 3 tickets",
    amount: 15,
    status: "completed",
    paymentMethod: "PayPal",
  },
  {
    id: 3,
    date: "2024-01-09",
    description: "Electronics Bonanza - 5 tickets",
    amount: 40,
    status: "completed",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    date: "2024-01-08",
    description: "Premium Luxury Draw - 2 tickets",
    amount: 50,
    status: "pending",
    paymentMethod: "Mercado Pago",
  },
]

const winHistory = [
  {
    id: 1,
    date: "2024-01-05",
    prize: "iPhone 15 Pro",
    value: 1200,
    drawTitle: "Tech Gadgets Draw",
    status: "claimed",
  },
  {
    id: 2,
    date: "2023-12-20",
    prize: "Weekend Getaway",
    value: 800,
    drawTitle: "Holiday Special",
    status: "claimed",
  },
  {
    id: 3,
    date: "2023-12-10",
    prize: "Cash Prize",
    value: 500,
    drawTitle: "Daily Cash Draw",
    status: "claimed",
  },
]

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder-user.png" alt="User" />
            <AvatarFallback className="bg-gold text-black text-xl font-bold">JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, John!</h1>
            <p className="text-gray-400">Member since December 2023</p>
          </div>
        </div>
        <Button onClick={() => setShowPaymentForm(true)} className="bg-gold hover:bg-gold/90 text-black font-semibold">
          <CreditCard className="mr-2 h-4 w-4" />
          Buy More Tickets
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tickets</p>
                <p className="text-2xl font-bold text-white">{userStats.totalTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Entries</p>
                <p className="text-2xl font-bold text-white">{userStats.activeEntries}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-white">${userStats.totalSpent}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Prizes Won</p>
                <p className="text-2xl font-bold text-white">{userStats.prizesWon}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">{userStats.winRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <User className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tickets" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <Ticket className="mr-2 h-4 w-4" />
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <History className="mr-2 h-4 w-4" />
            Purchase History
          </TabsTrigger>
          <TabsTrigger value="wins" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <Trophy className="mr-2 h-4 w-4" />
            My Wins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {purchaseHistory.slice(0, 3).map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{purchase.description}</p>
                      <p className="text-gray-400 text-sm">{purchase.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-bold">${purchase.amount}</p>
                      <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Draws */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="h-5 w-5 text-gold" />
                  Active Draws
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userTickets
                  .filter((ticket) => ticket.status === "active")
                  .slice(0, 3)
                  .map((ticket) => (
                    <div key={ticket.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-medium">{ticket.drawTitle}</p>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-400">{ticket.ticketNumbers.length} tickets</p>
                        <p className="text-gold">Draw: {ticket.drawDate}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="mt-8">
          <div className="space-y-6">
            {userTickets.map((ticket) => (
              <Card key={ticket.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{ticket.drawTitle}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Purchased on {ticket.purchaseDate} • Draw on {ticket.drawDate}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={ticket.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                        {ticket.status === "active" ? "Active" : "Completed"}
                      </Badge>
                      <p className="text-gold font-bold mt-1">{ticket.prizeValue}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-white font-medium mb-2">Your Ticket Numbers:</p>
                      <div className="flex flex-wrap gap-2">
                        {ticket.ticketNumbers.map((number) => (
                          <Badge key={number} variant="outline" className="border-gold text-gold">
                            {number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {ticket.result && (
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400 text-sm">Result:</p>
                        <p className="text-white">{ticket.result}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Purchase History</CardTitle>
              <CardDescription className="text-gray-400">All your ticket purchases and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseHistory.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          purchase.status === "completed" ? "bg-green-500/20" : "bg-orange-500/20"
                        }`}
                      >
                        {purchase.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{purchase.description}</p>
                        <p className="text-gray-400 text-sm">
                          {purchase.date} • {purchase.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-bold">${purchase.amount}</p>
                      <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wins" className="mt-8">
          <div className="space-y-6">
            {winHistory.length > 0 ? (
              winHistory.map((win) => (
                <Card key={win.id} className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold/20 rounded-lg">
                          <Trophy className="h-6 w-6 text-gold" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{win.prize}</h3>
                          <p className="text-gray-400">
                            {win.drawTitle} • {win.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gold font-bold text-xl">${win.value.toLocaleString()}</p>
                        <Badge className="bg-green-500 text-white">{win.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-12 text-center">
                  <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-bold mb-2">No wins yet</h3>
                  <p className="text-gray-400 mb-6">Keep playing for your chance to win amazing prizes!</p>
                  <Button
                    onClick={() => setShowPaymentForm(true)}
                    className="bg-gold hover:bg-gold/90 text-black font-semibold"
                  >
                    Buy More Tickets
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Form Modal */}
      {showPaymentForm && <PaymentForm onClose={() => setShowPaymentForm(false)} />}
    </div>
  )
}
