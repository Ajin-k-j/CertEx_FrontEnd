import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box, Grid, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { fetchUserPendingActions } from '../../../api/FetchUserPendingNominationsApi';
import UserPendingNominationsForEach from './UserPendingNominationsForEach';

interface UserPendingAction {
    id: number;
    employeeId: number;
    certificationId: number;
    nominationStatusFromNomination: string;
    nominationStatusFromCertificationExam: string;
    certificationName: string;
}

const UserPendingNomination: React.FC = () => {
    const [pendingActions, setPendingActions] = useState<UserPendingAction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const itemsPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchUserPendingActions();
                setPendingActions(data);
            } catch (err) {
                console.log(err)
                setError('Failed to fetch user pending actions.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) =>
            Math.min(prevPage + 1, Math.ceil(pendingActions.length / itemsPerPage) - 1)
        );
    };

    const displayedActions = pendingActions.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
                <Typography variant="body1" color="textSecondary" sx={{ ml: 2 }}>
                    Loading pending actions...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (pendingActions.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <InfoOutlinedIcon sx={{ fontSize: 40, mb: 1, color: 'grey' }} />
                <Typography variant="body1" color="textSecondary">
                    No pending actions found.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: '550vw',
                height: '60vh',
                mt: 1.5,
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 1,
                p: 0.8,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                    Pending Actions ({pendingActions.length})
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
                        disabled={currentPage === Math.ceil(pendingActions.length / itemsPerPage) - 1}
                        sx={{ borderRadius: '50%' }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box
                sx={{
                    backgroundColor: pendingActions.length > 0 ? '#f0f0f0' : '#f5f5f5',
                    borderRadius: 2,
                    p: 0.4,
                    pt: 1,
                    height: '170px',
                }}
            >
                <Grid container direction="column" spacing={1}>
                    {displayedActions.map((action) => (
                        <Grid item key={action.id}>
                            <UserPendingNominationsForEach certificationName={action.certificationName} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default UserPendingNomination;
