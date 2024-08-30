import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PendingNominationModal from '../PendingActionsModal/PendingActionsModal';
import PendingNominationCard from '../PendingNominationCardList/PendingNominationCardList';

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
  containerWidth?: string | number; // New prop for container width
  CardComponent: React.FC<{ nomination: Nomination }>;
}

const PendingNominationsTable: React.FC<PendingNominationsTableProps> = ({
  fetchNominations,
  containerHeight = 'auto',
  containerWidth = 'auto', // Set default value for width
}) => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 6;

  useEffect(() => {
    const loadNominations = async () => {
      setIsLoading(true);
      const data = await fetchNominations();
      setNominations(data);
      setIsLoading(false);
    };

    loadNominations();
  }, [fetchNominations]);

  const handleViewApproveClick = (nomination: Nomination) => {
    setSelectedNomination(nomination);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNomination(null);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(nominations.length / itemsPerPage) - 1));
  };

  const displayedNominations = nominations.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <Box
      sx={{
        maxWidth: "100%",
        width: containerWidth, // Use the containerWidth prop
        minHeight: '385px',
        height: containerHeight,
        backgroundColor: 'white',
        borderRadius: 4,
        p: 0.8,
        m: 1,
        mt:2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          Pending Actions ({nominations.length})
        </Typography>
        <Box>
          <IconButton
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            sx={{ borderRadius: "50%", mr: 1 }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(nominations.length / itemsPerPage) - 1
            }
            sx={{ borderRadius: "50%" }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: nominations.length > 0 ? '#f0f0f0' : '#f5f5f5',
          borderRadius: 2,
          p: 0.6,
          pt: 1,
          height: '55vh',
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress sx={{ color: "grey" }} />
            <Typography variant="body1" color="textSecondary">
              Loading pending actions...
            </Typography>
          </Box>
        ) : nominations.length > 0 ? (
          <Grid container direction="column"  spacing={1}>
            {displayedNominations.map((nomination) => (
              <Grid item key={nomination.id}>
                <PendingNominationCard nomination={nomination} onViewApproveClick={handleViewApproveClick} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 25, mb: 0.3, color: "grey" }} />
            <Typography variant="body1" color="textSecondary">
              No pending actions available.
            </Typography>
          </Box>
        )}
      </Box>
      {selectedNomination && (
        <PendingNominationModal
          nomination={selectedNomination}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default PendingNominationsTable;
