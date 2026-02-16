'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Moon, Sun, LogOut, Home, Menu, X } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from "next/image"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark)

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setIsLoading(false)
    }
    checkAuth()
  }, [supabase])

  const toggleDarkMode = () => {
    const newValue = !isDarkMode
    setIsDarkMode(newValue)
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    if (newValue) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleEndChat = () => {
    router.push('/')
  }

  const isOnChat = pathname === '/chat'
  const isOnAuth = pathname.includes('/auth')

  // ✅ Single Get Started Button
  const GetStartedButton = () => (
    <Button asChild size="lg" variant="teal" className="text-sm font-medium px-2 emerald-glow h-8 w-full md:w-auto">
      <Link href="/auth/sign-up">Get Started</Link>
    </Button>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        {mobileOpen && !isOnAuth && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg">
            <div className="px-6 py-4 space-y-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground hover:text-teal-600">Home</Link>
              
              <Link
                href="/#how-it-works"
                onClick={(e) => {
                  setMobileOpen(false)
                  if (pathname === '/') {
                    e.preventDefault()
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="block text-lg font-semibold text-foreground hover:text-teal-600"
              >
                How It Works
              </Link>

              {/* Mobile Get Started */}
              <GetStartedButton />

              {isAuthenticated && isOnChat && (
                <>
                  <Button variant="outline" className="w-full" onClick={() => { setMobileOpen(false); handleEndChat() }}>Home</Button>
                  <Button variant="destructive" className="w-full" onClick={() => { setMobileOpen(false); handleLogout() }}>Logout</Button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <Image src="/nutra-logo.png" alt="Nutri logo" width={44} height={44} className="rounded-full object-contain" />
            <span className="text-lg font-semibold text-foreground">Nutra</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isOnAuth && !isLoading && (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/" className="text-sm font-medium text-foreground hover:text-teal-600 transition">Home</Link>
                <Link href="/#how-it-works" className="text-sm font-medium text-foreground hover:text-teal-600 transition" onClick={(e) => {
                  if (pathname === '/') {
                    e.preventDefault()
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}>How It Works</Link>

                {/* Desktop Get Started */}
                <GetStartedButton />
              </div>
            )}

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} title="Toggle dark mode" className="text-foreground hover:bg-muted">
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>

            {/* Chat Page Actions */}
            {isOnChat && isAuthenticated && (
              <>
                <Button variant="ghost" size="icon" onClick={handleEndChat} title="Return home" className="text-foreground hover:bg-muted hidden sm:inline-flex">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="text-foreground hover:bg-muted hidden sm:inline-flex">
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </>
            )}

            {/* Auth Page Links */}
            {!isAuthenticated && isOnAuth && (
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm"><Link href="/auth/login">Login</Link></Button>
                <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700 text-white"><Link href="/auth/sign-up">Sign Up</Link></Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
