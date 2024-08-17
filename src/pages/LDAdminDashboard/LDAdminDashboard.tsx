import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import { fetchPendingNominations } from '../../api/PendingActionTableAPI';
const LDAdminDashboard = () => {
  return (
    <div>
      <h1>L&D ADMIN Dashboard</h1>
      <PendingNominationsTable fetchNominations={fetchPendingNominations} />
    </div>
  )
}

export default LDAdminDashboard
