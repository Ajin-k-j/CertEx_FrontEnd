import React, { useState, useEffect } from 'react';
import {
  Button,
  IconButton,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tooltip,
  TextField,
  SelectChangeEvent,
  Dialog,
  AppBar,
  Toolbar,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CertificationFormModal from './CertificationFormModal';
import { fetchCertificationsjson } from "../../api/AllCertificationsApi";

// Simulated API calls
const updateCertification = async (id: number, values: any) => {
  console.log(`Updating certification ${id} with`, values);
};

const deleteCertification = async (id: number) => {
  console.log(`Deleting certification ${id}`);
};

interface Certification {
  id: number;
  provider: string;
  certification_name: string;
  level: string;
  description: string;
  official_link: string;
  critical: string;
  views: number;
  nomination_status: string;
  nomination_open_date: string;
  nomination_close_date: string;
  tags: string[]; // Tags as string array
}

const CertificationManagementPage: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [nominationStatus, setNominationStatus] = useState<string>('');
  const [nominationOpenDate, setNominationOpenDate] = useState<string>('');
  const [nominationCloseDate, setNominationCloseDate] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<Certification | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const getCertifications = async () => {
      try {
        const data = await fetchCertificationsjson();
        setCertifications(data);
      } catch (error) {
        console.error('Failed to fetch certifications', error);
      }
    };
    getCertifications();
  }, []);

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectionModel.map(id => deleteCertification(id as number)));
      setCertifications(certifications.filter(cert => !selectionModel.includes(cert.id)));
      setSelectionModel([]);
    } catch (error) {
      console.error('Failed to delete certifications', error);
    }
  };

  const handleBulkEdit = async () => {
    try {
      const updates = selectionModel.map(id => {
        const cert = certifications.find(c => c.id === id);
        if (!cert) return Promise.resolve(); // Skip if certification not found

        const updateValues: any = {
          nomination_status: nominationStatus,
        };

        if (nominationStatus === 'Accepting') {
          updateValues.nomination_open_date = nominationOpenDate || cert.nomination_open_date;
          updateValues.nomination_close_date = nominationCloseDate || cert.nomination_close_date;
        }

        return updateCertification(id as number, updateValues);
      });

      await Promise.all(updates);

      const updatedCertifications = certifications.map(cert => {
        if (selectionModel.includes(cert.id)) {
          return {
            ...cert,
            nomination_status: nominationStatus || cert.nomination_status,
            nomination_open_date: nominationStatus === 'Accepting' ? nominationOpenDate || cert.nomination_open_date : cert.nomination_open_date,
            nomination_close_date: nominationStatus === 'Accepting' ? nominationCloseDate || cert.nomination_close_date : cert.nomination_close_date,
          };
        }
        return cert;
      });

      setCertifications(updatedCertifications);
      setSelectionModel([]);
      // Clear the fields
      setNominationStatus('');
      setNominationOpenDate('');
      setNominationCloseDate('');
    } catch (error) {
      console.error('Failed to update certifications', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCertification(id);
      setCertifications(certifications.filter(cert => cert.id !== id));
    } catch (error) {
      console.error('Failed to delete certification', error);
    }
  };

  const handleEdit = (data: Certification) => {
    setEditData(data); // Set data for editing
    setOpenModal(true);
  };

  const handleNominationStatusChange = (event: SelectChangeEvent<string>) => {
    setNominationStatus(event.target.value as string);
  };

  const handleOpenDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNominationOpenDate(event.target.value);
  };

  const handleCloseDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNominationCloseDate(event.target.value);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setEditData(null);
  };

  const handleModalSubmit = async (values: Certification) => {
    if (values.id) {
      await updateCertification(values.id, values);
    } else {
      // Add new certification logic
    }
    handleModalClose();
    const data = await fetchCertifications();
    setCertifications(data);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCertifications = certifications.filter(cert =>
    cert.certification_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns: GridColDef[] = [
    { field: 'certification_name', headerName: 'Certification Name', flex: 1 },
    { field: 'provider', headerName: 'Provider', flex: 1 },
    { field: 'level', headerName: 'Level', flex: 1 },
    {
      field: 'tags',
      headerName: 'Tags',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title={params.value.join(', ')} arrow>
            <Typography variant="body2" color="textPrimary">
              {params.value.join(', ')}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    { field: 'critical', headerName: 'Criticality', flex: 1 },
    { field: 'nomination_status', headerName: 'Nomination Status', flex: 1 },
    { field: 'nomination_open_date', headerName: 'Nomination Open Date', flex: 1 },
    { field: 'nomination_close_date', headerName: 'Nomination Close Date', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={() => handleEdit(params.row as Certification)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: 'relative', backgroundColor: 'white', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Certification Management</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, justifyContent: 'space-between' }}>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setEditData(null); // Ensure no data is set for a new certification
                setOpenModal(true);
              }}
            >
              Add Certification
            </Button>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              
            />
          </Stack>
          {selectionModel.length > 0 && (
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Nomination Status</InputLabel>
                <Select
                  label="Nomination Status"
                  value={nominationStatus}
                  onChange={handleNominationStatusChange}
                >
                  <MenuItem value="Accepting">Accepting</MenuItem>
                    <MenuItem value="Not Accepting">Not Accepting</MenuItem>
                    <MenuItem value="Always Accepting">Always Accepting</MenuItem>
                </Select>
              </FormControl>
              {nominationStatus === 'Accepting' && (
                <>
                  <TextField
                    label="Nomination Open Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={nominationOpenDate}
                    onChange={handleOpenDateChange}
                    sx={{ width: 200 }}
                  />
                  <TextField
                    label="Nomination Close Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={nominationCloseDate}
                    onChange={handleCloseDateChange}
                    sx={{ width: 200 }}
                  />
                </>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleBulkEdit}
              >
                Apply Bulk Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </Stack>
          )}
        </Stack>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredCertifications}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
          />
        </Box>
        {openModal && (
          <CertificationFormModal
            open={openModal}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
            initialValues={editData || {
              id: 0,
              provider: '',
              certification_name: '',
              level: '',
              description: '',
              official_link: '',
              critical: '',
              views: 0,
              nomination_status: '',
              nomination_open_date: '',
              nomination_close_date: '',
              tags: [],
            }} // Providing default values
          />
        )}
      </Box>
    </Dialog>
  );
};

export default CertificationManagementPage;
