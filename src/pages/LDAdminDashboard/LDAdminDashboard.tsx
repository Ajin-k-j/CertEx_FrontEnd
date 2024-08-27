import { useState } from 'react';
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable";
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import CertificationChartss from '../../components/BarGraph/LDAdminBarGraph/LDAdminBarGraph';
import DashboardActions from '../../components/DashboardActions/DashboardActions';
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList";
import CertificationManagementPage from '../../components/AllCertificationsAdmin/AllCertificationsManagement';


const LDAdminDashboard = () => {
  const [openCertificationModal, setOpenCertificationModal] = useState(false);

  const ldButtons = [
    {
      label: 'All Certifications (24)',
      onClick: () => setOpenCertificationModal(true),
    },
    {
      label: 'User Suggested Certifications (02)',
      onClick: () => console.log('User Suggested Certifications'),
    },
    {
      label: 'Users & Roles (06)',
      onClick: () => console.log('Users & Roles'),
    },
    {
      label: 'Critical Certification (24/34)',
      onClick: () => console.log('Critical Certification'),
    },
    {
      label: 'Detailed Statistics',
      onClick: () => console.log('Detailed Statistics'),
    },
  ];

  const handleCloseModal = () => {
    setOpenCertificationModal(false);
  };

  return (
    <>
      <div style={{ display: 'flex'}}>
        <CertificationChartss />
        <PendingNominationsTable
          fetchNominations={fetchPendingNominations}
          itemsPerPage={3}
          CardComponent={PendingNominationCard}
          containerHeight="70vh"
          containerWidth="100vw"
        />
      </div>
      <DashboardActions buttons={ldButtons} />
      
      {openCertificationModal && (
        <CertificationManagementPage
          open={openCertificationModal}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default LDAdminDashboard;
