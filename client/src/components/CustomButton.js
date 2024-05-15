// CustomButton.js
import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {amber} from "@mui/material/colors";

const CustomButton = ({ onClick, disabled, fontSize, text, icon, isScrolled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      endIcon={React.cloneElement(icon, {
        sx: {
            transform: 'scale(1.8)',
            marginLeft: isScrolled ? '-42px' : { xs: '-42px', lg: '0' },
            transition: 'margin-left 0.2s ease-in-out',
        },
      })}
      sx={{
        textTransform: 'none',
        padding: '15px 30px',
        cursor: 'pointer',
        marginTop: '20px',
        position: 'fixed',
        top: '280px',
        right: '50px',
        backgroundColor: amber[300],
        color: '#FFF',
        border: 'none',
        borderRadius: '100px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease-in-out',
        height: '60px',
        width: isScrolled ? '60px' : { xs: '60px', lg: '180px' },
        zIndex: 2,
        '&:hover': {
          backgroundColor: amber[200],
        },
        '& .MuiTouchRipple-child': {
          backgroundColor: amber[50],
        },
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          fontSize: fontSize || '18pt',
          fontFamily: 'arial',
          fontWeight: 'bold',
          opacity: isScrolled ? 0 : { xs: 0, lg: 1 },
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        {text}
      </Typography>
    </Button>
  );
};

export default CustomButton;
