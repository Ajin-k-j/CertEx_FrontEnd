import React, { useEffect, useState } from 'react';
import { fetchDepartmentStatistics } from '../../api/DepartmentStatisticsApi';
import { DepartmentStatistics } from '../../types/DepartmentStatistics.types';
import StatisticsCard from '../../components/StatisticsCard/StatisticsCard';
import { Work, Group, Badge } from '@mui/icons-material';
import { CircularProgress, Box } from '@mui/material';

const DepartmentStatisticsPage: React.FC = () => {
  const [data, setData] = useState<DepartmentStatistics>({
    department: '',
    employees: 0,
    certifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchDepartmentStatistics();
        setData(fetchedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    loadData();
  }, []);

  const mappedData = {
    primary: data.department,
    secondary: data.employees,
    tertiary: data.certifications,
  };

  const icons = {
    primary: <Work />,
    secondary: <Group />,
    tertiary: <Badge />,
  };

  const labels = {
    primary: 'Department',
    secondary: 'Employees',
    tertiary: 'Certifications',
  };

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <StatisticsCard data={mappedData} icons={icons} labels={labels} />
      )}
    </div>
  );
};

export default DepartmentStatisticsPage;
