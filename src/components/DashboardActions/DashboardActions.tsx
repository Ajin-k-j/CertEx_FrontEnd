import React from "react";
import { Button, Box, Typography } from "@mui/material";

interface ButtonConfig {
  label: string;
  onClick: () => void;
}

interface DashboardActionsProps {
  title: string;
  buttons: ButtonConfig[];
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  title,
  buttons,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: { xs: "3vh", sm: "4vh", md: "5vh" },
        padding: { xs: "2vh", sm: "3vh", md: "4vh" },
        textAlign: "center",
        maxWidth: { xs: "100%", sm: "80%", md: "600px" },
        margin: { xs: "0 auto", sm: ".8vw", md: "0.8vw" },
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
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: { xs: "8px", sm: "10px", md: "20px" },
        }}
      >
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant="contained"
            color="primary"
            onClick={button.onClick}
            sx={{
              backgroundColor: "#6C63FF",
              borderRadius: "5vh",
              textTransform: "none",
              fontWeight: "bold",
              lineHeight: "2.5vh",
              width: { xs: "80%", sm: "30%", md: "31%" }, // Adjusted width to fit 3 in a row
              height: { xs: "6vh", sm: "7vh", md: "6vh" },
              fontSize: { xs: "1.7vh", sm: "1.8vh", md: "2vh" }, // Slightly reduced font size for better fit
              "&:hover": {
                backgroundColor: "#574bff",
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
