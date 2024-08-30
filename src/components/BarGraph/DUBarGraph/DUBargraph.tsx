import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import ReusableBarChart from "../ReusableBarChart/ReusableBarChart";
import {
  fetchDuBarGraphData,
  fetchFinancialYears,
  fetchCertificationProviders,
} from "../../../api/BarGraphApi/BarGraphApi";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LoadingAnimation from "../../LoadAnimation/LoadAnimation";

const DuBarGraph: React.FC = () => {
  const [financialYearId, setFinancialYearId] = useState<number>(0);
  const [providerId, setProviderId] = useState<number>(0);

  const [financialYears, setFinancialYears] = useState<
    { id: number; label: string }[]
  >([]);
  const [providers, setProviders] = useState<{ id: number; label: string }[]>(
    []
  );

  const [chartData, setChartData] = useState<
    { month: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
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
      setError(false);
      setNoData(false);

      try {
        const data = await fetchDuBarGraphData(financialYearId, providerId);

        if (Object.keys(data).length === 0) {
          setNoData(true);
        } else {
          const formattedData = months.map((month) => ({
            month: monthAbbreviations[month.toLowerCase()],
            value: data[month.toLowerCase()] || 0,
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [financialYearId, providerId]);

  return (
    <Grid container justifyContent="left" sx={{ padding: 2 }}>
      <Paper
        sx={{
          width: { xs: "100%", md: "100%", lg: "44vw" },
          height: { xs: "70vh", md: "50vh", lg: "50vh" },
          padding: 1,
          backgroundColor: "white",
          borderRadius: "15px",
        }}
        elevation={3}
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
                sx={{ fontSize: { xs: "12px", md: "13px", lg: "14px" } }}
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
                  fontSize: { xs: "12px", md: "13px", lg: "14px" },
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
              <div style={{ height: "300px" }}>
                <ReusableBarChart
                  data={chartData}
                  isMobile={window.innerWidth <= 768}
                />
              </div>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default DuBarGraph;
