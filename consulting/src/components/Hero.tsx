import React from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
  background: transparent;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  z-index: 2;
`;

const MainTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 300;
  line-height: 1.4;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ExploreButton = styled(motion.button)`
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  
  &:hover {
    background: white;
    color: black;
  }
`;

const AnimatedLogo = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  color: black;
  z-index: 1;
  opacity: 0.1;
`;

const FloatingElements = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const FloatingDot = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
`;

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const logoRotate = useTransform(scrollY, [0, 1000], [0, 360]);

  // Create floating dots
  const floatingDots = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <HeroSection>
      <AnimatedLogo
        style={{ scale: logoScale, rotate: logoRotate }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        T
      </AnimatedLogo>

      <FloatingElements>
        {floatingDots.map((dot) => (
          <FloatingDot
            key={dot.id}
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 3,
              delay: dot.delay,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </FloatingElements>
      
      <HeroContent>
        <MainTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Meet us<br />
          at the edge.
        </MainTitle>
        
        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          We're a frontier tech venture firm with an engineering-first approach.
        </Subtitle>
        
        <ExploreButton
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore
        </ExploreButton>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
