import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

interface StatisticsCardProps {
  data: {
    department: string;
    employees: number;
    certifications: number;
  };
  icons: {
    department: React.ReactElement;
    employees: React.ReactElement;
    certifications: React.ReactElement;
  };
  labels: {
    department: string;
    employees: string;
    certifications: string;
  };
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ data, icons, labels }) => {
  const isEmpty = Object.values(data).every(value => value === '' || value === 0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '15px',
        boxShadow: 'none',
        width: {
          xs: '90vw',
          sm: '70vw',
          md: '50vw',
          lg: '40vw',
        },
        height: {
          xs: '15vh',
          sm: '12vh',
          md: '10vh',
          lg: '8vh',
        },
        textAlign: 'center',
      }}
    >
      {isEmpty ? (
        <Typography variant="h6" sx={{ color: '#808080' }}>
          No data available.
        </Typography>
      ) : (
        <Grid container spacing={3} alignItems="center">
          {Object.keys(data).map((key) => (
            <React.Fragment key={key}>
              <Grid item>
                <Box
                  sx={{
                    backgroundColor: '#7FFFD4',
                    borderRadius: '50%',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {icons[key as keyof typeof icons]}
                </Box>
              </Grid>
              <Grid item sx={{ marginLeft: -2, textAlign: 'left' }}>
                <Typography variant="subtitle1" sx={{ color: '#808080' }}>
                  {labels[key as keyof typeof labels]}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 20 }}>
                  {data[key as keyof typeof data]}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StatisticsCard;
