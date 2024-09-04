import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { getCertificationDetails, fetchNominationById, fetchExamDetailByNominationId } from '../../../api/UserActionFlowApi';
import UserPendingActionStep2 from '../../AdminApprovalFlow/UserPendingActionStep2';
import UserPendingActionStep3 from '../../AdminApprovalFlow/UserPendingActionStep3';
import UserPendingActionStep4 from '../../AdminApprovalFlow/UserPendingActionStep4';
import UserPendingActionStep5 from '../../AdminApprovalFlow/UserPendingActionStep5';
import UserPendingActionStep6 from '../../AdminApprovalFlow/UserPendingActionStep6';
import UploadReminder from '../../AdminApprovalFlow/UserPendingActionStep7';
import UpdateReimbursementStatus from '../../AdminApprovalFlow/UserPendingActionStep8';

interface UserPendingActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    nominationId: number;
}

const steps = [
    { label: 'Certification Details' },
    { label: 'Nomination Approval' },
    { label: 'Register for the Exam' },
    { label: 'Update Exam Status' },
    { label: 'Upload Certificate' },
    { label: 'Upload Invoice' },
    { label: 'Upload into Skill Matrix' },
    { label: 'Update Reimbursement Status' },
];

const StyledText = ({ label, value }) => (
    <span>
        <span style={{ color: '#337ab7', fontWeight: 'bold' }}>{label}:</span>
        <span style={{ fontWeight: 'bold' }}>{value}</span>
    </span>
);

const UserPendingActionModal: React.FC<UserPendingActionModalProps> = ({ isOpen, onClose, nominationId }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [certificationDetails, setCertificationDetails] = useState({
        certificationName: '',
        certificationDescription: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [certDetails, nomination, examDetail] = await Promise.all([
                    getCertificationDetails(nominationId),
                    fetchNominationById(nominationId),
                    fetchExamDetailByNominationId(nominationId)
                ]);

                setCertificationDetails(certDetails);

                // Determine the active step based on the conditions
                if (!nomination.isLndApproved) {
                    setActiveStep(1);
                } else if (!nomination.examDate) {
                    setActiveStep(2);
                } else if (nomination.examStatus === 'Not Completed') {
                    setActiveStep(3);
                } else if (nomination.examStatus === 'Failed' || nomination.examStatus === 'Not Attempted') {
                    setActiveStep(-1); // No further steps, user can't proceed
                } else if (nomination.examStatus === 'Passed' && (!examDetail || examDetail.uploadCertificateStatus === 'Not Uploaded')) {
                    setActiveStep(4);
                } else if (examDetail && examDetail.skillMatrixStatus === 'Not Updated') {
                    setActiveStep(5);
                } else {
                    setActiveStep(6);                     // Assuming all steps completed, default to last step
                }

                // Set step 1 description
                steps[0].description = (
                    <div>
                        <StyledText label="Certification Name" value={certDetails.certificationName} />
                        <br />
                        <StyledText label="Description" value={certDetails.certificationDescription} />
                    </div>
                );

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (isOpen && nominationId) {
            fetchData();
        }
    }, [isOpen, nominationId]);

    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

    const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);


    const handleSave = (id: number) => {
        console.log('New Certification ID:', id);
    };
    const handleDone = (value: number) => {
        value = 7;
        setActiveStep(value);
      };
    const renderStepContent = (stepIndex: number) => {
        switch (stepIndex) {
            case 1:
                return <UserPendingActionStep2 nominationId={nominationId} />;
            case 2:
                return <UserPendingActionStep3 nominationId={nominationId} />;
            case 3:
                return <UserPendingActionStep4 nominationId={nominationId} />;
            case 4:
                return <UserPendingActionStep5 onSave={handleSave} />;
            case 5:
                return <UserPendingActionStep6 onSave={function (): void {
                    throw new Error('Function not implemented.');
                } } />;
            case 6: 
             return <UploadReminder onDone={handleDone} />
            case 7 : 
             return <UpdateReimbursementStatus />
            default:
                return null;
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose} aria-labelledby="user-pending-action-modal">
            <Box sx={{
                width: '90%',
                maxWidth: 500,
                margin: 'auto',
                mt: 4,
                p: 2,
                backgroundColor: 'white',
                maxHeight: '80vh',
                overflowY: 'auto',
                borderRadius: 2,
                boxShadow: 3
            }}>
                <Typography variant="h6" id="user-pending-action-modal" sx={{
                    textAlign: 'center',
                    mb: 3,
                    fontWeight: 'bold',
                    color: 'primary.main'
                }}>
                    User Action Flow
                </Typography>

                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                sx={{
                                    '.MuiStepLabel-label': {
                                        fontWeight: activeStep === index ? 'bold' : 'normal',
                                        color: activeStep === index ? 'primary.main' : 'text.secondary',
                                    }
                                }}
                            >
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                {index === activeStep && (
                                    <Paper elevation={2} sx={{
                                        p: 2,
                                        backgroundColor: 'background.paper',
                                        borderRadius: 1,
                                        mb: 2
                                    }}>
                                        <Typography whiteSpace="pre-line" sx={{
                                            fontSize: '0.95rem',
                                            color: 'text.primary'
                                        }}>
                                            {step.description || renderStepContent(activeStep)}
                                        </Typography>
                                    </Paper>
                                )}
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{
                                            mt: 1,
                                            mr: 1,
                                            backgroundColor: activeStep === steps.length - 1 ? 'success.main' : 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: activeStep === steps.length - 1 ? 'success.dark' : 'primary.dark',
                                            }
                                        }}
                                        disabled={index !== activeStep || activeStep === -1}
                                    >
                                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>
                                    <Button
                                        disabled={index === 0 || index !== activeStep}
                                        onClick={handleBack}
                                        sx={{
                                            mt: 1,
                                            mr: 1,
                                            color: 'secondary.main'
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{
                        p: 3,
                        mt: 2,
                        textAlign: 'center',
                        backgroundColor: 'background.default'
                    }}>
                        <Typography sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            All steps completed - you're finished
                        </Typography>             
                    </Paper>
                )}
            </Box>
        </Modal>
    );
};

export default UserPendingActionModal;
