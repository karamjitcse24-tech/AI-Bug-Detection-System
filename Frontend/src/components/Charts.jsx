
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { Box, Paper, Typography } from "@mui/material";

function Charts({ bugs = [] }) {
  // ================= SEVERITY DATA =================

  const severityData = [
    {
      name: "Critical",
      value: bugs.filter((bug) => bug.severity === "Critical").length,
    },
    {
      name: "High",
      value: bugs.filter((bug) => bug.severity === "High").length,
    },
    {
      name: "Medium",
      value: bugs.filter((bug) => bug.severity === "Medium").length,
    },
    {
      name: "Low",
      value: bugs.filter((bug) => bug.severity === "Low").length,
    },
  ];

  // ================= STATUS DATA =================

  const statusData = [
    {
      name: "Open",
      value: bugs.filter((bug) => bug.status === "Open").length,
    },
    {
      name: "In Progress",
      value: bugs.filter((bug) => bug.status === "In Progress").length,
    },
    {
      name: "Resolved",
      value: bugs.filter((bug) => bug.status === "Resolved").length,
    },
    {
      name: "Closed",
      value: bugs.filter((bug) => bug.status === "Closed").length,
    },
  ];

  // ================= CHART COLORS =================

  const severityColors = [
    "#C084FC", // Critical
    "#F87171", // High
    "#FBBF24", // Medium
    "#34D399", // Low
  ];

  const statusBarColor = "var(--accent, #22D3C5)";

  // ================= THEME-AWARE CHART STYLES =================

  const chartPaperStyle = {
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    minHeight: 390,
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "var(--surface)",
    color: "var(--text-h)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    transition:
      "background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease",
  };

  const axisColor = "var(--text)";
  const gridColor = "var(--border)";

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "8px",
      color: "var(--text-h)",
    },
    labelStyle: {
      color: "var(--text-h)",
    },
    itemStyle: {
      color: "var(--text)",
    },
  };

  const legendStyle = {
    color: "var(--text)",
    fontSize: 13,
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 1fr",
        },
        gap: 3,
        width: "100%",
        mb: 4,
      }}
    >
      {/* ================= BUG SEVERITY CHART ================= */}

      <Paper elevation={0} sx={chartPaperStyle}>
        <Typography
          variant="h6"
          align="center"
          fontWeight="bold"
          sx={{
            mb: 1,
            color: "var(--text-h)",
          }}
        >
          Bug Severity
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mb: 1,
            color: "var(--text)",
          }}
        >
          Distribution of bugs by severity
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={105}
                innerRadius={45}
                paddingAngle={3}
                label={({ name, value }) =>
                  value > 0 ? `${name}: ${value}` : ""
                }
                labelLine={{ stroke: axisColor }}
              >
                {severityData.map((entry, index) => (
                  <Cell
                    key={`severity-${index}`}
                    fill={severityColors[index]}
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip {...tooltipStyle} />

              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={legendStyle}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* ================= BUG STATUS CHART ================= */}

      <Paper elevation={0} sx={chartPaperStyle}>
        <Typography
          variant="h6"
          align="center"
          fontWeight="bold"
          sx={{
            mb: 1,
            color: "var(--text-h)",
          }}
        >
          Bug Status
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mb: 1,
            color: "var(--text)",
          }}
        >
          Current status of reported bugs
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusData}
              margin={{
                top: 20,
                right: 20,
                left: 5,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: axisColor }}
                tickLine={{ stroke: gridColor }}
                axisLine={{ stroke: gridColor }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: axisColor }}
                tickLine={{ stroke: gridColor }}
                axisLine={{ stroke: gridColor }}
              />

              <Tooltip {...tooltipStyle} />

              <Legend wrapperStyle={legendStyle} />

              <Bar
                dataKey="value"
                name="Number of Bugs"
                fill={statusBarColor}
                radius={[8, 8, 0, 0]}
                barSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}

export default Charts;
