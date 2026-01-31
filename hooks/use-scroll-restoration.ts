'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useScrollRestoration() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Reset scroll to top when pathname changes
    window.scrollTo(0, 0)
  }, [pathname, searchParams])
}
