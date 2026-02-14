'use client'

import React from "react"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2, Github, Globe, Apple } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
      } else if (data?.user) {
        setSuccess(true)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setFullName('')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'apple') => {
    setError(null)
    setIsLoading(true)

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })

      if (oauthError) {
        console.error('OAuth signIn error:', oauthError)
        setError(oauthError.message)
      }
    } catch (err) {
      console.error('OAuth signIn failed:', err)
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'OAuth sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
        <CardHeader className="space-y-1 text-center pb-3">
          <div className="flex items-center justify-center mb-2">
            <Link href="/" className="flex items-center gap-2">
            <Image
              src="/nutra-logo.png"
              alt="Nutri logo"
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-contain"
            />
          </Link>
          </div>
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription className="text-xs">
            Join Nutra and get 24/7 nutrition guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <p className="text-emerald-900 dark:text-emerald-100 font-medium">
                  Check your email to confirm your account
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation link to {email}
              </p>
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!showEmailForm ? (
                // Social Auth View
                <>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleOAuthSignIn('google')} 
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Sign up with Google
                    </Button>
                    
                    <Button 
                      onClick={() => handleOAuthSignIn('github')} 
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Sign up with GitHub
                    </Button>
                    
                    <Button 
                      onClick={() => handleOAuthSignIn('apple')} 
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Apple className="mr-2 h-4 w-4" />
                      Sign up with Apple
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setShowEmailForm(true)}
                    variant="secondary"
                    className="w-full"
                  >
                    Sign up with Email
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-teal-600 hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </>
              ) : (
                // Email Form View
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-9"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 mt-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <Button 
                    type="button"
                    variant="ghost"
                    className="w-full text-xs h-8"
                    onClick={() => setShowEmailForm(false)}
                    disabled={isLoading}
                  >
                    Back to sign up options
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-teal-600 hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
