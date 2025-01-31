import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import RegistrationForm from './components/RegistrationForm';
import Header from './components/Header';
import HomePage from './components/HomePage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Purple
    },
    secondary: {
      main: '#ffd700', // Gold
    },
    background: {
      default: '#1a1034', // Dark purple
      paper: '#2a1b4a', // Lighter purple
    },
  },
});

const StyledApp = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #1a1034 25%, #2a1b4a 25%, #2a1b4a 50%, #1a1034 50%, #1a1034 75%, #2a1b4a 75%, #2a1b4a 100%);
  background-size: 56.57px 56.57px;
`;

function App() {
  const [formData, setFormData] = useState({
    players: Array(5).fill({
      realName: '',
      uid: '',
      contact: '',
      proof: null
    })
  });

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    alert('Registration successful! Please check your email for confirmation and join our Discord channel for tournament updates.');
  };

  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <StyledApp>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/register" 
              element={
                <Container>
                  <Box sx={{ py: 4 }}>
                    <Header />
                    <RegistrationForm 
                      formData={formData} 
                      setFormData={setFormData} 
                      onSubmit={handleSubmit}
                    />
                  </Box>
                </Container>
              } 
            />
          </Routes>
        </StyledApp>
      </ThemeProvider>
    </Router>
  );
}

export default App;
