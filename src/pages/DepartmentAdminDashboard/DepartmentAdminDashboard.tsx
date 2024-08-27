import { fetchPendingNominations } from "../../api/PendingActionTableAPI"
import DUBarGraph from "../../components/BarGraph/DUBarGraph/DUBargraph"
import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList"
import DepartmentStatisticsCard from "../../components/DepartmentStatistics/DepartmentStatisticsCard"
import DepartmentNominationsTable from '../../components/DepartmentNominationsTable/DepartmentNominationsTable'



const DepartmentAdminDashboard = () => {
  return (
    <div>
       <div style={{display:'flex', justifyContent:'space-around'}}>
      <DUBarGraph />
      <PendingNominationsTable fetchNominations={fetchPendingNominations} itemsPerPage={3} CardComponent={PendingNominationCard} containerHeight="250px" containerWidth="600px" />
      </div>
      <DepartmentStatisticsCard />
      <DepartmentNominationsTable />
    </div>
  )
}

export default DepartmentAdminDashboard
