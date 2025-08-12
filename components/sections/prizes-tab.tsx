"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Gift, Star, Clock, Users } from "lucide-react"

const prizeCategories = {
  grand: [
    {
      id: 1,
      name: "Luxury Sports Car",
      value: "$150,000",
      image: "/luxury-sports-car.png",
      description: "Brand new premium sports car with all features",
      odds: "1 in 10,000",
      timeLeft: "5 days",
    },
    {
      id: 2,
      name: "Dream House Down Payment",
      value: "$100,000",
      image: "/modern-house.png",
      description: "Cash prize for your dream home",
      odds: "1 in 8,000",
      timeLeft: "5 days",
    },
  ],
  weekly: [
    {
      id: 3,
      name: "Premium Electronics Bundle",
      value: "$5,000",
      image: "/placeholder-grmu9.png",
      description: "Latest tech gadgets and devices",
      odds: "1 in 500",
      timeLeft: "2 days",
    },
    {
      id: 4,
      name: "Luxury Vacation Package",
      value: "$3,000",
      image: "/luxury-vacation-resort.png",
      description: "All-inclusive resort getaway",
      odds: "1 in 300",
      timeLeft: "2 days",
    },
  ],
  daily: [
    {
      id: 5,
      name: "Cash Prize",
      value: "$500",
      image: "cash-money-gold.png",
      description: "Instant cash reward",
      odds: "1 in 50",
      timeLeft: "18 hours",
    },
    {
      id: 6,
      name: "Shopping Spree",
      value: "$300",
      image: "/luxury-shopping-bags.png",
      description: "Premium shopping vouchers",
      odds: "1 in 30",
      timeLeft: "18 hours",
    },
  ],
}

export function PrizesTab() {
  const [activeTab, setActiveTab] = useState("grand")

  return (
    <section className="py-24 bg-premium-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Premium Prizes
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gold-gradient bg-clip-text text-transparent">Exclusive Prize Categories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our carefully curated prize categories, each offering incredible rewards
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="grand" className="data-[state=active]:bg-gold data-[state=active]:text-gold-foreground">
              <Trophy className="w-4 h-4 mr-2" />
              Grand Prizes
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-gold data-[state=active]:text-gold-foreground"
            >
              <Gift className="w-4 h-4 mr-2" />
              Weekly Draws
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-gold data-[state=active]:text-gold-foreground">
              <Star className="w-4 h-4 mr-2" />
              Daily Rewards
            </TabsTrigger>
          </TabsList>

          {Object.entries(prizeCategories).map(([category, prizes]) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 gap-8">
                {prizes.map((prize) => (
                  <Card key={prize.id} className="premium-card group hover:scale-105 transition-all duration-300">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={prize.image || "/placeholder.svg"}
                        alt={prize.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gold text-gold-foreground font-bold">{prize.value}</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {prize.timeLeft}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{prize.name}</CardTitle>
                      <CardDescription className="text-base">{prize.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          Odds: {prize.odds}
                        </div>
                      </div>
                      <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">Enter This Draw</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
