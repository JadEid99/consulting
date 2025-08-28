import { useEffect, useRef, useState } from 'react'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

const StarField = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const { scrollY } = useSmoothScroll()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Star configuration
  const starLayers = [
    { count: 40, speed: 0.05, size: 1, opacity: 1, color: '#ffffff' }, // Far stars
    { count: 25, speed: 0.15, size: 1.5, opacity: 1, color: '#e0e0e0' }, // Medium stars
    { count: 15, speed: 0.25, size: 2, opacity: 1, color: '#f0f0f0' }, // Close stars
    { count: 8, speed: 0.4, size: 2.5, opacity: 1, color: '#64b5f6' } // Very close stars (blue tint)
  ]

  // Generate stars for each layer
  const generateStars = (layer) => {
    const stars = []
    const colors = ['#ffffff', '#e0e0e0', '#f0f0f0', '#64b5f6', '#42a5f5']
    
    for (let i = 0; i < layer.count; i++) {
      stars.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: layer.size + Math.random() * 0.5,
        opacity: layer.opacity,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: layer.speed,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03
      })
    }
    return stars
  }

  // Initialize canvas
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Generate all stars
    const allStars = starLayers.map(layer => generateStars(layer))

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Draw each layer
      allStars.forEach((layerStars, layerIndex) => {
        layerStars.forEach(star => {
          // Update star position based on scroll
          const parallaxOffset = scrollY * star.speed
          const y = (star.y + parallaxOffset) % (dimensions.height + 100)

          // Twinkle effect
          const twinkle = Math.sin(star.twinkle) * 0.3 + 0.7
          star.twinkle += star.twinkleSpeed

          // Draw star
          ctx.save()
          ctx.globalAlpha = star.opacity * twinkle
          ctx.fillStyle = star.color
          
          // Create star shape (simple circle for performance)
          ctx.beginPath()
          ctx.arc(star.x, y, star.size, 0, Math.PI * 2)
          ctx.fill()

          // Add subtle glow for larger stars
          if (star.size > 1.5) {
            ctx.globalAlpha = star.opacity * twinkle * 0.3
            ctx.beginPath()
            ctx.arc(star.x, y, star.size * 2, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.restore()
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, scrollY])

  return (
    <canvas
      ref={canvasRef}
      className="star-field"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  )
}

export default StarField
