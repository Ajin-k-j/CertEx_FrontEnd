import React, { useEffect, useState } from "react";
import { fetchCertifications } from "../../api/AllCertificationsApi";
import { Box, Typography } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import styles from "./AllCertifications.module.css";
import CertificationCard from "../../components/CertificationCard/CertificationCard";
import FilterChips from "../../components/FilterChipsBox/FilterChips";
import useFilterCertifications from "../../hooks/useFilterCertifications";
import TopFilter from "../../components/TopFilter/TopFilter";
import LeftFilter from "../../components/LeftFilter/LeftFilter";
import CertificationCardViewModal from "../../components/CertificationCardViewModal/CertificationCardViewModal";
import NominationFormModal from "../../components/NominationFormModal/NominationFormModal";
import { SortOption, CertificationLevel, CertificationData } from "../../types/AllCertifications.types";

const AllCertifications: React.FC = () => {
  const [data, setData] = useState<CertificationData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<CertificationLevel | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // State to manage modals visibility and content
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [nominationModalOpen, setNominationModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<CertificationData | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const certifications = await fetchCertifications();
        setData(certifications);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const filteredData = useFilterCertifications({
    data,
    searchQuery,
    selectedLevel,
    sortOption,
    selectedProviders,
    selectedCategories,
  });

  const removeFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case "searchQuery":
        setSearchQuery("");
        break;
      case "selectedLevel":
        setSelectedLevel("all");
        break;
      case "sortOption":
        setSortOption("latest");
        break;
      case "selectedProviders":
        setSelectedProviders(prev => prev.filter(provider => provider !== value));
        break;
      case "selectedCategories":
        setSelectedCategories(prev => prev.filter(category => category !== value));
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedLevel("all");
    setSortOption("latest");
    setSelectedProviders([]);
    setSelectedCategories([]);
  };

  // Function to handle card click
  const handleCardClick = (certification: CertificationData) => {
    setSelectedCertification(certification);
    setViewModalOpen(true);
  };

  // Function to close the view modal
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedCertification(null);
  };

  // Function to handle nomination button click
  const handleNominateClick = () => {
    setViewModalOpen(false); // Close the view modal
    setNominationModalOpen(true); // Open the nomination modal
  };

  // Function to close the nomination modal
  const handleCloseNominationModal = () => {
    setNominationModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.LeftSection}>
        <LeftFilter
          selectedProviders={selectedProviders}
          setSelectedProviders={setSelectedProviders}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          clearAllFilters={clearAllFilters}
        />
      </div>
      <div className={styles.MiddleSection}>
        <TopFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {/* Cards Display Section */}
        <div className={styles.CardsSection}>
          {/* FilterChips Component */}
          <div className={styles.FilterChipsDisplay}>
            <FilterChips
              searchQuery={searchQuery}
              selectedLevel={selectedLevel}
              sortOption={sortOption}
              selectedProviders={selectedProviders}
              selectedCategories={selectedCategories}
              removeFilter={removeFilter}
            />
          </div>
          {filteredData.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="400px"
              textAlign="center"
              bgcolor="white"
              p={3}
            >
              <InfoOutlined
                sx={{
                  fontSize: 30,
                  color: "#888",
                  marginBottom: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: "15px",
                  color: "#888",
                }}
              >
                No certifications available
              </Typography>
            </Box>
          ) : (
            <div className={styles.cardDisplay}>
              {filteredData.map(cert => (
                <CertificationCard key={cert.id} {...cert} onClick={() => handleCardClick(cert)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CertificationCardViewModal Component */}
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

      {/* NominationFormModal Component */}
      {selectedCertification && (
        <NominationFormModal
          open={nominationModalOpen}
          onClose={handleCloseNominationModal}
          id={selectedCertification.id}
          certificationName={selectedCertification.certification_name}
          nomination_open_date={selectedCertification.nomination_open_date} 
          nomination_close_date={selectedCertification.nomination_close_date} 
        />
      )}
    </div>
  );
};

export default AllCertifications;
