import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function PrizesShowcase() {
  const prizes = [
    {
      id: 1,
      title: "Efectivo $80,000",
      value: "$80,000",
      image: "/cash-money-gold.png",
      status: "Popular",
    },
    {
      id: 2,
      title: "Motocicleta $45,000",
      value: "$45,000",
      image: "/luxury-motorcycle.png",
      status: "Nuevo",
    },
    {
      id: 3,
      title: "Motocicleta $25,000",
      value: "$25,000",
      image: "/sport-motorcycle.png",
      status: "Disponible",
    },
  ]

  return (
    <section id="prizes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Premios Actuales</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ¡Descubre nuestras increíbles rifas actuales. Nuevos premios agregados semanalmente con probabilidades
            increíbles de ganar!
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
                    prize.status === "Popular"
                      ? "bg-red-500"
                      : prize.status === "Nuevo"
                        ? "bg-green-500"
                        : "bg-blue-500"
                  }`}
                >
                  {prize.status}
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="font-bold text-purple-600">{prize.value}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{prize.title}</h3>

                <Link href="/buy-tickets">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Comprar Boletos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
