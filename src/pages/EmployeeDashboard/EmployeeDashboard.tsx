import React from "react";
import { Box } from "@mui/material";
import SimilarCertifications from "../../components/SimilarCertifications/SimilarCertifications";
import UpcomingExams from "../../components/UpcomingExams/UpcomingExams";
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable";
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
const EmployeeDashboard: React.FC = () => {
  return (
    <Box
      sx={{
        padding: ".1rem",
        display: "flex",
        flexDirection: "row",
        gap: "0rem",
        justifyContent: "start",
        flexWrap: "wrap",
      }}
    >
      <UpcomingExams />

      <SimilarCertifications />
      <PendingNominationsTable fetchNominations={fetchPendingNominations} />
    </Box>
  );
};

export default EmployeeDashboard;
