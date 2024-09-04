import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import axios from 'axios';

const steps = ['Manager Recommendation', 'Department Approval', 'L&D Approval'];

// API function to fetch approval details
export const getAdminsApprovalDetails = async (nominationId: number) => {
  const response = await axios.get(`https://localhost:7209/api/Nomination/${nominationId}/Details`);
  return response.data;
};

const UserPendingActionStep2 = ({ nominationId }: { nominationId: number }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [managerRecommendation, setManagerRecommendation] = useState<string | null>(null);
  const [isDepartmentApproved, setIsDepartmentApproved] = useState<boolean | null>(null);
  const [isLndApproved, setIsLndApproved] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchApprovalDetails = async () => {
      const details = await getAdminsApprovalDetails(nominationId);
      setManagerRecommendation(details.managerRecommendation);
      setIsDepartmentApproved(details.isDepartmentApproved);
      setIsLndApproved(details.isLndApproved);

      if (!details.managerRecommendation) {
        setActiveStep(0);
      } else if (!details.isDepartmentApproved) {
        setActiveStep(1);
      } else if (!details.isLndApproved) {
        setActiveStep(2);
      } else {
        setActiveStep(3); // All steps completed
      }
    };

    fetchApprovalDetails();
  }, [nominationId]);

  const getStepLabel = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return managerRecommendation ? `Manager Recommendation: ${managerRecommendation}` : 'Manager Recommendation: Pending';
      case 1:
        return isDepartmentApproved ? 'Department Head: Approved' : 'Department Approval: Pending';
      case 2:
        return isLndApproved ? 'L&D Approved' : 'L&D Approval: Pending';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{getStepLabel(index)}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default UserPendingActionStep2;
