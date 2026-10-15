
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import BugReportIcon from "@mui/icons-material/BugReport";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

function DashboardCards({ bugs = [] }) {
  // ================= STATISTICS =================

  const total = bugs.length;

  const open = bugs.filter(
    (bug) => bug.status === "Open"
  ).length;

  const closed = bugs.filter(
    (bug) => bug.status === "Closed"
  ).length;

  const high = bugs.filter(
    (bug) => bug.severity === "High"
  ).length;

  // ================= CARD DATA =================

  const cards = [
    {
      title: "Total Bugs",
      value: total,
      color: "#1976d2",
      icon: <BugReportIcon sx={{ fontSize: 42 }} />,
    },
    {
      title: "Open Bugs",
      value: open,
      color: "#f57c00",
      icon: <ErrorIcon sx={{ fontSize: 42 }} />,
    },
    {
      title: "Closed Bugs",
      value: closed,
      color: "#2e7d32",
      icon: <CheckCircleIcon sx={{ fontSize: 42 }} />,
    },
    {
      title: "High Severity",
      value: high,
      color: "#d32f2f",
      icon: <WarningIcon sx={{ fontSize: 42 }} />,
    },
  ];

  return (
    <Grid
      container
      spacing={2.5}
      sx={{ mb: 4 }}
    >
      {cards.map((card) => (
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          key={card.title}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              minHeight: 145,
              backgroundColor: "var(--surface)",
              color: "var(--text-h)",
              border: "1px solid var(--border)",
              borderTop: `4px solid ${card.color}`,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "var(--shadow)",
              transition:
                "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",

              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0, 0, 0, 0.14)",
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                py: 2.5,
              }}
            >
              {/* ICON */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                  color: card.color,
                }}
              >
                {card.icon}
              </Box>

              {/* TITLE */}

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  mb: 0.5,
                  color: "var(--text)",
                }}
              >
                {card.title}
              </Typography>

              {/* NUMBER */}

              <Typography
                sx={{
                  fontSize: "34px",
                  lineHeight: 1,
                  fontWeight: 800,
                  color: "var(--text-h)",
                }}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardCards;
