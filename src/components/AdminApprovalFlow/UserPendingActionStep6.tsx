import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import axios from 'axios';

interface UploadInvoiceProps {
  onSave: () => void;
}

const UploadInvoice: React.FC<UploadInvoiceProps> = ({ onSave }) => {
  const [id, setId] = useState<number | null>(null);
  const [nominationId, setNominationId] = useState<number | null>(null);
  const [myCertificationId, setMyCertificationId] = useState<number | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [costInrWithoutTax, setCostInrWithoutTax] = useState<number | null>(null);
  const [costInrWithTax, setCostInrWithTax] = useState<number | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (
      id &&
      nominationId &&
      myCertificationId &&
      invoiceNumber &&
      url &&
      costInrWithoutTax &&
      costInrWithTax &&
      invoiceFile
    ) {
      const formData = new FormData();
      formData.append('Id', id.toString());
      formData.append('NominationId', nominationId.toString());
      formData.append('MyCertificationId', myCertificationId.toString());
      formData.append('InvoiceNumber', invoiceNumber);
      formData.append('Url', url);
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
          onSave();
          alert('Invoice uploaded successfully!');
        } else {
          console.error('Failed to upload invoice:', response.statusText);
          alert(`Failed to upload invoice: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error uploading invoice:', error);
        alert('An error occurred while uploading the invoice.');
      }
    } else {
      alert('Please fill in all fields and select a file!');
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Upload Invoice
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="ID"
            type="number"
            value={id || ''}
            onChange={(e) => setId(parseInt(e.target.value, 10))}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nomination ID"
            type="number"
            value={nominationId || ''}
            onChange={(e) => setNominationId(parseInt(e.target.value, 10))}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="My Certification ID"
            type="number"
            value={myCertificationId || ''}
            onChange={(e) => setMyCertificationId(parseInt(e.target.value, 10))}
            fullWidth
            required
          />
        </Grid>
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
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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
          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadInvoice;
