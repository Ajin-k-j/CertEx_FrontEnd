import React from "react";
import Chip from "@mui/material/Chip";
import styles from "./FilterChips.module.css";
import { CertificationLevel, SortOption } from "../../types/AllCertifications.types";
interface FilterChipsProps {
  searchQuery: string;
  selectedLevel:CertificationLevel | "all" ;
  sortOption: SortOption;
  selectedProviders: string[];
  selectedCategories: string[];
  removeFilter: (filterType: string, value: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  searchQuery,
  selectedLevel,
  sortOption,
  selectedProviders,
  selectedCategories,
  removeFilter,
}) => {
  return (
    <div className={styles.container}>
      {searchQuery && (
        <Chip
          label={`Search: ${searchQuery}`}
          onDelete={() => removeFilter("searchQuery", searchQuery)}
          style={{ margin: 4 }}
        />
      )}
      {selectedLevel !== "all" && (
        <Chip
          label={`Level: ${selectedLevel}`}
          onDelete={() => removeFilter("selectedLevel", selectedLevel)}
          style={{ margin: 4 }}
        />
      )}
      {sortOption !== "latest" && (
        <Chip
          label={`Sort: ${sortOption}`}
          onDelete={() => removeFilter("sortOption", sortOption)}
          style={{ margin: 4 }}
        />
      )}
      {selectedProviders.map((provider) => (
        <Chip
          key={provider}
          label={`Provider: ${provider}`}
          onDelete={() => removeFilter("selectedProviders", provider)}
          style={{ margin: 4 }}
        />
      ))}
      {selectedCategories.map((category) => (
        <Chip
          key={category}
          label={`Category: ${category}`}
          onDelete={() => removeFilter("selectedCategories", category)}
          style={{ margin: 4 }}
        />
      ))}
    </div>
  );
};

export default FilterChips;
