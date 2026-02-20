'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AUTO_PLAY_INTERVAL = 6000 // 6 seconds

// ---------------- Skeleton Components ----------------
const Step1Skeleton = () => (
  <div className="bg-muted rounded-lg p-4 flex-1 flex flex-col gap-2">
    <motion.div
      className="h-3 bg-teal-600/20 rounded w-full"
      animate={{ opacity: [0.5, 1, 0.5], y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 1 }}
    />
    <motion.div
      className="h-3 bg-teal-600/20 rounded w-5/6"
      animate={{ opacity: [0.5, 1, 0.5], y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
    />
    <motion.div
      className="mt-4 h-8 bg-teal-600/20 rounded"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
    />
    <motion.div
      className="h-2 bg-teal-600/20 rounded w-4/5 mt-3"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1, delay: 0.1 }}
    />
  </div>
)

const Step2Skeleton = () => (
  <div className="bg-muted rounded-lg p-4 flex-1 flex flex-col items-center justify-center gap-3">
    {/* Pulsing record dot */}
    <div className="w-12 h-12 rounded-full border-2 border-teal-600/30 flex items-center justify-center">
      <motion.div
        className="w-6 h-6 bg-teal-600/20 rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
    </div>
    {/* Simulated frequency bars */}
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="h-4 w-1 bg-teal-600/40 rounded"
          animate={{ height: ['4px', '12px', '6px'] }}
          transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: 'easeInOut' }}
        />
      ))}
    </div>
  </div>
)

const Step3Skeleton = () => (
  <div className="bg-muted rounded-lg p-3 flex-1 flex flex-col gap-2">
    {/* Simulate AI/User conversation */}
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={`self-${i % 2 === 0 ? 'start' : 'end'} h-4 rounded-full w-full ${
          i % 2 === 0 ? 'bg-teal-600/20 max-w-[80%]' : 'bg-teal-600/40 max-w-[70%]'
        }`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: i * 0.2 }}
      />
    ))}
  </div>
)

const Step4Skeleton = () => (
  <div className="bg-muted rounded-lg p-3 flex-1 flex flex-col gap-2">
    {/* AI message (left) */}
    <motion.div
      className="self-start h-4 bg-teal-600/20 rounded-full w-full max-w-[80%]"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
    />

    {/* User message (right) */}
    <motion.div
      className="self-end h-4 bg-teal-600/20 rounded-full w-full max-w-[70%]"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
    />

    {/* AI message (left) */}
    <motion.div
      className="self-start h-4 bg-teal-600/20 rounded-full w-full max-w-[90%]"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
    />

    {/* User message (right) */}
    <motion.div
      className="self-end h-4 bg-teal-600/20 rounded-full w-full max-w-[75%]"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0.6 }}
    />
  </div>
)
// Step Data 
const steps = [
  { id: 1, title: 'Sign Up', description: 'Create your account in seconds with email', skeleton: <Step1Skeleton /> },
  { id: 2, title: 'Use Audio/Text', description: 'Speak or type - choose your style', skeleton: <Step2Skeleton /> },
  { id: 3, title: 'Meet Nora', description: 'Start conversation naturally with AI', skeleton: <Step3Skeleton /> },
  { id: 4, title: 'Get Feedback', description: 'Receive instant personalized advice', skeleton: <Step4Skeleton /> },
]

// Carousel Component
export default function HowItWorksCarousel() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0) // -1 = left, 1 = right
  const [isPaused, setIsPaused] = useState(false)

  // Auto-play logic
  useEffect(() => {
    if (isPaused) return
    const timer = setTimeout(() => handleNext(), AUTO_PLAY_INTERVAL)
    return () => clearTimeout(timer)
  }, [currentStep, isPaused])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 100 : -100, opacity: 0 }),
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="bg-background rounded-xl border border-border p-8 mb-2 min-h-[400px] flex flex-col relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                {steps[currentStep].id}
              </div>
              <h3 className="text-2xl font-bold text-foreground">{steps[currentStep].title}</h3>
            </div>

            <div className="flex-1 mb-6 flex flex-col">{steps[currentStep].skeleton}</div>

            <p className="text-base text-muted-foreground">{steps[currentStep].description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-teal-600 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isPaused ? undefined : 1 }}
          transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
        />

        {/* Pause Icon */}
        {isPaused && (
          <motion.div className="absolute top-4 right-4 text-teal-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Pause className="w-5 h-5" />
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="teal" size="icon" onClick={handlePrev}>
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentStep ? 1 : -1)
                setCurrentStep(index)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-teal-600 w-8'
                  : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <Button variant="teal" size="icon" onClick={handleNext}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  )
}