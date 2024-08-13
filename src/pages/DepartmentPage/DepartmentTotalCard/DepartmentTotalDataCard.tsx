import React, { useEffect, useState } from 'react';
import { fetchDepartmentTotalData, DepartmentTotalData } from '../../../api/DepartmentTotalDataCardApi';
import TotalDataCard from '../../../components/TotalDataCard/TotalDataCard';
import { Work, Group, Badge } from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DepartmentTotalData>({
    department: '',
    employees: 0,
    certifications: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDepartmentTotalData();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
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

  // Convert data to match the TotalDataCard expected structure
  const formattedData = {
    department: data.department,
    employees: data.employees,
    certifications: data.certifications,
  };

  return <TotalDataCard data={formattedData} icons={icons} labels={labels} />;
};

export default DashboardPage;
