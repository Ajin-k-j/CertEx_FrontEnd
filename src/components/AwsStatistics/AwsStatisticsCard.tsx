import React, { useEffect, useState } from 'react';
import StatisticsCard from '../StatisticsCard/StatisticsCard';
import { People, Done } from '@mui/icons-material';
import fetchAwsTotalData from '../../api/AwsStatisticsApi';
import { AwsStatistics } from '../../types/AwsStatistics.types';

const AwsStatisticsPage: React.FC = () => {
  const [data, setData] = useState({
    primary: '',
    secondary: 0,
    
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: AwsStatistics = await fetchAwsTotalData();
        setData({
          primary: result.totalAccounts,
          secondary: result.activeAccounts,

        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const icons = {
    primary: <People />,
    secondary: <Done />,
    
  };

  const labels = {
    primary: 'Total Aws Accounts',
    secondary: 'pending Requests',
    
  };

  return <StatisticsCard data={data} icons={icons} labels={labels} />;
};

export default AwsStatisticsPage;
