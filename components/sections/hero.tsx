import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Users, Trophy } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary fill-current" />
                ))}
              </div>
              <span className="text-muted-foreground">Trusted by 50,000+ players</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Win Amazing Prizes with
              <span className="text-primary"> Every Ticket</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of winners in our exciting raffles. From luxury cars to dream vacations, your next big win
              is just one ticket away!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
                Buy Tickets Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4 bg-transparent"
              >
                View Current Prizes
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">$2M+</span>
                </div>
                <p className="text-muted-foreground">Prizes Won</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">50K+</span>
                </div>
                <p className="text-muted-foreground">Happy Winners</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Star className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">4.9/5</span>
                </div>
                <p className="text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/excited-winner.png"
                alt="Happy raffle winner"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
              🎉 New Winner!
            </div>
            <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold shadow-lg">
              💰 $50K Prize
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
