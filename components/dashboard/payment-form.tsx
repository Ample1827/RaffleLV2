"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, CreditCard, Smartphone, Building, DollarSign, Shield, CheckCircle } from "lucide-react"

interface PaymentFormProps {
  onClose: () => void
}

const ticketPackages = [
  { id: 1, tickets: 1, price: 5, popular: false },
  { id: 2, tickets: 5, price: 20, popular: false, discount: 20 },
  { id: 3, tickets: 10, price: 35, popular: true, discount: 30 },
  { id: 4, tickets: 25, price: 70, popular: false, discount: 44 },
  { id: 5, tickets: 50, price: 125, popular: false, discount: 50 },
  { id: 6, tickets: 100, price: 200, popular: false, discount: 60 },
]

export function PaymentForm({ onClose }: PaymentFormProps) {
  const [selectedPackage, setSelectedPackage] = useState(ticketPackages[2])
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsCompleted(true)
    }, 3000)
  }

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-400">Your tickets have been added to your account</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-white font-semibold">{selectedPackage.tickets} Tickets Purchased</p>
              <p className="text-gold text-xl font-bold">${selectedPackage.price}</p>
            </div>
            <Button onClick={onClose} className="w-full bg-gold hover:bg-gold/90 text-black font-semibold">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white text-2xl">Purchase Tickets</CardTitle>
            <CardDescription className="text-gray-400">Choose your package and payment method</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Package Selection */}
          <div>
            <h3 className="text-white font-semibold mb-4">Select Ticket Package</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ticketPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPackage.id === pkg.id
                      ? "border-gold shadow-lg shadow-gold/20"
                      : "border-gray-700 hover:border-gold/50"
                  } ${pkg.popular ? "ring-2 ring-gold" : ""}`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gold text-black">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-4 text-center bg-gray-800/50">
                    <div className="text-2xl font-bold text-white mb-1">{pkg.tickets}</div>
                    <div className="text-gray-400 text-sm mb-3">{pkg.tickets === 1 ? "Ticket" : "Tickets"}</div>
                    <div className="text-gold font-bold text-xl">${pkg.price}</div>
                    {pkg.discount && <div className="text-green-400 text-sm mt-1">{pkg.discount}% OFF</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-white font-semibold mb-4">Payment Method</h3>
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="stripe" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Stripe
                </TabsTrigger>
                <TabsTrigger value="paypal" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <DollarSign className="mr-2 h-4 w-4" />
                  PayPal
                </TabsTrigger>
                <TabsTrigger value="mercadopago" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mercado Pago
                </TabsTrigger>
                <TabsTrigger value="bank" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Building className="mr-2 h-4 w-4" />
                  Bank Transfer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stripe" className="mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">
                        First Name
                      </Label>
                      <Input id="firstName" className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">
                        Last Name
                      </Label>
                      <Input id="lastName" className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardNumber" className="text-white">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-white">
                        Expiry Date
                      </Label>
                      <Input id="expiry" placeholder="MM/YY" className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-white">
                        CVV
                      </Label>
                      <Input id="cvv" placeholder="123" className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="paypal" className="mt-6">
                <div className="text-center py-8">
                  <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
                    <h4 className="font-semibold">PayPal Payment</h4>
                    <p className="text-sm">You will be redirected to PayPal to complete your payment</p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Click "Complete Payment" to proceed to PayPal's secure checkout
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="mercadopago" className="mt-6">
                <div className="text-center py-8">
                  <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
                    <h4 className="font-semibold">Mercado Pago</h4>
                    <p className="text-sm">Pay with your Mercado Pago account or credit card</p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Available payment methods: Credit/Debit cards, Bank transfer, Cash payments
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="mt-6">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-3">Bank Transfer Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bank Name:</span>
                      <span className="text-white">RafflePro Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Number:</span>
                      <span className="text-white">1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Routing Number:</span>
                      <span className="text-white">987654321</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reference:</span>
                      <span className="text-white">RAFFLE-{Date.now()}</span>
                    </div>
                  </div>
                  <p className="text-yellow-400 text-xs mt-3">
                    Please include the reference number in your transfer description
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Package:</span>
                <span className="text-white">{selectedPackage.tickets} Tickets</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price per ticket:</span>
                <span className="text-white">${(selectedPackage.price / selectedPackage.tickets).toFixed(2)}</span>
              </div>
              {selectedPackage.discount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-green-400">-{selectedPackage.discount}%</span>
                </div>
              )}
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-gold font-bold text-xl">${selectedPackage.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <Shield className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-green-400 font-medium text-sm">Secure Payment</p>
              <p className="text-gray-400 text-xs">Your payment information is encrypted and secure</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:border-gold hover:text-gold bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gold hover:bg-gold/90 text-black font-semibold"
            >
              {isProcessing ? "Processing..." : `Complete Payment - $${selectedPackage.price}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
