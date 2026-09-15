'use client'

import { useEffect } from 'react'

export default function PullToRefresh() {
  useEffect(() => {
    let touchstartY = 0
    let touchendY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchstartY = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchendY = e.changedTouches[0].screenY
      // Provjerava da li je korisnik na samom vrhu stranice (scrollTop === 0) 
      // i da li je povukao prst prema dolje više od 120 piksela
      if (window.scrollY === 0 && touchendY > touchstartY + 120) {
        window.location.reload()
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return null
}