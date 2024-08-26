import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridEventListener, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Modal, Typography, Paper, Select, MenuItem, FormControl, InputLabel, TextField, CircularProgress, Button, Accordion, AccordionSummary, AccordionDetails, IconButton, FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import ExcelExport from '../ExportButton/ExportButton';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parse } from 'date-fns';
import { JSX } from 'react/jsx-runtime';



// Define the structure of your data rows
interface RowData {
  selected: unknown;
  nomination_id: string;
  employeeName: string;
  email: string;
  department: string;
  provider: string;
  certificationName: string;
  criticality: string;
  nominationDate: Date | null;
  plannedMonthOfExam: string;
  motivation: string;
  departmentApproval: string;
  lndApproval: string;
  examDate: Date | null;
  examStatus: string;
  uploadCertificateStatus: string;
  skillMatrixStatus: string;
  reimbursementStatus: string;
  nominationStatus: string;
  financialYear: string;
  costOfCertification: number;
}

// Helper function to parse date strings
const parseDate = (dateString: string) => {
  return parse(dateString, 'dd-MM-yyyy', new Date());
};

// Define columns for DataGrid with specific configurations
const columns: GridColDef[] = [
  
  { field: 'nomination_id', headerName: 'Nomination ID', width: 150 },
  { field: 'employeeName', headerName: 'Employee Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'department', headerName: 'Department', width: 150 },
  { field: 'provider', headerName: 'Provider', width: 150 },
  { field: 'certificationName', headerName: 'Certification Name', width: 200 },
  { field: 'criticality', headerName: 'Criticality', width: 100 },
  { field: 'nominationDate', headerName: 'Nomination Date', width: 150, type: 'date' },
  { field: 'plannedMonthOfExam', headerName: 'Planned Month of Exam', width: 200 },
  { field: 'motivation', headerName: 'Motivation', width: 200 },
  { field: 'departmentApproval', headerName: 'Department Approval', width: 200 },
  { field: 'lndApproval', headerName: 'L&D Approval', width: 200 },
  { field: 'examDate', headerName: 'Exam Date', width: 150, type: 'date' },
  { field: 'examStatus', headerName: 'Exam Status', width: 150 },
  { field: 'uploadCertificateStatus', headerName: 'Upload Certificate Status', width: 200 },
  { field: 'skillMatrixStatus', headerName: 'Skill Matrix Status', width: 200 },
  { field: 'reimbursementStatus', headerName: 'Reimbursement Status', width: 200 },
  { field: 'nominationStatus', headerName: 'Nomination Status', width: 150 },
  { field: 'financialYear', headerName: 'Financial Year', width: 150 },
  // Removed the last column
];

const LdNominationTable: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedCriticality, setSelectedCriticality] = useState('');
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [financialYears, setFinancialYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [criticalities, setCriticalities] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  // function to add date in the filename of excel file
  const getCurrentDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  

  // Fetch data from API or local file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('../../../public/Data/LDNominationData.json');
        const data = response.data;

        if (Array.isArray(data)) {
          const parsedData = data.map((row: RowData) => ({
            ...row,
            nominationDate: typeof row.nominationDate === 'string' ? parseDate(row.nominationDate) : row.nominationDate,
            examDate: typeof row.examDate === 'string' ? parseDate(row.examDate) : row.examDate,
          }));
          setRows(parsedData);
          setFilteredRows(parsedData);

          // Extract unique values for filters
          const uniqueFinancialYears = Array.from(new Set(parsedData.map((row: RowData) => row.financialYear)));
          setFinancialYears(uniqueFinancialYears);

          const uniqueProviders = Array.from(new Set(parsedData.map((row: RowData) => row.provider)));
          setProviders(uniqueProviders);

          const uniqueCriticalities = Array.from(new Set(parsedData.map((row: RowData) => row.criticality)));
          setCriticalities(uniqueCriticalities);

          // Extract unique departments
          const uniqueDepartments = Array.from(new Set(parsedData.map((row: RowData) => row.department)));
          setDepartments(uniqueDepartments);

        } else {
          throw new Error('Data is not in expected array format');
        }

        setLoading(false);
      } catch {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter rows based on search term and selected filters
  useEffect(() => {
    let filtered = rows;

    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          value
            ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            : false
        )
      );
    }

    if (selectedProvider) {
      filtered = filtered.filter((row) => row.provider === selectedProvider);
    }

    if (selectedCriticality) {
      filtered = filtered.filter((row) => row.criticality === selectedCriticality);
    }

    if (selectedFinancialYear) {
      filtered = filtered.filter((row) => row.financialYear === selectedFinancialYear);
    }

    if (selectedStartDate) {
      filtered = filtered.filter((row) => row.examDate && row.examDate >= selectedStartDate);
    }

    if (selectedEndDate) {
      filtered = filtered.filter((row) => row.examDate && row.examDate <= selectedEndDate);
    }

    if (selectedDepartment) {
      filtered = filtered.filter((row) => row.department === selectedDepartment);
    }

    setFilteredRows(filtered);
  }, [searchTerm, selectedProvider, selectedCriticality, selectedFinancialYear, selectedStartDate, selectedEndDate, selectedDepartment, rows]);

  // Handle opening and closing the modal
  const handleOpenModal = (row: RowData) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  // Clear date filters
  const handleClearDateFilters = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };
  
  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };

  const handleRowClick: GridEventListener<'rowClick'> = (params: GridRowParams, event) => {
    // Type assertion to ensure `event.target` is an `HTMLElement`
    const target = event.target as HTMLElement;
  
    // Check if the click was on a checkbox or other specific element
    if (target.closest('.MuiDataGrid-cellCheckbox')) {
      event.stopPropagation(); // Prevents the modal from opening
    } else {
      handleOpenModal(params.row as RowData);
    }
  };

  const getRowId = (row: RowData) => row.nomination_id; 

  // Display loading spinner or error message
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" p={2} sx={{ backgroundColor: "white" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function setStartDate(date: Date | null): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Box p={2} m={1.5} sx={{ backgroundColor: 'white', borderRadius: '8px' }}>
      <Accordion 
        expanded={accordionExpanded} 
        sx={{ width: '100%', border: 'none', boxShadow: 'none' }}
      >
