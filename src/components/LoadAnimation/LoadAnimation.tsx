import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingAnimation = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '40vh', // Full height of the viewport
    }}
  >
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress size={40} thickness={4} />
      <Box
        sx={{
          animation: 'rotate 3s linear infinite',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              position: 'absolute',
              transform: `rotate(${index * 120}deg) translateX(12px)`,
            }}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

export default LoadingAnimation;
