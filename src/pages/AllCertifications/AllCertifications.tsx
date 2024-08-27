import React, { useEffect, useState } from "react";
import { fetchCertifications } from "../../api/AllCertificationsApi";
import { Box, Typography } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { ThreeDots } from 'react-loader-spinner'; // Import professional spinner
import styles from "./AllCertifications.module.css";
import CertificationCard from "../../components/CertificationCard/CertificationCard";
import FilterChips from "../../components/FilterChipsBox/FilterChips";
import useFilterCertifications from "../../hooks/useFilterCertifications";
import TopFilter from "../../components/TopFilter/TopFilter";
import LeftFilter from "../../components/LeftFilter/LeftFilter";
import CertificationCardViewModal from "../../components/CertificationCardViewModal/CertificationCardViewModal";
import NominationFormModal from "../../components/NominationFormModal/NominationFormModal";
import { SortOption, CertificationLevel, CertificationData } from "../../types/AllCertifications.types";

const CACHE_KEY = 'certifications_data';
const CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes

const AllCertifications: React.FC = () => {
  const [data, setData] = useState<CertificationData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<CertificationLevel | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // State to manage modals visibility and content
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [nominationModalOpen, setNominationModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<CertificationData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(CACHE_KEY + '_time');
        const currentTime = new Date().getTime();

        if (cachedData && cacheTime && (currentTime - parseInt(cacheTime) < CACHE_EXPIRY)) {
          setData(JSON.parse(cachedData));
        } else {
          const certifications = await fetchCertifications();
          setData(certifications);
          localStorage.setItem(CACHE_KEY, JSON.stringify(certifications));
          localStorage.setItem(CACHE_KEY + '_time', currentTime.toString());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, CACHE_EXPIRY);

    return () => clearInterval(interval);
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

  const handleCardClick = (certification: CertificationData) => {
    setSelectedCertification(certification);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedCertification(null);
  };

  const handleNominateClick = () => {
    setViewModalOpen(false);
    setNominationModalOpen(true);
  };

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

        <div className={styles.CardsSection}>
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
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100vh"
              textAlign="center"
              bgcolor="white"
              p={3}
              position="fixed"
              width="100%"
              top={0}
              left={0}
            >
              <ThreeDots color="#1976d2" height={80} width={80} />
            </Box>
          ) : filteredData.length === 0 ? (
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

      {selectedCertification && (
        <CertificationCardViewModal
          open={viewModalOpen}
          onClose={handleCloseViewModal}
          certificationName={selectedCertification.certificationName}
          providerName={selectedCertification.providerName}
          level={selectedCertification.level as CertificationLevel}
          description={selectedCertification.description}
          tags={selectedCertification.tags}
          officialLink={selectedCertification.officialLink}
          nominationStatus={selectedCertification.nominationStatus}
          nominationOpenDate={selectedCertification.nominationOpenDate} 
          nominationCloseDate={selectedCertification.nominationCloseDate} 
          onNominate={handleNominateClick}
        />
      )}

      {selectedCertification && (
        <NominationFormModal
          open={nominationModalOpen}
          onClose={handleCloseNominationModal}
          id={selectedCertification.id}
          certificationName={selectedCertification.certificationName}
          nominationOpenDate={selectedCertification.nominationOpenDate} 
          nominationCloseDate={selectedCertification.nominationCloseDate} 
          nominationStatus={selectedCertification.nominationStatus}
        />
      )}
    </div>
  );
};

export default AllCertifications;
