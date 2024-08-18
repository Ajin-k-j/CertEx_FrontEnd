import React from "react";
import { Box } from "@mui/material";
import SimilarCertifications from "../../components/SimilarCertifications/SimilarCertifications";
import UpcomingExams from "../../components/UpcomingExams/UpcomingExams";
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable";
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList";
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
      <PendingNominationsTable fetchNominations={fetchPendingNominations} itemsPerPage={1} containerHeight="130px" CardComponent={PendingNominationCard} />
    </Box>
  );
};

export default EmployeeDashboard;
