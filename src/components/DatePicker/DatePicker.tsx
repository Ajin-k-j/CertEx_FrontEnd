import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';  // Importing Axios

interface DatePickerComponentProps {
  nominationId: number;
  onSave: (selectedDate: string) => void;
  nominationOpenDate: string;
  nominationCloseDate: string;
}

export default function DatePickerComponent({
  nominationId,
  onSave,
  nominationOpenDate,
  nominationCloseDate,
}: DatePickerComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const minDate = dayjs(nominationOpenDate);
  const maxDate = dayjs(nominationCloseDate);
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleSave = async () => {
    if (selectedDate) {
      const formattedDate = `"${selectedDate.toISOString()}"`; // Wrap in quotes
  
      try {
        const response = await axios.patch(
          `https://localhost:7209/api/UserActionFlow/${nominationId}/set-exam-date`,
          formattedDate, // Send as raw string with quotes
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Response Status:', response.status);
  
        if (response.status === 200) {
          onSave(formattedDate);
          alert('Exam date has been set successfully!');
        } else {
          console.error('Failed to set exam date:', response.statusText);
          alert(`Failed to set exam date: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error setting exam date:', error);
        alert('An error occurred while setting the exam date.');
      }
    } else {
      alert('No date selected!');
    }
  };
  

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Enter Exam Date
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          disablePast
          format="DD/MM/YYYY"
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              sx={{ fontSize: '14px' }}
            />
          )}
        />
      </LocalizationProvider>
      <Button variant="contained" onClick={handleSave} sx={{ mt: 1,ml:1, fontSize: '14px', padding: '6px 12px ' }}>
        Submit
      </Button>
    </Box>
  );
}
