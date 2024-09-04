import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { showToast } from "../../utils/toastUtils";
import { ThreeDots } from "react-loader-spinner";

const ReviewAwsCredentials: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [employeeName, setEmployeeName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [certificationName, setCertificationName] = useState<string>('');
  const [plannedExamMonth, setPlannedExamMonth] = useState<string>('');
  const [signupLink, setSignupLink] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEmployeeName(queryParams.get('employeeName') || '');
    setEmail(queryParams.get('email') || '');
    setCertificationName(queryParams.get('certificationName') || '');
    setPlannedExamMonth(queryParams.get('plannedExamMonth') || '');
    setLoading(false);
  }, [location]);

  const validateForm = () => {
    const newErrors: string[] = [];

    // Validate URL
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-zA-Z0-9\\-\\.]+)\\.)+[a-zA-Z]{2,}|'+ // domain name
      '((\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})|'+ // OR ipv4
      '\\[([a-fA-F0-9:\\.]+)\\]))'+ // OR ipv6
      '(\\:\\d+)?'+ // port
      '(\\/[-a-zA-Z0-9%_@~#=\\+\\(\\)\\,\\.;]*)*'+ // path
      '(\\?[;&a-zA-Z0-9%_@~#=\\+\\(\\)\\,\\.;]*)?'+ // query string
      '(\\#[-a-zA-Z0-9_]*)?$','i'); // fragment locator
    if (!urlPattern.test(signupLink)) {
      newErrors.push('Signup Link must be a valid URL.');
    }

    // Validate remarks
    const wordCount = remarks.split(/\s+/).length;
    if (wordCount < 10) {
      newErrors.push('Remarks must be at least 10 words.');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    axios.post('https://localhost:7209/api/AwsAdmin/submit', {
      EmployeeId: id,
      AWSCredentials: signupLink,
      AWSAdminRemarks: remarks
    })
      .then(response => {
        showToast("AWS credentials setup submitted successfully!", "success");
        setSubmissionSuccess(true);
        setSubmitting(false);
      })
      .catch(error => {
        console.error('Error submitting AWS credentials setup:', error);
        showToast("Error submitting AWS credentials setup. Please try again.", "error");
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
        <h2 style={headingStyle}>Submission Successful</h2>
        <h3 style={messageStyle}>You can close this window now.</h3>
        
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Review and share AWS Credentials</h2>
      <div style={infoStyle}>
        <p><strong>Employee:</strong> {employeeName}</p>
        <p><strong>E-mail:</strong> {email}</p>
        <p><strong>Certification:</strong> {certificationName}</p>
        <p><strong>Planned Exam Month:</strong> {plannedExamMonth}</p>
      </div>
      <hr style={separatorStyle} />
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label htmlFor='signupLink' style={labelStyle}>Signup Link:</label>
          <input
            type='text'
            id='signupLink'
            name='signupLink'
            value={signupLink}
            onChange={(e) => setSignupLink(e.target.value)}
            style={inputStyle}
            required
          />
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
  paddingTop:'5px',
  paddingBottom: '25px',
  paddingRight:'25px',
  paddingLeft:'25px',
  maxWidth: '600px',
  margin: 'auto',
  marginTop: '30px', // Added margin at the top
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

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  boxSizing: 'border-box'
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

export default ReviewAwsCredentials;
