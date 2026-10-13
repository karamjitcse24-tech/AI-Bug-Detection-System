
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
        String(bug.status || "").toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [bugs, search, severity, status]);

  const clearFilters = () => {
    setSearch("");
    setSeverity("");
    setStatus("");
  };

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

  const panelSx = {
    background: "var(--surface, #191a20)",
    color: "var(--text-h, #f5f5f5)",
    border: "1px solid var(--border, #303039)",
    borderRadius: 3,
    boxShadow: "none",
  };

  const inputSx = {
    minWidth: 0,
    "& .MuiOutlinedInput-root": {
      color: "var(--text-h, #f5f5f5)",
      background: "var(--surface-secondary, #222229)",
      borderRadius: 2,
      "& fieldset": {
        borderColor: "var(--border, #303039)",
      },
      "&:hover fieldset": {
        borderColor: "#35c6d2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#35c6d2",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--text, #a5a5b0)",
    },
    "& .MuiSvgIcon-root": {
      color: "var(--text, #a5a5b0)",
    },
  };

  const filtersApplied = Boolean(search.trim() || severity || status);

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
      }}
    >
      {/* Page header */}
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
              fontWeight: 850,
              letterSpacing: "-1px",
              fontSize: { xs: "1.7rem", sm: "2.1rem" },
            }}
          >
            Bug Management
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Track, organize, update, and analyze your bug reports.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={loadBugs}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={openAddForm}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              background: "#31b8c6",
              color: "#071316",
              boxShadow: "none",
              "&:hover": {
                background: "#54d0dc",
                boxShadow: "none",
              },
            }}
          >
            Add Bug
          </Button>
        </Box>
      </Box>

      {/* Add/edit form */}
      {formOpen && (
        <Paper sx={{ ...panelSx, p: { xs: 2, md: 3 }, mb: 3 }}>
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
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {selectedBug ? "Update Bug Report" : "Create Bug Report"}
            </Typography>

            <Button
              onClick={() => {
                setFormOpen(false);
                setSelectedBug(null);
              }}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
          </Box>

          <BugForm
            selectedBug={selectedBug}
            onBugAdded={async () => {
              setFormOpen(false);
              setSelectedBug(null);
              await loadBugs();
            }}
            clearSelection={() => {
              setFormOpen(false);
              setSelectedBug(null);
            }}
          />
        </Paper>
      )}

      {/* Summary strip */}
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
          <Typography variant="body2" color="text.secondary">
            Total bug reports
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {loading ? "—" : bugs.length}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "1px",
            alignSelf: "stretch",
            background: "var(--border, #303039)",
          }}
        />

        <Box>
          <Typography variant="body2" color="text.secondary">
            Matching results
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {loading ? "—" : filteredBugs.length}
          </Typography>
        </Box>
      </Paper>

      {/* Search and filters */}
      <Paper
        sx={{
          ...panelSx,
          p: { xs: 2, md: 2.5 },
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
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
                    sx={{ mr: 1, color: "text.secondary" }}
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              startIcon={<FilterAltOffRoundedIcon />}
              onClick={clearFilters}
              sx={{ textTransform: "none" }}
            >
              Clear filters
            </Button>
          </Box>
        )}
      </Paper>

      {/* Bug table */}
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
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            All Bug Reports
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {loading ? "Loading..." : `${filteredBugs.length} results`}
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={loadBugs}>
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
            <CircularProgress />
            <Typography color="text.secondary">
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
          <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {bugs.length === 0
                ? "No bug reports yet"
                : "No matching bugs found"}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {bugs.length === 0
                ? "Add a bug report to get started."
                : "Try different search terms or clear your filters."}
            </Typography>

            {filtersApplied ? (
              <Button onClick={clearFilters} variant="outlined">
                Clear filters
              </Button>
            ) : (
              <Button onClick={openAddForm} variant="contained">
                Add your first bug
              </Button>
            )}
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
}
