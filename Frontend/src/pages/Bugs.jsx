
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import BugForm from "../components/BugForm";
import BugTable from "../components/BugTable";
import { getAllBugs, deleteBug } from "../services/bugService";

const severities = ["Critical", "High", "Medium", "Low"];
const statuses = ["Open", "In Progress", "Resolved", "Closed"];

export default function Bugs() {
  const [bugs, setBugs] = useState([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);

  // ================= LOAD BUGS =================

  const loadBugs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllBugs();

      if (!Array.isArray(response?.data)) {
        throw new Error("Unexpected response from the bug service.");
      }

      setBugs(response.data);
    } catch (err) {
      console.error("Failed to load bugs:", err);

      setError(
        err.response?.status === 401
          ? "Your session has expired. Please sign in again."
          : "Unable to load bug reports. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBugs();
  }, [loadBugs]);

  // ================= SEARCH AND FILTERS =================

  const filteredBugs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bugs.filter((bug) => {
      const matchesSearch =
        !query ||
        String(bug.title || "").toLowerCase().includes(query) ||
        String(bug.description || "").toLowerCase().includes(query) ||
        String(bug.id ?? "").toLowerCase().includes(query);

      const matchesSeverity =
        !severity ||
        String(bug.severity || "").toLowerCase() ===
          severity.toLowerCase();

      const matchesStatus =
        !status ||
        String(bug.status || "").toLowerCase() ===
          status.toLowerCase();

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [bugs, search, severity, status]);

  const clearFilters = () => {
    setSearch("");
    setSeverity("");
    setStatus("");
  };

  const filtersApplied = Boolean(search.trim() || severity || status);

  // ================= EDIT AND DELETE =================

  const handleEdit = (bug) => {
    setSelectedBug(bug);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) {
      return;
    }

    try {
      await deleteBug(id);
      await loadBugs();
    } catch (err) {
      console.error("Failed to delete bug:", err);

      window.alert(
        err.response?.data?.message || "Unable to delete this bug."
      );
    }
  };

  const openAddForm = () => {
    setSelectedBug(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedBug(null);
  };

  // ================= THEME STYLES =================

  const panelSx = {
    backgroundColor: "var(--surface)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: 3,
    boxShadow: "var(--shadow)",
    transition:
      "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
  };

  const headingSx = {
    color: "var(--text-h)",
    fontWeight: 800,
  };

  const secondaryTextSx = {
    color: "var(--text)",
  };

  const inputSx = {
    minWidth: 0,

    "& .MuiInputLabel-root": {
      color: "var(--text)",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--accent)",
    },

    "& .MuiOutlinedInput-root": {
      color: "var(--text-h)",
      backgroundColor: "var(--surface-secondary)",
      borderRadius: 2,

      "& fieldset": {
        borderColor: "var(--border)",
      },

      "&:hover fieldset": {
        borderColor: "var(--accent)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "var(--accent)",
      },
    },

    "& .MuiSvgIcon-root": {
      color: "var(--text)",
    },

    "& .MuiInputBase-input::placeholder": {
      color: "var(--text)",
      opacity: 0.8,
    },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: "var(--surface)",
        color: "var(--text)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",

        "& .MuiMenuItem-root:hover": {
          backgroundColor: "var(--surface-secondary)",
        },

        "& .MuiMenuItem-root.Mui-selected": {
          backgroundColor: "var(--accent-bg)",
        },

        "& .MuiMenuItem-root.Mui-selected:hover": {
          backgroundColor: "var(--accent-bg)",
        },
      },
    },
  };

  const primaryButtonSx = {
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 700,
    backgroundColor: "var(--accent)",
    color: "var(--bg)",
    boxShadow: "none",

    "&:hover": {
      backgroundColor: "var(--accent)",
      filter: "brightness(1.08)",
      boxShadow: "none",
    },
  };

  const secondaryButtonSx = {
    borderRadius: 2,
    textTransform: "none",
    color: "var(--text-h)",
    borderColor: "var(--border)",

    "&:hover": {
      borderColor: "var(--accent)",
      backgroundColor: "var(--accent-bg)",
    },
  };

  // ================= PAGE =================

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        boxSizing: "border-box",
        minWidth: 0,
        color: "var(--text)",
      }}
    >
      {/* PAGE HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              ...headingSx,
              fontWeight: 850,
              letterSpacing: "-1px",
              fontSize: { xs: "1.7rem", sm: "2.1rem" },
            }}
          >
            Bug Management
          </Typography>

          <Typography sx={{ ...secondaryTextSx, mt: 0.75 }}>
            Track, organize, update, and analyze your bug reports.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={loadBugs}
            disabled={loading}
            sx={secondaryButtonSx}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={openAddForm}
            sx={primaryButtonSx}
          >
            Add Bug
          </Button>
        </Box>
      </Box>

      {/* ADD / EDIT FORM */}

      {formOpen && (
        <Paper
          sx={{
            ...panelSx,
            p: { xs: 2, md: 3 },
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={headingSx}>
              {selectedBug ? "Update Bug Report" : "Create Bug Report"}
            </Typography>

            <Button onClick={closeForm} sx={secondaryButtonSx}>
              Cancel
            </Button>
          </Box>

          <BugForm
            selectedBug={selectedBug}
            onBugAdded={async () => {
              closeForm();
              await loadBugs();
            }}
            clearSelection={closeForm}
          />
        </Paper>
      )}

      {/* SUMMARY STRIP */}

      <Paper
        sx={{
          ...panelSx,
          p: 2.5,
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="body2" sx={secondaryTextSx}>
            Total bug reports
          </Typography>

          <Typography
            variant="h4"
            sx={{ ...headingSx, mt: 0.5 }}
          >
            {loading ? "—" : bugs.length}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "1px",
            alignSelf: "stretch",
            backgroundColor: "var(--border)",
          }}
        />

        <Box>
          <Typography variant="body2" sx={secondaryTextSx}>
            Matching results
          </Typography>

          <Typography
            variant="h4"
            sx={{ ...headingSx, mt: 0.5 }}
          >
            {loading ? "—" : filteredBugs.length}
          </Typography>
        </Box>
      </Paper>

      {/* SEARCH AND FILTERS */}

      <Paper
        sx={{
          ...panelSx,
          p: { xs: 2, md: 2.5 },
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ ...headingSx, mb: 2 }}>
          Search and Filters
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(180px, 2fr) minmax(140px, 1fr) minmax(140px, 1fr)",
            },
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Search bug reports"
            placeholder="Title, description, or ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={inputSx}
            slotProps={{
              input: {
                startAdornment: (
                  <SearchRoundedIcon
                    sx={{ mr: 1, color: "var(--text)" }}
                  />
                ),
              },
            }}
          />

          <FormControl fullWidth size="small" sx={inputSx}>
            <InputLabel id="bug-severity-label">Severity</InputLabel>

            <Select
              labelId="bug-severity-label"
              label="Severity"
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              MenuProps={menuProps}
            >
              <MenuItem value="">All Severities</MenuItem>

              {severities.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={inputSx}>
            <InputLabel id="bug-status-label">Status</InputLabel>

            <Select
              labelId="bug-status-label"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              MenuProps={menuProps}
            >
              <MenuItem value="">All Statuses</MenuItem>

              {statuses.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {filtersApplied && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Button
              startIcon={<FilterAltOffRoundedIcon />}
              onClick={clearFilters}
              sx={{
                color: "var(--accent)",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "var(--accent-bg)",
                },
              }}
            >
              Clear filters
            </Button>
          </Box>
        )}
      </Paper>

      {/* BUG TABLE */}

      <Paper
        sx={{
          ...panelSx,
          p: { xs: 1.5, sm: 2.5 },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={headingSx}>
            All Bug Reports
          </Typography>

          <Typography variant="body2" sx={secondaryTextSx}>
            {loading ? "Loading..." : `${filteredBugs.length} results`}
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: "var(--surface-secondary)",
              color: "var(--text)",
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={loadBugs}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 1.5,
              py: 7,
            }}
          >
            <CircularProgress
              sx={{ color: "var(--accent)" }}
            />

            <Typography sx={secondaryTextSx}>
              Loading bug reports...
            </Typography>
          </Box>
        ) : !error && filteredBugs.length > 0 ? (
          <Box sx={{ width: "100%", minWidth: 0 }}>
            <BugTable
              bugs={filteredBugs}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Box>
        ) : !error ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 2,
              border: "1px dashed var(--border)",
              borderRadius: 3,
              backgroundColor: "var(--surface-secondary)",
            }}
          >
            <Typography variant="h6" sx={headingSx}>
              {bugs.length === 0
                ? "No bug reports yet"
                : "No matching bugs found"}
            </Typography>

            <Typography sx={{ ...secondaryTextSx, mt: 1, mb: 2 }}>
              {bugs.length === 0
                ? "Add a bug report to get started."
                : "Try different search terms or clear your filters."}
            </Typography>

            {filtersApplied ? (
              <Button
                onClick={clearFilters}
                variant="outlined"
                sx={secondaryButtonSx}
              >
                Clear filters
              </Button>
            ) : (
              <Button
                onClick={openAddForm}
                variant="contained"
                sx={primaryButtonSx}
              >
                Add your first bug
              </Button>
            )}
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
}
