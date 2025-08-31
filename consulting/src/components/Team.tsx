import React from 'react';
import styled from 'styled-components';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const TeamSection = styled.section`
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
`;

const TeamContainer = styled.div`
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

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
`;

const TeamMember = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const ProfileImage = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #333 0%, #666 100%);
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    transition: transform 0.6s ease;
  }
  
  &:hover::after {
    transform: rotate(45deg) translate(50%, 50%);
  }
`;

const MemberName = styled.h3`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
  color: white;
  position: relative;
`;

const MemberRole = styled.p`
  font-size: 1rem;
  color: #888;
  margin-bottom: 1rem;
  position: relative;
`;

const MemberBackground = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;
  position: relative;
`;

const SupportedBy = styled(motion.div)`
  text-align: center;
  margin-top: 4rem;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: left 0.8s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const SupportedByTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  color: white;
  position: relative;
`;

const SupportedByList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  position: relative;
`;

const SupportedByItem = styled(motion.li)`
  font-size: 1rem;
  color: #888;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
    transition: left 0.3s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const BackgroundLines = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.1;
`;

const Line = styled(motion.div)`
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  height: 1px;
`;

const Team: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -100]);

  const teamMembers = [
    {
      name: "Casey Caruso",
      role: "Investing",
      background: "[x‑Google, x‑Bessemer, x‑Paradigm]",
      initial: "C"
    },
    {
      name: "Stella Liu",
      role: "Platform",
      background: "[x‑Jungle, x-HF0]",
      initial: "S"
    },
    {
      name: "Hunter Harloff",
      role: "Research & Engineering",
      background: "[x‑Citadel]",
      initial: "H"
    }
  ];

  const supportedBy = [
    "Co-founder of OpenAI",
    "Marc Andreessen",
    "Co-author of GPT4",
    "AI Chairman at Johns Hopkins",
    "Chris Dixon"
  ];

  // Create background lines
  const lines = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    top: (i * 20) + '%',
    width: Math.random() * 100 + 50,
    delay: i * 0.2,
  }));

  return (
    <TeamSection ref={ref}>
      <BackgroundLines style={{ y }}>
        {lines.map((line) => (
          <Line
            key={line.id}
            style={{
              top: line.top,
              width: `${line.width}%`,
              left: `${Math.random() * 20}%`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: line.delay,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </BackgroundLines>
      
      <TeamContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Team
        </SectionTitle>
        
        <TeamGrid>
          {teamMembers.map((member, index) => (
            <TeamMember
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
              <ProfileImage
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                {member.initial}
              </ProfileImage>
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role}</MemberRole>
              <MemberBackground>{member.background}</MemberBackground>
            </TeamMember>
          ))}
        </TeamGrid>

        <SupportedBy
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ 
            scale: 1.01,
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <SupportedByTitle>Supported by:</SupportedByTitle>
          <SupportedByList>
            {supportedBy.map((person, index) => (
              <SupportedByItem 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                {person}
              </SupportedByItem>
            ))}
          </SupportedByList>
        </SupportedBy>
      </TeamContainer>
    </TeamSection>
  );
};

export default Team;
