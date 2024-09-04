import { useState } from 'react';
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable";
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import CertificationChartss from '../../components/BarGraph/LDAdminBarGraph/LDAdminBarGraph';
import DashboardActions from '../../components/DashboardActions/DashboardActions';
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList";
import CertificationManagementPage from '../../components/AllCertificationsAdmin/AllCertificationsManagement';
import LdNominationTable from '../../components/LdNominationTable/LdNominationTable';
import { Grid } from "@mui/material";
import LDCertificationCostTable from '../../components/LDCertificationCostTable/LDCertificationCostTable';  // Updated import

const LDAdminDashboard = () => {
  const [openCertificationModal, setOpenCertificationModal] = useState(false);
  const [openStatisticsDialog, setOpenStatisticsDialog] = useState(false);

  const ldButtons = [
    {
      label: "All Certifications (24)",
      onClick: () => setOpenCertificationModal(true),
    },
    {
      label: "User Suggested Certifications (02)",
      onClick: () => console.log("User Suggested Certifications"),
    },
    {
      label: "Users & Roles (06)",
      onClick: () => console.log("Users & Roles"),
    },
    {
      label: "Critical Certification (24/34)",
      onClick: () => console.log("Critical Certification"),
    },
    {
      label: "Detailed Statistics",
      onClick: () => setOpenStatisticsDialog(true),
    },
  ];

  const handleCloseModal = () => {
    setOpenCertificationModal(false);
  };

  const handleCloseStatisticsDialog = () => {
    setOpenStatisticsDialog(false);
  };

  return (


    <Grid container spacing={3} sx={{ padding: ".1rem" }}>
      {/* Left Column */}
      <Grid item xs={12} md={8} lg={6}>
        <Grid container spacing={.2} direction="column">
          <Grid item>
            <CertificationChartss />
          </Grid>
          <Grid item>
            <DashboardActions buttons={ldButtons} />
          </Grid>
        </Grid>
      </Grid>
    
      {/* Right Column */}
      <Grid item xs={12} md={4} lg={5.8}>
      <PendingNominationsTable
          fetchNominations={fetchPendingNominations}
          itemsPerPage={6}
          CardComponent={PendingNominationCard}
          containerHeight="435px"
          containerWidth="580px"
        />
      </Grid>
    
      {/* Full-width Row for LdNominationTable */}
      <Grid item xs={12}>
        <LdNominationTable />
      </Grid>

      {/* Conditional Rendering of CertificationManagementPage Modal */}
      {openCertificationModal && (
        <Grid item xs={12}>
          <CertificationManagementPage
            open={openCertificationModal}
            onClose={handleCloseModal}
          />
        </Grid>
      )}

      {/* Pass dialog state to the LDCertificationCostTable */}
      <LDCertificationCostTable open={openStatisticsDialog} onClose={handleCloseStatisticsDialog} />
    </Grid>
  );
};

export default LDAdminDashboard;
