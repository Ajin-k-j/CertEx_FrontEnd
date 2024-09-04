import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authconfig";
import { SiMicrosoft } from "react-icons/si"; // Import Microsoft icon

const LoginPage: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "94vh",
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/025/695/429/non_2x/abstract-white-background-for-design-brochure-website-flyer-minimal-white-wallpaper-for-certificate-presentation-vector.jpg')`, // Updated minimalistic background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "1rem", // Add padding around the container for responsiveness
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight transparency for a modern feel
          padding: "3rem", // Increased padding for a spacious layout
          borderRadius: "12px", // Slightly more rounded corners for a modern look
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)", // Softer, more subtle shadow
          textAlign: "center",
          maxWidth: "500px", // Restrict the width for a more focused look
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#1976d2", // Use primary color for branding
            marginBottom: "1.5rem", // Add some spacing below the title
          }}
        >
          Welcome to CertEx
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SiMicrosoft />} // Microsoft logo
          onClick={handleLogin}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "0.75rem 2rem", // Increase padding for the button
            borderRadius: "24px", // Rounded button for a modern look
          }}
        >
          Sign in with Microsoft
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