<AccordionSummary
  aria-controls="filter-content"
  id="filter-header"
  sx={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'white',
    padding: 1,
    cursor: 'default',
    flexWrap: 'wrap',
  }}
>
  <Typography
    variant="h5"
    sx={{
      flex: 1,
      minWidth: '150px',
      textAlign: { xs: 'center', sm: 'left' },
    }}
  >
    All Nominations Data
  </Typography>
  <Box
    display="flex"
    alignItems="center"
    sx={{
      ml: { xs: 0, sm: 1 },
      flexDirection: { xs: 'column', sm: 'row' },
      width: 'auto',
      textAlign: { xs: 'center', sm: 'left' },
    }}
  >
    <TextField
      label="Search"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{
        width: { xs: '100%', sm: '200px' },
        height: '35px',
        '& .MuiInputBase-input': {
          height: '10px',
        },
      }}
    />
    <IconButton
      onClick={() => setAccordionExpanded(!accordionExpanded)}
      sx={{
        ml: { xs: 0, sm: 1 },
        mt: { xs: 1, sm: 0 },
      }}
    >
      <FilterListIcon />
    </IconButton>
    <ExcelExport
      data={filteredRows}
      fileName={`Nomination_Data_${getCurrentDateString()}`}
      sx={{
        mt: { xs: 1, sm: 0 },
      }}
    />
  </Box>
