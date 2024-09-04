import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Chip,
  Autocomplete,
  IconButton,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  fetchProvidersjson,
  createProviderjson,
} from "../../api/FetchProviderApi";
import {
  fetchCategoriesjson,
  createCategoryjson,
} from "../../api/FetchCategoriesApi";
import {
  submitCertification,
  updateCertification,
} from "../../api/AllCertificationsApi";
import { showToast } from "../../utils/toastUtils";

interface Provider {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface CertificationFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
}

const CertificationFormModal: React.FC<CertificationFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const theme = useTheme();
  const [certificationName, setCertificationName] = useState(
    initialValues.certification_name || ""
  );
  const [description, setDescription] = useState(
    initialValues.description || ""
  );
  const [criticality, setCriticality] = useState(initialValues.critical || "");
  const [officialLink, setOfficialLink] = useState(
    initialValues.official_link || ""
  );
  const [provider, setProvider] = useState<Provider | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [nominationStatus, setNominationStatus] = useState(
    initialValues.nomination_status || ""
  );
  const [nominationOpenDate, setNominationOpenDate] =
    useState<dayjs.Dayjs | null>(
      initialValues.nomination_open_date
        ? dayjs(initialValues.nomination_open_date)
        : null
    );
  const [nominationCloseDate, setNominationCloseDate] =
    useState<dayjs.Dayjs | null>(
      initialValues.nomination_close_date
        ? dayjs(initialValues.nomination_close_date)
        : null
    );
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Tag[]>([]);
  const [openCreateProviderModal, setOpenCreateProviderModal] = useState(false);
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false);
  const [newProvider, setNewProvider] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await fetchProvidersjson();
        setProviders(data);
        if (initialValues.provider) {
          const provider = data.find((p) => p.name === initialValues.provider);
          setProvider(provider || null);
        }
      } catch (error) {
        showToast("Failed to load providers", "error");
      }
    };

    const loadCategories = async () => {
      try {
        const data = await fetchCategoriesjson();
        setCategories(data);
        if (initialValues.tags) {
          const selectedTags = data.filter((c) =>
            initialValues.tags.includes(c.name)
          );
          setTags(selectedTags);
        }
      } catch (error) {
        showToast("Failed to load categories", "error");
      }
    };

    loadProviders();
    loadCategories();
  }, [initialValues.provider, initialValues.tags]);

  const handleCriticalityChange = (event: SelectChangeEvent<string>) => {
    setCriticality(event.target.value as string);
  };

  const handleNominationStatusChange = (event: SelectChangeEvent<string>) => {
    setNominationStatus(event.target.value as string);
  };

  const handleProviderChange = (
    event: React.SyntheticEvent,
    newValue: Provider | null
  ) => {
    setProvider(newValue);
  };

  const handleTagChange = (event: React.SyntheticEvent, value: Tag[]) => {
    if (value.length > 6) {
      showToast("Only 6 tags allowed", "error");
      return;
    }
    setTags(value);
  };

  const handleCreateProvider = async () => {
    try {
      const createdProvider = await createProviderjson(newProvider);
      setProviders([...providers, createdProvider]);
      setProvider(createdProvider);
      setNewProvider("");
      setOpenCreateProviderModal(false);
      showToast("Provider created successfully!", "success");
    } catch (error) {
      showToast("Failed to create provider", "error");
    }
  };

  const handleCreateCategory = async () => {
    try {
      const createdCategory = await createCategoryjson(newCategory);
      setCategories([...categories, createdCategory]);
      setTags([...tags, createdCategory]);
      setNewCategory("");
      setOpenCreateCategoryModal(false);
      showToast("Category created successfully!", "success");
    } catch (error) {
      showToast("Failed to create category", "error");
    }
  };

  const validateForm = () => {
    if (
      !certificationName ||
      !description ||
      !criticality ||
      !officialLink ||
      !nominationStatus
    ) {
      return false;
    }

    if (!provider) {
      return false;
    }

    if (tags.length === 0) {
      return false;
    }

    if (nominationStatus === "Accepting") {
      if (!nominationOpenDate || !nominationCloseDate) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    const values = {
      certification_name: certificationName,
      description,
      critical: criticality,
      official_link: officialLink,
      provider: provider?.name || "",
      tags: tags.map((tag) => tag.name),
      nomination_status: nominationStatus,
      nomination_open_date: nominationOpenDate?.toISOString() || null,
      nomination_close_date: nominationCloseDate?.toISOString() || null,
    };

    try {
      if (initialValues.id) {
        await updateCertification(initialValues.id, values); // Update existing certification
      } else {
        await submitCertification(values); // Create new certification
      }
      onSubmit(values);
      showToast("Certification submitted successfully!", "success");
    } catch (error) {
      showToast("Failed to submit certification", "error");
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
          <DialogTitle>
            {initialValues.id ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Certification Name"
                value={certificationName}
                onChange={(e) => setCertificationName(e.target.value)}
                fullWidth
                required
                InputLabelProps={{
                  style: {
                    backgroundColor: "white",
                    padding: "0 4px",
                    marginTop: "5px", // Add margin to avoid overlap
                  },
                }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                required
                InputLabelProps={{
                  style: {
                    backgroundColor: "white",
                    padding: "0 4px",
                  },
                }}
              />
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{ backgroundColor: "white", padding: "0 4px" }}
                  >
                    Criticality
                  </InputLabel>
                  <Select
                    value={criticality}
                    required
                    onChange={handleCriticalityChange}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Official Link"
                  value={officialLink}
                  onChange={(e) => setOfficialLink(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{
                    style: {
                      backgroundColor: "white",
                      padding: "0 4px",
                    },
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexGrow={1}
                >
                  <Autocomplete
                    sx={{ width: "25vw" }}
                    options={providers}
                    value={provider}
                    required
                    onChange={handleProviderChange}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Provider"
                        fullWidth
                        InputLabelProps={{
                          style: { backgroundColor: "white", padding: "0 4px" },
                        }}
                      />
                    )}
                  />
                  <IconButton onClick={() => setOpenCreateProviderModal(true)}>
                    <AddIcon />
                  </IconButton>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexGrow={1}
                >
                  <Autocomplete
                    sx={{ width: "25vw" }}
                    multiple
                    options={categories}
                    value={tags}
                    required
                    onChange={handleTagChange}
                    getOptionLabel={(option) => option.name || ""}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.name}
                          {...getTagProps({ index })}
                          sx={{ backgroundColor: theme.palette.grey[300] }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categories"
                        fullWidth
                        InputLabelProps={{
                          style: { backgroundColor: "white", padding: "0 4px" },
                        }}
                      />
                    )}
                  />
                  <IconButton onClick={() => setOpenCreateCategoryModal(true)}>
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ width: "30vw" }} required>
                  <InputLabel
                    sx={{ backgroundColor: "white", padding: "0 4px" }}
                  >
                    Nomination Status
                  </InputLabel>
                  <Select
                    value={nominationStatus}
                    required
                    onChange={handleNominationStatusChange}
                  >
                    <MenuItem value="Accepting">Accepting</MenuItem>
                    <MenuItem value="Not Accepting">Not Accepting</MenuItem>
                    <MenuItem value="Always Accepting">
                      Always Accepting
                    </MenuItem>
                  </Select>
                </FormControl>
                {nominationStatus === "Accepting" && (
                  <Stack direction="row" spacing={2}>
                    <DatePicker
                      label="Nomination Open Date"
                      value={nominationOpenDate}
                      onChange={(newValue) => setNominationOpenDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              backgroundColor: "white",
                              padding: "0 4px",
                            },
                          }}
                        />
                      )}
                    />
                    <DatePicker
                      label="Nomination Close Date"
                      value={nominationCloseDate}
                      onChange={(newValue) => setNominationCloseDate(newValue)}
                      minDate={nominationOpenDate}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              backgroundColor: "white",
                              padding: "0 4px",
                            },
                          }}
                        />
                      )}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                padding: 1,
                marginLeft: "auto",
                marginRight: 2,
              }}
              disabled={!validateForm()}
            >
              {initialValues.id ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
      <Dialog
        open={openCreateProviderModal}
        onClose={() => setOpenCreateProviderModal(false)}
        fullWidth
      >
        <DialogTitle>Create Provider</DialogTitle>
        <DialogContent>
          <TextField
            label="Provider Name"
            value={newProvider}
            onChange={(e) => setNewProvider(e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              style: {
                backgroundColor: "white",
                padding: "0 4px",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCreateProviderModal(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleCreateProvider} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCreateCategoryModal}
        onClose={() => setOpenCreateCategoryModal(false)}
        fullWidth
      >
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              style: {
                backgroundColor: "white",
                padding: "0 4px",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCreateCategoryModal(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleCreateCategory} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CertificationFormModal;
