import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import { updateInvoice } from '../../../api/UserPendingActionApi'; // API function to patch the invoice data

interface InvoiceDetailsProps {
  nominationId: boolean;
  onSave: () => void;
}

export default function InvoiceDetails({ nominationId, onSave }: InvoiceDetailsProps) {
  const [invoiceId, setInvoiceId] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [priceWithoutTax, setPriceWithoutTax] = useState('');
  const [priceWithTax, setPriceWithTax] = useState('');
  const [uploading, setUploading] = useState(false);

  // Check if all fields are filled
  const isFormValid = () => {
    return invoiceId && priceWithoutTax && priceWithTax;
  };

  const handleSave = async () => {
    setUploading(true);

    const invoiceData = {
      invoice_id: invoiceId,
      currency,
      price_without_tax: parseFloat(priceWithoutTax),
      price_with_tax: parseFloat(priceWithTax),
    };

    try {
      await updateInvoice(nominationId, invoiceData);
      toast.success('Invoice updated successfully!');
      onSave();
    } catch (error) {
      toast.error('Failed to update the invoice. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        label="Invoice ID"
        fullWidth
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Currency</InputLabel>
        <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <MenuItem value="INR">INR</MenuItem>
          <MenuItem value="USD">USD</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Price without Tax"
        fullWidth
        value={priceWithoutTax}
        onChange={(e) => setPriceWithoutTax(e.target.value)}
        type="number"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Price with Tax"
        fullWidth
        value={priceWithTax}
        onChange={(e) => setPriceWithTax(e.target.value)}
        type="number"
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2, mr: 2 }} // Add margin-right for spacing
        >
          Upload Invoice
          <input type="file" hidden />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={uploading || !isFormValid()}
        >
          {uploading ? 'Saving...' : 'Save Invoice'}
        </Button>
      </Box>
    </Box>
  );
}
