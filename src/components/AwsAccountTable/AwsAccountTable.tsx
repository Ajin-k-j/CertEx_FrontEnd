import React, { useState, useEffect } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
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
  IconButton,
  CircularProgress,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { fetchAwsAccountData } from "../../api/AwsAccountDataApi";
import { AwsAccountDataRow } from "../../types/AwsAccountData.types";

const NominationsTable: React.FC = () => {
  const [rows, setRows] = useState<AwsAccountDataRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<AwsAccountDataRow[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCriticality, setSelectedCriticality] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<AwsAccountDataRow | null>(
    null
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const data = await fetchAwsAccountData();
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
        (selectedDepartment === "" || row.department === selectedDepartment) &&
        (selectedCriticality === "" ||
          row.criticality === selectedCriticality) &&
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowercasedQuery)
        )
    );
    setFilteredRows(filtered);
  }, [searchQuery, selectedDepartment, selectedCriticality, rows]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedDepartment(event.target.value);
  };

  const handleCriticalityChange = (event: SelectChangeEvent<string>) => {
    setSelectedCriticality(event.target.value);
  };

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRow(params.row as AwsAccountDataRow);
    setOpenModal(true);
  };

  const columns: GridColDef[] = [
    {
      field: "nominationId",
      headerName: "Nomination ID",
      width: 120,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "certificationName",
      headerName: "Certification Name",
      width: 250,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      width: 130,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 130,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "criticality",
      headerName: "Criticality",
      width: 130,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "level",
      headerName: "Level",
      width: 120,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "date",
      headerName: "Nomination Date",
      width: 130,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ overflow: "hidden", width: "98%", margin: 1.5 }}>
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
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h5">AWS Nominations Data</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexDirection: isMobile ? "column" : "row",
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
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                label="Department"
              >
                <MenuItem value="">All</MenuItem>
                {Array.from(new Set(rows.map((row) => row.department))).map(
                  (department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: isMobile ? "100%" : 200 }}>
              <InputLabel>Criticality</InputLabel>
              <Select
                value={selectedCriticality}
                onChange={handleCriticalityChange}
                label="Criticality"
              >
                <MenuItem value="">All</MenuItem>
                {Array.from(new Set(rows.map((row) => row.criticality))).map(
                  (criticality) => (
                    <MenuItem key={criticality} value={criticality}>
                      {criticality}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box sx={{ height: noData ? 180 : 300, width: "100%" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: "1.6rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="body1"
                sx={{ mt: ".5vh", mb: ".2rem", textAlign: "center" }}
              >
                Something went wrong while fetching.
              </Typography>
            </Box>
          ) : noData ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: "1.6rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                height: "20vh",
              }}
            >
              <InfoOutlinedIcon
                sx={{ height: "17vh", fontSize: "2rem", color: "#757575" }}
              />
              <Typography
                variant="body1"
                sx={{ mt: ".5vh", mb: ".2rem", textAlign: "center" }}
              >
                No New Nominations.
              </Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              rowHeight={40}
              disableColumnMenu
              pagination
              getRowId={(row) => row.nominationId}
              onRowClick={handleRowClick} // Added row click handler
            />
          )}
        </Box>
      </Paper>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedRow && (
            <>
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                gutterBottom
              >
                {selectedRow.employeeName}
              </Typography>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                <strong>Nomination ID:</strong> {selectedRow.nominationId}
                <br />
                <strong>Email:</strong> {selectedRow.email}
                <br />
                <strong>Department:</strong> {selectedRow.department}
                <br />
                <strong>Certification Name:</strong>{" "}
                {selectedRow.certificationName}
                <br />
                <strong>Criticality:</strong> {selectedRow.criticality}
                <br />
                <strong>Level:</strong> {selectedRow.level}
                <br />
                <strong>Nomination Date:</strong> {selectedRow.date}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default NominationsTable;
