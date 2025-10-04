import { Card, CardContent } from "@/components/ui/card"
import { Ticket, CreditCard, Trophy, Gift } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <CreditCard className="h-12 w-12 text-purple-600" />,
      title: "Elige Tus Boletos",
      description: "Explora nuestras emocionantes rifas y selecciona el número de boletos que deseas comprar.",
      step: "01",
    },
    {
      icon: <Ticket className="h-12 w-12 text-purple-600" />,
      title: "Asegura Tu Participación",
      description: "Completa tu compra con nuestro sistema de pago seguro y obtén tus números de boleto únicos.",
      step: "02",
    },
    {
      icon: <Trophy className="h-12 w-12 text-purple-600" />,
      title: "Espera el Sorteo",
      description:
        "Relájate mientras realizamos sorteos justos y transparentes usando sistemas aleatorios certificados.",
      step: "03",
    },
    {
      icon: <Gift className="h-12 w-12 text-purple-600" />,
      title: "Reclama Tu Premio",
      description:
        "Los ganadores son notificados inmediatamente y pueden reclamar sus premios a través de nuestro proceso simple.",
      step: "04",
    },
  ]

  return (
    <section id="how-it-works" className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">Cómo Funciona</h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            ¡Ganar es simple! Sigue estos pasos fáciles para unirte a nuestras rifas y comenzar tu camino hacia premios
            increíbles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6 md:p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <div className="mb-4 md:mb-6 flex justify-center">{step.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
