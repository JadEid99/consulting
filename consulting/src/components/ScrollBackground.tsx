import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`;

const GradientLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #ff0000 0%,
    #ff8000 16.66%,
    #ffff00 33.33%,
    #00ff00 50%,
    #0080ff 66.66%,
    #8000ff 83.33%,
    #ff0080 100%
  );
  opacity: 0.3;
  filter: blur(100px);
`;

const NoiseLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  opacity: 0.5;
`;

const WaveLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0.3;
`;

const AnimatedShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Shape = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  filter: blur(2px);
`;

const ScrollBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Transform scroll position to various animation values
  const gradientY = useTransform(scrollY, [0, 1000], [0, -200]);
  const gradientScale = useTransform(scrollY, [0, 1000], [1, 1.2]);
  const gradientRotate = useTransform(scrollY, [0, 1000], [0, 360]);
  
  const noiseY = useTransform(scrollY, [0, 1000], [0, 100]);
  const noiseOpacity = useTransform(scrollY, [0, 500], [0.5, 0.8]);
  
  const waveY = useTransform(scrollY, [0, 1000], [0, -150]);
  const waveScale = useTransform(scrollY, [0, 1000], [1, 1.5]);
  
  // Create animated shapes
  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = e;
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        const x = (clientX / width - 0.5) * 20;
        const y = (clientY / height - 0.5) * 20;
        
        containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <BackgroundContainer ref={containerRef}>
      <GradientLayer
        style={{
          y: gradientY,
          scale: gradientScale,
          rotate: gradientRotate,
        }}
        animate={{
          background: [
            'linear-gradient(135deg, #ff0000 0%, #ff8000 16.66%, #ffff00 33.33%, #00ff00 50%, #0080ff 66.66%, #8000ff 83.33%, #ff0080 100%)',
            'linear-gradient(135deg, #ff0080 0%, #ff0000 16.66%, #ff8000 33.33%, #ffff00 50%, #00ff00 66.66%, #0080ff 83.33%, #8000ff 100%)',
            'linear-gradient(135deg, #8000ff 0%, #ff0080 16.66%, #ff0000 33.33%, #ff8000 50%, #ffff00 66.66%, #00ff00 83.33%, #0080ff 100%)',
            'linear-gradient(135deg, #ff0000 0%, #ff8000 16.66%, #ffff00 33.33%, #00ff00 50%, #0080ff 66.66%, #8000ff 83.33%, #ff0080 100%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <NoiseLayer
        style={{
          y: noiseY,
          opacity: noiseOpacity,
        }}
        animate={{
          backgroundImage: [
            'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <WaveLayer
        style={{
          y: waveY,
          scale: waveScale,
        }}
        animate={{
          background: [
            'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <AnimatedShapes>
        {shapes.map((shape) => (
          <Shape
            key={shape.id}
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              delay: shape.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </AnimatedShapes>
    </BackgroundContainer>
  );
};

export default ScrollBackground;
