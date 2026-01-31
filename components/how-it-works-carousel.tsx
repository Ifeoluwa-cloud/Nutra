'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Sign Up',
    description: 'Create your account in seconds with email',
    skeleton: (
      <div className="bg-muted rounded-lg p-4 flex-1">
        <div className="space-y-3">
          <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
          <div className="mt-4 h-8 bg-teal-600/20 rounded"></div>
          <div className="h-2 bg-muted-foreground/10 rounded w-4/5 mt-3"></div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Meet Nora',
    description: 'Start conversation naturally with AI',
    skeleton: (
      <div className="bg-muted rounded-lg p-3 flex-1 flex flex-col gap-2">
        <div className="self-start h-6 bg-muted-foreground/20 rounded-full w-32"></div>
        <div className="self-end h-6 bg-teal-600/20 rounded-full w-28"></div>
        <div className="self-start h-6 bg-muted-foreground/20 rounded-full w-40"></div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Use Audio/Text',
    description: 'Speak or type - choose your style',
    skeleton: (
      <div className="bg-muted rounded-lg p-4 flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-teal-600/30 flex items-center justify-center">
          <div className="w-6 h-6 bg-teal-600/20 rounded-full"></div>
        </div>
        <div className="w-full h-2 bg-muted-foreground/20 rounded-full"></div>
        <div className="flex gap-1">
          <div className="h-4 w-1 bg-teal-600/40 rounded"></div>
          <div className="h-6 w-1 bg-teal-600/40 rounded"></div>
          <div className="h-5 w-1 bg-teal-600/40 rounded"></div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Get Instant Feedback',
    description: 'Receive instant personalized advice',
    skeleton: (
      <div className="bg-muted rounded-lg p-3 flex-1 flex flex-col gap-2">
        <div className="self-start h-6 bg-muted-foreground/20 rounded-full w-32"></div>
        <div className="self-end space-y-1">
          <div className="h-4 bg-teal-600/20 rounded w-56"></div>
          <div className="h-4 bg-teal-600/20 rounded w-48"></div>
          <div className="h-4 bg-teal-600/20 rounded w-52"></div>
        </div>
      </div>
    ),
  },
]

export default function HowItWorksCarousel() {
  const [currentStep, setCurrentStep] = useState(0)

  const handlePrev = () => {
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
  }

  const step = steps[currentStep]

  return (
    <div className="w-full">
      <div className="bg-background rounded-xl border border-border p-8 mb-8 min-h-96 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
            {step.id}
          </div>
          <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
        </div>

        <div className="flex-1 mb-6">{step.skeleton}</div>

        <p className="text-base text-muted-foreground">{step.description}</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="text-foreground border-border hover:bg-muted bg-transparent"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-teal-600 w-8'
                  : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="text-foreground border-border hover:bg-muted bg-transparent"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  )
}
