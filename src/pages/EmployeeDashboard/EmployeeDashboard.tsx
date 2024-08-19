import React from "react";
import { Box } from "@mui/material";
import SimilarCertifications from "../../components/SimilarCertifications/SimilarCertifications";
import UpcomingExams from "../../components/UpcomingExams/UpcomingExams";
import PendingNominationsTable from "../../components/PendingActions/UserPendingAction/UserPendingAction";
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import DashboardActions from "../../components/DashboardActions/DashboardActions";
import UserPendingActionModal from "../../components/PendingActions/UserPendingActionModal/UserPendingActionModal";

const EmployeeDashboard: React.FC = () => {

  const userButtons = [
    { label: 'Suggest a new Certification', onClick: () => console.log('Suggest a new Certification') },
    { label: 'Nomination History', onClick: () => console.log('Nomination History') },
  ];
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
      <DashboardActions buttons={userButtons} />
      <UserPendingActionModal />
    </Box>
  );
};

export default EmployeeDashboard;
