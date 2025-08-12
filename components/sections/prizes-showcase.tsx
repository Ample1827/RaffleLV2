import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ArrowRight } from "lucide-react"

export function PrizesShowcase() {
  const prizes = [
    {
      id: 1,
      title: "Luxury Tesla Model S",
      value: "$95,000",
      image: "/red-tesla-model-s.png",
      ticketPrice: "$25",
      totalTickets: 5000,
      soldTickets: 3200,
      timeLeft: "5 days",
      status: "Hot",
    },
    {
      id: 2,
      title: "Dream Vacation to Maldives",
      value: "$15,000",
      image: "/maldives-bungalow.png",
      ticketPrice: "$10",
      totalTickets: 2000,
      soldTickets: 1800,
      timeLeft: "12 days",
      status: "Almost Sold Out",
    },
    {
      id: 3,
      title: "Apple MacBook Pro + iPhone Bundle",
      value: "$5,000",
      image: "/placeholder-al9ry.png",
      ticketPrice: "$5",
      totalTickets: 1500,
      soldTickets: 450,
      timeLeft: "20 days",
      status: "New",
    },
  ]

  return (
    <section id="prizes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Current Prizes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Check out our amazing current raffles. New prizes added weekly with incredible odds of winning!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prizes.map((prize) => (
            <Card
              key={prize.id}
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img src={prize.image || "/placeholder.svg"} alt={prize.title} className="w-full h-48 object-cover" />
                <Badge
                  className={`absolute top-4 left-4 ${
                    prize.status === "Hot"
                      ? "bg-red-500"
                      : prize.status === "Almost Sold Out"
                        ? "bg-orange-500"
                        : "bg-green-500"
                  }`}
                >
                  {prize.status}
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="font-bold text-purple-600">{prize.value}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{prize.title}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ticket Price:</span>
                    <span className="font-bold text-purple-600">{prize.ticketPrice}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Time Left:
                    </span>
                    <span className="font-bold text-gray-900">{prize.timeLeft}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Sold:
                    </span>
                    <span className="font-bold text-gray-900">
                      {prize.soldTickets.toLocaleString()} / {prize.totalTickets.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(prize.soldTickets / prize.totalTickets) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Buy Tickets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white bg-transparent"
          >
            View All Prizes
          </Button>
        </div>
      </div>
    </section>
  )
}
