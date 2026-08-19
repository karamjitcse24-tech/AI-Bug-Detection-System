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

function Charts({ bugs }) {
  // ================= SEVERITY DATA =================

  const severityData = [
    {
      name: "High",
      value: bugs.filter(
        (bug) => bug.severity === "High"
      ).length,
    },
    {
      name: "Medium",
      value: bugs.filter(
        (bug) => bug.severity === "Medium"
      ).length,
    },
    {
      name: "Low",
      value: bugs.filter(
        (bug) => bug.severity === "Low"
      ).length,
    },
  ];

  // ================= STATUS DATA =================

  const statusData = [
    {
      name: "Open",
      value: bugs.filter(
        (bug) => bug.status === "Open"
      ).length,
    },
    {
      name: "Closed",
      value: bugs.filter(
        (bug) => bug.status === "Closed"
      ).length,
    },
  ];

  // ================= COLORS =================

  const SEVERITY_COLORS = [
    "#e53935", // High
    "#fb8c00", // Medium
    "#43a047", // Low
  ];

  // ================= COMPONENT =================

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

      {/* ================================================= */}
      {/* BUG SEVERITY CHART */}
      {/* ================================================= */}

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          minHeight: 390,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          fontWeight="bold"
          sx={{
            mb: 1,
          }}
        >
          Bug Severity
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{
            mb: 1,
          }}
        >
          Distribution of bugs by severity
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: 300,
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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
              >
                {severityData.map(
                  (entry, index) => (
                    <Cell
                      key={`severity-${index}`}
                      fill={
                        SEVERITY_COLORS[index]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* ================================================= */}
      {/* BUG STATUS CHART */}
      {/* ================================================= */}

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          minHeight: 390,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          fontWeight="bold"
          sx={{
            mb: 1,
          }}
        >
          Bug Status
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{
            mb: 1,
          }}
        >
          Current status of reported bugs
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: 300,
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={statusData}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 14 }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 14 }}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                name="Number of Bugs"
                fill="#1976d2"
                radius={[8, 8, 0, 0]}
                barSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}

export default Charts;