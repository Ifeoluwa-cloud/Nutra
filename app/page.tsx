import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Heart, Shield, Sparkles, Users, Lock, } from "lucide-react";
import { HeroLeft, HeroRight } from "@/components/HeroMotion";
import HowItWorksCarousel from '@/components/how-it-works-carousel';


export const metadata = {
  title: 'Nutri5 - HealthyChat | 24/7 AI Nutritionist',
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
                <span>🌱 AI HEALTHCARE</span>
        </div>
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
            <Link href="#how-it-works">Contact us</Link>
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
        <div className="aspect-square rounded-3xl overflow-hidden emerald-glow rotate-3 transition-transform hover:rotate-0 duration-500">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000" 
            alt="Healthy Food" 
            className="w-full h-full object-cover"
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
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground">
              Have questions or feedback? We'd love to hear from you. Reach out to our team anytime.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-background rounded-xl p-8 border border-border">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Support</h3>
              <Link href="mailto:support@nutri5.com" className="text-teal-600 hover:text-teal-700 font-medium text-lg">
                support@nutri5.com
              </Link>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 text-center md:text-right">Follow Us</h3>
              <div className="flex gap-6">
                <Link href="https://twitter.com/nutri5" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-teal-600 transition" title="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 2H1l8.26 11.35L1.45 22H4.1l6.46-7.41L21 22h7L12.55 9.64 20.16 2h-3.66l-5.36 6.21L8 2zm9.6 16.2h2L7.07 3.72h-2.3L17.6 18.2z"/></svg>
                </Link>
                <Link href="https://facebook.com/nutri5" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-teal-600 transition" title="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Link>
                <Link href="https://instagram.com/nutri5" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-teal-600 transition" title="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="4" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>
                </Link>
                <Link href="https://linkedin.com/company/nutri5" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-teal-600 transition" title="LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.047-8.842 0-9.769h3.554v1.381c-.009.015-.021.029-.031.042h.031v-.042c.43-.664 1.195-1.612 2.905-1.612 2.122 0 3.714 1.388 3.714 4.375v5.625zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.955.771-1.71 1.958-1.71 1.187 0 1.914.755 1.938 1.71 0 .951-.751 1.71-1.981 1.71zm1.581 11.597H3.715V9.683h3.203v10.769zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted/30 rounded-xl p-8 md:p-12 border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
              ></textarea>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Send Message
              </Button>
            </form>
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
              className="rounded-full"
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
