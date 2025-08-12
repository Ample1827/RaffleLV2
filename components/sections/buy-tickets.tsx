"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Ticket, CreditCard, Shield, Zap, Plus, Minus } from "lucide-react"

const ticketPackages = [
  {
    id: 1,
    name: "Starter Pack",
    tickets: 5,
    price: 25,
    originalPrice: 30,
    popular: false,
    bonus: "1 Free Ticket",
  },
  {
    id: 2,
    name: "Popular Pack",
    tickets: 15,
    price: 60,
    originalPrice: 75,
    popular: true,
    bonus: "5 Free Tickets",
  },
  {
    id: 3,
    name: "Premium Pack",
    tickets: 50,
    price: 150,
    originalPrice: 200,
    popular: false,
    bonus: "20 Free Tickets",
  },
]

export function BuyTickets() {
  const [selectedPackage, setSelectedPackage] = useState(2)
  const [customTickets, setCustomTickets] = useState(10)
  const [paymentMethod, setPaymentMethod] = useState("card")

  const calculateCustomPrice = (tickets: number) => {
    const basePrice = 5
    const discount = tickets >= 20 ? 0.2 : tickets >= 10 ? 0.1 : 0
    return tickets * basePrice * (1 - discount)
  }

  return (
    <section className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Ticket className="w-4 h-4" />
            Buy Tickets
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gold-gradient bg-clip-text text-transparent">Get Your Lucky Tickets</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our premium ticket packages or customize your own bundle
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {ticketPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`premium-card cursor-pointer transition-all duration-300 ${
                selectedPackage === pkg.id ? "ring-2 ring-gold" : ""
              } ${pkg.popular ? "scale-105" : ""}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gold text-gold-foreground px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                  <span className="text-lg line-through text-muted-foreground ml-2">${pkg.originalPrice}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gold mb-2">{pkg.tickets}</div>
                  <div className="text-sm text-muted-foreground">Raffle Tickets</div>
                  <div className="text-sm text-gold font-medium mt-2">+ {pkg.bonus}</div>
                </div>
                <Button
                  className={`w-full ${
                    selectedPackage === pkg.id
                      ? "bg-gold hover:bg-gold/90 text-gold-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {selectedPackage === pkg.id ? "Selected" : "Select Package"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold" />
                Complete Your Purchase
              </CardTitle>
              <CardDescription>Secure checkout with instant ticket delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom Ticket Option */}
              <div className="p-6 bg-card/50 rounded-lg border">
                <Label className="text-base font-medium mb-4 block">Or customize your ticket count:</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCustomTickets(Math.max(1, customTickets - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={customTickets}
                    onChange={(e) => setCustomTickets(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="text-center w-24"
                    min="1"
                  />
                  <Button variant="outline" size="icon" onClick={() => setCustomTickets(customTickets + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <div className="ml-auto text-right">
                    <div className="text-lg font-bold">${calculateCustomPrice(customTickets)}</div>
                    <div className="text-sm text-muted-foreground">
                      {customTickets >= 10 && (
                        <span className="text-gold">
                          {customTickets >= 20 ? "20% discount applied!" : "10% discount applied!"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold">Order Summary</h3>
                <div className="flex justify-between">
                  <span>Selected Package:</span>
                  <span className="font-medium">
                    {selectedPackage ? ticketPackages.find((p) => p.id === selectedPackage)?.name : "Custom"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tickets:</span>
                  <span className="font-medium text-gold">
                    {selectedPackage ? ticketPackages.find((p) => p.id === selectedPackage)?.tickets : customTickets}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Price:</span>
                  <span className="text-gold">
                    $
                    {selectedPackage
                      ? ticketPackages.find((p) => p.id === selectedPackage)?.price
                      : calculateCustomPrice(customTickets)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Security Features */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gold" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold" />
                  Instant Delivery
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-gold" />
                  Verified Tickets
                </div>
              </div>

              <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground text-lg py-6">
                Complete Purchase - $
                {selectedPackage
                  ? ticketPackages.find((p) => p.id === selectedPackage)?.price
                  : calculateCustomPrice(customTickets)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
