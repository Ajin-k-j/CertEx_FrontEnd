import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
import { useNavigate } from 'react-router-dom';
import CertificationChartss from '../../components/BarGraph/LDAdminBarGraph/LDAdminBarGraph';
import DashboardActions from '../../components/DashboardActions/DashboardActions';
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList";

// import TickPlacementBars from '../../Components/CertificationChart/CertificationChar';
const LDAdminDashboard = () => {
  const navigate = useNavigate();
  const ldButtons = [
    { label: 'All Certifications (24)', onClick: () => navigate('/') },
    { label: 'User Suggested Certifications (02)', onClick: () => console.log('User Suggested Certifications') },
    { label: 'Users & Roles (06)', onClick: () => console.log('Users & Roles') },
    { label: 'Critical Certification (24/34)', onClick: () => console.log('Critical Certification') },
    { label: 'Detailed Statistics', onClick: () => console.log('Detailed Statistics') },
  ];

  return (
  <>
  <CertificationChartss/>
  <PendingNominationsTable fetchNominations={fetchPendingNominations} itemsPerPage={2} CardComponent={PendingNominationCard} containerHeight="330px" />
  <DashboardActions title="Admin Controls" buttons={ldButtons} />;
  </>
  );
};

export default LDAdminDashboard;
