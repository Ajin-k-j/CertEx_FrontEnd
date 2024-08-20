import AwsStatisticsCard from "../../components/AwsStatistics/AwsStatisticsCard"
import AWSAdminBarGraph from "../../components/BarGraph/AWSAdminBarGraph/AWSAdminBarGraph"
import AwsAccountTable from '../../components/AwsAccountTable/AwsAccountTable'


const AwsAdminDashboard = () => {
  return (
    <div>
       <AWSAdminBarGraph />
       <AwsStatisticsCard />
       <AwsAccountTable />
    </div>
  )
}

export default AwsAdminDashboard
