import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { CertificationLevel } from "../../types/AllCertifications.types";

// Define the prop types
interface CertificationCardViewModalProps {
  open: boolean;
  onClose: () => void;
  certificationName: string;
  provider: string;
  level: CertificationLevel;
  description: string;
  tags: string[];
  officialLink: string;
  onNominate: () => void;
}

const CertificationCardViewModal: React.FC<CertificationCardViewModalProps> = ({
  open,
  onClose,
  certificationName,
  provider,
  level,
  description,
  tags,
  officialLink,
  onNominate,
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
      <DialogTitle sx={{ borderRadius: "10px 10px 0 0" }}>
        {certificationName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Provider:</strong> {provider}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Level:</strong>{" "}
            <span style={{ color: getBorderColor() }}>{level}</span>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Description:</strong> {description}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Tags:</strong>{" "}
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{
                  fontSize: 10,
                  height: "1.1rem",
                  margin: ".11rem",
                  backgroundColor: `hsl(${index * 40}, 70%, 80%)`,
                }}
              />
            ))}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <a href={officialLink} target="_blank" rel="noopener noreferrer">
              Want to learn more about the certification?
            </a>
          </Typography>
        </DialogContentText>
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
