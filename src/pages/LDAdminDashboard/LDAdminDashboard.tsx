import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import CertificationChartss from '../../components/CertificationBarGraph/CertificationBarGraph';
import DashboardActions from '../../components/DashboardActions/DashboardActions';
// import TickPlacementBars from '../../Components/CertificationChart/CertificationChar';
const LDAdminDashboard = () => {
  const ldButtons = [
    { label: 'All Certifications (24)', onClick: () => console.log('All Certifications') },
    { label: 'User Suggested Certifications (02)', onClick: () => console.log('User Suggested Certifications') },
    { label: 'Users & Roles (06)', onClick: () => console.log('Users & Roles') },
    { label: 'Critical Certification (24/34)', onClick: () => console.log('Critical Certification') },
    { label: 'Detailed Statistics', onClick: () => console.log('Detailed Statistics') },
  ];

  return (
  <>
  <CertificationChartss/>
  <PendingNominationsTable fetchNominations={fetchPendingNominations} />
  <DashboardActions title="Admin Controls" buttons={ldButtons} />;
  </>
  );
};

export default LDAdminDashboard;
