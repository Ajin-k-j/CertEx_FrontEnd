import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { CertificationLevel } from "../../types/AllCertifications.types";

interface CertificationCardViewModalProps {
  open: boolean;
  onClose: () => void;
  certificationName: string;
  providerName: string;
  level: CertificationLevel;
  description: string;
  tags: string[];
  officialLink: string;
  onNominate: () => void;
  nominationStatus: string;
  nominationOpenDate: string; 
  nominationCloseDate: string;
}

const CertificationCardViewModal: React.FC<CertificationCardViewModalProps> = ({
  open,
  onClose,
  certificationName,
  providerName,
  level,
  description,
  tags,
  officialLink,
  onNominate,
  nominationCloseDate,
  nominationStatus,
  nominationOpenDate,
}) => {
  const getBorderColor = () => {
    switch (level) {
      case "Beginner":
        return "green";
      case "Intermediate":
        return "blue";
      case "Expert":
        return "red";
      default:
        return "gray";
    }
  };

  const getNominationStatusMessage = () => {
    if (nominationStatus === "Accepting") {
      if (nominationOpenDate && new Date(nominationOpenDate) > new Date()) {
        return `Nominations will open from ${new Date(nominationOpenDate).toLocaleDateString()}.`;
      }
      if (nominationCloseDate) {
        return `Nomination is open until ${new Date(nominationCloseDate).toLocaleDateString()}.`;
      }
      return "Nomination is Open.";
    }
    if (nominationStatus === "Not Accepting") {
      return "Nomination is Closed.";
    }
    if (nominationStatus === "Always Accepting") {
      return "Nomination is Open.";
    }
    return "";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTop: `4px solid ${getBorderColor()}`,
          borderRadius: "10px",
          padding: "10px",
          minWidth: "300px",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderRadius: "10px 10px 0 0",
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "#1976d2",
        }}
      >
        {certificationName}
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="subtitle1" color="grey" gutterBottom>
            <strong>Provider:</strong> {providerName}
          </Typography>
          <Typography variant="subtitle1" color="grey" gutterBottom>
            <strong>Level:</strong>{" "}
            <span style={{ color: getBorderColor() }}>{level}</span>
          </Typography>
          <Typography variant="subtitle1" color="grey" gutterBottom>
            <strong>Description:</strong> {description}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            component="div"
            sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            {tags.map((tag, index) => (
              <span key={index} style={{fontWeight: "bold", color:"grey" }}>
                {tag}
                {index < tags.length - 1 && <span style={{ margin: "0.5rem" }}>•</span>}
              </span>
            ))}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <a href={officialLink} target="_blank" rel="noopener noreferrer">
              Want to learn more about the certification?
            </a>
          </Typography>
          <Box
            sx={{
              backgroundColor: "rgba(255, 193, 7, 0.15)",
              padding: "8px",
              borderRadius: "5px",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
              {getNominationStatusMessage()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onNominate} color="primary" variant="contained">
          Nominate for Certification
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificationCardViewModal;
