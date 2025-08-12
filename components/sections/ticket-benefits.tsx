import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Heart, Award, Users, Clock } from "lucide-react"

export function TicketBenefits() {
  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "100% Secure",
      description:
        "All transactions are encrypted and your personal information is protected with bank-level security.",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Instant Confirmation",
      description: "Get your ticket numbers immediately after purchase with email confirmation and receipt.",
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Fair & Transparent",
      description: "All draws are conducted using certified random number generators and are fully auditable.",
    },
    {
      icon: <Heart className="h-8 w-8 text-purple-600" />,
      title: "Supporting Charity",
      description: "10% of all proceeds go to registered charities, so you're helping good causes while playing.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community Driven",
      description: "Join our community of winners and share your success stories with fellow players.",
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: "24/7 Support",
      description: "Our customer support team is available around the clock to help with any questions.",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose Our Raffles?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing the best raffle experience with complete transparency, security, and amazing
            prizes that change lives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="bg-purple-100 p-4 rounded-full">{benefit.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
