import React, { useEffect, useState } from 'react';
import StatisticsCard from '../StatisticsCard/StatisticsCard';
import { People, Done } from '@mui/icons-material';
import fetchAwsTotalData from '../../api/AwsStatisticsApi';
import { AwsStatistics } from '../../types/AwsStatistics.types';
import { CircularProgress, Box } from '@mui/material';

const AwsStatisticsPage: React.FC = () => {
  const [data, setData] = useState({
    primary: '',
    secondary: 0,
  });
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: AwsStatistics = await fetchAwsTotalData();
        setData({
          primary: result.totalAwsNominations.toString(), // Convert to string
          secondary: result.pendingNominations,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, []);

  const icons = {
    primary: <People />,
    secondary: <Done />,
  };

  const labels = {
    primary: 'Total AWS Nominations', 
    secondary: 'Pending Nominations',
  };

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <StatisticsCard data={data} icons={icons} labels={labels} />
      )}
    </div>
  );
};

export default AwsStatisticsPage;
