'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Authentication Error</h1>
          <p className="text-muted-foreground">
            Something went wrong with your authentication. Please try again.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
