import React, { useEffect, useState } from 'react';
import { fetchAwsTotalData, AwsTotalData } from '../../../api/AWSTotalDataCard'; // Adjust path if necessary
import TotalDataCard from '../../../components/TotalDataCard/TotalDataCard'; // Adjust path if necessary
import { People, Done, Cancel } from '@mui/icons-material';

interface TotalData {
  department: string;
  employees: number;
  certifications: number;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<TotalData>({
    department: '',
    employees: 0,
    certifications: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const awsData: AwsTotalData = await fetchAwsTotalData();
        const totalData: TotalData = {
          department: awsData.totalAccounts, // Assuming totalAccounts is a string
          employees: awsData.activeAccounts, // Assuming activeAccounts is a number
          certifications: awsData.inactiveAccounts, // Assuming inactiveAccounts is a number
        };
        setData(totalData);
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
    department: 'Department',
    employees: 'Employees',
    certifications: 'Certifications',
  };

  return <TotalDataCard data={data} icons={icons} labels={labels} />;
};

export default DashboardPage;