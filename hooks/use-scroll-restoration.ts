'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}
