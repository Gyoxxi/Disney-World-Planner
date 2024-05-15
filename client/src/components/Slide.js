// Slide.js
import React, {useEffect, useState} from 'react';
import {
  Box,
  Checkbox,
  Stack,
  Typography
} from '@mui/material';
import {CircleRounded, CheckCircle} from '@mui/icons-material';
import { amber } from '@mui/material/colors'
import {rgb} from "d3-color";


const Slide = ({ slide, selectedRides, handleCheckboxChange, handleRideClick }) => {
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    const importImage = async () => {
      const imageName = slide.name.replace(/[^a-zA-Z0-9]/g, '');
      const imageModule = await import(`../static/${imageName}.jpg`);
      setImagePath(imageModule.default);
    };
    importImage();
  }, [slide.name]);

  return (
      <Box
        key={slide.name}
        sx={{
          display: 'flex',
          textAlign: 'center',
          fontSize: '12px',
          borderRadius: '24px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          height: '300px',
          cursor: 'pointer',
          position: 'relative',
          background:  `${selectedRides.includes(slide.name) ? amber[300] : rgb(255,255,255)}`,
          transition: 'background-color border-radius 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: `${selectedRides.includes(slide.name) ? amber[300] : rgb(245,245,245)}`,
          },
        }}
      >
      <Stack
        direction="column"
        alignItems="center"
        sx={{
          top: '10px',
          right: '10px',
          width: '100%',
        }}
      >
        <Checkbox
          id={`checkbox-${slide.name}`}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
            '& .MuiSvgIcon-root': { fontSize: 30 }
          }}
          icon={<CircleRounded sx={{ color: 'white', stroke: 'white', strokeWidth: '3px' }} />}
          checkedIcon={<CheckCircle sx={{ color: amber[500], bgcolor: 'white', borderRadius: '100px' }} />}
          checked={selectedRides.includes(slide.name)}
          onClick={(e) => handleCheckboxChange(slide.name, e)}
        />

        <Box
          overflow="hidden"
          sx={{
            width: '100%',
            height: '240px',
            borderRadius: '24px',
          }}
          onClick={(e) => handleRideClick(slide, e)}
        >
          <Box
          component="img"
          sx={{
            width: '100%',
            height: '240px',
            objectFit: 'cover',
            transition: 'all 0.6s ease-in-out',
            filter: 'grayscale(40%)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          alt={slide.name}
          src={imagePath}
          />
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: '10pt',
            width: '84%',
            // transform: `${selectedRides.includes(slide.name) ? 'scale(1.1)' : 'scale(1)'}`,
            margin: '0 auto',
            paddingTop: slide.name.length > 32 ? '8px' : '16px',
            paddingBottom: '10px',
            transition: 'all 0.4s ease-in-out',
            // '&:hover': {
            //   transform: 'scale(1.1)',
            // },
          }}
        >
          {slide.name}
        </Typography>
      </Stack>
      </Box>
  );
};

export default Slide;
