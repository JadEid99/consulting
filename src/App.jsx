import { useState } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import StarField from './components/StarField'
import ScrollTriggeredAnimation from './components/ScrollTriggeredAnimation'
import ScrollTest from './components/ScrollTest'
import './App.css'

function App() {
  const { scrollY, scrollProgress, scrollToElement } = useSmoothScroll()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close mobile menu when clicking on a link
  const handleNavClick = (section) => {
    scrollToElement(section)
    setIsMenuOpen(false)
  }

  return (
    <div className="app">
      {/* Star Field Background */}
      <StarField />

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>Jad Eid</h2>
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-menu">
            <a 
              href="#home" 
              className="nav-link"
              onClick={() => handleNavClick('home')}
            >
              Home
            </a>
            <a 
              href="#career" 
              className="nav-link"
              onClick={() => handleNavClick('career')}
            >
              Career
            </a>
            <a 
              href="#projects" 
              className="nav-link"
              onClick={() => handleNavClick('projects')}
            >
              Projects
            </a>
            <a 
              href="#contact" 
              className="nav-link"
              onClick={() => handleNavClick('contact')}
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <a 
            href="#home" 
            className="mobile-nav-link"
            onClick={() => handleNavClick('home')}
          >
            Home
          </a>
          <a 
            href="#career" 
            className="mobile-nav-link"
            onClick={() => handleNavClick('career')}
          >
            Career
          </a>
          <a 
            href="#projects" 
            className="mobile-nav-link"
            onClick={() => handleNavClick('projects')}
          >
            Projects
          </a>
          <a 
            href="#contact" 
            className="mobile-nav-link"
            onClick={() => handleNavClick('contact')}
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section - Black Hole */}
      <section id="home" className="hero">
        <ScrollTriggeredAnimation
          trigger="#home"
          start="top center"
          end="bottom center"
          animations={[
            {
              properties: {
                scale: 1.2,
                rotation: 360,
                opacity: 1
              },
              duration: 2
            }
          ]}
          className="black-hole-container"
        >
          <div className="black-hole">
            <div className="black-hole-core"></div>
            <div className="black-hole-ring ring-1"></div>
            <div className="black-hole-ring ring-2"></div>
            <div className="black-hole-ring ring-3"></div>
          </div>
        </ScrollTriggeredAnimation>
      </section>

      {/* Astronaut Introduction */}
      <section id="astronaut" className="astronaut-section">
        <ScrollTriggeredAnimation
          trigger="#astronaut"
          start="top center"
          end="bottom center"
          animations={[
            {
              properties: {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1
              },
              duration: 1.5
            }
          ]}
          className="astronaut-container"
        >
          <div className="astronaut">
            <div className="astronaut-helmet"></div>
            <div className="astronaut-body"></div>
            <div className="astronaut-arms"></div>
            <div className="astronaut-legs"></div>
          </div>
        </ScrollTriggeredAnimation>
      </section>

      {/* Name Display */}
      <section id="name" className="name-section">
        <ScrollTriggeredAnimation
          trigger="#name"
          start="top center"
          end="bottom center"
          animations={[
            {
              properties: {
                scale: 1,
                opacity: 1
              },
              duration: 1
            }
          ]}
          className="name-container"
        >
          <h1 className="hero-name">Jad Eid</h1>
          <p className="hero-subtitle">Space Explorer & Developer</p>
        </ScrollTriggeredAnimation>
      </section>

      {/* Career Journey */}
      <section id="career" className="career-section">
        <div className="container">
          <h2 className="section-title">Career Journey</h2>
          <div className="career-timeline">
            <div className="career-milestone">
              <div className="milestone-marker"></div>
              <div className="milestone-content">
                <h3>Software Engineer</h3>
                <p>Started my journey in software development, building web applications and learning modern technologies.</p>
              </div>
            </div>
            <div className="career-milestone">
              <div className="milestone-marker"></div>
              <div className="milestone-content">
                <h3>Full Stack Developer</h3>
                <p>Expanded my skills to include both frontend and backend development, working with React, Node.js, and databases.</p>
              </div>
            </div>
            <div className="career-milestone">
              <div className="milestone-marker"></div>
              <div className="milestone-content">
                <h3>Senior Developer</h3>
                <p>Led development teams, architected complex systems, and mentored junior developers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="projects-section">
        <div className="container">
          <h2 className="section-title">Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3>E-Commerce Platform</h3>
              <p>Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, product management, and payment processing.</p>
            </div>
            <div className="project-card">
              <h3>Task Management App</h3>
              <p>Developed a collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.</p>
            </div>
            <div className="project-card">
              <h3>Portfolio Website</h3>
              <p>Created this space-themed portfolio website with smooth scrolling animations and immersive user experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="section-title">Contact</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <p>Ready to explore new opportunities together?</p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>jad@example.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>Earth, Solar System</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Progress Indicator */}
      <div className="scroll-progress">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      {/* Scroll Test Component (remove in production) */}
      <ScrollTest />
    </div>
  )
}

export default App
