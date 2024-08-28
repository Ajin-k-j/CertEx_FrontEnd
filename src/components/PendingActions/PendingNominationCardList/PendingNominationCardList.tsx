import React from 'react';
import { Card, CardContent, Grid, Typography, Button } from '@mui/material';

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

interface PendingNominationCardProps {
  nomination: Nomination;
  onViewApproveClick: (nomination: Nomination) => void;
}

const PendingNominationCard: React.FC<PendingNominationCardProps> = ({ nomination, onViewApproveClick }) => {
  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: '8px', backgroundColor: 'white' }}>
        <CardContent sx={{ padding: '8px !important' }}>
          <Grid container spacing={1.8} alignItems="center"  wrap="nowrap">
            <Grid item xs={4}>
              <Typography variant="subtitle2" sx={{ marginRight: '8px' }} noWrap>
                {nomination.title}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2" sx={{ marginRight: '5px' }} color="textSecondary" fontWeight="bold" noWrap>
                {nomination.department}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" noWrap>
                {nomination.provider}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="error" noWrap>
                {nomination.criticality}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                size="small"
                sx={{ fontSize: '0.75rem', borderRadius: '8px' }}
                onClick={() => onViewApproveClick(nomination)}
              >
                View & Approve
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  </>
  );
};

export default PendingNominationCard;
