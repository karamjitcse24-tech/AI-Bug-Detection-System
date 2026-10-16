
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  BugReportRounded,
  CheckCircleRounded,
  CodeRounded,
  GroupsRounded,
  RocketLaunchRounded,
  TaskAltRounded,
  TimelineRounded,
} from "@mui/icons-material";
import { getAllBugs } from "../services/bugService";

const TASK_STORAGE_KEY = "bugmanager_tasks_v1";

const panelSx = {
  p: 2.5,
  borderRadius: 3,
  bgcolor: "var(--surface, #191a20)",
  color: "var(--text, #f3f4f6)",
  border: "1px solid var(--border, #30313b)",
  boxShadow: "var(--shadow)",
  minWidth: 0,
};

const colors = {
  cyan: "#22d3ee",
  green: "#34d399",
  yellow: "#fbbf24",
  red: "#fb7185",
  purple: "#a78bfa",
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function isResolved(bug) {
  return ["resolved", "closed", "fixed", "completed"].includes(
    normalize(bug.status)
  );
}

function loadLocalTasks() {
  try {
    const saved = localStorage.getItem(TASK_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function MetricCard({ title, value, description, icon, color }) {
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
            sx={{ mt: 1, color: "var(--text, #f3f4f6)" }}
          >
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
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

function SectionTitle({ children, icon }) {
  return (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      {icon}
      <Typography variant="h6" fontWeight={750}>
        {children}
      </Typography>
    </Box>
  );
}

export default function Team() {
  const [bugs, setBugs] = useState([]);
  const [tasks, setTasks] = useState(loadLocalTasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBugs() {
      try {
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
              "Bug statistics could not be loaded."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBugs();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function syncTasks() {
      setTasks(loadLocalTasks());
    }

    window.addEventListener("storage", syncTasks);

    return () => {
      window.removeEventListener("storage", syncTasks);
    };
  }, []);

  const bugStats = useMemo(() => {
    const resolved = bugs.filter(isResolved).length;

    return {
      total: bugs.length,
      open: bugs.length - resolved,
      resolved,
      high: bugs.filter((bug) =>
        ["critical", "high"].includes(normalize(bug.severity))
      ).length,
      progress: bugs.length
        ? Math.round((resolved / bugs.length) * 100)
        : 0,
    };
  }, [bugs]);

  const taskStats = useMemo(() => {
    const completed = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    return {
      total: tasks.length,
      completed,
      pending: tasks.filter((task) => task.status === "Pending").length,
      inProgress: tasks.filter(
        (task) => task.status === "In Progress"
      ).length,
      progress: tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0,
    };
  }, [tasks]);

  const milestones = [
    {
      title: "Authentication",
      description: "Login, signup, and protected routes",
      status: "Completed",
      color: colors.green,
    },
    {
      title: "Bug Management",
      description: "Create, view, edit, and delete bug reports",
      status: "Completed",
      color: colors.green,
    },
    {
      title: "AI Bug Analysis",
      description: "AI-assisted bug analysis workflow",
      status: "Completed",
      color: colors.green,
    },
    {
      title: "Reports & Analytics",
      description: "Bug statistics, status distribution, and trends",
      status: "Completed",
      color: colors.green,
    },
    {
      title: "Task Management",
      description: "Local task tracking and priorities",
      status: "Available",
      color: colors.cyan,
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        color: "var(--text, #f3f4f6)",
        "& .MuiPaper-root": {
          backgroundColor: "var(--surface, #ffffff)",
          color: "var(--text, #475569)",
          borderColor: "var(--border, #dbe3ee)",
        },
        "& .MuiInputBase-root": {
          color: "var(--text, #475569)",
          backgroundColor: "var(--surface, #ffffff)",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--border, #dbe3ee)",
        },
        "& .MuiInputLabel-root": {
          color: "var(--text, #475569)",
        },
        "& .MuiSvgIcon-root": {
          color: "inherit",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Team Project
          </Typography>
          <Typography color="text.secondary">
            Your BugManager project workspace and development progress.
          </Typography>
        </Box>

        <Chip
          icon={<CodeRounded />}
          label="Full-Stack Project"
          sx={{
            color: colors.cyan,
            bgcolor: `${colors.cyan}1a`,
            fontWeight: 700,
          }}
        />
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} Project milestones are still available below.
        </Alert>
      )}

      <Paper
        sx={{
          ...panelSx,
          mb: 3,
          p: { xs: 2.5, md: 3.5 },
          background:
            "linear-gradient(120deg, rgba(34,211,238,0.12), rgba(167,139,250,0.08))",
        }}
      >
        <Box
          display="flex"
          alignItems={{ xs: "flex-start", md: "center" }}
          flexDirection={{ xs: "column", md: "row" }}
          gap={3}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 64,
              height: 64,
              bgcolor: `${colors.cyan}20`,
              color: colors.cyan,
            }}
          >
            <RocketLaunchRounded sx={{ fontSize: 34 }} />
          </Avatar>

          <Box flex={1}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              BugManager
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 750 }}>
              An AI-assisted bug management platform for organizing bug
              reports, analyzing issues, tracking work, and reviewing project
              analytics.
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
              <Chip size="small" label="React" />
              <Chip size="small" label="Spring Boot" />
              <Chip size="small" label="MySQL" />
              <Chip size="small" label="AI Integration" />
            </Box>
          </Box>

          <Box
            sx={{
              minWidth: { xs: "100%", md: 150 },
              textAlign: { xs: "left", md: "center" },
            }}
          >
            <Typography variant="h3" fontWeight={800} color={colors.cyan}>
              {bugStats.progress}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bug resolution rate
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" fontWeight={750} mb={2}>
        Project Overview
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          title="Total Bugs"
          value={loading ? "—" : bugStats.total}
          description="Recorded bug reports"
          icon={<BugReportRounded />}
          color={colors.cyan}
        />
        <MetricCard
          title="Open Bugs"
          value={loading ? "—" : bugStats.open}
          description="Not resolved or closed"
          icon={<TimelineRounded />}
          color={colors.yellow}
        />
        <MetricCard
          title="Resolved Bugs"
          value={loading ? "—" : bugStats.resolved}
          description="Fixed or closed reports"
          icon={<CheckCircleRounded />}
          color={colors.green}
        />
        <MetricCard
          title="Project Tasks"
          value={taskStats.total}
          description={`${taskStats.completed} completed`}
          icon={<TaskAltRounded />}
          color={colors.purple}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        <Paper sx={panelSx}>
          <SectionTitle icon={<TimelineRounded color="info" />}>
            Bug Resolution Progress
          </SectionTitle>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" color="text.secondary">
              Resolved bugs
            </Typography>
            <Typography fontWeight={700}>
              {bugStats.resolved} / {bugStats.total}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={bugStats.progress}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "var(--border, #30313b)",
              "& .MuiLinearProgress-bar": {
                bgcolor: colors.cyan,
                borderRadius: 5,
              },
            }}
          />

          <Typography variant="caption" color="text.secondary" mt={1} display="block">
            {bugStats.progress}% of your recorded bugs are resolved.
          </Typography>

          <Box mt={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Critical / high severity
              </Typography>
              <Typography fontWeight={700}>{bugStats.high}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={
                bugStats.total
                  ? (bugStats.high / bugStats.total) * 100
                  : 0
              }
              sx={{
                height: 8,
                borderRadius: 5,
                bgcolor: "var(--border, #30313b)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: colors.red,
                  borderRadius: 5,
                },
              }}
            />
          </Box>
        </Paper>

        <Paper sx={panelSx}>
          <SectionTitle icon={<TaskAltRounded color="success" />}>
            Task Progress
          </SectionTitle>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" color="text.secondary">
              Completed tasks
            </Typography>
            <Typography fontWeight={700}>
              {taskStats.completed} / {taskStats.total}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={taskStats.progress}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "var(--border, #30313b)",
              "& .MuiLinearProgress-bar": {
                bgcolor: colors.green,
                borderRadius: 5,
              },
            }}
          />

          <Typography variant="caption" color="text.secondary" mt={1} display="block">
            {taskStats.progress}% of your browser-saved tasks are completed.
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1} mt={3}>
            <Chip
              label={`Pending: ${taskStats.pending}`}
              sx={{
                color: colors.yellow,
                bgcolor: `${colors.yellow}1a`,
              }}
            />
            <Chip
              label={`In progress: ${taskStats.inProgress}`}
              sx={{
                color: colors.purple,
                bgcolor: `${colors.purple}1a`,
              }}
            />
            <Chip
              label={`Completed: ${taskStats.completed}`}
              sx={{
                color: colors.green,
                bgcolor: `${colors.green}1a`,
              }}
            />
          </Box>
        </Paper>
      </Box>

      <Paper sx={panelSx}>
        <SectionTitle icon={<GroupsRounded color="info" />}>
          Project Milestones
        </SectionTitle>

        <Box display="flex" flexDirection="column" gap={0}>
          {milestones.map((milestone, index) => (
            <Box
              key={milestone.title}
              display="flex"
              alignItems="flex-start"
              gap={2}
              py={2}
              sx={{
                borderBottom:
                  index < milestones.length - 1
                    ? "1px solid var(--border, #30313b)"
                    : "none",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: milestone.color,
                  bgcolor: `${milestone.color}1a`,
                  flexShrink: 0,
                }}
              >
                <CheckCircleRounded fontSize="small" />
              </Box>

              <Box flex={1} minWidth={0}>
                <Typography fontWeight={700}>
                  {milestone.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {milestone.description}
                </Typography>
              </Box>

              <Chip
                size="small"
                label={milestone.status}
                sx={{
                  color: milestone.color,
                  bgcolor: `${milestone.color}1a`,
                  fontWeight: 700,
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mt: 2 }}
      >
        Bug statistics come from your authenticated bug reports. Task
        statistics come from browser-local storage and are not synchronized
        with your backend or other devices. Milestones describe the current
        application features; they are not a live team activity feed.
      </Typography>
    </Box>
  );
}
