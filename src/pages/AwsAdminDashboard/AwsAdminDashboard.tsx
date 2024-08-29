import AwsStatisticsCard from "../../components/AwsStatistics/AwsStatisticsCard";
import AWSAdminBarGraph from "../../components/AWSAdminBarGraph/AWSAdminBarGraph";

const AwsAdminDashboard = () => {
  return (
    <div>
      <AWSAdminBarGraph />
      <AwsStatisticsCard />
    </div>
  );
};

export default AwsAdminDashboard;
