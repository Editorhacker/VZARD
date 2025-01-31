import React from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const StyledPaper = styled(motion.div)`
  padding: 24px;
  margin-bottom: 24px;
  background: rgba(42, 27, 74, 0.9) !important;
  border: 2px solid #9c27b0;
  border-radius: 15px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(156, 39, 176, 0.1);

  &:hover {
    box-shadow: 0 0 30px rgba(156, 39, 176, 0.2);
    transform: translateY(-2px);
  }
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background: rgba(26, 16, 52, 0.8);
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }

    & fieldset {
      border-color: #9c27b0;
    }

    &:hover fieldset {
      border-color: #ffd700;
    }

    &.Mui-focused fieldset {
      border-color: #ffd700;
      border-width: 2px;
    }
  }

  & .MuiInputLabel-root {
    color: #9c27b0;
    &.Mui-focused {
      color: #ffd700;
    }
  }

  & .MuiOutlinedInput-input {
    color: #fff;
  }
`;

const StyledButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #9c27b0, #ffd700);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    box-shadow: 0 0 30px rgba(156, 39, 176, 0.5);
  }
`;

const FileUploadButton = styled(Button)`
  background: rgba(42, 27, 74, 0.9) !important;
  border: 1px solid #9c27b0 !important;
  color: #fff !important;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(5px);

  &:hover {
    border-color: #ffd700 !important;
    box-shadow: 0 0 15px rgba(156, 39, 176, 0.3);
    transform: translateY(-2px);
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

function PlayerForm({ index, player, onChange }) {
  const handleChange = (field) => (event) => {
    onChange(index, field, event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      alert('Please upload only image files as proof');
      return;
    }
    onChange(index, 'proof', file);
  };

  return (
    <StyledPaper
      as={motion.div}
      variants={itemVariants}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: '#ffd700',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
        }}
      >
        Player {index + 1} {index === 0 ? '(Team Leader)' : ''}
      </Typography>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <StyledTextField
          label="Real Name"
          value={player.realName}
          onChange={handleChange('realName')}
          fullWidth
          required
        />
        <StyledTextField
          label="BGMI UID"
          value={player.uid}
          onChange={handleChange('uid')}
          fullWidth
          required
          inputProps={{ pattern: '\\d{8,12}' }}
          helperText="UID should be 8-12 digits"
        />
        <StyledTextField
          label="Contact Number"
          value={player.contact}
          onChange={handleChange('contact')}
          fullWidth
          required
          inputProps={{ pattern: '\\d{10}' }}
          helperText="Contact should be 10 digits"
        />
        <Box>
          <input
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id={`proof-upload-${index}`}
          />
          <label htmlFor={`proof-upload-${index}`}>
            <FileUploadButton
              variant="outlined"
              component="span"
              fullWidth
              sx={{ mt: 1 }}
            >
              Upload Screenshot Proof
            </FileUploadButton>
          </label>
          {player.proof && (
            <Typography 
              variant="caption" 
              display="block" 
              sx={{ 
                mt: 1,
                color: '#ffd700'
              }}
            >
              File selected: {player.proof.name}
            </Typography>
          )}
        </Box>
      </Box>
    </StyledPaper>
  );
}

function RegistrationForm({ formData, setFormData, onSubmit }) {
  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = {
      ...newPlayers[index],
      [field]: value
    };
    setFormData({ ...formData, players: newPlayers });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = formData.players.every(player => {
      return (
        player.realName &&
        /^\d{8,12}$/.test(player.uid) &&
        /^\d{10}$/.test(player.contact) &&
        player.proof
      );
    });

    if (!isValid) {
      alert('Please fill all required fields correctly');
      return;
    }

    onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {formData.players.map((player, index) => (
        <PlayerForm
          key={index}
          index={index}
          player={player}
          onChange={handlePlayerChange}
        />
      ))}

      <StyledPaper
        as={motion.div}
        variants={itemVariants}
      >
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2,
            backgroundColor: 'rgba(42, 27, 74, 0.9)',
            color: '#fff',
            border: '1px solid #9c27b0',
            '& .MuiAlert-icon': {
              color: '#ffd700'
            }
          }}
        >
          All the further rules about this tournament will be given in the discord channel.
          Make sure all members join the discord channel prior to the event.
        </Alert>
      </StyledPaper>

      <StyledButton
        as={motion.button}
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        variants={itemVariants}
      >
        Register Team
      </StyledButton>
    </motion.form>
  );
}

export default RegistrationForm;
