import React from "react";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import SimilarCertifications from "../../components/SimilarCertifications/SimilarCertifications";
import UpcomingExams from "../../components/UpcomingExams/UpcomingExams";
// import PendingNominationsTable from "../../components/PendingActions/UserPendingAction/UserPendingAction";
// import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import DashboardActions from "../../components/DashboardActions/DashboardActions";
// import UserPendingActionModal from "../../components/PendingActions/UserPendingActionModal/UserPendingActionModal";
import UserPendingNomination from "../../components/PendingActions/UserPendingAction/UserPendingNomination";
import UserCertificationsTable from "../../components/UserCertificationsTable/UserCertificationsTable";

const EmployeeDashboard: React.FC = () => {

  const userButtons = [
    { label: 'Suggest a new Certification', onClick: () => console.log('Suggest a new Certification') },
    { label: 'Nomination History', onClick: () => console.log('Nomination History') },
  ];

  return (
    <>
    
   

<Grid container spacing={1} sx={{ padding: ".1rem" }}>
  {/* Left Column: UpcomingExams, SimilarCertifications, DashboardActions */}
  <Grid item xs={12} md={6} lg={6.2}>
    <Grid container spacing={1} direction="column">
      <Grid item>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <UpcomingExams />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SimilarCertifications />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <DashboardActions buttons={userButtons} />
      </Grid>
    </Grid>
  </Grid>

  {/* Right Column: UserPendingNomination */}
  <Grid item xs={12} md={6} lg={5.9}>
    <UserPendingNomination />
  </Grid>

  {/* Full-width Row: UserCertificationsTable */}
  <Grid item xs={11.8}>
    <UserCertificationsTable />
  </Grid>
</Grid>

    </>
  );
};

export default EmployeeDashboard
