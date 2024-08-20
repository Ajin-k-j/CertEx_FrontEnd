import React, { useState, useEffect } from 'react';
import { fetchNominations } from '../../api/DepartmentNominationsTableApi';
import {DepartmentNominationsRow } from '../../types/DepartmentNominationsTable.types';
import {
  DataGrid,
  GridColDef
} from '@mui/x-data-grid';
import {
  TextField,
  Box,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Modal,
  Button,
  IconButton,
  CircularProgress,
  useMediaQuery,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const NominationsTable: React.FC = () => {
  const [rows, setRows] = useState<DepartmentNominationsRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<DepartmentNominationsRow[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<DepartmentNominationsRow | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const data = await fetchNominations();
        if (data.length === 0) {
          setNoData(true);
        } else {
          setRows(data);
          setFilteredRows(data);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = rows.filter(
      (row) =>
        (selectedProvider === '' || row.provider === selectedProvider) &&
        (selectedCriticality === '' || row.criticality === selectedCriticality) &&
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowercasedQuery)
        )
    );
    setFilteredRows(filtered);
  }, [searchQuery, selectedProvider, selectedCriticality, rows]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleProviderChange = (event: SelectChangeEvent<string>) => {
    setSelectedProvider(event.target.value);
  };

  const handleCriticalityChange = (event: SelectChangeEvent<string>) => {
    setSelectedCriticality(event.target.value);
  };

  const handleRowClick = (row: DepartmentNominationsRow) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'Approved' ? 'green' : 'red';
  };

  const columns: GridColDef[] = [
    { field: 'employeeName', headerName: 'Employee Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'provider', headerName: 'Provider', width: 130 },
    { field: 'certificationName', headerName: 'Certification Name', width: 200 },
    { field: 'criticality', headerName: 'Criticality', width: 150 },
    { field: 'plannedMonthOfExam', headerName: 'Planned Month of Exam', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            color: getStatusColor(params.value),
            fontSize: '12px',
            mt: 1
          }}
        >
          {params.value}
        </Typography>
      )
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden', width: '98%', margin: 1.5 }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', width: '100%' }}>
          <Typography variant="h5">All Nominations Data</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
            <TextField
              size="small"
              variant="outlined"
              label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: isMobile ? '100%' : 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ width: isMobile ? '100%' : 200 }}>
              <InputLabel>Provider</InputLabel>
              <Select value={selectedProvider} onChange={handleProviderChange} label="Provider">
                <MenuItem value="">All</MenuItem>
                {Array.from(new Set(rows.map((row) => row.provider))).map((provider) => (
                  <MenuItem key={provider} value={provider}>
                    {provider}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: isMobile ? '100%' : 200 }}>
              <InputLabel>Criticality</InputLabel>
              <Select value={selectedCriticality} onChange={handleCriticalityChange} label="Criticality">
                <MenuItem value="">All</MenuItem>
                {Array.from(new Set(rows.map((row) => row.criticality))).map((criticality) => (
                  <MenuItem key={criticality} value={criticality}>
                    {criticality}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box sx={{ height: noData ? 180 : 300, width: '100%' }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: '1.6rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
              }}
            >
              <InfoOutlinedIcon sx={{ height: '17vh', fontSize: '2rem', color: '#757575' }} />
              <Typography variant="body1" sx={{ mt: '.5vh', mb: '.2rem', textAlign: 'center' }}>
                Something went wrong while fetching.
              </Typography>
            </Box>
          ) : noData ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: '1.6rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
              }}
            >
              <InfoOutlinedIcon sx={{ height: '17vh', fontSize: '2rem', color: '#757575' }} />
              <Typography variant="body1" sx={{ mt: '.5vh', mb: '.2rem', textAlign: 'center' }}>
                No New Nominations.
              </Typography>
            </Box>
          ) : (
            <DataGrid 
                rows={filteredRows} 
                columns={columns} 
                rowHeight={40} 
                onRowClick={(params) => handleRowClick(params.row as DepartmentNominationsRow)} 
                disableColumnMenu
                // disableExtendRowFullWidth
/>

          )}
        </Box>
      </Paper>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedRow && (
            <>
              <Typography variant="h6" id="modal-title" sx={{ mb: 2 }}>
                {selectedRow.employeeName}
              </Typography>
              <Typography variant="body1" id="modal-description" sx={{ mb: 2 }}>
                <strong>Email:</strong> {selectedRow.email}<br />
                <strong>Certification Name:</strong> {selectedRow.certificationName}<br />
                <strong>Provider:</strong> {selectedRow.provider}<br />
                <strong>Criticality:</strong> {selectedRow.criticality}<br />
                <strong>Planned Month of Exam:</strong> {selectedRow.plannedMonthOfExam}<br />
                <strong>Status:</strong> {selectedRow.status}<br />
                <strong>Motivation:</strong> {selectedRow.motivation}<br />
                <strong>Cost for Certification (INR):</strong> {selectedRow.cost}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleCloseModal} fullWidth>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default NominationsTable;
