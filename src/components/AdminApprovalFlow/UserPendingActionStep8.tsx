import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { showToast } from "../../utils/toastUtils";

const UpdateReimbursementStatus: React.FC = () => {
  const handleYesClick = () => {
    showToast("Reimbursement status updated!","success");
  };

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
         Reimbursement received
      </Typography>
      <div >

      <Button variant="contained" color="primary" onClick={handleYesClick}>
        Yes
      </Button>
      <Button variant="contained" color="warning"  sx={{marginLeft:"2vw"}}>
        No
      </Button>

      </div>
    </Box>
  );
};

export default UpdateReimbursementStatus;
