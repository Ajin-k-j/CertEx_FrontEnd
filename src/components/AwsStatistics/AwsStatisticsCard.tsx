import React, { useEffect, useState } from 'react';
import StatisticsCard from '../../components/StatisticsCard/StatisticsCard';
import { People, Done, Cancel } from '@mui/icons-material';
import fetchAwsStatistics from '../../api/AwsStatisticsApi';
import { AwsStatistics } from '../../types/AwsStatistics.types';

const AwsStatisticsPage: React.FC = () => {
  const [data, setData] = useState({
    department: '',
    employees: 0,
    certifications: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: AwsStatistics = await fetchAwsStatistics();
        setData({
          department: result.totalAccounts,
          employees: result.activeAccounts,
          certifications: result.inactiveAccounts,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const icons = {
    department: <People />,
    employees: <Done />,
    certifications: <Cancel />,
  };

  const labels = {
    department: 'Total Accounts',
    employees: 'Active',
    certifications: 'Inactive',
  };

  return <StatisticsCard data={data} icons={icons} labels={labels} />;
};

export default AwsStatisticsPage;
