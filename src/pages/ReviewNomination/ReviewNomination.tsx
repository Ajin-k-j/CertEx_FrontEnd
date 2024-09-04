import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from "../../utils/toastUtils";
import { ThreeDots } from "react-loader-spinner";

const ReviewNomination: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [nomination, setNomination] = useState<any>({
    employeeName: '',
    certificationName: '',
    plannedExamMonth: '',
    motivationDescription: ''
  });
  const [recommendation, setRecommendation] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const queryParams = new URLSearchParams(location.search);
      setNomination({
        employeeName: queryParams.get('employeeName') || '',
        certificationName: queryParams.get('certificationName') || '',
        plannedExamMonth: queryParams.get('plannedExamMonth') || '',
        motivationDescription: decodeURIComponent(queryParams.get('motivationDescription') || '')
      });
      setLoading(false);
    }
  }, [id, location]);

  const validateForm = () => {
    const newErrors: string[] = [];

    const wordCount = remarks.split(/\s+/).length;
    if (wordCount < 10) {
      newErrors.push('Remarks must be at least 10 words.');
    }

    if (!recommendation) {
      newErrors.push('Please select a recommendation.');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    axios.post('https://localhost:7209/api/manager/submit', {
      nominationId: id,
      recommendation,
      remarks
    })
      .then(response => {
        showToast("Nomination submitted successfully!", "success");
        setSubmissionSuccess(true);
        setSubmitting(false);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
        showToast("Error submitting nomination. Please try again.", "error");
        setSubmitting(false);
      });
  };

  if (loading) return (
    <div style={loadingContainerStyle}>
      <ThreeDots color="#1976d2" height={80} width={80} />
    </div>
  );

  if (submissionSuccess) return (
    <div style={successContainerStyle}>
      <div style={messageBoxStyle}>
        <h2 style={headingStyle}>Recommendation Submitted Successfully</h2>
        <h3 style={messageStyle}>You can close this window now.</h3>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Review and Recommend Nomination</h2>
      <div style={infoStyle}>
        <p><strong>Employee:</strong> {nomination.employeeName}</p>
        <p><strong>Certification:</strong> {nomination.certificationName}</p>
        <p><strong>Planned Exam Month:</strong> {nomination.plannedExamMonth}</p>
        <p><strong>Employee Remarks:</strong></p>
        <blockquote style={blockquoteStyle}>
          {nomination.motivationDescription}
        </blockquote>
      </div>
      <hr style={separatorStyle} />
      <form onSubmit={handleSubmit} style={formStyle}>
        
        <div style={instructionsStyle}>
          <p style={instructionsTextStyle}>Please choose a recommendation:</p>
        </div>
        <div style={buttonGroupStyle}>
          <button
            type='button'
            onClick={() => setRecommendation('Recommended')}
            style={{ ...buttonOptionStyle, ...(recommendation === 'Recommended' ? selectedButtonStyle : {}) }}
          >
            Recommended
          </button>
          <button
            type='button'
            onClick={() => setRecommendation('Not Recommended')}
            style={{ ...buttonOptionStyle, ...(recommendation === 'Not Recommended' ? selectedButtonStyle : {}) }}
          >
            Not Recommended
          </button>
        </div>
        <div style={formGroupStyle}>
          <label htmlFor='remarks' style={labelStyle}>Remarks:</label>
          <textarea
            id='remarks'
            name='remarks'
            rows={6}
            cols={50}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={textareaStyle}
            required
          ></textarea>
        </div>
        {errors.length > 0 && (
          <div style={errorStyle}>
            {errors.map((error, index) => (
              <p key={index} style={errorTextStyle}>{error}</p>
            ))}
          </div>
        )}
        <button
          type='submit'
          style={buttonStyle}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

// Styling for the component
const containerStyle: React.CSSProperties = {
  marginTop: '8px', // Margin added to account for missing Navbar
  paddingLeft: '30px',
  paddingRight: '30px',
  paddingBottom:'10px',
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff'
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f0f0f0'
};

const successContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f9fff0',
};

const messageBoxStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  maxWidth: '500px',
  width: '100%'
};

const headingStyle: React.CSSProperties = {
  fontSize: '24px',
  color: '#333',
  marginBottom: '20px'
};

const messageStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#555',
  marginBottom: '20px'
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  textAlign: 'center'
};

const buttonOptionStyle: React.CSSProperties = {
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  textAlign: 'center',
  margin: '0 10px'
};

const selectedButtonStyle: React.CSSProperties = {
  backgroundColor: '#007BFF',
  color: '#fff'
};

const buttonGroupStyle: React.CSSProperties = {
  marginBottom: '15px',
  display: 'flex',
  justifyContent: 'center'
};

const instructionsStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '15px'
};

const instructionsTextStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#333'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column'
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: '15px'
};

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  marginBottom: '5px',
  display: 'block'
};

const textareaStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px',
  border: '1px solid #007BFF',
  borderRadius: '4px',
  boxSizing: 'border-box'
};

const infoStyle: React.CSSProperties = {
  marginBottom: '20px'
};

const blockquoteStyle: React.CSSProperties = {
  borderLeft: '4px solid #007BFF',
  paddingLeft: '10px',
  fontStyle: 'italic',
  color: '#555'
};

const separatorStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #ddd',
  margin: '20px 0'
};

const errorStyle: React.CSSProperties = {
  marginBottom: '15px',
  color: '#ff4d4d',
  textAlign: 'center'
};

const errorTextStyle: React.CSSProperties = {
  fontSize: '14px'
};

export default ReviewNomination;
