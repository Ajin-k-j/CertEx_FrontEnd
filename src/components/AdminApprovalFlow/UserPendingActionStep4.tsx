import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import { showToast } from "../../utils/toastUtils";
interface UpdateExamStatusModalProps {
  nominationId: number;
}

const UpdateExamStatusModal: React.FC<UpdateExamStatusModalProps> = ({ nominationId }) => {
  const [examStatus, setExamStatus] = useState<string>('Not Completed');
  const [isStatusPosted, setIsStatusPosted] = useState<boolean>(false);
  const [fetchedStatus, setFetchedStatus] = useState<string | null>(null);

  // Fetch the exam status from the backend
  const fetchExamStatus = async () => {
    try {
      const response = await axios.get(`https://localhost:7209/api/Nomination/${nominationId}/ExamStatus`);
      const status = response.data;
      setFetchedStatus(status);
      setExamStatus(status);
      setIsStatusPosted(status !== 'Not Completed'); // If status is not "Not Complete", disable further changes
    } catch (error) {
      console.error('Error fetching exam status:', error);
    }
  };

  useEffect(() => {
    fetchExamStatus();
  }, [nominationId]);

  const handleSave = async () => {
    if (examStatus && !isStatusPosted) {
      try {
        const response = await axios.patch(
          `https://localhost:7209/api/UserActionFlow/${nominationId}/update-exam-status`,
          JSON.stringify(examStatus), // Send the status as a string
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          showToast("Exam status has been updated successfully!","success");
          setIsStatusPosted(true); // Disable further changes
          fetchExamStatus(); // Re-fetch the status after updating
        } else {
          console.error('Failed to update exam status:', response.statusText);
          alert(`Failed to update exam status: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error updating exam status:', error);
        showToast("error", "error");
      }
    } else {
      alert('Please select an exam status!');
    }
  };

  // Determine button label and color based on exam status
  const getButtonStyle = () => {
    let backgroundColor = '';
    let label = 'Save';

    switch (examStatus) {
      case 'Passed':
        backgroundColor = 'green';
        label = 'Passed';
        break;
      case 'Failed':
        backgroundColor = 'red';
        label = 'Failed';
        break;
      case 'Not Attempted':
        backgroundColor = 'orange';
        label = 'Not Attempted';
        break;
      default:
        backgroundColor = 'gray';
    }

    return { backgroundColor, label };
  };

  const { backgroundColor, label } = getButtonStyle();

  return (
    <Box className="modal">
      <div className="modal-content">
        <h2>Update Exam Status</h2>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="examStatus"
              value="Passed"
              checked={examStatus === 'Passed'}
              onChange={(e) => setExamStatus(e.target.value)}
              disabled={isStatusPosted} // Disable after posting status
            />
            Passed
          </label>
          <label>
            <input
              type="radio"
              name="examStatus"
              value="Failed"
              checked={examStatus === 'Failed'}
              onChange={(e) => setExamStatus(e.target.value)}
              disabled={isStatusPosted} // Disable after posting status
            />
            Failed
          </label>
          <label>
            <input
              type="radio"
              name="examStatus"
              value="Not Attempted"
              checked={examStatus === 'Not Attempted'}
              onChange={(e) => setExamStatus(e.target.value)}
              disabled={isStatusPosted} // Disable after posting status
            />
            Not Attempted
          </label>
        </div>
        <div className="modal-actions">
          <Button
            onClick={handleSave}
            style={{
              marginTop: '10px',
              backgroundColor: backgroundColor,
              color: 'white',
            }}
            disabled={isStatusPosted} // Disable button after posting status
          >
            {label}
          </Button>
        </div>
        {/* Display the fetched status if it's not "Not Complete" */}
        {fetchedStatus && fetchedStatus !== 'Not Completed' && (
          <div style={{ marginTop: '10px', color: '#007BFF' }}>
            <strong>You already gave the exam Status</strong>
          </div>
        )}
      </div>
    </Box>
  );
};

export default UpdateExamStatusModal;
