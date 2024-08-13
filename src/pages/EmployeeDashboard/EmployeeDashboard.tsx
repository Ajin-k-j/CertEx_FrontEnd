import React from 'react';
import { Box, Typography } from '@mui/material';
import CertificationTable from '../../components/UserCertificationsTable/UserCertificationsTable';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const UserCertificationsPage: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>User Certifications</Typography>
        <CertificationTable />
      </Box>
    </LocalizationProvider>
  );
};

export default UserCertificationsPage;
