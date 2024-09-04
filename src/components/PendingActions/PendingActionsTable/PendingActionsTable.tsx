import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface Nomination {
  id: string;
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
  containerWidth?: string | number;
  CardComponent: React.FC<{ nomination: Nomination }>;
}

const PendingNominationsTable: React.FC<PendingNominationsTableProps> = ({
  fetchNominations,
  itemsPerPage = 3,
  containerHeight = 'auto',
  containerWidth = 'auto',
  CardComponent,
}) => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNominations = async () => {
      setIsLoading(true);
      try {
        const data = await fetchNominations();
        setNominations(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadNominations();
  }, [fetchNominations]);

  const totalPages = Math.ceil(nominations.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  // Calculate indices for slicing nominations
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, nominations.length);
  const displayedNominations = nominations.slice(startIndex, endIndex);

  return (
    <Box
      sx={{
        maxWidth: '100%',
        width: containerWidth,
        minHeight: '100px',
        height: containerHeight,
        backgroundColor: 'white',
        borderRadius: 4.2,
        boxShadow: .3,
        p: 0.8,
        m: 1,
        mt: 2,
        overflow: 'hidden',
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
            disabled={currentPage >= totalPages - 1}
            sx={{ borderRadius: '50%' }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          borderRadius: 2,
          p: 0.6,
          pt: 1,
          height: 'calc(100% - 75px)',
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
            <InfoOutlinedIcon sx={{ fontSize: 25, mb: 0.3, color: 'grey' }} />
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
