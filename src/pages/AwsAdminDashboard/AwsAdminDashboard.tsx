import AwsStatisticsCard from "../../components/AwsStatistics/AwsStatisticsCard"
import AWSAdminBarGraph from "../../components/BarGraph/AWSAdminBarGraph/AWSAdminBarGraph"
import AwsAccountTable from '../../components/AwsAccountTable/AwsAccountTable'
import { fetchPendingNominations } from "../../api/PendingActionTableAPI"

import PendingNominationsTable from "../../components/PendingActions/PendingActionsTable/PendingActionsTable"
import PendingNominationCard from "../../components/PendingActions/PendingNominationCardList/PendingNominationCardList"

const AwsAdminDashboard = () => {
  return (
    <div>
       <AWSAdminBarGraph />
       <AwsStatisticsCard />
       <PendingNominationsTable fetchNominations={fetchPendingNominations} itemsPerPage={3} CardComponent={PendingNominationCard} containerHeight="250px" containerWidth="600px" />
       <AwsAccountTable />
    </div>
  )
}

export default AwsAdminDashboard
