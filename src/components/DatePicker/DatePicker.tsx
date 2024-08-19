import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { fetchNominationById } from '../../api/UserPendingActionApi'; // Ensure this is correctly imported

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominationId: string;
  onSave: (selectedDate: string) => void;
}

export default function DatePickerModal({
  isOpen,
  onClose,
  nominationId,
  onSave,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleSave = async () => {
    if (selectedDate) {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      // Update the nomination with the new exam date
      await fetchNominationById(nominationId, { exam_date: formattedDate });
      onSave(formattedDate);
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ maxWidth: 400, bgcolor: 'background.paper', p: 4, m: 'auto', mt: 10 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Choose Exam Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            disablePast
            renderInput={(params) => <input {...params} />}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
}