</AccordionSummary>


        <AccordionDetails>
          <Box 
            display="flex" 
            flexDirection="row" 
            justifyContent="space-between" 
            flexWrap="wrap"
            gap={2}
            sx={{ border: 'none', boxShadow: 'none' }}
          >
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel>Provider</InputLabel>
              <Select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as string)}
                label="Provider"
              >
                <MenuItem value="">All</MenuItem>
                {providers.map((provider) => (
                  <MenuItem key={provider} value={provider}>
                    {provider}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 130 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value as string)}
                label="Department"
              >
                <MenuItem value="">All</MenuItem>
                {departments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Criticality</InputLabel>
              <Select
                value={selectedCriticality}
                onChange={(e) => setSelectedCriticality(e.target.value as string)}
                label="Criticality"
              >
                <MenuItem value="">All</MenuItem>
                {criticalities.map((criticality) => (
                  <MenuItem key={criticality} value={criticality}>
                    {criticality}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Financial Year</InputLabel>
              <Select
                value={selectedFinancialYear}
                onChange={(e) => setSelectedFinancialYear(e.target.value as string)}
                label="Financial Year"
              >
                <MenuItem value="">All</MenuItem>
                {financialYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns} >
              <DatePicker
                label="Start Date"
                value={selectedStartDate}
                onChange={(date: Date | null) => setStartDate(date)}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={selectedEndDate}
                onChange={(date) => setSelectedEndDate(date)}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Button onClick={handleClearDateFilters}>Clear</Button>
          </Box>
        </AccordionDetails>
      </Accordion>

        {/* Render button only when rows are selected */}
        {selectionModel.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2,mb:1 }}
          onClick={() => alert('email is sent')}
        >
          Send E-Mail
        </Button>
      )}
      {/* Data table */}
      <Box sx={{ height: 350, width: '100%' }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionChange}
        getRowId={getRowId}
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
        sx={{
          width: "100%",
          '& .MuiDataGrid-cell': {
            overflow: 'hidden',
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' ,
            '&[title]': {
            pointerEvents: 'none',
          }
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none'
          }
        }}
      />
    </Box>

      {/* Modal for row details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Paper sx={{ width: '80%', maxWidth: 400, margin: 'auto', padding: 2, position: 'relative', maxHeight: '85vh', overflow: 'auto',marginTop:6 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {selectedRow?.certificationName}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 1,fontSize:14 }}>
            <strong>Employee Name:</strong> {selectedRow?.employeeName} <br />
            <strong>Email:</strong> {selectedRow?.email} <br />
            <strong>Department:</strong> {selectedRow?.department} <br />
            <strong>Provider:</strong> {selectedRow?.provider} <br />
            <strong>Criticality:</strong> {selectedRow?.criticality} <br />
            <strong>Nomination Date:</strong> {selectedRow?.nominationDate?.toDateString()} <br />
            <strong>Planned Month of Exam:</strong> {selectedRow?.plannedMonthOfExam} <br />
            <strong>Motivation:</strong> {selectedRow?.motivation} <br />
            <strong>Department Approval:</strong> {selectedRow?.departmentApproval} <br />
            <strong>L&D Approval:</strong> {selectedRow?.lndApproval} <br />
            <strong>Exam Date:</strong> {selectedRow?.examDate?.toDateString()} <br />
            <strong>Exam Status:</strong> {selectedRow?.examStatus} <br />
            <strong>Upload Certificate Status:</strong> {selectedRow?.uploadCertificateStatus} <br />
            <strong>Skill Matrix Status:</strong> {selectedRow?.skillMatrixStatus} <br />
            <strong>Reimbursement Status:</strong> {selectedRow?.reimbursementStatus} <br />
            <strong>Nomination Status:</strong> {selectedRow?.nominationStatus} <br />
            <strong>Financial Year:</strong> {selectedRow?.financialYear} <br />
            <strong>Cost of Certification (INR):</strong> {selectedRow?.costOfCertification} <br />
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = `mailto:${selectedRow?.email}`}
            sx={{ mt: 2 }}
          >
            Send Email
          </Button>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Paper>
      </Modal>
    </Box>
  );
};

export default LdNominationTable;


