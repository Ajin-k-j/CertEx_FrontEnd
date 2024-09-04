import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const UpdateReimbursementStatus: React.FC = () => {
  const handleYesClick = () => {
    alert('Updated successfully!');
  };

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        If you receive reimbursement click on yes
      </Typography>
      <Button variant="contained" color="primary" onClick={handleYesClick}>
        Yes
      </Button>
    </Box>
  );
};

export default UpdateReimbursementStatus;
