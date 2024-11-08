import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { GridCloseIcon, GridColDef, DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Alert, AlertTitle } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { fetchNominationHistory } from "../../api/UserNominationHistoryApi";
import {
  RowData,
  UserNominationHistoryDialogProps,
} from "../../types/UserNominationHistory.types";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const columns: GridColDef[] = [
  { field: "nominationId", headerName: "Nomination ID", width: 130 },
  { field: "certificationName", headerName: "Certification Name", width: 200 },
  { field: "provider", headerName: "Provider", width: 150 },
  { field: "criticality", headerName: "Criticality", width: 130 },
  { field: "appliedDate", headerName: "Applied Date", width: 130 },
  {
    field: "isDepartmentApproved",
    headerName: "Department Approval",
    width: 200,
  },
  { field: "isLndApproved", headerName: "L&D Approval", width: 200 },
  { field: "examDate", headerName: "Exam Date", width: 200 },
  { field: "examStatus", headerName: "Exam Status", width: 200 },
  {
    field: "uploadCertificateStatus",
    headerName: "Upload Certification Status",
    width: 200,
  },
  { field: "skillMatrixStatus", headerName: "Skill Matrix Status", width: 200 },
  {
    field: "reimbursementStatus",
    headerName: "Reimbursement Status",
    width: 200,
  },
  { field: "financialYear", headerName: "Financial Year", width: 200 },
  {
    field: "costOfCertification",
    headerName: "Certification Cost",
    width: 150,
  },
];

