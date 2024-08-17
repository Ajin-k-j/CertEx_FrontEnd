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

  const icons = {
    department: <Work />,
    employees: <Group />,
    certifications: <Badge />,
  };

  const labels = {
    department: 'Department',
    employees: 'Employees',
    certifications: 'Certifications',
  };

  return <StatisticsCard data={data} icons={icons} labels={labels} />;
};

export default DepartmentStatisticsPage;