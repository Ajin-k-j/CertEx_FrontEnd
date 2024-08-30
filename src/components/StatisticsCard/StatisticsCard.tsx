import React from 'react';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';

interface StatisticsCardProps {
  data: {
    primary?: string;
    secondary?: number;
    tertiary?: number;
  };
  icons: {
    primary?: React.ReactElement;
    secondary?: React.ReactElement;
    tertiary?: React.ReactElement;
  };
  labels: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  loading?: boolean;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ data, icons, labels, loading = false }) => {
  const isEmpty = Object.values(data).every((value) => value === '' || value === 0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '10px',
        boxShadow: 'none',
        width: {
          xs: '90vw',
          sm: '70vw',
          md: '49vw',
          lg: '44vw',
        },
        height: 'auto',
        textAlign: 'center',
        marginLeft: 1.5,
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
          <CircularProgress />
        </Box>
      ) : isEmpty ? (
        <Typography variant="h6" sx={{ color: '#808080' }}>
          No data available.
        </Typography>
      ) : (
        <Grid container spacing={2} alignItems="center" justifyContent="space-around">
          {Object.keys(data).map((key) => (
            <Grid item xs={4} sm={4} md={3} lg={3} key={key}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#7FFFD4',
                    borderRadius: '50%',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px', // Space between icon and text
                  }}
                >
                  {icons[key as keyof typeof icons]}
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#808080',
                    }}
                  >
                    {labels[key as keyof typeof labels]}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}
                  >
                    {data[key as keyof typeof data]}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StatisticsCard;
