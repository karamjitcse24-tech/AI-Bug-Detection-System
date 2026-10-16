
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import {
  AccountCircleRounded,
  DarkModeRounded,
  LightModeRounded,
  LogoutRounded,
  PaletteRounded,
  SettingsRounded,
  ShieldRounded,
} from "@mui/icons-material";

const panelSx = {
  p: 3,
  borderRadius: 3,
  bgcolor: "var(--surface)",
  color: "var(--text)",
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow)",
  transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
};

const themedFieldSx = {
  minWidth: 150,
  "& .MuiOutlinedInput-root": {
    color: "var(--text)",
    bgcolor: "var(--surface-secondary)",
    "& fieldset": { borderColor: "var(--border)" },
    "&:hover fieldset": { borderColor: "var(--accent)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent)" },
  },
  "& .MuiSvgIcon-root": { color: "var(--text)" },
};

function readStoredUser() {
  for (const key of ["user", "currentUser", "loggedInUser"]) {
    try {
      const value = sessionStorage.getItem(key);
      if (!value) continue;

      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Some applications store a plain string instead of JSON.
      const value = sessionStorage.getItem(key);
      if (value) return { name: value };
    }
  }

  return {};
}

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(readStoredUser);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [density, setDensity] = useState(
    () => localStorage.getItem("taskDensity") || "comfortable"
  );
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("notificationsEnabled") !== "false"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("taskDensity", density);
  }, [density]);

  useEffect(() => {
    localStorage.setItem(
      "notificationsEnabled",
      String(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const displayName =
    user.name ||
    user.fullName ||
    user.username ||
    user.email?.split("@")[0] ||
    "BugManager User";

  const email = user.email || "Account email unavailable";

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  function savePreferences() {
    localStorage.setItem("theme", theme);
    localStorage.setItem("taskDensity", density);
    localStorage.setItem(
      "notificationsEnabled",
      String(notifications)
    );

    setMessage("Your preferences have been saved in this browser.");
  }

  function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out of BugManager?"
    );

    if (!confirmed) return;

    // Clear the existing browser session without touching bug records.
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("loggedInUser");

    navigate("/login", { replace: true });
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
      <Box mb={3}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Profile &amp; Settings
        </Typography>
        <Typography color="text.secondary">
          Manage your account and personalize your BugManager experience.
        </Typography>
      </Box>

      {message && (
        <Alert
          severity="success"
          onClose={() => setMessage("")}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      <Paper sx={{ ...panelSx, mb: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2.5}
        >
          <Avatar
            sx={{
              width: 76,
              height: 76,
              bgcolor: "var(--accent)",
              color: "var(--bg)",
              fontSize: 27,
              fontWeight: 800,
            }}
          >
            {initials || "B"}
          </Avatar>

          <Box flex={1} minWidth={200}>
            <Typography variant="h5" fontWeight={800}>
              {displayName}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {email}
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap" mt={1.5}>
              <Typography
                variant="caption"
                sx={{
                  color: "#34d399",
                  bgcolor: "rgba(52,211,153,0.12)",
                  px: 1.2,
                  py: 0.5,
                  borderRadius: 5,
                  fontWeight: 700,
                }}
              >
                Signed-in session
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#22d3ee",
                  bgcolor: "rgba(34,211,238,0.12)",
                  px: 1.2,
                  py: 0.5,
                  borderRadius: 5,
                  fontWeight: 700,
                }}
              >
                BugManager
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutRounded />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ ...panelSx, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <AccountCircleRounded color="info" />
          <Typography variant="h6" fontWeight={750}>
            Account Information
          </Typography>
        </Box>

        <Divider sx={{ mb: 2.5, borderColor: "var(--border)" }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Display Name
            </Typography>
            <Typography fontWeight={600}>{displayName}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Email Address
            </Typography>
            <Typography fontWeight={600} sx={{ overflowWrap: "anywhere" }}>
              {email}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Authentication
            </Typography>
            <Typography fontWeight={600}>
              Existing BugManager session
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Preferences Storage
            </Typography>
            <Typography fontWeight={600}>
              This browser
            </Typography>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          Account details are read from the browser session. Editing your
          registered name, email, or password is not available on this page.
        </Alert>
      </Paper>

      <Paper sx={{ ...panelSx, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PaletteRounded color="info" />
          <Typography variant="h6" fontWeight={750}>
            Appearance
          </Typography>
        </Box>

        <Divider sx={{ mb: 2, borderColor: "var(--border)" }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          flexWrap="wrap"
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            {theme === "dark" ? (
              <DarkModeRounded color="info" />
            ) : (
              <LightModeRounded color="warning" />
            )}

            <Box>
              <Typography fontWeight={650}>Color Theme</Typography>
              <Typography variant="body2" color="text.secondary">
                Choose your preferred appearance.
              </Typography>
            </Box>
          </Box>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={theme}
              inputProps={{ "aria-label": "Color theme" }}
              onChange={(event) => setTheme(event.target.value)}
            >
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="light">Light</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ ...panelSx, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <SettingsRounded color="info" />
          <Typography variant="h6" fontWeight={750}>
            Application Preferences
          </Typography>
        </Box>

        <Divider sx={{ mb: 2, borderColor: "var(--border)" }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          flexWrap="wrap"
          py={1}
        >
          <Box>
            <Typography fontWeight={650}>Task Card Density</Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a comfortable or compact preference.
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <Select
              value={density}
              inputProps={{ "aria-label": "Task card density" }}
              onChange={(event) => setDensity(event.target.value)}
            >
              <MenuItem value="comfortable">Comfortable</MenuItem>
              <MenuItem value="compact">Compact</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 1.5, borderColor: "var(--border)" }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Box>
            <Typography fontWeight={650}>Notifications Preference</Typography>
            <Typography variant="body2" color="text.secondary">
              Save your preference for future notification features.
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={notifications}
                onChange={(event) => setNotifications(event.target.checked)}
              />
            }
            label={notifications ? "On" : "Off"}
          />
        </Box>

        <Button
          variant="contained"
          onClick={savePreferences}
          sx={{
            mt: 3,
            bgcolor: "var(--accent)",
            color: "var(--bg)",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": { bgcolor: "var(--accent)", filter: "brightness(0.95)" },
          }}
        >
          Save Preferences
        </Button>
      </Paper>

      <Paper sx={panelSx}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <ShieldRounded color="success" />
          <Typography variant="h6" fontWeight={750}>
            Security &amp; Privacy
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your bug reports continue to use the existing authenticated backend.
          This page stores appearance and preference settings in browser
          local storage.
        </Typography>

        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutRounded />}
          onClick={handleLogout}
        >
          Log Out of BugManager
        </Button>
      </Paper>
    </Box>
  );
}
