import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Box, Typography, Container } from '@mui/material';
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const HeroSection = styled(Box)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('/bgmi-background.jpg') center/cover no-repeat fixed;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(156, 39, 176, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
    pointer-events: none;
  }
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
`;

const GlowingTitle = styled(motion.h1)`
  font-size: 4.5rem;
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  background: linear-gradient(45deg, #9c27b0, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(156, 39, 176, 0.5);
  letter-spacing: 4px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ExploreButton = styled(motion.button)`
  padding: 1.2rem 3.5rem;
  font-size: 1.5rem;
  background: transparent;
  border: 3px solid #9c27b0;
  color: #9c27b0;
  cursor: pointer;
  border-radius: 50px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: bold;
  z-index: 1;
  backdrop-filter: blur(5px);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #9c27b0, #ffd700);
    transition: all 0.5s ease;
    z-index: -1;
  }

  &:hover:before {
    width: 100%;
  }

  &:hover {
    color: #fff;
    border-color: #ffd700;
    box-shadow: 0 0 30px rgba(156, 39, 176, 0.7);
    letter-spacing: 2px;
  }
`;

const PrizePool = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(42, 27, 74, 0.9);
  padding: 1.5rem 2.5rem;
  border-radius: 15px;
  border: 2px solid #ffd700;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
`;

const TournamentInfo = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  color: #fff;
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 2rem;
  background: rgba(42, 27, 74, 0.6);
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

function HomePage() {
  const navigate = useNavigate();

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const handleExploreClick = () => {
    navigate('/register');
  };

  return (
    <HeroSection>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            opacity: 0
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#9c27b0",
            },
            links: {
              color: "#9c27b0",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      <Container>
        <ContentWrapper
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <GlowingTitle
            animate={{ 
              textShadow: [
                "0 0 20px rgba(156, 39, 176, 0.5)",
                "0 0 40px rgba(156, 39, 176, 0.8)",
                "0 0 60px rgba(156, 39, 176, 0.5)",
                "0 0 40px rgba(156, 39, 176, 0.8)",
                "0 0 20px rgba(156, 39, 176, 0.5)"
              ],
              scale: [1, 1.02, 1],
              rotate: [0, 1, -1, 1, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            BGMI Survival Series 4
          </GlowingTitle>

          <TournamentInfo
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                color: '#ffd700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: 'bold'
              }}
            >
              Join the Ultimate Battle
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', fontSize: '1.1rem' }}>
              Compete with the best BGMI players and prove your worth in the most intense tournament of the year
            </Typography>
          </TournamentInfo>

          <Box sx={{ textAlign: 'center' }}>
            <ExploreButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={handleExploreClick}
            >
              Register Now
            </ExploreButton>
          </Box>
        </ContentWrapper>

        <PrizePool
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 100 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)"
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#ffd700',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            Prize Pool
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            ₹100,000
          </Typography>
        </PrizePool>
      </Container>
    </HeroSection>
  );
}

export default HomePage;
