import React, { useState } from "react";
import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import PendingNominationModal from "../PendingActionsModal/PendingActionsModal";

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
}

const PendingNominationCard: React.FC<PendingNominationCardProps> = ({
  nomination,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewApproveClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{ borderRadius: "8px", backgroundColor: "white" }}
      >
        <CardContent sx={{ padding: "8px !important" }}>
          <Grid container spacing={1.8} alignItems="center" wrap="nowrap">
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{ marginRight: "8px" }}
                noWrap
              >
                {nomination.title}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography
                variant="body2"
                sx={{ marginRight: "5px" }}
                color="textSecondary"
                fontWeight="bold"
                noWrap
              >
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
            <Grid item xs={4}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  borderRadius: "8px",
                }}
                onClick={handleViewApproveClick}
              >
                View & Approve
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <PendingNominationModal
        nomination={nomination}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PendingNominationCard;
