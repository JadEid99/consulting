import { useState, useEffect, useCallback } from 'react'

export const useSmoothScroll = () => {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  // Throttle function to limit scroll event frequency
  const throttle = (func, limit) => {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0

    setScrollY(currentScrollY)
    setScrollProgress(progress)
    setIsScrolling(true)

    // Reset scrolling state after scroll ends
    clearTimeout(window.scrollTimeout)
    window.scrollTimeout = setTimeout(() => {
      setIsScrolling(false)
    }, 150)
  }, [])

  // Smooth scroll to element
  const scrollToElement = useCallback((elementId, offset = 0) => {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  // Smooth scroll to position
  const scrollToPosition = useCallback((position) => {
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    })
  }, [])

  // Get scroll progress for a specific section
  const getSectionProgress = useCallback((sectionId) => {
    const element = document.getElementById(sectionId)
    if (!element) return 0

    const rect = element.getBoundingClientRect()
    const elementTop = rect.top
    const elementHeight = rect.height
    const windowHeight = window.innerHeight

    // Calculate progress based on element visibility
    if (elementTop > windowHeight) {
      return 0 // Element not yet visible
    } else if (elementTop + elementHeight < 0) {
      return 1 // Element completely scrolled past
    } else {
      return Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)))
    }
  }, [])

  // Check if element is in viewport
  const isElementInViewport = useCallback((elementId, threshold = 0.1) => {
    const element = document.getElementById(elementId)
    if (!element) return false

    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const thresholdHeight = windowHeight * threshold

    return (
      rect.top <= windowHeight - thresholdHeight &&
      rect.bottom >= thresholdHeight
    )
  }, [])

  useEffect(() => {
    // Throttled scroll handler for better performance
    const throttledHandleScroll = throttle(handleScroll, 16) // ~60fps

    // Add scroll event listener
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })

    // Initial scroll position
    handleScroll()

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      clearTimeout(window.scrollTimeout)
    }
  }, [handleScroll])

  return {
    scrollY,
    scrollProgress,
    isScrolling,
    scrollToElement,
    scrollToPosition,
    getSectionProgress,
    isElementInViewport
  }
}
