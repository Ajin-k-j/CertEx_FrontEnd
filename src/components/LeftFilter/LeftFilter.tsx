import React, { useEffect, useState } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import CheckboxFilter from "../CheckboxFilter/CheckboxFilter";
import { fetchProviders } from "../../api/FetchProviderApi";
import { fetchCategories } from "../../api/FetchCategoriesApi";

interface Provider {
  id: string;
  providerName: string;
}

interface Category {
  id: string;
  categoryTagName: string;
}

interface LeftFilterProps {
  selectedProviders: string[];
  setSelectedProviders: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  clearAllFilters: () => void;
}

const LeftFilter: React.FC<LeftFilterProps> = ({
  selectedProviders,
  setSelectedProviders,
  selectedCategories,
  setSelectedCategories,
  clearAllFilters,
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingProviders(true);
        const providerData = await fetchProviders();
        setProviders(providerData);
        setLoadingProviders(false);

        setLoadingCategories(true);
        const categoryData = await fetchCategories();
        setCategories(categoryData);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching providers/categories:", error);
        setLoadingProviders(false);
        setLoadingCategories(false);
      }
    };

    getData();
  }, []);

  const handleClearAll = () => {
    setSelectedProviders([]);
    setSelectedCategories([]);
    clearAllFilters();
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        padding: 2,
        paddingLeft:3,
        paddingRight: 3, 
        borderRadius: 1, // Optional: Add rounded corners
        height: "auto", // Ensure it takes full height of the parent container
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" component="div">
          Filters
        </Typography>
        <Typography
          variant="body2"
          component="span"
          style={{
            color: "blue",
            marginLeft: "8px",
            cursor: "pointer",
          }}
          onClick={handleClearAll}
        >
          Clear All
        </Typography>
      </Box>

      <div>
        <h4>Providers</h4>
        {loadingProviders ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={100}
          >
            <CircularProgress size={50} color="primary" />
          </Box>
        ) : (
          <CheckboxFilter
            items={providers.map((provider) => provider.providerName)}
            selectedItems={selectedProviders}
            setSelectedItems={setSelectedProviders}
            placeholder="Search Providers"
          />
        )}
      </div>
      <div>
        <h4>Categories</h4>
        {loadingCategories ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={100}
          >
            <CircularProgress size={50} color="primary" />
          </Box>
        ) : (
          <CheckboxFilter
            items={categories.map((category) => category.categoryTagName)}
            selectedItems={selectedCategories}
            setSelectedItems={setSelectedCategories}
            placeholder="Search Categories"
          />
        )}
      </div>
    </Box>
  );
};

export default LeftFilter;
