import React, { useState } from "react";
import { Grid } from "@mui/material";
import SimilarCertifications from "../../components/SimilarCertifications/SimilarCertifications";
import UpcomingExams from "../../components/UpcomingExams/UpcomingExams";
import DashboardActions from "../../components/DashboardActions/DashboardActions";
import UserPendingNomination from "../../components/PendingActions/UserPendingAction/UserPendingNomination";
import UserCertificationsTable from "../../components/UserCertificationsTable/UserCertificationsTable";
import UserNominationHistory from "../../components/UserNominationHistory/UserNominationHistory";

const EmployeeDashboard: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const userButtons = [
    { label: 'Suggest a new Certification', onClick: () => console.log('Suggest a new Certification') },
    { label: 'Nomination History', onClick: () => setIsDialogOpen(true) },
  ];

  return (
    <>
      <Grid container spacing={1} sx={{ padding: ".1rem" }}>
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

        <Grid item xs={12} md={6} lg={5.8}>
          <UserPendingNomination />
        </Grid>

        <Grid item xs={11.8}>
          <UserCertificationsTable />
        </Grid>
      </Grid>

      {/* Nomination History Modal */}
      <UserNominationHistory open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
};

export default EmployeeDashboard;
