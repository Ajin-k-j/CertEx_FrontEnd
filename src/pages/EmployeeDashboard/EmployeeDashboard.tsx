import React from "react";
import { Box } from "@mui/material";
import SimilarCertifications from "../../components/SimilarCertifications/SimilarCertifications";
import UpcomingExams from "../../components/UpcomingExams/UpcomingExams";

const EmployeeDashboard: React.FC = () => {
  return (
    <Box
      sx={{
        padding: "2rem",
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <UpcomingExams />

      <SimilarCertifications />
    </Box>
  );
};

export default EmployeeDashboard;