const UserNominationHistory: React.FC<UserNominationHistoryDialogProps> = ({
  open,
  onClose,
}) => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedCriticality, setSelectedCriticality] = useState<string | null>(
    null
  );
  const [selectedExamStatus, setSelectedExamStatus] = useState<string | null>(
    null
  );
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);

  const [providers, setProviders] = useState<string[]>([]);
  const [criticalities, setCriticalities] = useState<string[]>([]);
  const [examStatuses, setExamStatuses] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchNominationHistory();
        setRows(data);
        setFilteredRows(data);

        const uniqueProviders = Array.from(
          new Set(data.map((item) => item.provider))
        ) as string[];
        const uniqueCriticalities = Array.from(
          new Set(data.map((item) => item.criticality))
        ) as string[];
        const uniqueExamStatuses = Array.from(
          new Set(data.map((item) => item.examStatus))
        ) as string[];

        setProviders(uniqueProviders);
        setCriticalities(uniqueCriticalities);
        setExamStatuses(uniqueExamStatuses);
      } catch (error) {
        setError("Unable to fetch data");
        setRows([]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      setIsFiltering(true);
      const filtered = rows.filter((row) => {
        const matchesSearch = Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesProvider = selectedProvider
          ? row.provider === selectedProvider
          : true;
        const matchesCriticality = selectedCriticality
          ? row.criticality === selectedCriticality
          : true;
        const matchesExamStatus = selectedExamStatus
          ? row.examStatus === selectedExamStatus
          : true;

        // Ensure appliedDate is a Dayjs object and compare
        const matchesStartDate = selectedStartDate
          ? row.createdAt?.isSameOrAfter(selectedStartDate)
          : true;
        const matchesEndDate = selectedEndDate
          ? row.createdAt?.isSameOrBefore(selectedEndDate)
          : true;

        return (
          matchesSearch &&
          matchesProvider &&
          matchesCriticality &&
          matchesExamStatus &&
          matchesStartDate &&
          matchesEndDate
        );
      });
      setFilteredRows(filtered);
      setIsFiltering(false);
    };
    applyFilters();
  }, [
    searchTerm,
    rows,
    selectedProvider,
    selectedCriticality,
    selectedExamStatus,
    selectedStartDate,
    selectedEndDate,
  ]);

  const handleClearDateFilters = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth fullScreen>
      <DialogTitle style={{ marginBottom: 15 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" icon={<ErrorIcon />}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        ) : rows.length === 0 ? (
          <Alert severity="info" icon={<InfoIcon />}>
            <AlertTitle>No Data</AlertTitle>
            There is no data available to display.
          </Alert>
        ) : (
          <>
            <Accordion
              sx={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              <AccordionSummary
                sx={{
                  "&.Mui-focusVisible": {
                    backgroundColor: "transparent", // Removes grey focus background
                  },
                  "&:focus": {
                    backgroundColor: "transparent", // Removes grey background when focused
                  },
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      flex: 1,
                      minWidth: "150px",
                      textAlign: { xs: "center", sm: "left" },
                    }}
                  >
                    Nominations History
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      label="Search"
                      variant="outlined"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        marginRight: 1,
                        width: { xs: "100%", sm: "220px" },
                        height: "40px",
                        "& .MuiInputBase-root": { height: "30px" },
                        "& .MuiInputBase-input": {
                          padding: "4px 8px",
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                    <IconButton sx={{ color: "primary.main" }}>
                      <FilterListIcon sx={{ color: "inherit" }} />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  alignItems="center"
                  gap={2}
                >
                  {/* Provider Filter */}
                  <FormControl
                    sx={{
                      minWidth: { xs: "100%", sm: "250px" },
                    }}
                  >
                    <InputLabel shrink sx={{ backgroundColor: "white" }}>
                      Provider
                    </InputLabel>
                    <Select
                      value={selectedProvider || ""}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      variant="outlined"
                      label="Provider"
                    >
                      <MenuItem value="">All Providers</MenuItem>
                      {providers.map((provider) => (
                        <MenuItem key={provider} value={provider}>
                          {provider}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Criticality Filter */}
                  <FormControl
                    sx={{
                      minWidth: { xs: "100%", sm: "250px" },
                    }}
                  >
                    <InputLabel shrink sx={{ backgroundColor: "white" }}>
                      Criticality
                    </InputLabel>
                    <Select
                      value={selectedCriticality || ""}
                      onChange={(e) => setSelectedCriticality(e.target.value)}
                      variant="outlined"
                      label="Criticality"
                    >
                      <MenuItem value="">All Criticalities</MenuItem>
                      {criticalities.map((criticality) => (
                        <MenuItem key={criticality} value={criticality}>
                          {criticality}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Exam Status Filter */}
                  <FormControl
                    sx={{
                      minWidth: { xs: "100%", sm: "250px" },
                    }}
                  >
                    <InputLabel shrink sx={{ backgroundColor: "white" }}>
                      Exam Status
                    </InputLabel>
                    <Select
                      value={selectedExamStatus || ""}
                      onChange={(e) => setSelectedExamStatus(e.target.value)}
                      variant="outlined"
                      label="Exam Status"
                    >
                      <MenuItem value="">All Exam Statuses</MenuItem>
                      {examStatuses.map((examStatus) => (
                        <MenuItem key={examStatus} value={examStatus}>
                          {examStatus}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Date Pickers */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={selectedStartDate}
                      onChange={(date) => setSelectedStartDate(date)}
                      sx={{
                        width: { xs: "100%", sm: "200px" },
                      }}
                    />
                    <DatePicker
                      label="End Date"
                      value={selectedEndDate}
                      onChange={(date) => setSelectedEndDate(date)}
                      sx={{
                        width: { xs: "100%", sm: "200px" },
                      }}
                    />
                  </LocalizationProvider>

                  {/* Clear Button */}
                  <Button
                    onClick={handleClearDateFilters}
                    sx={{ mt: { xs: 2, sm: 0 } }}
                  >
                    Clear
                  </Button>

                  {/* Loading Indicator */}
                  {isFiltering && <CircularProgress size={20} sx={{ ml: 2 }} />}
                </Box>
              </AccordionDetails>
            </Accordion>
            <Box sx={{ backgroundColor: "background.paper" }}>
              {filteredRows.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="200px"
                >
                  <SearchOffIcon
                    sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                  />
                  <p>
                    No records found. Try adjusting your filters or search
                    criteria.
                  </p>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "450px",
                  }}
                >
                  <DataGrid
                    columns={columns}
                    rows={filteredRows}
                    getRowId={(row) => row.nominationId}
                    disableRowSelectionOnClick
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
                    sx={{
                      height: "100%",
                      "& .MuiDataGrid-columnHeaders": {
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserNominationHistory;
