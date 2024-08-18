import { fetchPendingNominations } from "../../api/PendingActionTableAPI"
import DUBarGraph from "../../components/BarGraph/DUBarGraph/DUBargraph"
import DepartmentStatisticsCard from "../../components/DepartmentStatistics/DepartmentStatisticsCard"
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList"




const DepartmentAdminDashboard = () => {
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-around'}}>
      <DUBarGraph />
      <PendingNominationsTable fetchNominations={fetchPendingNominations} itemsPerPage={3} CardComponent={PendingNominationCard} containerHeight="250px" />
      </div>
      <DepartmentStatisticsCard />
    </div>
  )
}

export default DepartmentAdminDashboard
