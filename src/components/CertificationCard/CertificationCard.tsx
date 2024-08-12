import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { CertificationLevel } from "../../types/AllCertifications.types";


interface CertificationCardProps {
  id: number;
  provider: string;
  certification_name: string;
  level: CertificationLevel;
  description: string;
  tags: string[];
  official_link: string;
  onClick: () => void;  // Function to handle click event
}
const CertificationCard: React.FC<CertificationCardProps> = ({
  provider,
  certification_name,
  level,
  description,
  tags,
  onClick,
}) => {
  const borderColor =
    level === "Beginner" ? "green" :
    level === "Intermediate" ? "blue" : "red";

  const truncateDescription = (text: string, limit: number) => {
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return `${words.slice(0, limit).join(" ")}...`;
  };

  return (
    <Card
      sx={{
        height: "auto",
        maxHeight: "15rem",
        width: { xs: "100%", sm: "14.2rem" },
        borderTop: `4px solid ${borderColor}`,
        borderLeft: "1px solid rgb(146, 145, 145)",
        borderRight: "1px solid rgb(146, 145, 145)",
        borderBottom: "1px solid rgb(146, 145, 145)",
        borderRadius: "10px",
        margin: "5px",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Typography sx={{ fontSize: 11 }} color="text.secondary" gutterBottom>
          {provider}
        </Typography>
        <Typography sx={{ fontSize: 15 }} variant="h5" component="div">
          {certification_name}
        </Typography>
        <Typography
          sx={{ mb: 0.5, mt: 0.5, fontSize: 12, color: borderColor }}
          gutterBottom
        >
          {level}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: 13,
            color: "grey",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {truncateDescription(description, 15)}
        </Typography>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "0.5rem" }}>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationCard;
