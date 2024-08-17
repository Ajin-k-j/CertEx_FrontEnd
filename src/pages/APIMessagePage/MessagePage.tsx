import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

interface MessagePageProps {
  message: string;
  success: boolean;
}

const MessagePage: React.FC<MessagePageProps> = ({ message, success }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          {success ? 'Success' : 'Failure'}
        </Typography>
        <Typography variant="body1" paragraph>
          {message}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
        >
          Go Back
        </Button>
        <h3>You can close this now.</h3>
      </Box>
    </Container>
  );
};

export default MessagePage;
