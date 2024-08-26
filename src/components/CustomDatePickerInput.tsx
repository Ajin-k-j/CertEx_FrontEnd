import React from 'react';
import { TextField, Button } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';

interface CustomDatePickerInputProps extends DatePickerProps<Date> {
  onClear: () => void;
}

const CustomDatePickerInput: React.FC<CustomDatePickerInputProps> = ({ onClear, ...props }) => {
  return (
    <div>
      <TextField {...props} sx={{ maxWidth: 200, flexGrow: 1, height: '40px' }} />
      <Button variant="outlined" onClick={onClear} sx={{ height: '40px', marginLeft: 1 }}>
        Clear
      </Button>
    </div>
  );
};
