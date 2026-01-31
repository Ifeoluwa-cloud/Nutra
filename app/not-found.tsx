import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div>
          <h1 className="text-6xl font-bold text-teal-600 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist. Let's get you back on track.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/chat">Start Chat</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
