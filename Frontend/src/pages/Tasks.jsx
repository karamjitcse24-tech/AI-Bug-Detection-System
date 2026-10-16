
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddRounded,
  AssignmentRounded,
  CheckCircleRounded,
  DeleteOutlineRounded,
  EditRounded,
  EventRounded,
  PendingActionsRounded,
  PlayCircleOutlineRounded,
  SearchRounded,
  TaskAltRounded,
} from "@mui/icons-material";

const STORAGE_KEY = "bugmanager_tasks_v1";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["Pending", "In Progress", "Completed"];

const COLORS = {
  cyan: "#22d3ee",
  yellow: "#fbbf24",
  green: "#34d399",
  red: "#fb7185",
  purple: "#a78bfa",
};

const panelSx = {
  p: 2.5,
  borderRadius: 3,
  bgcolor: "var(--surface, #ffffff)",
  color: "var(--text, #475569)",
  border: "1px solid var(--border, #dbe3ee)",
  boxShadow: "var(--shadow, none)",
  minWidth: 0,
  transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
};

const fieldSx = {
  "& .MuiInputLabel-root": { color: "var(--text)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent)" },
  "& .MuiOutlinedInput-root": {
    color: "var(--text-h)",
    backgroundColor: "var(--surface)",
    "& fieldset": { borderColor: "var(--border)" },
    "&:hover fieldset": { borderColor: "var(--accent-border)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent)" },
  },
  "& .MuiSvgIcon-root": { color: "var(--text)" },
};

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function priorityColor(priority) {
  switch (priority) {
    case "Critical":
      return COLORS.red;
    case "High":
      return "#fb923c";
    case "Medium":
      return COLORS.yellow;
    default:
      return COLORS.green;
  }
}

function statusColor(status) {
  switch (status) {
    case "Completed":
      return COLORS.green;
    case "In Progress":
      return COLORS.cyan;
    default:
      return COLORS.yellow;
  }
}

