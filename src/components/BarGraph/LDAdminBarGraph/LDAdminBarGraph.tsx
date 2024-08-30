import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import ReusableBarChart from "../ReusableBarChart/ReusableBarChart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  fetchLndBarGraphData,
  fetchFinancialYears,
  fetchDepartments,
  fetchCertificationProviders,
} from "../../../api/BarGraphApi/BarGraphApi";
import LoadingAnimation from "../../LoadAnimation/LoadAnimation";
const LndBarGraph: React.FC = () => {
  const [financialYearId, setFinancialYearId] = useState<number>(0);
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [providerId, setProviderId] = useState<number>(0);

  const [financialYears, setFinancialYears] = useState<
    { id: number; label: string }[]
  >([]);
  const [departments, setDepartments] = useState<
    { id: number; label: string }[]
  >([]);
  const [providers, setProviders] = useState<{ id: number; label: string }[]>(
    []
  );
  const [error, setError] = useState<boolean>(false);
  const [chartData, setChartData] = useState<
    { month: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);

  const months = [
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "january",
    "february",
    "march",
  ];

  const monthAbbreviations: { [key: string]: string } = {
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "Jun",
    july: "Jul",
    august: "Aug",
    september: "Sep",
    october: "Oct",
    november: "Nov",
    december: "Dec",
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const fetchedFinancialYears = await fetchFinancialYears();
        setFinancialYears([{ id: 0, label: "All" }, ...fetchedFinancialYears]);

        const fetchedDepartments = await fetchDepartments();
        setDepartments([{ id: 0, label: "All" }, ...fetchedDepartments]);

        const fetchedProviders = await fetchCertificationProviders();
        setProviders([{ id: 0, label: "All" }, ...fetchedProviders]);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setNoData(false);
      setError(false);
      try {
        const data = await fetchLndBarGraphData(
          financialYearId,
          departmentId,
          providerId
        );

        const formattedData = months.map((month) => ({
          month: monthAbbreviations[month.toLowerCase()],
          value: data[month.toLowerCase()] || 0,
        }));

        setChartData(formattedData);

        // Check if there is any data
        if (formattedData.every((item) => item.value === 0)) {
          setNoData(true);
        }
      } catch (error) {
        setError(true);
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [financialYearId, departmentId, providerId]);

  return (
    <Grid container justifyContent="left" sx={{ padding: 2 }}>
      <Box
        sx={{
          width: { xs: "100%", md: "100%", lg: "44vw" },
          height: { xs: "50vh", md: "40vh", lg: "50vh" },
          padding: 2,
          borderRadius: "15px",
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="center"
          paddingRight={{ md: "2vw" }}
        >
          <Grid item xs={12} md={6} lg={3}>
            <FormControl
              fullWidth
              size="small"
              sx={{ marginLeft: { xs: 0, md: 1, lg: 4 } }}
            >
              <InputLabel
                sx={{
                  fontSize: { xs: "12px", md: "14px", lg: "16px" },
                  backgroundColor: "white",
                  padding: "3px",
                }}
              >
                Financial Year
              </InputLabel>
              <Select
                value={financialYearId}
                onChange={(e) => setFinancialYearId(Number(e.target.value))}
                sx={{ fontSize: { xs: "12px", md: "14px", lg: "16px" } }}
              >
                {financialYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <FormControl
              fullWidth
              size="small"
              sx={{ marginLeft: { xs: 0, md: 1, lg: 4 } }}
            >
              <InputLabel
                sx={{
                  fontSize: { xs: "12px", md: "14px", lg: "16px" },
                  backgroundColor: "white",
                  padding: "3px",
                }}
              >
                DU
              </InputLabel>
              <Select
                value={departmentId}
                onChange={(e) => setDepartmentId(Number(e.target.value))}
                sx={{ fontSize: { xs: "12px", md: "14px", lg: "16px" } }}
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <FormControl
              fullWidth
              size="small"
              sx={{ marginLeft: { xs: 0, md: 1, lg: 4 } }}
            >
              <InputLabel
                sx={{
                  fontSize: { xs: "12px", md: "14px", lg: "16px" },
                  backgroundColor: "white",
                  padding: "3px",
                }}
              >
                Provider
              </InputLabel>
              <Select
                value={providerId}
                onChange={(e) => setProviderId(Number(e.target.value))}
                sx={{ fontSize: { xs: "12px", md: "14px", lg: "16px" } }}
              >
                {providers.map((provider) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div style={{ height: "300px" }}>
              {loading ? (
                <LoadingAnimation />
              ) : error ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: "1.6rem",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    height: "30vh",
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{ height: "17vh", fontSize: "2rem", color: "#757575" }}
                  />
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
                    height: "30vh",
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{ height: "17vh", fontSize: "2rem", color: "#757575" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ mt: ".5vh", mb: ".2rem", textAlign: "center" }}
                  >
                    No Certification completed yet.
                  </Typography>
                </Box>
              ) : (
                <ReusableBarChart
                  data={chartData}
                  isMobile={window.innerWidth <= 768}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default LndBarGraph;
