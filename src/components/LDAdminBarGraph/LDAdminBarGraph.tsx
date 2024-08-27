import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { fetchCertificationData } from '../../api/BarGraphApi';
import { fetchFinancialYears } from '../../api/FetchFinancialYearApi'; 
import ReusableBarChart from '../BarGraph/ReusableBarChart/ReusableBarChart';
import { fetchDU } from '../../api/FetchingDUApi';
import { fetchProviders } from '../../api/FetchProviderApi';

type CertificationData = {
  [key: string]: {
    [key: string]: {
      [key: string]: number[];
    };
  };
};

const months = [
  'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'
];

const Certification: React.FC = () => {
  const [certificationData, setCertificationData] = useState<CertificationData>({});
  const [year, setYear] = useState<string>('All');
  const [du, setDU] = useState<string>('All');
  const [provider, setProvider] = useState<string>('All');
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [yearOptions, setYearOptions] = useState<string[]>(['All']);
  const [duOptions, setDUOptions] = useState<string[]>(['All']);
  const [providerOptions, setProviderOptions] = useState<string[]>(['All']);
  const [noData, setNoData] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const financialYears = await fetchFinancialYears();
        const formattedYears = financialYears.map(
          (fy: { from_date: string; to_date: string }) =>
            `${fy.from_date}-${fy.to_date}`
        );
        setYearOptions(['All', ...formattedYears]);

        const [duData, providersData] = await Promise.all([fetchDU(), fetchProviders()]);
        setDUOptions(['All', ...duData]);
        setProviderOptions(['All', ...providersData]);

        const data = await fetchCertificationData();
        setCertificationData(data as CertificationData);
        setNoData(Object.keys(data).length === 0);
      } catch (err) {
        console.log(err)
        setError('Failed to fetch dropdown data.');
      } finally {
        setLoading(false);
      }
    };

    loadDropdownData();
  }, []);

  useEffect(() => {
    if (loading || error) return;

    const yearData = certificationData[year] ;
    // const yearData = filteredData[year] || filteredData['All'];
    if (!yearData || !yearData[du]) {
      setData([]);
      setNoData(true);
      return;
    }

    const duData = yearData[du] || yearData['All'];
    const providerData = duData[provider] || [];
    if (Array.isArray(providerData) && providerData.length > 0) {
      setData(providerData);
      setNoData(false);
    } else {
      setData([]);
      setNoData(true);
    }
  }, [certificationData, year, du, provider, loading, error]);

  const dataset = data.map((value, index) => ({
    month: months[index] || `M${index + 1}`,
    value,
  }));

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
  };

  const handleDUChange = (event: SelectChangeEvent<string>) => {
    setDU(event.target.value);
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
        <FormControl sx={{ minWidth: isMobile ? 120 : 120 }}>
          <InputLabel>Financial Year</InputLabel>
          <Select
            value={year}
            onChange={handleYearChange}
            label="Financial Year"
            sx={{ height: isMobile ? '7vh' : '5vh', fontSize: '2vh' }}
          >
            {yearOptions.map((yearOption) => (
              <MenuItem key={yearOption} value={yearOption}>
                {yearOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: isMobile ? 120 : 120 }}>
          <InputLabel>DU</InputLabel>
          <Select
            value={du}
            onChange={handleDUChange}
            label="DU"
            sx={{ height: isMobile ? '7vh' : '5vh', fontSize: '2vh' }}
          >
            {duOptions.map((duOption) => (
              <MenuItem key={duOption} value={duOption}>
                {duOption}
              </MenuItem>
            ))}
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
            {providerOptions.map((providerOption) => (
              <MenuItem key={providerOption} value={providerOption}>
                {providerOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: '1.6rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          <InfoOutlinedIcon sx={{ height: '17vh', fontSize: '2rem', color: '#757575' }} />
          <Typography variant="body1" sx={{ mt: '.5vh', mb: '.2rem', textAlign: 'center' }}>
            Something went wrong while fetching.
          </Typography>
        </Box>
      ) : noData ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: '1.6rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          <InfoOutlinedIcon sx={{ height: '17vh', fontSize: '2rem', color: '#757575' }} />
          <Typography variant="body1" sx={{ mt: '.5vh', mb: '.2rem', textAlign: 'center' }}>
            No Certification completed yet.
          </Typography>
        </Box>
      ) : (
        <ReusableBarChart data={dataset} isMobile={isMobile} />
      )}
    </Stack>
  );
};

export default Certification;
