import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Heart, Shield, Sparkles, Users, Lock, } from "lucide-react";
import { HeroLeft, HeroRight } from "@/components/HeroMotion";
import HowItWorksCarousel from '@/components/how-it-works-carousel';


export const metadata = {
  title: 'Nutra | Guide your diet',
  description: 'Get instant nutrition guidance with our AI nutritionist. Fair access to healthcare for everyone, 24/7.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
<section className="relative pt-28 pb-20 overflow-hidden">
  {/* Decorative Background */}
  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
  <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* LEFT */}
      <HeroLeft>
        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
          <span className="text-primary">Nutra</span> <br />
          Your 24/7 <br />
          <span className="text-primary">Nutrition Care</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
          Nutra AI provides 24/7 Instant, personalized diet guidance, anytime, anywhere to everyone. No consultation fees, no queues, just equal access for all.
        </p>


        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="text-lg px-8 emerald-glow h-14">
            <Link href="/auth/sign-up">Start Chatting Now →</Link>
          </Button>
          <Button asChild variant="outline" size="lg"  className="text-lg px-8 h-14">
            <Link href="#how-it-works">How It Works</Link>
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden"
              >
                <img
                  src={`https://i.pravatar.cc/40?img=${i + 10}`}
                  alt="User"
                />
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground font-medium">
            Joined by <span className="text-foreground font-bold">2,000+</span> community members
          </p>
        </div>
      </HeroLeft>

      {/* RIGHT */}
      <HeroRight>
      <div className="aspect-square rounded-3xl overflow-hidden emerald-glow rotate-3 transition-transform hover:rotate-0 duration-500 relative">
        <Image 
          src="/NutraHomeUI.png"
          alt="Healthy Food"
          fill
          className="object-cover"
        />
        </div>
        <div className="absolute -bottom-6 -left-6 glass-morphism p-6 rounded-2xl shadow-xl max-w-[200px] animate-bounce-slow">
          <Users className="text-primary w-8 h-8 mb-2" />
          <p className="font-bold text-sm">Personalized for you</p>
          <p className="text-xs text-primary text-muted-foreground">
            Tailored advice based on your health goals.
          </p>
        </div>

        <div className="absolute -top-6 -right-6 glass-morphism p-6 rounded-2xl shadow-xl max-w-[200px] animate-float">
          <Shield className="text-primary w-8 h-8 mb-2" />
          <p className="font-bold text-sm">Safe diet for you</p>
          <p className="text-xs text-primary text-muted-foreground">
            24/7 guide for your diet without any complication.
          </p>
        </div>
      </HeroRight>

    </div>
  </div>
</section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 scroll-mt-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Follow these simple steps to start your journey to better health with Nutri5
          </p>

          <HowItWorksCarousel /> {/* Use the imported HowItWorksCarousel component */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-lg text-teal-50 mb-8">
            Join thousands of people accessing healthcare on their terms.
          </p>
          <Button asChild size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
            <Link href="/auth/sign-up">Get Started Free →</Link>
          </Button>
        </div>
      </section>

            
      {/* Contact Section */}
      <section className="relative py-20 md:py-28 bg-mint dark:bg-background dot-grid-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Start your free chat.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Try NutriCare AI in seconds. Prefer to talk to our team? 
                Send a message and we'll reply within one business day.
              </p>

              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="space-y-2">
                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Send Message
                  </Button>
                </div>
              </form>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By reaching out, you agree to our Privacy Policy.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-card aspect-[4/5]">
  <Image
    src="/contactNutra.png"
    alt="Person starting their nutrition journey"
    fill
    className="object-cover"
  />
</div>

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-card p-5 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">10k+</p>
                    <p className="text-sm text-muted-foreground">Active users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              
              <Link href="/" className="flex items-center gap-2">
            <Image
              src="/nutra-logo.png"
              alt="Nutri logo"
              width={44}
              height={44}
              className="rounded-full w-11 h-11 object-contain"
            />
          </Link>
              <span>Nutra</span>
              <span> © 2026</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
