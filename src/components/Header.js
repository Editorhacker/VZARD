import React from 'react';
import { Typography, Box, Link } from '@mui/material';
import { YouTube, Instagram, Chat } from '@mui/icons-material';
import styled from 'styled-components';

const StyledHeader = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: rgba(42, 27, 74, 0.9);
  border: 2px solid #9c27b0;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(156, 39, 176, 0.2);
`;

const Title = styled(Typography)`
  background: linear-gradient(45deg, #9c27b0, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(156, 39, 176, 0.5);
`;

const SocialLinks = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const SocialLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  transition: all 0.3s ease;
  background: rgba(26, 16, 52, 0.8);
  border: 1px solid #9c27b0;

  &:hover {
    background: #9c27b0;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(156, 39, 176, 0.5);
  }
`;

function Header() {
  return (
    <StyledHeader>
      <Title variant="h1" component="h1" gutterBottom>
        BGMI Survival Series 4
      </Title>
      <SocialLinks>
        <SocialLink href="#" target="_blank" rel="noopener noreferrer">
          <YouTube /> YouTube
        </SocialLink>
        <SocialLink href="#" target="_blank" rel="noopener noreferrer">
          <Instagram /> Instagram
        </SocialLink>
        <SocialLink href="#" target="_blank" rel="noopener noreferrer">
          <Chat /> Discord
        </SocialLink>
      </SocialLinks>
    </StyledHeader>
  );
}

export default Header;
