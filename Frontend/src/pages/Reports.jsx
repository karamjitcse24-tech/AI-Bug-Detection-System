
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

// ================= CHART COLORS =================

const COLORS = [
  "#22d3ee",
  "#818cf8",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
];

// ================= THEME STYLES =================

const panelSx = {
  p: 2.5,
  height: "100%",
  minWidth: 0,
  borderRadius: 3,
  backgroundColor: "var(--surface)",
  color: "var(--text)",
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow)",
  transition:
    "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
};

const chartTextStyle = {
  fill: "var(--text)",
  fontSize: 12,
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getDate(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function isResolvedBug(bug) {
  return ["resolved", "closed", "fixed", "completed"].includes(
    normalize(bug.status)
  );
}

// ================= STATISTICS CARD =================

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <Paper sx={panelSx}>
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box minWidth={0}>
          <Typography
            variant="body2"
            sx={{ color: "var(--text)" }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "var(--text-h)", mt: 1 }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "var(--text)" }}
          >
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

// ================= CHART PANEL =================

function ChartPanel({ title, subtitle, children, height = 300 }) {
  return (
    <Paper sx={panelSx}>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{ color: "var(--text-h)" }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        mb={2}
        sx={{ color: "var(--text)" }}
      >
        {subtitle}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height,
          minWidth: 0,
          minHeight: height,
          position: "relative",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

// ================= REPORTS PAGE =================

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

        if (active) {
          setBugs(records);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.response?.data?.message ||
              "Unable to load analytics. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  // ================= SUMMARY STATISTICS =================

  const stats = useMemo(() => {
    const resolved = bugs.filter(isResolvedBug).length;
    const open = bugs.length - resolved;

    const highPriority = bugs.filter((bug) =>
      ["critical", "high"].includes(normalize(bug.severity))
    ).length;

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

  // ================= SEVERITY DATA =================

  const severityData = useMemo(() => {
    const categories = [
      { key: "critical", label: "Critical" },
      { key: "high", label: "High" },
      { key: "medium", label: "Medium" },
      { key: "low", label: "Low" },
    ];

    return categories.map(({ key, label }) => ({
      name: label,
      count: bugs.filter(
        (bug) => normalize(bug.severity) === key
      ).length,
    }));
  }, [bugs]);

  // ================= STATUS DATA =================

  const statusData = useMemo(() => {
    const categories = [
      { key: "open", label: "Open" },
      { key: "in progress", label: "In Progress" },
      { key: "resolved", label: "Resolved" },
      { key: "closed", label: "Closed" },
    ];

    return categories.map(({ key, label }) => ({
      name: label,
      value: bugs.filter(
        (bug) => normalize(bug.status) === key
      ).length,
    }));
  }, [bugs]);

  // ================= REPORTING TREND =================

  const trendData = useMemo(() => {
    const months = [];

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

      if (!month) return;

      month.reported += 1;

      const updated = getDate(bug.updatedAt);

      if (
        isResolvedBug(bug) &&
        updated &&
        updated.getFullYear() === created.getFullYear() &&
        updated.getMonth() === created.getMonth()
      ) {
        month.resolved += 1;
      }
    });

    return months;
  }, [bugs]);

  // ================= LOADING STATE =================

  if (loading) {
    return (
      <Box
        minHeight="50vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ color: "var(--text)" }}
      >
        <CircularProgress sx={{ color: "var(--accent)" }} />

        <Typography sx={{ color: "var(--text)" }}>
          Preparing your reports...
        </Typography>
      </Box>
    );
  }

  // ================= PAGE UI =================

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        color: "var(--text)",
      }}
    >
      {/* PAGE HEADER */}

      <Box mb={3}>
        <Typography
          variant="h4"
          fontWeight={800}
          gutterBottom
          sx={{
            color: "var(--text-h)",
            overflowWrap: "anywhere",
          }}
        >
          Reports &amp; Analytics
        </Typography>

        <Typography sx={{ color: "var(--text)" }}>
          Understand bug severity, resolution progress, and reporting trends.
        </Typography>
      </Box>

      {/* ERROR MESSAGE */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* STATISTICS */}

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

      {/* CHARTS */}

      <Grid container spacing={2.5}>
        {/* BUGS BY SEVERITY */}

        <Grid item xs={12} lg={6}>
          <ChartPanel
            title="Bugs by Severity"
            subtitle="Distribution across severity levels"
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={200}
            >
              <BarChart
                data={severityData}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={chartTextStyle}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={{ stroke: "var(--border)" }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={chartTextStyle}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={{ stroke: "var(--border)" }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    color: "var(--text-h)",
                  }}
                  labelStyle={{ color: "var(--text-h)" }}
                  itemStyle={{ color: "var(--text)" }}
                  cursor={{ fill: "var(--accent-bg)" }}
                />

                <Bar
                  dataKey="count"
                  name="Bugs"
                  fill="var(--accent)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </Grid>

        {/* STATUS DISTRIBUTION */}

        <Grid item xs={12} lg={6}>
          <ChartPanel
            title="Status Distribution"
            subtitle="Current state of your bug reports"
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={200}
            >
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius="70%"
                  innerRadius="42%"
                  paddingAngle={3}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    color: "var(--text-h)",
                  }}
                  labelStyle={{ color: "var(--text-h)" }}
                  itemStyle={{ color: "var(--text)" }}
                />

                <Legend
                  wrapperStyle={{
                    color: "var(--text)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        </Grid>

        {/* REPORTING TREND */}

        <Grid item xs={12}>
          <ChartPanel
            title="Reporting Trend"
            subtitle="Monthly reports based on recorded creation dates"
            height={320}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={200}
            >
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 20, left: -15, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={chartTextStyle}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={{ stroke: "var(--border)" }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={chartTextStyle}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={{ stroke: "var(--border)" }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    color: "var(--text-h)",
                  }}
                  labelStyle={{ color: "var(--text-h)" }}
                  itemStyle={{ color: "var(--text)" }}
                />

                <Legend
                  wrapperStyle={{
                    color: "var(--text)",
                    fontSize: 12,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="reported"
                  name="Reported"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved in creation month"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        </Grid>
      </Grid>

      {/* EMPTY STATE */}

      {bugs.length === 0 && !error && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No bug reports are available yet. Create a bug report to start
          generating analytics.
        </Alert>
      )}

      {/* FOOTNOTE */}

      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 3, color: "var(--text)" }}
      >
        Analytics are calculated from the bug records returned for your
        account. Historical resolution dates are estimated from the available
        creation and update timestamps.
      </Typography>
    </Box>
  );
}
