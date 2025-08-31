import React from 'react';
import styled from 'styled-components';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const PrinciplesSection = styled.section`
  min-height: 100vh;
  background: rgba(17, 17, 17, 0.8);
  color: white;
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
`;

const PrinciplesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 300;
  text-align: center;
  margin-bottom: 4rem;
  color: white;
`;

const PrinciplesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
`;

const PrincipleCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const PrincipleTitle = styled.h3`
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 2rem;
  color: white;
  position: relative;
`;

const PrincipleDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.8;
`;

const Quote = styled.blockquote`
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.5;
  padding: 1.5rem;
  border-left: 3px solid #888;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0 8px 8px 0;
  margin: 0;
  opacity: 0.9;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: -10px;
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.1);
    font-family: serif;
  }
`;

const QuoteAuthor = styled.cite`
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.7;
  font-style: normal;
`;

const BackgroundParticles = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
`;

const Principles: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -50]);

  const principles = [
    {
      title: "Execute with Vision.",
      description: "The greatest impact emerges when wild imagination meets calculated execution.",
      quote: "Vision without action is a daydream. Action without vision is a nightmare",
      author: "Japanese Proverb"
    },
    {
      title: "Self Author.",
      description: "Have the confidence to pursue the future state you know is within reach.",
      quote: "The self-authoring mind can take responsibility for its own values and ideology rather than depend on others to define its reality.",
      author: "Robert Kegan"
    },
    {
      title: "Lead with Curiosity.",
      description: "The path to changing the world often begins with an earnestly spoken 'why'.",
      quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss"
    }
  ];

  // Create floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <PrinciplesSection ref={ref}>
      <BackgroundParticles style={{ y }}>
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 4,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        ))}
      </BackgroundParticles>
      
      <PrinciplesContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Principles
        </SectionTitle>
        
        <PrinciplesGrid>
          {principles.map((principle, index) => (
            <PrincipleCard
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.02,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <PrincipleTitle>{principle.title}</PrincipleTitle>
              <PrincipleDescription>{principle.description}</PrincipleDescription>
              <Quote>
                "{principle.quote}"
                <QuoteAuthor>— {principle.author}</QuoteAuthor>
              </Quote>
            </PrincipleCard>
          ))}
        </PrinciplesGrid>
      </PrinciplesContainer>
    </PrinciplesSection>
  );
};

export default Principles;
