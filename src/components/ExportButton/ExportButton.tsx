
import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

// Styled Button to match the inverted color scheme
const StyledButton = styled(Button)(() => ({
    backgroundColor: '#007bff',
    color: '#fff',
    border: `1px solid #007bff`,
    '&:hover': {
      backgroundColor: '#006CE0',
      color: '#fff',
      border: `1px solid #0056b3`,
    },
    fontSize:'12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ExcelExportProps {
  data: unknown[];
  fileName: string;
}

const ExcelExport: React.FC<ExcelExportProps> = ({ data, fileName }) => {
  const formatDate = (date: Date): string => {
    // Format date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    // Generate filename with current date
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const fullFileName = `${fileName}_${formattedDate}.xlsx`;

    saveAs(blob, fullFileName);
  };

  return (
    <StyledButton
      onClick={exportToExcel}
      startIcon={<CloudDownloadIcon />}
    >
      Export
      <VisuallyHiddenInput type="file" />
    </StyledButton>
  );
};

export default ExcelExport;
