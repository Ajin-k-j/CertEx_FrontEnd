import React, { useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';

interface UpdateExamStatusModalProps {
  nominationId: number;
}

const UpdateExamStatusModal: React.FC<UpdateExamStatusModalProps> = ({ nominationId }) => {
  const [examStatus, setExamStatus] = useState<string>('Not Complete');

  const handleSave = async () => {
    if (examStatus) {
      try {
        const response = await axios.patch(
          `https://localhost:7209/api/UserActionFlow/${nominationId}/update-exam-status`,
          examStatus, // Send the status as an object
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          alert('Exam status has been updated successfully!');
        } else {
          console.error('Failed to update exam status:', response.statusText);
          alert(`Failed to update exam status: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error updating exam status:', error);
        alert('An error occurred while updating the exam status.');
      }
    } else {
      alert('Please select an exam status!');
    }
  };

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
            />
            Not Attempted
          </label>
        </div>
        <div className="modal-actions">
          <button style={{marginTop:'10px'}} onClick={handleSave} >Save</button>
        </div>
      </div>
    </Box>
  );
};

export default UpdateExamStatusModal;
