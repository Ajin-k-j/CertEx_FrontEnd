import React from "react";
import { Box } from "@mui/material";
import SimilarCertifications from "../../components/SimilarCertifications/SimilarCertifications";
import UpcomingExams from "../../components/UpcomingExams/UpcomingExams";
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable";
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList";
import UserCertificationsTable from "../../components/UserCertificationsTable/UserCertificationsTable";

const EmployeeDashboard: React.FC = () => {
  return (
    <>
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
      <PendingNominationsTable fetchNominations={fetchPendingNominations} itemsPerPage={3} containerHeight="238px" CardComponent={PendingNominationCard} />
      <UserCertificationsTable />
    </Box>
    
    </>
  );
};

export default EmployeeDashboard;
