import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Modal,
  CircularProgress,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCertificationById, fetchNominationById } from '../../../api/UserPendingActionApi';
import DatePickerModal from '../../DatePicker/DatePicker'; // Import the DatePickerModal

const steps = [
  'Certification Details',
  'Nomination Approval',
  'Choose Exam Date',
  'Update Exam Status',
  'Upload Certificate',
];

interface UserPendingActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserPendingActionModal({ isOpen, onClose }: UserPendingActionModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [certification, setCertification] = useState<any>(null);
  const [nomination, setNomination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificationData = await fetchCertificationById(); 
        const nominationData = await fetchNominationById(certificationData.id); 

        setCertification(certificationData);
        setNomination(nominationData);

        // Determine the first incomplete step and set it as the active step
        let incompleteStep = 0;
        if (nominationData.department_approval !== 'approved') {
          incompleteStep = 1;
        } else if (nominationData.l_and_d_approval !== 'approved') {
          incompleteStep = 1;
        } else if (!nominationData.exam_date) {
          incompleteStep = 2;
        } else if (nominationData.exam_status !== 'updated') {
          incompleteStep = 3;
        } else if (nominationData.upload_certificate_status !== 'uploaded') {
          incompleteStep = 4;
        }
        setActiveStep(incompleteStep);
        updateCompletedSteps(incompleteStep);

      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateCompletedSteps = (currentStep: number) => {
    const newCompletedSteps = new Set<number>();
    for (let i = 0; i < currentStep; i++) {
      newCompletedSteps.add(i);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const handleNext = () => {
    if (completedSteps.has(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = (index: number) => {
    if (index <= activeStep) {
      setActiveStep(index);
    }
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('All steps completed successfully!');
      onClose();
    }, 2000);
  };

  const handleDatePickerOpen = () => {
    setDatePickerOpen(true);
  };

  const handleDatePickerClose = () => {
    setDatePickerOpen(false);
  };

  const handleDateSave = async (selectedDate: string) => {
    try {
      // Update the nomination with the selected exam date
      const updatedNomination = { ...nomination, exam_date: selectedDate };
      setNomination(updatedNomination);
      toast.success('Exam date selected successfully.');
      updateCompletedSteps(3); // Mark step 2 as completed
      handleNext();
    } catch (error) {
      console.error('Error saving exam date:', error);
      toast.error('Failed to save exam date. Please try again later.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ maxWidth: 400, bgcolor: 'background.paper', p: 4, m: 'auto', mt: 10 }}>
          <Typography variant="h6" id="modal-title" sx={{ mb: 2 }}>
            Certification Process
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step key={steps[0]}>
              <StepLabel onClick={() => handleBack(0)}>{steps[0]}</StepLabel>
              <StepContent>
                <Typography variant="body1">{certification?.certification_name}</Typography>
                <Typography variant="body2">{certification?.description}</Typography>
                <Button variant="contained" onClick={handleNext} sx={{ mt: 2 }}>
                  Continue
                </Button>
              </StepContent>
            </Step>

            <Step key={steps[1]}>
              <StepLabel onClick={() => handleBack(1)}>{steps[1]}</StepLabel>
              <StepContent>
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={nomination?.department_approval === 'approved' ? 1 : 0} alternativeLabel>
                    <Step key="Department Approval">
                      <StepLabel error={nomination?.department_approval !== 'approved'}>
                        Department Head Approval {nomination?.department_approval !== 'approved' && ' - Pending'}
                      </StepLabel>
                    </Step>
                    <Step key="L&D Approval">
                      <StepLabel error={nomination?.l_and_d_approval !== 'approved'}>
                        L&D Approval {nomination?.l_and_d_approval !== 'approved' && ' - Pending'}
                      </StepLabel>
                    </Step>
                  </Stepper>
                </Box>
                <Button variant="contained" onClick={handleNext} disabled={nomination?.department_approval !== 'approved' || nomination?.l_and_d_approval !== 'approved'} sx={{ mt: 2 }}>
                  Continue
                </Button>
              </StepContent>
            </Step>

            <Step key={steps[2]}>
              <StepLabel onClick={() => handleBack(2)}>{steps[2]}</StepLabel>
              <StepContent>
                {nomination?.exam_date ? (
                  <Typography variant="body2">Exam Date: {nomination.exam_date}</Typography>
                ) : (
                  <>
                    <Button variant="contained" onClick={handleDatePickerOpen} sx={{ mt: 2 }}>
                      Choose Exam Date
                    </Button>
                    <DatePickerModal
                      isOpen={isDatePickerOpen}
                      onClose={handleDatePickerClose}
                      nominationId={nomination?.id}
                      onSave={handleDateSave}
                    />
                  </>
                )}
                <Button variant="contained" onClick={handleNext} disabled={!nomination?.exam_date} sx={{ mt: 2 }}>
                  Continue
                </Button>
              </StepContent>
            </Step>

            <Step key={steps[3]}>
              <StepLabel onClick={() => handleBack(3)}>{steps[3]}</StepLabel>
              <StepContent>
                {nomination?.exam_status === 'updated' ? (
                  <Typography variant="body2">Exam status updated.</Typography>
                ) : (
                  <Button variant="contained" sx={{ mt: 2 }}>Update Exam Status</Button>
                )}
                <Button variant="contained" onClick={handleNext} disabled={nomination?.exam_status !== 'updated'} sx={{ mt: 2 }}>
                  Continue
                </Button>
              </StepContent>
            </Step>

            <Step key={steps[4]}>
              <StepLabel onClick={() => handleBack(4)}>{steps[4]}</StepLabel>
              <StepContent>
                {nomination?.upload_certificate_status === 'uploaded' ? (
                  <Typography variant="body2">Certificate uploaded.</Typography>
                ) : (
                  <Button variant="contained" component="label" sx={{ mt: 2 }}>
                    Upload Certificate
                    <input type="file" hidden />
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleFinish}
                  disabled={nomination?.upload_certificate_status !== 'uploaded'}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Finish'}
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
}
