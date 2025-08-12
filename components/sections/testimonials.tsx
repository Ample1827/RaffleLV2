import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "California, USA",
      prize: "Tesla Model 3",
      image: "happy-woman-headshot.png",
      rating: 5,
      text: "I couldn't believe it when I got the call! I only bought 5 tickets and won a brand new Tesla. The whole process was so smooth and professional. Thank you RafflePro!",
    },
    {
      name: "Mike Chen",
      location: "New York, USA",
      prize: "$25,000 Cash",
      image: "happy-man-headshot.png",
      rating: 5,
      text: "Amazing experience! I've been playing for 6 months and finally hit the jackpot. The customer service was excellent and I received my prize within 48 hours.",
    },
    {
      name: "Emma Rodriguez",
      location: "Texas, USA",
      prize: "Dream Vacation",
      image: "happy-woman-headshot.png",
      rating: 5,
      text: "Won an all-expenses-paid trip to Hawaii! The vacation was absolutely perfect. RafflePro made my dreams come true. I'm definitely playing again!",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">What Our Winners Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real winners have to say about their experience with RafflePro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-purple-600 mb-4" />
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.text}"</p>

                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                    <div className="text-sm text-purple-600 font-semibold">Won: {testimonial.prize}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
