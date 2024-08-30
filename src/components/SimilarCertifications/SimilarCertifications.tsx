import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fetchSimilarCertifications } from "../../api/SimilarCertificationsApi";
import CertificationCard from "../CertificationCard/CertificationCard";
import CertificationCardViewModal from "../CertificationCardViewModal/CertificationCardViewModal";
import NominationFormModal from "../NominationFormModal/NominationFormModal";
import {
  CertificationLevel,
  CertificationData,
} from "../../types/AllCertifications.types";
import { Link } from "react-router-dom";

const SimilarCertifications: React.FC = () => {
  const [certifications, setCertifications] = useState<CertificationData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [nominationModalOpen, setNominationModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] =
    useState<CertificationData | null>(null);

  useEffect(() => {
    const getCertifications = async () => {
      const data = await fetchSimilarCertifications();
      setCertifications(data);
    };
    getCertifications();
  }, []);

  const handleNextSlide = useCallback(() => {
    if (certifications.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % certifications.length);
    }
  }, [certifications]);

  const handlePrevSlide = useCallback(() => {
    if (certifications.length > 0) {
      setCurrentSlide(
        (prev) => (prev - 1 + certifications.length) % certifications.length
      );
    }
  }, [certifications]);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      handleNextSlide();
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(autoScroll); // Clean up on component unmount
  }, [handleNextSlide]);

  const handleCardClick = (certification: CertificationData) => {
    setSelectedCertification(certification);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedCertification(null);
  };

  const handleNominateClick = () => {
    setViewModalOpen(false); // Close the view modal
    setNominationModalOpen(true); // Open the nomination modal
  };

  const handleCloseNominationModal = () => {
    setNominationModalOpen(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 290,
        height: '38vh',
        m: '2vh',
        marginLeft:'1vh',
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "8px",
        // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" sx={{ fontSize: "1rem", textAlign: "center" }}>
        Recommended Certifications <span>({certifications.length})</span>
      </Typography>

      {certifications.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: "1.6rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: "2rem", color: "#757575" }} />
          <Typography
            variant="body1"
            sx={{ mt: ".5rem", mb: ".2rem", textAlign: "center" }}
          >
            No Recommendations for now
          </Typography>
          <Typography variant="body2" sx={{ mb: ".5rem", textAlign: "center" }}>
            Explore all available certifications
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="success" // Green color
            sx={{ padding: "0.3rem 2rem", borderRadius: "8px" }}
          >
            Explore
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handlePrevSlide}
              sx={{ backgroundColor: "white", zIndex: 1, boxShadow: 0 }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <Box
              sx={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {certifications.length > 0 && (
                <CertificationCard
                  key={certifications[currentSlide].id}
                  id={certifications[currentSlide].id}
                  provider={certifications[currentSlide].provider || " "}
                  certification_name={
                    certifications[currentSlide].certification_name || " "
                  }
                  level={certifications[currentSlide].level || "Beginner"}
                  description=" " // No description to maintain the height limit
                  tags={certifications[currentSlide].tags || []}
                  official_link={
                    certifications[currentSlide].official_link || " "
                  }
                  onClick={() => handleCardClick(certifications[currentSlide])}
                />
              )}
            </Box>
            <IconButton
              onClick={handleNextSlide}
              sx={{ backgroundColor: "white", zIndex: 1, boxShadow: 0 }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          {selectedCertification && (
            <CertificationCardViewModal
              open={viewModalOpen}
              onClose={handleCloseViewModal}
              certificationName={selectedCertification.certification_name}
              provider={selectedCertification.provider}
              level={selectedCertification.level as CertificationLevel}
              description={selectedCertification.description}
              tags={selectedCertification.tags}
              officialLink={selectedCertification.official_link}
              nominationOpenDate={selectedCertification.nomination_open_date}
              nominationCloseDate={selectedCertification.nomination_close_date}
              onNominate={handleNominateClick}
            />
          )}

          {selectedCertification && (
            <NominationFormModal
              open={nominationModalOpen}
              onClose={handleCloseNominationModal}
              id={selectedCertification.id}
              certificationName={selectedCertification.certification_name}
              nomination_open_date={selectedCertification.nomination_open_date}
              nomination_close_date={
                selectedCertification.nomination_close_date
              }
            />
          )}
        </>
      )}
    </Box>
  );
};

export default SimilarCertifications;
