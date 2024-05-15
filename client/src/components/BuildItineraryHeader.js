// BuildItineraryHeader.js

import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { amber } from '@mui/material/colors';

const BuildItineraryHeader = ({ title, src, bodyText, activeBox }) => {
  return (
    <Stack
      width={"100%"}
      sx={{
        justifyContent: 'center',
        marginBottom: { xs: '-60px', sm: '-60px', md: '-80px', lg: '-100px' },
      }}
    >
      <Box
        component="img"
        sx={{
          width: '100%',
          height: '400px',
          objectFit: 'cover',
          filter: 'brightness(50%)',
          zIndex: -1,
        }}
        alt="Build Your Itinerary"
        src={src}
      />
      <Typography
        sx={{
          position: 'relative',
          bottom: '280px',
          color: 'white',
          textAlign: 'center',
          zIndex: 3,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: { xs: '30pt', sm: '30pt', md: '40pt', lg: '50pt' },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Arial',
            fontSize: { xs: '10pt', sm: '10pt', md: '12pt', lg: '12pt' },
          }}
        >
          {bodyText.split('.').map((line, index) => (
            <React.Fragment key={index}>
              {line}.
              <br />
            </React.Fragment>
          ))}
        </Typography>
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          position: 'relative',
          alignSelf: 'center',
          width: '100px',
          bottom: '200px',
        }}
      >
        {[1, 2, 3].map((box) => (
          <Box
            key={box}
            sx={{
              borderRadius: '50%',
              backgroundColor: box === activeBox ? amber[300] : 'white',
              width: '8pt',
              height: '8pt',
              transform: box === activeBox ? "scale(1.5)" : "scale(1)",
              zIndex: 2,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default BuildItineraryHeader;
