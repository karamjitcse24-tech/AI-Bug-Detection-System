
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import DashboardCards from "../components/DashboardCards";
import Charts from "../components/Charts";
import BugForm from "../components/BugForm";
import BugTable from "../components/BugTable";
import { getAllBugs, deleteBug } from "../services/bugService";

const severityColor = (severity) => {
  const value = String(severity || "").toLowerCase();

  if (value === "critical") return "error";
  if (value === "high") return "warning";
  if (value === "medium") return "info";
  if (value === "low") return "success";

  return "default";
};

function SectionHeading({ title, subtitle, action }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedBug, setSelectedBug] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const loadBugs = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await getAllBugs();

      if (!Array.isArray(response?.data)) {
        throw new Error("Unexpected bug report response.");
      }

      setBugs(response.data);
    } catch (error) {
      console.error("Unable to load bugs:", error);

      setLoadError(
        error.response?.status === 401
          ? "Your session has expired. Please log in again."
          : "Could not load bug reports. Check the backend connection and retry."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBugs();
  }, [loadBugs]);

  const handleEdit = (bug) => {
    setSelectedBug(bug);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;

    try {
      await deleteBug(id);
      await loadBugs();
    } catch (error) {
      console.error("Unable to delete bug:", error);
      window.alert(
        error.response?.data?.message || "Could not delete this bug."
      );
    }
  };

  const handleAddBug = () => {
    setSelectedBug(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "Developer";

  const isClosed = (bug) =>
    ["closed", "resolved", "fixed", "completed"].includes(
      String(bug.status || "").toLowerCase()
    );

  const openCount = bugs.filter((bug) => !isClosed(bug)).length;

  const highPriorityCount = bugs.filter((bug) =>
    ["critical", "high"].includes(String(bug.severity || "").toLowerCase())
  ).length;

  const resolvedCount = bugs.filter(isClosed).length;

  const panelSx = {
    p: { xs: 2, sm: 2.5, md: 3 },
    height: "100%",
    minWidth: 0,
    borderRadius: 3,
    bgcolor: "var(--surface, #191a20)",
    color: "var(--text-h, #f4f5f8)",
    border: "1px solid var(--border, #30313b)",
    boxShadow: "none",
  };

  const metricCards = [
    {
      title: "Total Bugs",
      value: bugs.length,
      description: "All reported issues",
      icon: BugReportOutlinedIcon,
      color: "#7c8cff",
    },
    {
      title: "Open Bugs",
      value: openCount,
      description: "Awaiting resolution",
      icon: ErrorOutlineRoundedIcon,
      color: "#f4b860",
    },
    {
      title: "Resolved Bugs",
      value: resolvedCount,
      description: "Completed or fixed",
      icon: TaskAltRoundedIcon,
      color: "#39c6a5",
    },
    {
      title: "High Priority",
      value: highPriorityCount,
      description: "Critical and high severity",
      icon: TrendingUpRoundedIcon,
      color: "#f1788b",
    },
  ];

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
      {/* Page heading */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
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
              fontSize: { xs: "1.65rem", sm: "2rem", md: "2.25rem" },
            }}
          >
            Dashboard
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Welcome back, {displayName}. Here's your project overview.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
            onClick={handleAddBug}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              background: "#31b8c6",
              color: "#071316",
              boxShadow: "none",
              "&:hover": { background: "#54d0dc", boxShadow: "none" },
            }}
          >
            Add Bug
          </Button>
        </Box>
      </Box>

      {loadError && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={loadBugs}>
              Retry
            </Button>
          }
        >
          {loadError}
        </Alert>
      )}

      {/* Existing add/edit form */}
      {showForm && (
        <Paper sx={{ ...panelSx, mb: 3 }}>
          <SectionHeading
            title={selectedBug ? "Update Bug Report" : "Create Bug Report"}
            subtitle="Enter the issue details and use AI analysis if needed."
            action={
              <Button
                onClick={() => {
                  setShowForm(false);
                  setSelectedBug(null);
                }}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            }
          />

          <BugForm
            onBugAdded={async () => {
              setShowForm(false);
              setSelectedBug(null);
              await loadBugs();
            }}
            selectedBug={selectedBug}
            clearSelection={() => {
              setSelectedBug(null);
              setShowForm(false);
            }}
          />
        </Paper>
      )}

      {/* Summary metrics */}
      <SectionHeading
        title="Project Overview"
        subtitle="A snapshot of your current bug reports"
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : !loadError ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {metricCards.map((metric) => {
            const Icon = metric.icon;

            return (
              <Grid key={metric.title} size={{ xs: 12, sm: 6, xl: 3 }}>
                <Paper
                  sx={{
                    ...panelSx,
                    p: 2.5,
                    transition: "transform 160ms ease, border-color 160ms ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: metric.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: { xs: 30, md: 36 },
                          fontWeight: 850,
                          lineHeight: 1.2,
                        }}
                      >
                        {metric.value}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        width: 46,
                        height: 46,
                        borderRadius: 2.5,
                        color: metric.color,
                        bgcolor: `${metric.color}1A`,
                      }}
                    >
                      <Icon sx={{ fontSize: 25 }} />
                    </Box>
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 2 }}
                  >
                    {metric.description}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : null}

      {/* Analytics */}
      <SectionHeading
        title="Bug Analytics"
        subtitle="Understand issue severity and resolution status"
        action={
          <Button
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate("/reports")}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            View Reports
          </Button>
        }
      />

      {!loading && !loadError && (
        <Paper sx={{ ...panelSx, mb: 3 }}>
          <Charts bugs={bugs} />
        </Paper>
      )}

      {/* Recent bugs */}
      <Paper sx={{ ...panelSx, mb: 3 }}>
        <SectionHeading
          title="Recent Bug Reports"
          subtitle="Review and manage the latest issues"
          action={
            <Button
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate("/bugs")}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              View All Bugs
            </Button>
          }
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : loadError ? (
          <Typography color="text.secondary">
            Reports will appear when the connection is restored.
          </Typography>
        ) : bugs.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <BugReportOutlinedIcon
              sx={{ fontSize: 42, color: "text.secondary", mb: 1 }}
            />
            <Typography sx={{ fontWeight: 700 }}>
              No bug reports yet
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
              Create your first report to populate your dashboard.
            </Typography>
            <Button variant="contained" onClick={handleAddBug}>
              Add your first bug
            </Button>
          </Box>
        ) : (
          <Box sx={{ minWidth: 0, overflowX: "auto" }}>
            <BugTable
              bugs={[...bugs]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                )
                .slice(0, 5)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Box>
        )}
      </Paper>

      {/* Severity legend */}
      {!loading && bugs.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {["Critical", "High", "Medium", "Low"].map((level) => (
            <Chip
              key={level}
              label={level}
              size="small"
              color={severityColor(level)}
              variant="outlined"
            />
          ))}
        </Box>
      )}

      {/* Keep the existing DashboardCards component available for reuse
          while the dedicated Bugs page is built. */}
      <Box sx={{ display: "none" }}>
        <DashboardCards bugs={bugs} />
      </Box>
    </Box>
  );
}

export default Dashboard;
