import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { showToast } from "../../utils/toastUtils";

interface UploadCertificateProps {
  onSave: (id: number) => void;
}

const UploadCertificate: React.FC<UploadCertificateProps> = ({ onSave }) => {
  const [filename, setFilename] = useState<string>('');
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [expiryDate, setExpiryDate] = useState<Dayjs | null>(dayjs());
  const [credentials, setCredentials] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  useEffect(() => {
    // Check if certification was already uploaded (e.g., from localStorage or an API call)
    const certificationUploaded = localStorage.getItem('certificationUploaded');
    if (certificationUploaded === 'true') {
      setIsUploaded(true);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const generatedUrl = URL.createObjectURL(selectedFile); 
      setUrl(generatedUrl);
    }
  };

  const handleSave = async () => {
    if (filename && fromDate && expiryDate && credentials && file) {
      const formData = new FormData();
      formData.append('Filename', filename);
      formData.append('Url', url);
      formData.append('FromDate', fromDate.toISOString());
      formData.append('ExpiryDate', expiryDate.toISOString());
      formData.append('Credentials', credentials);
      formData.append('File', file);

      try {
        const response = await axios.post(
          'https://localhost:7209/api/UserActionFlow/upload-certification',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status === 200) {
          const newId = response.data.id;
          onSave(newId);
          showToast("Certification uploaded successfully!","success");
          localStorage.setItem('certificationUploaded', 'true');
          setIsUploaded(true);
        } else {
          console.error('Failed to upload certification:', response.statusText);
          alert(`Failed to upload certification: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error uploading certification:', error);
        alert('Error uploading certification. Please try again!');
      }
    } else {
      alert('Please fill in all fields and select a file!');
    }
  };

  if (isUploaded) {
    return (
      <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          You uploaded your certification.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Upload Certification
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(date) => setFromDate(date)}
              format="DD/MM/YYYY"
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expiry Date"
              value={expiryDate}
              onChange={(date) => setExpiryDate(date)}
              format="DD/MM/YYYY"
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Credentials"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label" fullWidth>
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="body2" sx={{ mt: 1 }}>{file.name}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
            disabled={!filename || !fromDate || !expiryDate || !credentials || !file} // Disable button if any field is empty
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadCertificate;
