import React from 'react';
import styled from 'styled-components';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const AboutSection = styled.section`
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const JumpAnimation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6rem;
  gap: 2rem;
  position: relative;
`;

const JumpText = styled(motion.div)`
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 300;
  flex: 1;
  text-align: center;
  position: relative;
`;

const LogoAnimation = styled(motion.div)`
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: black;
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
`;

const JumpShadow = styled(motion.div)`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  z-index: 1;
`;

const NameOrigin = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
`;

const NameTitle = styled(motion.h2)`
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 2rem;
  color: #888;
`;

const NameDescription = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.3rem);
  line-height: 1.6;
  margin-bottom: 4rem;
  opacity: 0.8;
`;

const WhatWeDo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 6rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Section = styled(motion.div)`
  text-align: left;
  position: relative;
`;

const SectionNumber = styled(motion.div)`
  font-size: 2rem;
  font-weight: bold;
  color: #888;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 300;
  margin-bottom: 1.5rem;
  color: white;
`;

const SectionContent = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.8;
`;

const BackgroundGrid = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
`;

const About: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <AboutSection ref={ref}>
      <BackgroundGrid style={{ y }} />
      <AboutContainer>
        <JumpAnimation>
          <JumpText
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            You jump...
          </JumpText>
          
          <div style={{ position: 'relative' }}>
            <LogoAnimation
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={isInView ? { 
                opacity: 1, 
                scale: 1, 
                y: [0, -20, 0, -15, 0, -10, 0]
              } : {}}
              transition={{ 
                duration: 2, 
                delay: 0.3,
                times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1]
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 360,
                transition: { duration: 0.3 }
              }}
            >
              T
            </LogoAnimation>
            <JumpShadow
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { 
                opacity: [0, 0.5, 0.2, 0.4, 0.1, 0.3, 0],
                scale: [0, 1.2, 0.8, 1.1, 0.9, 1, 0.8]
              } : {}}
              transition={{ 
                duration: 2, 
                delay: 0.3,
                times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1]
              }}
            />
          </div>
          
          <JumpText
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We jump...
          </JumpText>
        </JumpAnimation>

        <NameOrigin>
          <NameTitle
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Where our name comes from
          </NameTitle>
          
          <NameDescription
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            Inspired by topological dimension reduction — a mathematical and machine learning technique that simplifies complex, high‑dimensional data while preserving essential features and core qualities.
            <br /><br />
            We see our work as similar: distilling intricate webs of information into key insights that drive high‑conviction investments and long term partnerships.
          </NameDescription>
        </NameOrigin>

        <WhatWeDo>
          <Section
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <SectionNumber
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              01.
            </SectionNumber>
            <SectionTitle>What we do.</SectionTitle>
            <SectionContent>
              We partner with brilliant technologists who have unreasonable ambition. We dream big and are devoted to advancing the intersection of technology and humanity. We are currently focused on AI, decentralized systems, and neurotech.
            </SectionContent>
          </Section>
          
          <Section
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <SectionNumber
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.7 }}
            >
              02.
            </SectionNumber>
            <SectionTitle>How we do it.</SectionTitle>
            <SectionContent>
              We are extremely selective in who we partner with. Straight up — we have a network we're phenomenally proud of, are fun to work with, deeply technical, and run through walls to help our founders win.
            </SectionContent>
          </Section>
        </WhatWeDo>
      </AboutContainer>
    </AboutSection>
  );
};

export default About;
