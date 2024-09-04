import React from "react";
import { useLocation } from "react-router-dom";
import {Typography, Box } from "@mui/material";

const MessagePage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get('message') || '';
  const success = queryParams.get('success') === 'true';

  // Clean up the message
  const cleanedMessage = message.replace(/_/g, ' ');

  // Construct full message
  const fullMessage = success
    ? `${cleanedMessage} successfully.`
    : `Some error occurred. Please try again later.`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: success ? '#e6f7e6' : '#f8d7da',
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          maxWidth: '600px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: '28px',
            color: '#000',  // Black color for both success and error
            fontWeight: 'bold',
            marginBottom: '20px',
          }}
        >
          {success ? "Success" : "Error"}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '18px',
            color: '#555',
            marginBottom: '30px',
            lineHeight: 1.5,
          }}
        >
          {fullMessage}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: '16px',
            color: '#555',
            marginTop: '20px',
          }}
        >
          You can close this window now.
        </Typography>
      </Box>
    </Box>
  );
};

export default MessagePage;
