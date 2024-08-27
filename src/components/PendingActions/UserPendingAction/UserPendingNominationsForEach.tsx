import React, { useState } from 'react';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import UserPendingActionModal from '../UserPendingActionModal/UserPendingActionModal';

interface UserPendingNominationsProps {
    certificationName: string;
}

const UserPendingNominationsForEach: React.FC<UserPendingNominationsProps> = ({ certificationName }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Grid item>
                <Card variant="outlined" sx={{ borderRadius: '8px', backgroundColor: 'white', marginBottom: '10px' }}>
                    <CardContent sx={{ padding: '8px !important' }}>
                        <Grid container spacing={1.2} alignItems="center" justifyContent="space-between" wrap="nowrap">
                            <Grid item xs={10}>
                                <Typography variant="h6" sx={{ fontSize: '19px', marginRight: '5px' }} noWrap>
                                    {certificationName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ marginTop: '5px' }} noWrap>
                                    Note: Do the pending actions.
                                </Typography>
                            </Grid>
                            <Grid item xs={2} container justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '8px', marginRight: '1px' }}
                                    onClick={handleClickOpen}
                                >
                                    View
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <UserPendingActionModal isOpen={isOpen} onClose={handleClose} />
        </>
    );
};

export default UserPendingNominationsForEach;
