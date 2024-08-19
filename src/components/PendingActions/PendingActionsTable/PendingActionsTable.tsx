import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface Nomination {
  id: number;
  title: string;
  candidateName: string;
  department: string;
  provider: string;
  criticality: string;
  status: string;
  remarks: string;
  plannedExamMonth: string;
}

interface PendingNominationsTableProps {
  fetchNominations: () => Promise<Nomination[]>;
  itemsPerPage?: number;
  containerHeight?: string | number;
  CardComponent: React.FC<{ nomination: Nomination }>; // New prop to accept card component
}

const PendingNominationsTable: React.FC<PendingNominationsTableProps> = ({
  fetchNominations,
  itemsPerPage = 3,
  containerHeight = 'auto',
  CardComponent, // Accept card component as a prop
}) => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNominations = async () => {
      setIsLoading(true);
      const data = await fetchNominations();
      setNominations(data);
      setIsLoading(false);
    };

    loadNominations();
  }, [fetchNominations]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(nominations.length / itemsPerPage) - 1)
    );
  };

  const displayedNominations = nominations.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <Box
      sx={{
        maxWidth: '44vw',
        minWidth: 'auto',
        minHeight: '100px',
        height: containerHeight,
        mt: 1.5,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 1,
        p: 0.8,
        m:1,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, ml: 1 }}>
        <Typography variant="h6">
          Pending Actions ({nominations.length})
        </Typography>
        <Box>
          <IconButton
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            sx={{ borderRadius: '50%', mr: 1 }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(nominations.length / itemsPerPage) - 1}
            sx={{ borderRadius: '50%' }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          p: .6,
          pt: 1,
          height: 'calc(100% - 75px)',
          border: '1px solid grey',
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <CircularProgress sx={{ color: 'grey' }} />
            <Typography variant="body1" color="textSecondary">
              Loading pending actions...
            </Typography>
          </Box>
        ) : nominations.length > 0 ? (
          <Grid container direction="column" spacing={1}>
            {displayedNominations.map((nomination) => (
              <Grid item key={nomination.id}>
                <CardComponent nomination={nomination} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 25, mb: .3, color: 'grey' }} />
            <Typography variant="body1" color="textSecondary">
              No pending actions available.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PendingNominationsTable;
