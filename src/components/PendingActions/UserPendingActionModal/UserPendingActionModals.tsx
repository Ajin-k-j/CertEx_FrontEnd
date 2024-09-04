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
import { getCertificationDetails } from '../../../api/UserActionFlowApi';
import UserPendingActionStep2 from '../../AdminApprovalFlow/UserPendingActionStep2';
import UserPendingActionStep3 from '../../AdminApprovalFlow/UserPendingActionStep3';
import UserPendingActionStep4 from '../../AdminApprovalFlow/UserPendingActionStep4';
import UserPendingActionStep5 from '../../AdminApprovalFlow/UserPendingActionStep5';
import UserPendingActionStep6 from '../../AdminApprovalFlow/UserPendingActionStep6';

interface UserPendingActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    nominationId: number;
}

const steps: { label: string; description: string | JSX.Element }[] = [
  { label: 'Certification Details', description: '' },
  { label: 'Nomination Approval', description: 'Complete Step 2 to proceed.' },
  { label: 'Register for the Exam', description: 'Complete Step 3 to proceed.' },
  { label: 'Choose Exam Date', description: 'Complete Step 4 to proceed.' },
  { label: 'Update Exam Status', description: 'Complete Step 5 to proceed.' },
  { label: 'Upload Certificate', description: 'Complete Step 6 to proceed.' },
  { label: 'Upload Invoice', description: 'Complete Step 7 to proceed.' },
  { label: 'Skill Matrix Status', description: 'Complete Step 8 to finish the flow.' },
];


const StyledText = ({ label, value }) => {
    return (
        <span>
            <span style={{ color: '#337ab7', fontWeight: 'bold' }}>{label}:</span>
            <span style={{ fontWeight: 'bold' }}>{value}</span>
        </span>
    );
};

const UserPendingActionModal: React.FC<UserPendingActionModalProps> = ({
    isOpen,
    onClose,
    nominationId,
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [, setCertificationDetails] = useState({
        certificationName: '',
        certificationDescription: '',
    });

    useEffect(() => {
        if (isOpen && nominationId) {
            getCertificationDetails(nominationId)
                .then((details) => {
                    setCertificationDetails(details);
                    steps[0].description = (
                        <div>
                            <StyledText label="Certification Name" value={details.certificationName} />
                            <br />
                            <StyledText label="Description" value={details.certificationDescription} />
                        </div>
                    );
                })
                .catch((error) => {
                    console.error('Failed to fetch certification details:', error);
                });
        }
    }, [isOpen, nominationId]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleGoBackToFinalStep = () => {
        setActiveStep(steps.length - 1);
    };

    return (
        <Modal open={isOpen} onClose={onClose} aria-labelledby="user-pending-action-modal">
            <Box 
                sx={{ 
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
                }}
            >
                <Typography 
                    variant="h6" 
                    id="user-pending-action-modal" 
                    sx={{ 
                        textAlign: 'center', 
                        mb: 3, 
                        fontWeight: 'bold', 
                        color: 'primary.main' 
                    }}
                >
                    User Action Flow
                </Typography>
                <UserPendingActionStep2 nominationId={nominationId} />
                <UserPendingActionStep3 nominationId={nominationId}/>
                <UserPendingActionStep4 nominationId={nominationId}/>
                <UserPendingActionStep5 />
                <UserPendingActionStep6 />
        
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
                                <Paper 
                                    elevation={2} 
                                    sx={{ 
                                        p: 2, 
                                        backgroundColor: 'background.paper', 
                                        borderRadius: 1, 
                                        mb: 2 
                                    }}
                                >
                                    <Typography 
                                        whiteSpace="pre-line" 
                                        sx={{ 
                                            fontSize: '0.95rem', 
                                            color: 'text.primary' 
                                        }}
                                    >
                                  {step.description}
                                    </Typography>
                                </Paper>
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
                                        disabled={index !== activeStep}
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
                                
                                {index !== activeStep && index === steps.length - 1 && (
                                    <Button onClick={handleGoBackToFinalStep} sx={{ mt: 1, color: 'info.main' }}>
                                        Go back to final step
                                    </Button>
                                )}
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper 
                        square 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            mt: 2, 
                            textAlign: 'center', 
                            backgroundColor: 'background.default' 
                        }}
                    >
                        <Typography sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            All steps completed - you're finished
                        </Typography>
                        <Button 
                            onClick={handleReset} 
                            sx={{ mt: 2, color: 'primary.main', fontWeight: 'bold' }}
                        >
                            Reset
                        </Button>
                    </Paper>
                )}
            </Box>
        </Modal>
    );
};

export default UserPendingActionModal;