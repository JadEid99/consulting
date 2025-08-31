import React from 'react';
import styled from 'styled-components';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const PublicGoodsSection = styled.section`
  min-height: 100vh;
  background: rgba(17, 17, 17, 0.8);
  color: white;
  padding: 6rem 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PublicGoodsContainer = styled.div`
  max-width: 800px;
  text-align: center;
  position: relative;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 300;
  margin-bottom: 3rem;
  color: white;
`;

const ContactInfo = styled(motion.div)`
  margin-top: 4rem;
  position: relative;
`;

const ContactText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
`;

const ContactEmail = styled(motion.a)`
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  border-bottom: 2px solid white;
  padding-bottom: 0.2rem;
  transition: all 0.3s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #888, white, #888);
    transition: width 0.3s ease;
  }
  
  &:hover::before {
    width: 100%;
  }
  
  &:hover {
    color: #888;
    border-bottom-color: #888;
  }
`;

const Footer = styled(motion.footer)`
  margin-top: 6rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FooterLink = styled(motion.a)`
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: white;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  &:hover {
    color: white;
  }
`;

const Copyright = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin: 0;
`;

const BackToTop = styled(motion.button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-top: 2rem;
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
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const BackgroundCircles = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const Circle = styled(motion.div)`
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
`;

const PublicGoods: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -50]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create background circles
  const circles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <PublicGoodsSection ref={ref}>
      <BackgroundCircles style={{ y }}>
        {circles.map((circle) => (
          <Circle
            key={circle.id}
            style={{
              width: circle.size,
              height: circle.size,
              left: `${circle.x}%`,
              top: `${circle.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              delay: circle.delay,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        ))}
      </BackgroundCircles>
      
      <PublicGoodsContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Public goods
        </SectionTitle>
        
        <ContactInfo
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ContactText>Get in touch:</ContactText>
          <ContactEmail
            href="mailto:hello@topology.vc"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            hello@topology.vc
          </ContactEmail>
        </ContactInfo>

        <Footer
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <FooterLinks>
            <FooterLink 
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              About
            </FooterLink>
            <FooterLink 
              href="#principles"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Principles
            </FooterLink>
            <FooterLink 
              href="#team"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Team
            </FooterLink>
            <FooterLink 
              href="#public-goods"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Public goods
            </FooterLink>
            <FooterLink 
              href="#terms"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Terms & Conditions
            </FooterLink>
            <FooterLink 
              href="#privacy"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Privacy Policy
            </FooterLink>
          </FooterLinks>
          
          <Copyright>Topology ©2025</Copyright>
          
          <BackToTop
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to top
          </BackToTop>
        </Footer>
      </PublicGoodsContainer>
    </PublicGoodsSection>
  );
};

export default PublicGoods;
