import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authconfig";

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
        height: "100vh",
        backgroundImage: `url('https://source.unsplash.com/random/1600x900')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to CertEx
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Sign in with Microsoft
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
