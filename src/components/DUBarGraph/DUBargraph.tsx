import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { fetchCertificationData } from '../../api/BarGraphApi';
import ReusableBarChart from '../ReusableBarChart/ReusableBarChart';

type CertificationData = {
  [key: string]: {
    [key: string]: number[];
  };
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DUBarGraph: React.FC = () => {
  const [certificationData, setCertificationData] = useState<CertificationData>({});
  const [year, setYear] = useState<string>('All');
  const [provider, setProvider] = useState<string>('All');

  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const du ="DU1";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const loadCertificationData = async () => {
      try {
        const data = await fetchCertificationData();
        setCertificationData(data as CertificationData); // Ensure correct typing
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    loadCertificationData();
  }, []);

  useEffect(() => {
    if (loading || error) return;

    const yearData = certificationData[year] || certificationData['All'];
    const duData = yearData[du] || yearData['All'];
    const providerData = duData[provider];

    if (Array.isArray(providerData)) {
      setData(providerData);
    } else {
      console.error('Data for the selected options is not an array.');
      setData([]);
    }
  }, [certificationData, year, provider, loading, error]);

  const dataset = data.map((value, index) => ({
    month: months[index] || `M${index + 1}`,
    value,
  }));

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
  };

  const handleProviderChange = (event: SelectChangeEvent<string>) => {
    setProvider(event.target.value);
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        width: isMobile ? '90%' : isTablet ? '70%' : '49%',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: isMobile ? '2vh' : '4vh 2vh 2vh 2vh',
        marginLeft: isMobile ? '2vh' : '2vh',
        marginBottom: isMobile ? '2vh' : '3vh',
        height: isMobile ? 'auto' : '40vh',
        justifyContent: 'flex-end',
      }}
    >
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        justifyContent="right"
      >
        <FormControl sx={{ minWidth: isMobile ? 120 : 120}}>
          <InputLabel>Financial Year</InputLabel>
          <Select
            value={year}
            onChange={handleYearChange}
            label="Year"
            sx={{ height: isMobile ? '7vh' : '5vh', fontSize: '2vh' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="2021">2021</MenuItem>
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: isMobile ? 120 : 120 }}>
          <InputLabel>Provider</InputLabel>
          <Select
            value={provider}
            onChange={handleProviderChange}
            label="Provider"
            sx={{
                height: isMobile ? '7vh' : '5vh',
                fontSize: '2vh',
                marginRight: isMobile ? 0 : '2vh',
              }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="AWS">AWS</MenuItem>
            <MenuItem value="Azure">Azure</MenuItem>
            <MenuItem value="GCP">GCP</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ReusableBarChart data={dataset} isMobile={isMobile}/>
      )}
    </Stack>
  );
};

export default DUBarGraph;
