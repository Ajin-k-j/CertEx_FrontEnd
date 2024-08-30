import React from "react";
import { Button, Box, Typography } from "@mui/material";

interface ButtonConfig {
  label: string;
  onClick: () => void;
}

interface DashboardActionsProps {
  buttons: ButtonConfig[];
}

const DashboardActions: React.FC<DashboardActionsProps> = ({  buttons }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius:'15px',
        padding: { xs: '2vh', sm: '3vh', md: '2vh' },
        textAlign: 'center',
        maxWidth: { xs: '100%', sm: '80%', md: '45vw' },
        marginLeft:{xs:'1.1vw', sm: '1.1vw', md: '1.1vw'},
      
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginTop: "-2vh",
          marginBottom: "1vh",
          fontWeight: "bold",
          fontSize: { xs: "2vh", sm: "2.5vh", md: "3vh" },
        }}
      >
   
      </Typography>
      <Box
        sx={{
          width: '46vw',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: '8px', sm: '8px', md: '10px' },
        }}
      >
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant="contained"
            color="primary"
            onClick={button.onClick}
            sx={{
              backgroundColor: '#6C63FF',
              borderRadius: '1vh',
              textTransform: 'none',
              fontWeight: 'bold',
              lineHeight:'2.5vh',
              width: { xs: '80%', sm: '30%', md: '31%' }, 
              height: { xs: '6vh', sm: '7vh', md: '6vh' },
              fontSize: { xs: '1.7vh', sm: '1.8vh', md: '1.8vh' }, 
              '&:hover': {
                backgroundColor: '#574bff',
              },
            }}
          >
            {button.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardActions;
