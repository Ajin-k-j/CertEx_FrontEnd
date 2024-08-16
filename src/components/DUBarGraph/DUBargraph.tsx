import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { fetchCertificationData } from '../../api/BarGraphApi';
import { fetchProviders } from '../../api/FetchProviderApi';
import ReusableBarChart from '../ReusableBarChart/ReusableBarChart';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type CertificationData = {
  [key: string]: {
    [key: string]: {
    [key: string]: number[];
  };
};
};
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DUBarGraph: React.FC = () => {
  const [certificationData, setCertificationData] = useState<CertificationData>({});
  const [year, setYear] = useState<string>('All');
  const [provider, setProvider] = useState<string>('All');
  const [providerOptions, setProviderOptions] = useState<string[]>([]); // New state for providers
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [noData, setNoData] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const du = "DU1";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));


  useEffect(() => {
    const loadCertificationData = async () => {
      try {
        const data = await fetchCertificationData();
        setCertificationData(data as CertificationData); // Ensure correct typing
      } catch (err) {
        console.log({ err });
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    loadCertificationData();
},[]);

  useEffect(()=>{
    const loadProviders = async () => {
        try {
          const fetchProvider = await fetchProviders();
          if (Array.isArray(fetchProvider)) {
            setProviderOptions(fetchProvider);

        } 
        else {
            throw new Error('Invalid data format');
          }
        }
        catch (err) {
          setError('Failed to fetch providers.');
          setProviderOptions([]);
        }
      };
      loadProviders();
  },[])

  useEffect(() => {
    if (loading || error) return;

    const yearData = certificationData[year] || certificationData['All'];
    const duData = yearData[du];
    const providerData = duData?.[provider];

    if (providerData && Array.isArray(providerData)) {
      setData(providerData);
      setNoData(false);
    } else {
      setData([]);
      setNoData(true);
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
 
  const getYearsOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
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
      {!loading && (
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
            label="Year"
            sx={{ height: isMobile ? '7vh' : '5vh', fontSize: '2vh' }}
          >
           <MenuItem value="All">All</MenuItem>
           {getYearsOptions().map((yearOption) => (
               <MenuItem key={yearOption} value={yearOption}>
               {yearOption}
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
              <MenuItem value="All">All</MenuItem>
            {providerOptions.length > 0 ? (
                providerOptions.map((providerOption) => (
              <MenuItem key={providerOption} value={providerOption}>
                {providerOption}
              </MenuItem>
            ))
        ):(
            <MenuItem disabled>No DUs available</MenuItem> 
        )}
          </Select>
        </FormControl>
      </Stack>
      )}

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

export default DUBarGraph;
