import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  TextField,
} from '@mui/material';

interface Nomination {
  id: number;
  title: string;
  candidateName: string;
  department: string;
  provider: string;
  criticality: string;
  status: string;
  remarks: string;
  plannedExamMonth: string;
}

interface PendingNominationModalProps {
  nomination: Nomination;
  isOpen: boolean;
  onClose: () => void;
}

const PendingNominationModal: React.FC<PendingNominationModalProps> = ({
  nomination,
  isOpen,
  onClose,
}) => {
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const handleApprove = () => {
    // Handle approve logic here
    onClose();
  };

  const handleReject = () => {
    // Open rejection modal
    setIsRejectionModalOpen(true);
  };

  const handleRejectionSubmit = () => {
    // Handle reject logic here with the rejectionMessage
    setIsRejectionModalOpen(false);
    onClose();
  };

  const handleCloseRejectionModal = () => {
    setIsRejectionModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" align="center" fontWeight="bold">
            Nomination Details
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box mb={2} mt={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {nomination.title}
            </Typography>
            <Typography variant="body1" fontSize="1.1rem">
              <strong>Employee Name:</strong> {nomination.candidateName}
            </Typography>
            <Typography variant="body1" fontSize="1.1rem">
              <strong>Department:</strong> {nomination.department}
            </Typography>
            <Typography variant="body1" fontSize="1.1rem">
              <strong>Provider:</strong> {nomination.provider}
            </Typography>
            <Typography variant="body1" fontSize="1.1rem" color="error">
              <strong>Criticality:</strong> {nomination.criticality}
            </Typography>
            <Typography variant="body1" fontSize="1.1rem">
              <strong>Planned Exam Month:</strong> {nomination.plannedExamMonth}
            </Typography>
          </Box>
          <Divider />
          <Box mt={2}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Remarks:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
              {nomination.remarks}
            </Typography>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            sx={{ minWidth: '100px' }}
          >
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            variant="contained"
            color="success"
            sx={{ minWidth: '100px', marginLeft: '16px' }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isRejectionModalOpen}
        onClose={handleCloseRejectionModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle align="center">
          <Typography variant="h6" fontWeight="bold">
            Provide Rejection Reason
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectionMessage}
            onChange={(e) => setRejectionMessage(e.target.value)}
            variant="outlined"
            placeholder="Enter rejection reason..."
            sx={{ marginTop: '16px' }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button
            onClick={handleCloseRejectionModal}
            color="secondary"
            sx={{ minWidth: '100px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectionSubmit}
            variant="contained"
            color="error"
            sx={{ minWidth: '100px', marginLeft: '16px' }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingNominationModal;
