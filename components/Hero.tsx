"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import { HeroLeft, HeroRight } from "@/components/HeroMotion";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* RIGHT (Top on mobile via order-1) */}
          <div className="order-1 lg:order-2">
            <HeroRight>
              <div className="aspect-square rounded-3xl overflow-hidden emerald-glow rotate-3 transition-transform hover:rotate-0 duration-500 relative">
                <Image 
                  src="/NutraHomeImage.png"
                  alt="Healthy Food"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-4 sm:-bottom-6 sm:-left-6 glass-morphism p-3 sm:p-6 rounded-2xl shadow-xl max-w-[140px] sm:max-w-[200px] animate-bounce-slow">
                <Users className="text-primary w-6 sm:w-8 h-6 sm:h-8 mb-1 sm:mb-2" />
                <p className="font-bold text-xs sm:text-sm">Personalized for you</p>
                <p className="text-[10px] sm:text-xs text-primary text-muted-foreground">
                  Tailored advice based on your health goals.
                </p>
              </div>

              <div className="absolute -top-6 -right-4 sm:-top-6 sm:-right-6 glass-morphism p-3 sm:p-6 rounded-2xl shadow-xl max-w-[140px] sm:max-w-[200px] animate-float">
                <Shield className="text-primary w-6 sm:w-8 h-6 sm:h-8 mb-1 sm:mb-2" />
                <p className="font-bold text-xs sm:text-sm">Safe diet for you</p>
                <p className="text-[10px] sm:text-xs text-primary text-muted-foreground">
                  24/7 guide for your diet without any complication.
                </p>
              </div>
            </HeroRight>
          </div>

          {/* LEFT (Bottom on mobile via order-2) */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <HeroLeft>
              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
                <span className="text-accent">Nutra</span> <br />
                Your 24/7 <br />
                <span className="text-accent">Nutrition Care</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Nutra AI provides 24/7 Instant, personalized diet guidance to everyone. No appointment delay, just equal access for all.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="teal" className="text-lg px-8 emerald-glow h-14">
                  <Link href="/auth/sign-up">Start Chatting Now →</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 h-14">
                  <Link href="#how-it-works">How It Works</Link>
                </Button>
              </div>

              <div className="mt-8 w-full hidden sm:block">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 bg-muted/40 px-5 py-4 rounded-xl sm:w-fit">
                  <div className="flex -space-x-2 justify-center sm:justify-start">
                    {["us", "fr", "es", "de", "ng"].map((code, i) => (
                      <img
                        key={i}
                        src={`https://flagcdn.com/w40/${code}.png`}
                        alt="Language Flag"
                        className="w-8 h-8 sm:w-8 rounded-full border border-background shadow-sm"
                      />
                    ))}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm sm:text-base font-semibold">20+ global languages</p>
                    <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground">
                      Nutra is accessible to everyone, everywhere.
                    </p>
                  </div>
                </div>
              </div>
            </HeroLeft>
          </motion.div>

        </div>
      </div>
    </section>
  );
}