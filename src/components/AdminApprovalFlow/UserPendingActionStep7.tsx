import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface UploadReminderProps {
  onDone: (value: number) => void;
}

const UploadReminder: React.FC<UploadReminderProps> = ({ onDone }) => {
  const handleDoneClick = () => {
    console.log('User clicked on Done after uploading the certification.');
    onDone(8); // Send the number 8 to the parent component
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box>
        <Typography variant="body1" fontWeight="bold">
          Upload your Certification in the Skill Matrix Application
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Once you upload, click on Done
        </Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={handleDoneClick}>
        Done
      </Button>
    </Box>
  );
};

export default UploadReminder;
