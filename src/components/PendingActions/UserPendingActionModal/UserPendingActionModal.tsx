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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCertificationById, fetchNominationById } from '../../../api/UserPendingActionApi';
import DatePickerModal from '../../DatePicker/DatePicker';
import Invoice from '../InvoiceDetails/InvoiceDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const steps = [
  'Certification Details',
  'Nomination Approval',
  'Choose Exam Date',
  'Update Exam Status',
  'Upload Certificate',
  'Update Invoice Status',
  'Skill Matrix Status',
  'Reimbursement Status',
];

interface UserPendingActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Certification {
  id: number;
  certification_name: string;
  description: string;
}

interface Nomination {
  id: string;
  department_approval: 'approved' | 'pending';
  l_and_d_approval: 'approved' | 'pending';
  exam_date?: Date;
  exam_status: 'pending' | 'pass' | 'incomplete';
  upload_certificate_status: 'uploaded' | 'not_uploaded';
  invoice_status?: 'updated' | 'not_updated';
  skill_matrix_status?: boolean;
  reimbursement_status?: boolean;
}

export default function UserPendingActionModal({ isOpen, onClose }: UserPendingActionModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [certification, setCertification] = useState<Certification | null>(null);
  const [nomination, setNomination] = useState<Nomination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'pass' | 'incomplete'>('incomplete');
  const [previousStep, setPreviousStep] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSkillMatrixCompleted, setSkillMatrixCompleted] = useState<boolean | null>(false);
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState<boolean | null>(false);
  const [isReimbursementCompleted, setReimbursementCompleted] = useState<boolean | null>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificationData = await fetchCertificationById();
        const nominationData = await fetchNominationById(certificationData.id);

        setCertification(certificationData);
        setNomination(nominationData);

        let incompleteStep = 0;
        if (nominationData.department_approval !== 'approved' || nominationData.l_and_d_approval !== 'approved') {
          incompleteStep = 1;
        } else if (!nominationData.exam_date) {
          incompleteStep = 2;
        } else if (nominationData.exam_status === 'pending') {
          incompleteStep = 3;
        } else if (nominationData.upload_certificate_status !== 'uploaded') {
          incompleteStep = 4;
        } else if (nominationData.upload_certificate_status === 'uploaded' && nominationData.invoice_status === 'pending') {
          incompleteStep = 5;
        } else if (nominationData.invoice_status === 'updated' && nominationData.skill_matrix_status === false) {
          incompleteStep = 6;
        } else if (nominationData.skill_matrix_status && nominationData.reimbursement_status === false) {
          incompleteStep = 7;
        } else if (nominationData.reimbursement_status === true) {
          incompleteStep = 8;
        }

        setCurrentStep(incompleteStep);
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
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setPreviousStep(null);
  };

  const handleBack = (index: number) => {
    if (index < activeStep) {
      setPreviousStep(activeStep);
      setCurrentStep(activeStep);
    } else {
      setPreviousStep(null);
    }
    setActiveStep(index);
  };

  const handleReturnToCurrentStep = () => {
    if (previousStep !== null) {
      setActiveStep(currentStep);
      setPreviousStep(null);
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
    if (activeStep === 2 && previousStep === null) {
      setDatePickerOpen(true);
    }
  };

  const handleDatePickerClose = () => {
    setDatePickerOpen(false);
  };

  const handleDateSave = async (selectedDate: string) => {
    try {
      if (nomination) {
        const updatedNomination: Nomination = await fetchNominationById(nomination.id, { exam_date: selectedDate });
        setNomination(updatedNomination);
        toast.success('Exam date selected successfully.');
        updateCompletedSteps(3);
        handleNext();
      } else {
        throw new Error('Nomination data is missing.');
      }
    } catch (error) {
      console.error('Error saving exam date:', error);
      toast.error('Failed to save exam date. Please try again later.');
    }
  };

  const handleDialogOpen = () => {
    if (activeStep === 3 && previousStep === null) {
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value as 'pass' | 'incomplete');
  };

  const handleStatusSave = async () => {
    if (nomination) {
      try {
        const updatedNomination: Nomination = await fetchNominationById(nomination.id, { exam_status: selectedStatus });
        setNomination(updatedNomination);

        toast.success(`Exam status updated to ${selectedStatus}.`);

        if (selectedStatus === 'pass' || selectedStatus === 'incomplete') {
          updateCompletedSteps(4);
          handleNext();
        }

        handleDialogClose();
      } catch (error) {
        console.error('Error updating exam status:', error);
        toast.error('Failed to update exam status. Please try again later.');
      }
    }
  };

  const handleInvoiceOpen = () => {
    if (activeStep === 5 && previousStep === null) {
      setAccordionOpen(!isAccordionOpen);
    }
  };

  const handleInvoiceClose = () => {
    setAccordionOpen(false);
  };

  const handleSkillMatrixCompletion = async (isCompleted: boolean) => {
    try {
      setSkillMatrixCompleted(isCompleted);
      console.log(isSkillMatrixCompleted)

      if (isCompleted) {
        const updatedNomination: Nomination = await fetchNominationById(nomination?.id || '', {
          skill_matrix_status: true,
        });

        setNomination(updatedNomination);

        toast.success('Skill matrix status updated successfully.');
      } else {
        setShowCompletionMessage(true);
        setTimeout(() => {
          setShowCompletionMessage(false);
        }, 10000);
      }
    } catch (error) {
      console.error('Error updating skill matrix status:', error);
      toast.error('Failed to update skill matrix status. Please try again later.');
    }
  };

  const handleReimbursementCompletion = async () => {
    try {
      setReimbursementCompleted(true);
      console.log(isReimbursementCompleted)
      toast.success('Reimbursement status updated successfully.');
      handleFinish();
    } catch (error) {
      console.error('Error updating reimbursement status:', error);
      toast.error('Failed to update reimbursement status. Please try again later.');
    }
  };

  const isContinueEnabled = (index: number) => {
    if (index === 0) return true;

    if (index === 1) {
      return (
        (nomination?.department_approval === 'approved' && nomination?.l_and_d_approval === 'approved') ||
        index === activeStep
      );
    }

    if (index === 2) {
      return !!nomination?.exam_date || index === activeStep;
    }

    if (index === 3) {
      return nomination?.exam_status !== 'pending' || index === activeStep;
    }

    if (index === 4) {
      return nomination?.upload_certificate_status === 'uploaded' || index === activeStep;
    }

    if (index === 5) {
      return nomination?.invoice_status === 'updated' || index === activeStep;
    }

    if (index === 6) {
      return nomination?.skill_matrix_status === true || index === activeStep;
    }

    if (index === 7) {
      return nomination?.reimbursement_status === true || index === activeStep;
    }

    if (index === 8) {
      return true;
    }

    return false;
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
        <Box
          sx={{
            maxWidth: 500,
            maxHeight: '75vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            p: 4,
            m: 'auto',
            mt: 10,
            mb: 10,
            borderRadius: 2,
            boxShadow: 3,
            '@media (max-width: 600px)': {
              maxWidth: 300,
              p: 3,
            },
            '@media (min-width: 600px) and (max-width: 960px)': {
              maxWidth: 350,
              p: 4,
            },
          }}
        >
          <Typography variant="h6" id="modal-title" sx={{ mb: 2 }}>
            Certification Process
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => {
              const isStepGrayedOut = !isContinueEnabled(index);

              return (
                <Step key={label} completed={completedSteps.has(index)}>
                  <StepLabel
                    onClick={() => {
                      if (!isStepGrayedOut) {
                        handleBack(index);
                      }
                    }}
                    sx={{
                      cursor: isStepGrayedOut ? 'not-allowed' : 'pointer',
                      color: isStepGrayedOut ? 'grey.500' : 'inherit',
                      pointerEvents: isStepGrayedOut ? 'none' : 'auto',
                    }}
                  >
                    {label}
                  </StepLabel>

                  {activeStep === index && !isStepGrayedOut && (
                    <StepContent>
                      {index === 0 && nomination && (
                        <>
                          <Typography variant="body1">{certification?.certification_name}</Typography>
                          <Typography variant="body2">{certification?.description}</Typography>
                        </>
                      )}
                      {index === 1 && nomination && (
                        <Box sx={{ width: '100%' }}>
                          <Stepper
                            activeStep={
                              nomination?.department_approval === 'approved' &&
                              nomination?.l_and_d_approval === 'approved'
                                ? 2
                                : nomination?.department_approval === 'approved'
                                ? 1
                                : 0
                            }
                            alternativeLabel
                          >
                            <Step key="Department Approval">
                              <StepLabel>Department Approval</StepLabel>
                            </Step>
                            <Step key="L&D Approval">
                              <StepLabel>L&D Approval</StepLabel>
                            </Step>
                          </Stepper>
                        </Box>
                      )}
                      {index === 2 && nomination && (
                        <>
                          <Typography>Select an exam date:</Typography>
                          <Button
                            variant="outlined"
                            onClick={handleDatePickerOpen}
                            disabled={activeStep !== index || previousStep !== null}
                          >
                            {nomination?.exam_date ? `Change Date: ${nomination.exam_date}` : 'Choose Date'}
                          </Button>
                          <DatePickerModal
                            isOpen={isDatePickerOpen}
                            onClose={handleDatePickerClose}
                            onSave={handleDateSave}
                          />
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <Typography>Update your exam status:</Typography>
                          <Button
                            variant="outlined"
                            onClick={handleDialogOpen}
                            disabled={activeStep !== index || previousStep !== null}
                          >
                            {nomination?.exam_status === 'pending'
                              ? 'Choose Status'
                              : `Status: ${nomination?.exam_status}`}
                          </Button>
                          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                            <DialogTitle>Select Exam Status</DialogTitle>
                            <DialogContent>
                              <RadioGroup value={selectedStatus} onChange={handleStatusChange}>
                                <FormControlLabel value="pass" control={<Radio />} label="Pass" />
                                <FormControlLabel value="incomplete" control={<Radio />} label="Incomplete" />
                              </RadioGroup>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleDialogClose} color="primary">
                                Cancel
                              </Button>
                              <Button onClick={handleStatusSave} color="primary">
                                Save
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </>
                      )}
                      {index === 4 && nomination && (
                        <Box>
                          <Typography>Upload your certificate:</Typography>
                          <Button
                            variant="contained"
                            component="label"
                            disabled={activeStep !== index || previousStep !== null}
                          >
                            {nomination?.upload_certificate_status === 'uploaded'
                              ? <span>Upload new certificate</span>
                              : 'Upload Certificate'}
                            <input type="file" hidden />
                          </Button>
                          {nomination?.upload_certificate_status === 'uploaded' && (
                            <button style={{ marginLeft: '10px' }} onClick={handleNext}>Next</button>
                          )}
                        </Box>
                      )}
                      {index === 5 && nomination && (
                        <>
                          <Typography>Update the invoice status.</Typography>
                          <Button
                            onClick={handleInvoiceOpen}
                            disabled={activeStep !== index}
                            sx={{ mt: 2 }}
                          >
                            {isAccordionOpen ? 'Hide Invoice Details' : 'Update Invoice'}
                          </Button>
                          <Accordion expanded={isAccordionOpen} onChange={() => setAccordionOpen(!isAccordionOpen)}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography>Invoice Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Invoice open={isAccordionOpen} onClose={handleInvoiceClose} />
                            </AccordionDetails>
                          </Accordion>
                        </>
                      )}

                      {index === 6 && nomination && (
                        <Box sx={{ mb: 2 }}>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            Did you upload your certification in the Skill Matrix Application?
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => handleSkillMatrixCompletion(true)}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Yes
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => handleSkillMatrixCompletion(false)}
                            sx={{ mt: 1 }}
                          >
                            No
                          </Button>
                          {showCompletionMessage && (
                            <Typography sx={{ mt: 2, color: 'red' }}>
                              Please update Skill Matrix Application for reimbursement.
                            </Typography>
                          )}
                        </Box>
                      )}

                      {index === 7 && nomination && (
                        <>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            Once you have received your reimbursement, click the button below to mark this step as complete.
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={handleReimbursementCompletion}
                            disabled={activeStep !== index || previousStep !== null}
                          >
                            Mark as Completed
                          </Button>
                        </>
                      )}

                      {index === 8 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography>All steps completed</Typography>
                          <Button onClick={handleFinish} sx={{ mt: 2 }}>
                            Finish
                          </Button>
                        </Box>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <div>
                          {previousStep !== null && activeStep !== previousStep && (
                            <Button
                              variant="outlined"
                              onClick={handleReturnToCurrentStep}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Return to Current Step
                            </Button>
                          )}
                        </div>
                      </Box>
                    </StepContent>
                  )}
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
}
