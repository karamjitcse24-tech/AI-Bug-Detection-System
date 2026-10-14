
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  BugReportRounded,
  CheckCircleRounded,
  PendingActionsRounded,
  PriorityHighRounded,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { getAllBugs } from "../services/bugService";

const COLORS = [
  "#22d3ee",
  "#818cf8",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
];

const panelSx = {
  p: 2.5,
  height: "100%",
  borderRadius: 3,
  bgcolor: "var(--surface, #191a20)",
  color: "var(--text, #f3f4f6)",
  border: "1px solid var(--border, #30313b)",
  boxShadow: "none",
};

const chartTooltipStyle = {
  backgroundColor: "#20212b",
  border: "1px solid #3b3d4a",
  borderRadius: 10,
  color: "#f3f4f6",
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <Paper sx={panelSx}>
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box minWidth={0}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "var(--text, #f3f4f6)", mt: 1 }}
          >
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            color,
            bgcolor: `${color}1a`,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

export default function Reports() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const response = await getAllBugs();
        const records = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        if (active) setBugs(records);
      } catch (err) {
        if (active) {
          setError(
            err?.response?.data?.message ||
              "Unable to load analytics. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const isResolved = (bug) =>
      ["resolved", "closed", "fixed", "completed"].includes(
        normalize(bug.status)
      );

    const isHighPriority = (bug) =>
      ["critical", "high"].includes(normalize(bug.severity));

    const resolved = bugs.filter(isResolved).length;
    const open = bugs.filter((bug) => !isResolved(bug)).length;
    const highPriority = bugs.filter(isHighPriority).length;

    return {
      total: bugs.length,
      resolved,
      open,
      highPriority,
      resolutionRate: bugs.length
        ? Math.round((resolved / bugs.length) * 100)
        : 0,
    };
  }, [bugs]);

  const severityData = useMemo(() => {
    const categories = [
      { key: "critical", label: "Critical" },
      { key: "high", label: "High" },
      { key: "medium", label: "Medium" },
      { key: "low", label: "Low" },
    ];

    return categories.map(({ key, label }) => ({
      name: label,
      count: bugs.filter((bug) => normalize(bug.severity) === key).length,
    }));
  }, [bugs]);

  const statusData = useMemo(() => {
    const categories = [
      { key: "open", label: "Open" },
      { key: "in progress", label: "In Progress" },
      { key: "resolved", label: "Resolved" },
      { key: "closed", label: "Closed" },
    ];

    return categories.map(({ key, label }) => ({
      name: label,
      value: bugs.filter((bug) => normalize(bug.status) === key).length,
    }));
  }, [bugs]);

  const trendData = useMemo(() => {
    const months = [];

    // Show the current month and the preceding five months.
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      date.setMonth(date.getMonth() - i);

      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        reported: 0,
        resolved: 0,
      });
    }

    bugs.forEach((bug) => {
      const created = getDate(bug.createdAt);
      if (!created) return;

      const key = `${created.getFullYear()}-${created.getMonth()}`;
      const month = months.find((item) => item.key === key);

      if (month) {
        month.reported += 1;

        const updated = getDate(bug.updatedAt);
        const status = normalize(bug.status);

        if (
          ["resolved", "closed", "fixed", "completed"].includes(status) &&
          updated &&
          updated.getFullYear() === created.getFullYear() &&
          updated.getMonth() === created.getMonth()
        ) {
          month.resolved += 1;
        }
      }
    });

    return months;
  }, [bugs]);

  if (loading) {
    return (
      <Box
        minHeight="50vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <CircularProgress />
        <Typography color="text.secondary">
          Preparing your reports...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        color: "var(--text, #f3f4f6)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box mb={3}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Reports &amp; Analytics
        </Typography>
        <Typography color="text.secondary">
          Understand bug severity, resolution progress, and reporting trends.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Bugs"
            value={stats.total}
            subtitle="Your recorded bug reports"
            icon={<BugReportRounded />}
            color="#22d3ee"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Open Bugs"
            value={stats.open}
            subtitle="Not yet resolved or closed"
            icon={<PendingActionsRounded />}
            color="#fbbf24"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Resolved"
            value={stats.resolved}
            subtitle={`${stats.resolutionRate}% resolution rate`}
            icon={<CheckCircleRounded />}
            color="#34d399"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="High Priority"
            value={stats.highPriority}
            subtitle="Critical and high severity"
            icon={<PriorityHighRounded />}
            color="#fb7185"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <Paper sx={panelSx}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Bugs by Severity
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Distribution across severity levels
            </Typography>

            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={severityData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#41424c"
                    vertical={false}
                  />
                  <XAxis dataKey="name" tick={{ fill: "#a1a1aa" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#a1a1aa" }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar
                    dataKey="count"
                    name="Bugs"
                    fill="#22d3ee"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={panelSx}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Status Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Current state of your bug reports
            </Typography>

            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={panelSx}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Reporting Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Monthly reports based on recorded creation dates
            </Typography>

            <Box height={320}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 20, left: -15, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#41424c"
                    vertical={false}
                  />
                  <XAxis dataKey="month" tick={{ fill: "#a1a1aa" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#a1a1aa" }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="reported"
                    name="Reported"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved in creation month"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {bugs.length === 0 && !error && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No bug reports are available yet. Create a bug report to start
          generating analytics.
        </Alert>
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mt: 3 }}
      >
        Analytics are calculated from the bug records returned for your
        account. Historical resolution dates are estimated from the available
        creation and update timestamps.
      </Typography>
    </Box>
  );
}
