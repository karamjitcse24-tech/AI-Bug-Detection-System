
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  Typography,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

function SearchFilter({
  search,
  setSearch,
  severity,
  setSeverity,
  status,
  setStatus,
}) {
  // ================= CHECK ACTIVE FILTERS =================

  const filtersApplied =
    search.trim() !== "" ||
    severity !== "" ||
    status !== "";

  // ================= CLEAR FILTERS =================

  const clearFilters = () => {
    setSearch("");
    setSeverity("");
    setStatus("");
  };

  // ================= THEME-AWARE INPUT STYLES =================

  const inputStyles = {
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
    "& .MuiInputBase-input::placeholder": {
      color: "var(--text)",
      opacity: 0.8,
    },
    "& .MuiSelect-icon": {
      color: "var(--text)",
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
        mb: 3,
        borderRadius: 3,
        backgroundColor: "var(--surface)",
        color: "var(--text-h)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
        transition:
          "background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FilterListIcon
            sx={{
              color: "var(--accent)",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "var(--text-h)",
            }}
          >
            Search & Filter Bugs
          </Typography>
        </Box>

        {/* ================= CLEAR FILTERS ================= */}

        {filtersApplied && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* ================= FILTERS ================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "2fr 1fr 1fr",
          },
          gap: 2,
        }}
      >
        {/* ================= SEARCH ================= */}

        <TextField
          fullWidth
          label="Search Bug"
          placeholder="Search by bug title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "var(--text)" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* ================= SEVERITY ================= */}

        <TextField
          fullWidth
          select
          label="Severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          sx={inputStyles}
        >
          <MenuItem value="">All Severities</MenuItem>
          <MenuItem value="Critical">Critical</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>

        {/* ================= STATUS ================= */}

        <TextField
          fullWidth
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={inputStyles}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
          <MenuItem value="Closed">Closed</MenuItem>
        </TextField>
      </Box>

      {/* ================= ACTIVE FILTER INFO ================= */}

      {filtersApplied && (
        <Box
          sx={{
            mt: 2,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            backgroundColor: "var(--surface-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "var(--text)",
              overflowWrap: "anywhere",
            }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                color: "var(--text-h)",
              }}
            >
              Active filters:
            </Box>

            {search.trim() !== "" && ` Search "${search.trim()}"`}
            {severity && ` • Severity: ${severity}`}
            {status && ` • Status: ${status}`}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default SearchFilter;
