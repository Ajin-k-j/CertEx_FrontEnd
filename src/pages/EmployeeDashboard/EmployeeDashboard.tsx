import React from "react";
import { Box } from "@mui/material";
import SimilarCertifications from "../../components/SimilarCertifications/SimilarCertifications";
import UpcomingExams from "../../components/UpcomingExams/UpcomingExams";
// import PendingNominationsTable from "../../components/PendingActions/UserPendingAction/UserPendingAction";
// import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import DashboardActions from "../../components/DashboardActions/DashboardActions";
// import UserPendingActionModal from "../../components/PendingActions/UserPendingActionModal/UserPendingActionModal";
import UserPendingNomination from "../../components/PendingActions/UserPendingAction/UserPendingNomination";

const EmployeeDashboard: React.FC = () => {

  const userButtons = [
    { label: 'Suggest a new Certification', onClick: () => console.log('Suggest a new Certification') },
    { label: 'Nomination History', onClick: () => console.log('Nomination History') },
  ];

  return (
    <>
    
    <Box 
       sx={{
        padding: ".1rem",
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        justifyContent: "start",
        flexWrap: "wrap",
      }}
      > 
     <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Box
        sx={{
          padding: ".1rem",
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          justifyContent: "start",
          flexWrap: "wrap",
        }}
      > 
       <UpcomingExams />
       <SimilarCertifications />
       </Box>        
          <DashboardActions buttons={userButtons} />
        </Box>
        <UserPendingNomination />
        </Box>
    </>
  );
};

export default EmployeeDashboard;
