import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Modal, Typography, Paper, Button, Select, MenuItem, FormControl, InputLabel, TextField, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import ExcelExport from '../ExportButton/ExportButton';

interface RowData {
  nomination_id: string;
  employeeName: string;
  email: string;
  department: string;
  provider: string;
  certificationName: string;
  criticality: string;
  nominationDate: string;
  plannedMonthOfExam: string;
  motivation: string;
  departmentApproval: string;
  lndApproval: string;
  examDate: string;
  examStatus: string;
  uploadCertificateStatus: string;
  skillMatrixStatus: string;
  reimbursementStatus: string;
  nominationStatus: string;
  financialYear: string;
  costOfCertification: number;
}

const columns: GridColDef[] = [
  { field: 'nomination_id', headerName: 'Nomination ID', width: 150 },
  { field: 'employeeName', headerName: 'Employee Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'department', headerName: 'Department', width: 150 },
  { field: 'provider', headerName: 'Provider', width: 150 },
  { field: 'certificationName', headerName: 'Certification Name', width: 200 },
  { field: 'criticality', headerName: 'Criticality', width: 100 },
  { field: 'nominationDate', headerName: 'Nomination Date', width: 150 },
  { field: 'plannedMonthOfExam', headerName: 'Planned Month of Exam', width: 200 },
  { field: 'motivation', headerName: 'Motivation', width: 200 },
  { field: 'departmentApproval', headerName: 'Department Approval', width: 200 },
  { field: 'lndApproval', headerName: 'L&D Approval', width: 200 },
  { field: 'examDate', headerName: 'Exam Date', width: 150 },
  { field: 'examStatus', headerName: 'Exam Status', width: 150 },
  { field: 'uploadCertificateStatus', headerName: 'Upload Certificate Status', width: 200 },
  { field: 'skillMatrixStatus', headerName: 'Skill Matrix Status', width: 200 },
  { field: 'reimbursementStatus', headerName: 'Reimbursement Status', width: 200 },
  { field: 'nominationStatus', headerName: 'Nomination Status', width: 150 },
  { field: 'financialYear', headerName: 'Financial Year', width: 150 },
  { field: 'costOfCertification', headerName: 'Cost of Certification(INR)', width: 150, },
];

const LdNominationTable: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedCriticality, setSelectedCriticality] = useState('');
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [financialYears, setFinancialYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('../../../public/Data/LDNominationData.json');
        const data = response.data;

        if (Array.isArray(data)) {
          setRows(data);
          setFilteredRows(data);
          const uniqueFinancialYears = Array.from(new Set(data.map((row: RowData) => row.financialYear)));
          setFinancialYears(uniqueFinancialYears);
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

  useEffect(() => {
    let filtered = rows;

    if (searchTerm) {
      filtered = filtered.filter((row) =>
        row.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase())
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

    setFilteredRows(filtered);
  }, [searchTerm, selectedProvider, selectedCriticality, selectedFinancialYear, rows]);

  const handleOpenModal = (row: RowData) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const getRowId = (row: any) => row.nomination_id;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          Error fetching data: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2} sx={{backgroundColor:"white"}}>
      <Box mb={0} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Typography variant="h5" sx={{ mr: 10 }}>All Nominations</Typography>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 300, flexGrow: 1, height: '30px' }}
          InputProps={{ style: { height: '40px'} }}
        />
        <FormControl variant="outlined" sx={{ maxWidth: 150, flexGrow: 1, height: '40px' }}>
          <InputLabel>Provider</InputLabel>
          <Select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            label="Provider"
            sx={{ height: '40px' }}
            inputProps={{ style: { height: '40px' } }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {Array.from(new Set(rows.map((row) => row.provider))).map((provider) => (
              <MenuItem key={provider} value={provider}>
                {provider}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ maxWidth: 150, flexGrow: 1, height: '50px' }}>
          <InputLabel>Criticality</InputLabel>
          <Select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            label="Criticality"
            sx={{ height: '40px' }}
            inputProps={{ style: { height: '40px' } }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {Array.from(new Set(rows.map((row) => row.criticality))).map((criticality) => (
              <MenuItem key={criticality} value={criticality}>
                {criticality}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ maxWidth: 150, flexGrow: 1, height: '50px' }}>
          <InputLabel>Financial Year</InputLabel>
          <Select
            value={selectedFinancialYear}
            onChange={(e) => setSelectedFinancialYear(e.target.value)}
            label="Financial Year"
            sx={{ height: '40px' }}
            inputProps={{ style: { height: '40px' } }}
            
             
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {financialYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={2} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <ExcelExport data={filteredRows} fileName="LdNominationData" />
      </Box>

      <Paper elevation={3} sx={{ width: '100%', mt: 3 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          disableSelectionOnClick
          getRowId={getRowId}
          onRowClick={(param) => handleOpenModal(param.row)}
        />
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">
              Nomination Details
            </Typography>
            <CloseIcon onClick={handleCloseModal} sx={{ cursor: 'pointer' }} />
          </Box>
          {selectedRow && (
            <Box>
              <Typography variant="body1">
                <strong>Nomination ID:</strong> {selectedRow.nomination_id || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Employee Name:</strong> {selectedRow.employeeName || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedRow.email || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Department:</strong> {selectedRow.department || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Provider:</strong> {selectedRow.provider || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Certification Name:</strong> {selectedRow.certificationName || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Criticality:</strong> {selectedRow.criticality || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Nomination Date:</strong> {selectedRow.nominationDate || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Planned Month of Exam:</strong> {selectedRow.plannedMonthOfExam || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Motivation:</strong> {selectedRow.motivation || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Department Approval:</strong> {selectedRow.departmentApproval || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>L&D Approval:</strong> {selectedRow.lndApproval || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Exam Date:</strong> {selectedRow.examDate || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Exam Status:</strong> {selectedRow.examStatus || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Upload Certificate Status:</strong> {selectedRow.uploadCertificateStatus || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Skill Matrix Status:</strong> {selectedRow.skillMatrixStatus || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Reimbursement Status:</strong> {selectedRow.reimbursementStatus || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Nomination Status:</strong> {selectedRow.nominationStatus || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Financial Year:</strong> {selectedRow.financialYear || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Cost of Certification (INR):</strong> {selectedRow.costOfCertification || '-'}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default LdNominationTable;