// UserPendingNomination.tsx

import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { fetchUserPendingActions } from '../../../api/FetchUserPendingNominationsApi';
import UserPendingNominationsForEach from './UserPendingNominationsForEach';
import LoadingAnimation from '../../LoadAnimation/LoadAnimation';

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
    const [noData, setNoData] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const itemsPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            setNoData(false);
            try {
                setLoading(true);
                const data = await fetchUserPendingActions();
                if (!data || data.length === 0) { 
                    setNoData(true);}
                else{
                        setPendingActions(data);
                    }
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

    return ( 
        <Grid item xs={12}>
            <div style={{ height: "300px" }}>
                {loading ? (
                    <LoadingAnimation />
                ) : error ? (
                    <Box
                        sx={{
                            width:'42.5vw',
                            mt:'2vh',
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            p: "1.6rem",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            height: "47vh",
                        }}
                    >
                        <InfoOutlinedIcon
                            sx={{ mt: '10vh', height: "17vh", fontSize: "2rem", color: "#757575", borderRadius: '20px' }}
                        />
                        <Typography
                            variant="body1"
                            sx={{ mt: ".5vh", mb: ".2rem", textAlign: "center" }}
                        >
                            Something went wrong while fetching.
                        </Typography>
                    </Box>
                ) : noData ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mt: '2.2vh',
                            p: "1.6rem",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            height: "45vh",
                        }}
                    >
                        <InfoOutlinedIcon
                            sx={{ mt: '10vh', height: "17vh", fontSize: "2rem", color: "#757575", borderRadius: '20px' }}
                        />
                        <Typography
                            variant="body1"
                            sx={{ mt: ".5vh", mb: ".2rem", textAlign: "center" }}
                        >
                            No Certification completed yet.
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            width: '45.3vw',
                            height: '53vh',
                            mt: 1.5,
                            backgroundColor: 'white',
                            borderRadius: '15px',
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
                                height: '250px',
                            }}
                        >
                            <Grid container direction="column" spacing={0}>
                                {displayedActions.map((action) => (
                                    <Grid item key={action.id}>
                                        <UserPendingNominationsForEach certificationName={action.certificationName} nominationId={action.id} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                )}
            </div>
        </Grid>
    );
};

export default UserPendingNomination;









    // if (loading) {
    //     return (
    //         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    //             <CircularProgress />
    //             <Typography variant="body1" color="textSecondary" sx={{ ml: 2 }}>
    //                 Loading pending actions...
    //             </Typography>
    //         </Box>
    //     );
    // }

    // if (error) {
    //     return (
    //         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    //             <Typography variant="h6" color="error">
    //                 {error}
    //             </Typography>
    //         </Box>
    //     );
    // }

    // if (pendingActions.length === 0) {
    //     return (
    //         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    //             <InfoOutlinedIcon sx={{ fontSize: 40, mb: 1, color: 'grey' }} />
    //             <Typography variant="body1" color="textSecondary">
    //                 No pending actions found.
    //             </Typography>
    //         </Box>
    //     );
    // }

    // return (
    
    // );

