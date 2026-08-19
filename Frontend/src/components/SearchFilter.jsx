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
  const filtersApplied =
    search !== "" ||
    severity !== "" ||
    status !== "";

  const clearFilters = () => {
    setSearch("");
    setSeverity("");
    setStatus("");
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
        mb: 3,
        borderRadius: 3,
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
              color: "#1976d2",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
            }}
          >
            Search & Filter Bugs
          </Typography>
        </Box>

        {/* CLEAR FILTERS */}

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
        {/* SEARCH */}

        <TextField
          fullWidth
          label="Search Bug"
          placeholder="Search by bug title..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* SEVERITY */}

        <TextField
          fullWidth
          select
          label="Severity"
          value={severity}
          onChange={(e) =>
            setSeverity(e.target.value)
          }
        >
          <MenuItem value="">
            All Severities
          </MenuItem>

          <MenuItem value="High">
            High
          </MenuItem>

          <MenuItem value="Medium">
            Medium
          </MenuItem>

          <MenuItem value="Low">
            Low
          </MenuItem>
        </TextField>

        {/* STATUS */}

        <TextField
          fullWidth
          select
          label="Status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <MenuItem value="">
            All Statuses
          </MenuItem>

          <MenuItem value="Open">
            Open
          </MenuItem>

          <MenuItem value="Closed">
            Closed
          </MenuItem>
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
            backgroundColor: "#f5f7fa",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Active filters:

            {search &&
              ` Search "${search}"`}

            {severity &&
              ` • Severity: ${severity}`}

            {status &&
              ` • Status: ${status}`}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default SearchFilter;