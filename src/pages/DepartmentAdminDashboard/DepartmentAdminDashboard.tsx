import { fetchPendingNominations } from "../../api/PendingActionTableAPI"
import DUBarGraph from "../../components/BarGraph/DUBarGraph/DUBargraph"
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList"




const DepartmentAdminDashboard = () => {
  return (
    <div>
      <DUBarGraph />
      <PendingNominationsTable fetchNominations={fetchPendingNominations} itemsPerPage={3} CardComponent={PendingNominationCard} containerHeight="250px" containerWidth="600px" />
      </div>
  )
}

export default DepartmentAdminDashboard
