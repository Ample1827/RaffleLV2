import { TrendingUp, DollarSign, Users, Trophy } from "lucide-react"

export function Stats() {
  const stats = [
    {
      icon: <DollarSign className="h-8 w-8 text-white" />,
      value: "$2.5M+",
      label: "Total Prizes Won",
      bgColor: "bg-green-500",
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      value: "50,000+",
      label: "Happy Winners",
      bgColor: "bg-blue-500",
    },
    {
      icon: <Trophy className="h-8 w-8 text-white" />,
      value: "1,200+",
      label: "Prizes Awarded",
      bgColor: "bg-purple-500",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      value: "98%",
      label: "Customer Satisfaction",
      bgColor: "bg-orange-500",
    },
  ]

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Our Success in Numbers</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have already won amazing prizes through our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-300 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
