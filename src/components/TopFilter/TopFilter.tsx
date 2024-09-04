import React from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  Box,
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  SortOption,
  CertificationLevel,
} from "../../types/AllCertifications.types";

interface TopFilterProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedLevel: CertificationLevel;
  setSelectedLevel: React.Dispatch<React.SetStateAction<CertificationLevel>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  inputHeight?: string; // Optional height property for flexibility
}

const TopFilter: React.FC<TopFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLevel,
  setSelectedLevel,
  sortOption,
  setSortOption,
  inputHeight = "2rem", // Default height if none provided
}) => {
  // Handle change for the level dropdown
  const handleLevelChange = (event: SelectChangeEvent<CertificationLevel>) => {
    setSelectedLevel(event.target.value as CertificationLevel);
  };

  // Handle change for the sort option dropdown
  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortOption(event.target.value as SortOption);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={2} // Adjust gap between filters as needed
      sx={{
        marginBottom: 1,
        width: "100%",
        flexWrap: "wrap",
        "@media (max-width:600px)": {
          flexDirection: "column", // Stack items vertically on small screens
        },
      }}
    >
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        sx={{
          backgroundColor: "#ffffff", // Set background color to white
          borderRadius: 1, // Add border radius
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none", // Remove the outline
            },
          },
          height: inputHeight, // Set height property
          flex: 1, // Allow to grow
          maxWidth: "400px", // Adjust maximum width for larger screens
          width: "100%", // Full width on small screens
          justifyContent: "center",
        }}
        placeholder="Search for certifications"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1.5}
          sx={{
            "@media (max-width:600px)": {
              flexDirection: "row",
            },
          }}
        >
          <span style={{ fontSize: "0.875rem" }}>Level</span>
          <FormControl
            size="small"
            sx={{ width: "130px", backgroundColor: "#ffffff" }}
          >
            <Select
              value={selectedLevel}
              onChange={handleLevelChange}
              sx={{
                borderRadius: 1, // Add border radius
                height: inputHeight, // Set height property
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                fontSize: "0.85rem", // Smaller font size for dropdown
                justifyContent: "center",
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Expert">Expert</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1.5}
          sx={{
            "@media (max-width:600px)": {
              flexDirection: "row",
            },
          }}
        >
          <span style={{ fontSize: "0.875rem" }}>Sort By</span>
          <FormControl
            size="small"
            sx={{ width: "130px", backgroundColor: "#ffffff" }}
          >
            <Select
              value={sortOption}
              onChange={handleSortChange}
              sx={{
                borderRadius: 1, // Add border radius
                height: inputHeight, // Set height property
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                fontSize: "0.85rem", // Smaller font size for dropdown
              }}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="popular">Popular</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="A-Z">A-Z</MenuItem>
              <MenuItem value="Z-A">Z-A</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default TopFilter;
