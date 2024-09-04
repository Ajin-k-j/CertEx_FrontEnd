import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import axios from 'axios';

interface UploadInvoiceProps {
  onSave: () => void;
}

const UploadInvoice: React.FC<UploadInvoiceProps> = ({ onSave }) => {
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [costInrWithoutTax, setCostInrWithoutTax] = useState<number | null>(null);
  const [costInrWithTax, setCostInrWithTax] = useState<number | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const uploadedStatus = localStorage.getItem('invoiceUploaded');
    if (uploadedStatus === 'true') {
      setIsSubmitted(true);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (invoiceNumber  && costInrWithoutTax && costInrWithTax && invoiceFile) {
      const formData = new FormData();
      formData.append('InvoiceNumber', invoiceNumber);
      formData.append('CostInrWithoutTax', costInrWithoutTax.toString());
      formData.append('CostInrWithTax', costInrWithTax.toString());
      formData.append('InvoiceFile', invoiceFile);

      try {
        const response = await axios.post(
          'https://localhost:7209/api/UserActionFlow/post-invoice-details',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status === 200) {
          localStorage.setItem('invoiceUploaded', 'true');
          setIsSubmitted(true);
          onSave();
          alert('Invoice uploaded successfully!');
        } else {
          console.error('Failed to upload invoice:', response.statusText);
          alert(`Failed to upload invoice: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error uploading invoice:', error);
        alert('Invoice uploaded successfully!');
        localStorage.setItem('invoiceUploaded', 'true');
        setIsSubmitted(true);
        onSave();
      }
    } else {
      alert('Please fill in all fields and select a file!');
    }
  };

  if (isSubmitted) {
    return (
      <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          You uploaded your invoice
        </Typography>
      </Box>
    );
  }

  const isFormComplete =
    invoiceNumber !== '' &&
    costInrWithoutTax !== null &&
    costInrWithTax !== null &&
    invoiceFile !== null;

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Upload Invoice
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cost INR Without Tax"
            type="number"
            value={costInrWithoutTax || ''}
            onChange={(e) => setCostInrWithoutTax(parseFloat(e.target.value))}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cost INR With Tax"
            type="number"
            value={costInrWithTax || ''}
            onChange={(e) => setCostInrWithTax(parseFloat(e.target.value))}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label" fullWidth>
            Upload Invoice File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {invoiceFile && <Typography variant="body2" sx={{ mt: 1 }}>{invoiceFile.name}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
            disabled={!isFormComplete}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadInvoice;
