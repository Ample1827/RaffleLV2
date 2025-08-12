"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Search, Ticket, AlertCircle } from "lucide-react"

const mockTickets = [
  {
    id: "TKT-2024-001234",
    status: "valid",
    purchaseDate: "2024-01-15",
    drawDate: "2024-01-20",
    prize: "Grand Prize Draw",
    value: "$150,000",
  },
  {
    id: "TKT-2024-001235",
    status: "used",
    purchaseDate: "2024-01-10",
    drawDate: "2024-01-15",
    prize: "Weekly Electronics",
    value: "$5,000",
  },
  {
    id: "TKT-2024-001236",
    status: "expired",
    purchaseDate: "2023-12-20",
    drawDate: "2024-01-01",
    prize: "Holiday Special",
    value: "$1,000",
  },
]

export function ValidateTickets() {
  const [ticketId, setTicketId] = useState("")
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)

  const handleValidation = async () => {
    if (!ticketId.trim()) return

    setIsValidating(true)

    // Simulate API call
    setTimeout(() => {
      const ticket = mockTickets.find((t) => t.id.toLowerCase() === ticketId.toLowerCase())
      setValidationResult(ticket || { status: "invalid" })
      setIsValidating(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "used":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "expired":
        return <XCircle className="w-5 h-5 text-orange-500" />
      case "invalid":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "used":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "expired":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "invalid":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "Valid & Active"
      case "used":
        return "Already Used"
      case "expired":
        return "Expired"
      case "invalid":
        return "Invalid Ticket"
      default:
        return "Unknown"
    }
  }

  return (
    <section className="py-24 bg-premium-bg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Search className="w-4 h-4" />
            Ticket Validation
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gold-gradient bg-clip-text text-transparent">Verify Your Tickets</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enter your ticket ID to check its status and validity
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="premium-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-gold" />
                Ticket Validator
              </CardTitle>
              <CardDescription>Enter your ticket ID to verify its authenticity and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ticketId">Ticket ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="ticketId"
                    placeholder="e.g., TKT-2024-001234"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleValidation}
                    disabled={!ticketId.trim() || isValidating}
                    className="bg-gold hover:bg-gold/90 text-gold-foreground"
                  >
                    {isValidating ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isValidating ? "Validating..." : "Validate"}
                  </Button>
                </div>
              </div>

              {validationResult && (
                <div className="space-y-4">
                  <Separator />

                  <div className="p-6 bg-card/50 rounded-lg border">
                    <div className="flex items-center gap-3 mb-4">
                      {getStatusIcon(validationResult.status)}
                      <div>
                        <h3 className="font-semibold">Validation Result</h3>
                        <Badge className={getStatusColor(validationResult.status)}>
                          {getStatusText(validationResult.status)}
                        </Badge>
                      </div>
                    </div>

                    {validationResult.status !== "invalid" ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ticket ID:</span>
                            <div className="font-mono font-medium">{validationResult.id}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Purchase Date:</span>
                            <div className="font-medium">{validationResult.purchaseDate}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Draw Date:</span>
                            <div className="font-medium">{validationResult.drawDate}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Prize Category:</span>
                            <div className="font-medium">{validationResult.prize}</div>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Prize Value:</span>
                          <span className="text-xl font-bold text-gold">{validationResult.value}</span>
                        </div>

                        {validationResult.status === "valid" && (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-green-500 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              This ticket is valid and eligible for the upcoming draw!
                            </div>
                          </div>
                        )}

                        {validationResult.status === "used" && (
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-500 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              This ticket has been used in a previous draw.
                            </div>
                          </div>
                        )}

                        {validationResult.status === "expired" && (
                          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-orange-500 text-sm">
                              <XCircle className="w-4 h-4" />
                              This ticket has expired and is no longer valid.
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                          <XCircle className="w-4 h-4" />
                          Invalid ticket ID. Please check your ticket and try again.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Ticket IDs for Testing */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-lg">Sample Ticket IDs for Testing</CardTitle>
              <CardDescription>Use these sample IDs to test the validation system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-card/50 rounded">
                  <code className="font-mono">TKT-2024-001234</code>
                  <Badge className="bg-green-500/10 text-green-500">Valid</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-card/50 rounded">
                  <code className="font-mono">TKT-2024-001235</code>
                  <Badge className="bg-blue-500/10 text-blue-500">Used</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-card/50 rounded">
                  <code className="font-mono">TKT-2024-001236</code>
                  <Badge className="bg-orange-500/10 text-orange-500">Expired</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
