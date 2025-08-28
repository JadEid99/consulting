import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const ScrollTriggeredAnimation = ({ 
  children, 
  trigger, 
  start, 
  end, 
  animations, 
  className = '',
  style = {}
}) => {
  const elementRef = useRef(null)
  const animationRef = useRef(null)

  // Create scroll-triggered animation
  const createAnimation = useCallback(() => {
    if (!elementRef.current) return

    // Kill any existing animation
    if (animationRef.current) {
      animationRef.current.kill()
    }

    // Create new animation
    animationRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || elementRef.current,
        start: start || "top center",
        end: end || "bottom center",
        scrub: true,
        markers: false, // Set to true for debugging
        onUpdate: (self) => {
          // You can add custom logic here based on progress
          const progress = self.progress
          // console.log('Animation progress:', progress)
        }
      }
    })

    // Apply animations
    if (Array.isArray(animations)) {
      animations.forEach((animation, index) => {
        const { target, properties, duration = 1, ease = "none" } = animation
        
        animationRef.current.to(
          target || elementRef.current,
          {
            ...properties,
            duration,
            ease,
          },
          index * 0.1 // Stagger animations slightly
        )
      })
    } else if (typeof animations === 'object') {
      // Single animation object
      const { target, properties, duration = 1, ease = "none" } = animations
      animationRef.current.to(target || elementRef.current, {
        ...properties,
        duration,
        ease,
      })
    }
  }, [trigger, start, end, animations])

  useEffect(() => {
    createAnimation()

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [createAnimation])

  // Recreate animation when props change
  useEffect(() => {
    createAnimation()
  }, [animations, trigger, start, end, createAnimation])

  return (
    <div ref={elementRef} className={className} style={style}>
      {children}
    </div>
  )
}

export default ScrollTriggeredAnimation
