import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Button,
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { fetchCertifications, Row } from "../../api/UserCertificationsApi";

const UserCertificationsTable: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [filteredRows, setFilteredRows] = useState<Row[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const formatDate = (dateString: string) => {
    // Check if dateString is a valid ISO 8601 date string
    if (!dateString || isNaN(Date.parse(dateString))) {
      return "Invalid Date";
    }
  
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const data = await fetchCertifications();
        const formattedData = data.map(row => ({
          ...row,
          fromDate: formatDate(row.fromDate),
          expiryDate: formatDate(row.expiryDate),
        }));
        setRows(formattedData);
        setFilteredRows(formattedData);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
  
    loadCertifications();
  }, []);
  

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = rows.filter(
      (row) =>
        (selectedProvider === "" || row.providerName === selectedProvider) &&
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowercasedQuery)
        )
    );
    setFilteredRows(filtered);
  }, [searchQuery, selectedProvider, rows]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleProviderChange = (event: SelectChangeEvent<string>) => {
    setSelectedProvider(event.target.value);
  };

  const handleActionClick = (row: Row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleViewCertificate = () => {
    if (selectedRow && selectedRow.url) {
      window.open(selectedRow.url, "_blank"); // Open the URL in a new tab
    } else {
      console.log("No URL available for this certificate");
    }
  };

  const handleExploreClick = () => {
    navigate("/");
  };

  const getModalBorderColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "green";
      case "intermediate":
        return "blue";
      case "expert":
        return "red";
      default:
        return "transparent";
    }
  };

  const columns: GridColDef[] = [
    {
      field: "certificationName",
      headerName: "Certification Name",
      width: isMobile ? 150 : isTablet ? 220 : 290,
    },
    {
      field: "providerName",
      headerName: "Provider",
      width: isMobile ? 80 : isTablet ? 90 : 120,
    },
    {
      field: "level",
      headerName: "Level",
      width: isMobile ? 100 : isTablet ? 110 : 150,
    },
    {
      field: "category",
      headerName: "Category",
      width: isMobile ? 120 : isTablet ? 140 : 190,
    },
    {
      field: "fromDate",
      headerName: "From Date",
      width: isMobile ? 100 : isTablet ? 120 : 140,
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      width: isMobile ? 80 : isTablet ? 90 : 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: isMobile ? 80 : isTablet ? 90 : 100,
      renderCell: (params) => (
        <Button
          onClick={() => handleActionClick(params.row as Row)}
          variant="outlined"
          color="primary"
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ overflow: "hidden", width: "100%", margin: 1.5 }}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              width: "100%",
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"}>
              My Certifications
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: isMobile ? 1 : 2,
                width: isMobile ? "100%" : "auto",
                justifyContent: "flex-end",
              }}
            >
              <TextField
                size="small"
                variant="outlined"
                label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ width: isMobile ? "100%" : 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ width: isMobile ? "100%" : 200 }}>
                <InputLabel>Provider</InputLabel>
                <Select
                  value={selectedProvider}
                  onChange={handleProviderChange}
                  label="Provider"
                >
                  <MenuItem value="">All</MenuItem>
                  {Array.from(new Set(rows.map((row) => row.providerName))).map(
                    (providerName) => (
                      <MenuItem key={providerName} value={providerName}>
                        {providerName}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Box>
          </Box>
          {filteredRows.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                textAlign: "center",
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
                No Certifications Found
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                It looks like you don’t have any certifications yet. Start
                exploring to find some!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExploreClick}
                sx={{
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  px: 4,
                  py: 1.5,
                }}
              >
                Explore
              </Button>
            </Box>
          ) : (
            <Box sx={{ height: 300, width: "100%" }}>
<DataGrid
  rows={filteredRows}
  columns={columns}
  rowHeight={40}
  sx={{
    width: "100%",
    "& .MuiDataGrid-cell": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      "&[title]": {
        pointerEvents: "none",
      },
    },
    "& .MuiDataGrid-cell:focus": {
      outline: "none",
    },
  }}
/>

            </Box>
          )}
        </Paper>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? "90%" : 500,
              bgcolor: "background.paper",
              borderRadius: 7,
              boxShadow: 24,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderTop: 4,
              borderColor: selectedRow
                ? getModalBorderColor(selectedRow.level)
                : "transparent",
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "text.secondary",
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Certification Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Certification Name:</strong>{" "}
              {selectedRow?.certificationName}
              <br />
              <strong>Provider:</strong> {selectedRow?.providerName}
              <br />
              <strong>Level:</strong> {selectedRow?.level}
              <br />
              <strong>Category:</strong> {selectedRow?.category}
              <br />
              <strong>From Date:</strong> {selectedRow?.fromDate}
              <br />
              <strong>Expiry Date:</strong> {selectedRow?.expiryDate}
              <br />
            </Typography>
            <Button
              variant="contained"
              onClick={handleViewCertificate}
              sx={{ mt: 2 }}
            >
              View Certificate
            </Button>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default UserCertificationsTable;

