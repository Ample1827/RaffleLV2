import { Card, CardContent } from "@/components/ui/card"
import { Ticket, CreditCard, Trophy, Gift } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <CreditCard className="h-12 w-12 text-purple-600" />,
      title: "Choose Your Tickets",
      description: "Browse our exciting raffles and select the number of tickets you want to purchase.",
      step: "01",
    },
    {
      icon: <Ticket className="h-12 w-12 text-purple-600" />,
      title: "Secure Your Entry",
      description: "Complete your purchase with our secure payment system and get your unique ticket numbers.",
      step: "02",
    },
    {
      icon: <Trophy className="h-12 w-12 text-purple-600" />,
      title: "Wait for the Draw",
      description: "Sit back and relax while we conduct fair and transparent draws using certified random systems.",
      step: "03",
    },
    {
      icon: <Gift className="h-12 w-12 text-purple-600" />,
      title: "Claim Your Prize",
      description: "Winners are notified immediately and can claim their prizes through our simple process.",
      step: "04",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Winning is simple! Follow these easy steps to join our raffles and start your journey to amazing prizes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <div className="mb-6 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
