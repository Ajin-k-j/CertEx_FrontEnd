// src/hooks/useFilterCertifications.ts
import { useState, useEffect, useCallback } from "react";
import { CertificationData } from "../types/AllCertifications.types";
import { CertificationLevel, SortOption } from "../types/AllCertifications.types";


interface UseFilterCertificationsProps {
  data: CertificationData[];
  searchQuery: string;
  selectedLevel: CertificationLevel | "all";
  sortOption: SortOption;
  selectedProviders: string[];
  selectedCategories: string[];
}

const useFilterCertifications = ({
  data,
  searchQuery,
  selectedLevel,
  sortOption,
  selectedProviders,
  selectedCategories,
}: UseFilterCertificationsProps) => {
  const [filteredData, setFilteredData] = useState<CertificationData[]>(data);

  const applyFilters = useCallback(() => {
    let result = data;

    if (searchQuery) {
      result = result.filter(item =>
        item.certificationName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLevel !== "all") {
      result = result.filter(item => item.level === selectedLevel);
    }

    if (selectedProviders.length > 0) {
      result = result.filter(item => selectedProviders.includes(item.providerName));
    }

    if (selectedCategories.length > 0) {
      result = result.filter(item =>
        item.tags.some(tag => selectedCategories.includes(tag))
      );
    }

    switch (sortOption) {
      case "latest":
        result = result.sort((a, b) => b.id - a.id);
        break;
      case "popular":
        result = result.sort((a, b) => a.views - b.views);
        break;
      case "oldest":
        result = result.sort((a, b) => a.id - b.id);
        break;
      case "A-Z":
        result = result.sort((a, b) =>
          a.certificationName.localeCompare(b.certificationName)
        );
        break;
      case "Z-A":
        result = result.sort((a, b) =>
          b.certificationName.localeCompare(a.certificationName)
        );
        break;
    }

    setFilteredData(result);
  }, [data, searchQuery, selectedLevel, sortOption, selectedProviders, selectedCategories]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return filteredData;
};

export default useFilterCertifications;
