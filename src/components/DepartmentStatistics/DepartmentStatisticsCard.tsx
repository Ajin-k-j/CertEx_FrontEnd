import React, { useEffect, useState } from 'react';
import { fetchDepartmentStatistics } from '../../api/DepartmentStatisticsApi';
import { DepartmentStatistics } from '../../types/DepartmentStatistics.types';
import StatisticsCard from '../../components/StatisticsCard/StatisticsCard';
import { Work, Group, Badge } from '@mui/icons-material';

const DepartmentStatisticsPage: React.FC = () => {
  const [data, setData] = useState<DepartmentStatistics>({
    department: '',
    employees: 0,
    certifications: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchDepartmentStatistics();
        setData(fetchedData);
      } catch (error) {
        console.error(error);
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

  return <StatisticsCard data={mappedData} icons={icons} labels={labels} />;
};

export default DepartmentStatisticsPage;