function SummaryCard({ title, value, icon, color }) {
  return (
    <Paper sx={panelSx}>
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ mt: 1, color: "var(--text-h)" }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 46,
            height: 46,
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            bgcolor: `${color}1a`,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState(loadTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      setNotice("Browser storage is unavailable. Your latest changes may not persist.");
    }
  }, [tasks]);

  const summary = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "Pending").length,
      progress: tasks.filter((task) => task.status === "In Progress").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        const matchesSearch =
          !query ||
          task.title.toLowerCase().includes(query) ||
          (task.description || "").toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "All" || task.status === statusFilter;

        const matchesPriority =
          priorityFilter === "All" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (!a.dueDate) return b.dueDate ? 1 : 0;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks, search, statusFilter, priorityFilter]);

  function openCreateDialog() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setDialogOpen(true);
  }

  function openEditDialog(task) {
    setEditingId(task.id);
    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.dueDate || "",
    });
    setFormError("");
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  }

  function handleSave(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setFormError("Please enter a task title.");
      return;
    }

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? { ...task, ...form, title, updatedAt: new Date().toISOString() }
            : task
        )
      );
      setNotice("Task updated successfully.");
    } else {
      const newTask = {
        ...form,
        title,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      };

      setTasks((previous) => [newTask, ...previous]);
      setNotice("Task created successfully.");
    }

    closeDialog();
  }

  function deleteTask(id) {
    const confirmed = window.confirm(
      "Delete this task? This action cannot be undone."
    );

    if (!confirmed) return;

    setTasks((previous) => previous.filter((task) => task.id !== id));
    setNotice("Task deleted.");
  }

  function updateStatus(id, status) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setNotice("Task status updated.");
  }

  function formatDate(value) {
    if (!value) return "No due date";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function isOverdue(task) {
    return (
      task.dueDate &&
      task.status !== "Completed" &&
      task.dueDate < new Date().toLocaleDateString("en-CA")
    );
  }

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
            Tasks
          </Typography>
          <Typography color="text.secondary">
            Organize your work and track your progress.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openCreateDialog}
          sx={{
            bgcolor: "var(--accent)",
            color: "var(--bg)",
            fontWeight: 700,
            "&:hover": { filter: "brightness(0.94)", bgcolor: "var(--accent)" },
          }}
        >
          Create Task
        </Button>
      </Box>

      {notice && (
        <Alert
          severity="info"
          onClose={() => setNotice("")}
          sx={{ mb: 2 }}
        >
          {notice}
        </Alert>
      )}

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
        <SummaryCard
          title="Total Tasks"
          value={summary.total}
          icon={<AssignmentRounded />}
          color={COLORS.cyan}
        />
        <SummaryCard
          title="Pending"
          value={summary.pending}
          icon={<PendingActionsRounded />}
          color={COLORS.yellow}
        />
        <SummaryCard
          title="In Progress"
          value={summary.progress}
          icon={<PlayCircleOutlineRounded />}
          color={COLORS.purple}
        />
        <SummaryCard
          title="Completed"
          value={summary.completed}
          icon={<TaskAltRounded />}
          color={COLORS.green}
        />
      </Box>

      <Paper sx={{ ...panelSx, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Search &amp; Filter Tasks
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          <TextField
            sx={fieldSx}
            fullWidth
            placeholder="Search by title or description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <SearchRounded sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              sx={fieldSx}
              MenuProps={{ PaperProps: { sx: { bgcolor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" } } }}
              value={statusFilter}
              label="Status"
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <MenuItem value="All">All statuses</MenuItem>
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              sx={fieldSx}
              MenuProps={{ PaperProps: { sx: { bgcolor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" } } }}
              value={priorityFilter}
              label="Priority"
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <MenuItem value="All">All priorities</MenuItem>
              {PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Box mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Your Tasks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </Typography>
      </Box>

      {filteredTasks.length === 0 ? (
        <Paper
          sx={{
            ...panelSx,
            py: 7,
            textAlign: "center",
          }}
        >
          <TaskAltRounded
            sx={{ fontSize: 54, color: "text.secondary", mb: 1 }}
          />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
          </Typography>
          <Typography color="text.secondary" mb={2}>
            {tasks.length === 0
              ? "Create your first task to organize your work."
              : "Try changing your search or filters."}
          </Typography>

          {tasks.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={openCreateDialog}
              sx={{ bgcolor: "var(--accent)", color: "var(--bg)", fontWeight: 700, "&:hover": { bgcolor: "var(--accent)", filter: "brightness(0.94)" } }}
            >
              Create your first task
            </Button>
          )}
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {filteredTasks.map((task) => (
            <Paper key={task.id} sx={panelSx}>
              <Box
                display="flex"
                alignItems="flex-start"
                justifyContent="space-between"
                gap={1}
              >
                <Box minWidth={0} flex={1}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ overflowWrap: "anywhere" }}
                  >
                    {task.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {task.description || "No description provided."}
                  </Typography>
                </Box>

                <Box display="flex" flexShrink={0}>
                  <IconButton
                    sx={{ color: "var(--text)" }}
                    aria-label="Edit task"
                    title="Edit task"
                    onClick={() => openEditDialog(task)}
                  >
                    <EditRounded />
                  </IconButton>
                  <IconButton
                    aria-label="Delete task"
                    title="Delete task"
                    color="error"
                    onClick={() => deleteTask(task.id)}
                  >
                    <DeleteOutlineRounded />
                  </IconButton>
                </Box>
              </Box>

              <Box
                display="flex"
                flexWrap="wrap"
                gap={1}
                alignItems="center"
                mt={2}
              >
                <Chip
                  size="small"
                  label={task.priority}
                  sx={{
                    color: priorityColor(task.priority),
                    bgcolor: `${priorityColor(task.priority)}1a`,
                    fontWeight: 700,
                  }}
                />

                <Chip
                  size="small"
                  label={task.status}
                  sx={{
                    color: statusColor(task.status),
                    bgcolor: `${statusColor(task.status)}1a`,
                    fontWeight: 700,
                  }}
                />

                {isOverdue(task) && (
                  <Chip
                    size="small"
                    label="Overdue"
                    color="error"
                  />
                )}
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
                mt={2.5}
                pt={2}
                sx={{ borderTop: "1px solid var(--border, #30313b)" }}
              >
                <Box display="flex" alignItems="center" gap={0.75}>
                  <EventRounded
                    fontSize="small"
                    color="action"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(task.dueDate)}
                  </Typography>
                </Box>

                <FormControl size="small" sx={{ minWidth: 145 }}>
                  <Select
                    sx={fieldSx}
                    MenuProps={{ PaperProps: { sx: { bgcolor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" } } }}
                    value={task.status}
                    inputProps={{ "aria-label": "Change task status" }}
                    onChange={(event) =>
                      updateStatus(task.id, event.target.value)
                    }
                  >
                    {STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 3,
            backgroundImage: "none",
          },
        }}
      >
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle fontWeight={800}>
            {editingId !== null ? "Edit Task" : "Create New Task"}
          </DialogTitle>

          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            <TextField
              sx={{ ...fieldSx, mt: 1, mb: 2 }}
              autoFocus
              required
              fullWidth
              label="Task title"
              placeholder="e.g. Fix login validation"
              value={form.title}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
              inputProps={{ maxLength: 150 }}
            />

            <TextField
              sx={{ ...fieldSx, mb: 2 }}
              fullWidth
              multiline
              minRows={3}
              label="Description"
              placeholder="Describe the work to be done..."
              value={form.description}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  sx={fieldSx}
                  MenuProps={{ PaperProps: { sx: { bgcolor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" } } }}
                  value={form.priority}
                  label="Priority"
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      priority: event.target.value,
                    }))
                  }
                >
                  {PRIORITIES.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  sx={fieldSx}
                  MenuProps={{ PaperProps: { sx: { bgcolor: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" } } }}
                  value={form.status}
                  label="Status"
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      status: event.target.value,
                    }))
                  }
                >
                  {STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              sx={fieldSx}
              fullWidth
              type="date"
              label="Due date"
              value={form.dueDate}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  dueDate: event.target.value,
                }))
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={closeDialog} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "var(--accent)",
                color: "var(--bg)",
                fontWeight: 700,
                "&:hover": { bgcolor: "var(--accent)", filter: "brightness(0.94)" },
              }}
            >
              {editingId !== null ? "Save Changes" : "Create Task"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
