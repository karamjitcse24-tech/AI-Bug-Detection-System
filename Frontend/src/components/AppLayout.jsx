
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import Sidebar from "./Sidebar";

const pageNames = {
  "/dashboard": "Dashboard",
  "/bugs": "All Bugs",
  "/reports": "Reports",
  "/tasks": "Tasks",
  "/team": "Team Project",
  "/profile": "Profile",
};

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = pageNames[location.pathname] || "Dashboard";

  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const initials = (user?.name || user?.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  const currentTheme =
    document.documentElement.dataset.theme ||
    localStorage.getItem("theme") ||
    "dark";

  const toggleTheme = () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg, #111216)",
        color: "var(--text-h, #f5f5f5)",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "var(--surface, #17171c)",
            color: "var(--text-h, #f5f5f5)",
            borderBottom: "1px solid var(--border, #303039)",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "64px !important",
              px: { xs: 2, md: 3 },
              gap: 1.5,
            }}
          >
            <Breadcrumbs
              separator="/"
              aria-label="breadcrumb"
              sx={{
                flex: 1,
                minWidth: 0,
                "& .MuiBreadcrumbs-separator": {
                  color: "text.secondary",
                },
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "nowrap" }}
              >
                BugNova
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "var(--text-h, #f5f5f5)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {pageTitle}
              </Typography>
            </Breadcrumbs>

            <TextField
              size="small"
              placeholder="Search bugs..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate("/bugs");
                }
              }}
              sx={{
                width: { xs: 125, sm: 190, md: 235 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  color: "inherit",
                  background: "var(--surface-secondary, #222229)",
                  fontSize: 13,
                  "& fieldset": {
                    borderColor: "var(--border, #303039)",
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{ fontSize: 19, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Tooltip title="Toggle light/dark theme">
              <IconButton
                onClick={toggleTheme}
                aria-label="Toggle theme"
                sx={{ color: "inherit" }}
              >
                {currentTheme === "dark" ? (
                  <LightModeRoundedIcon />
                ) : (
                  <DarkModeRoundedIcon />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton
                aria-label="Notifications"
                sx={{ color: "inherit" }}
              >
                <NotificationsNoneRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={user?.name || user?.email || "Profile"}>
              <IconButton
                onClick={() => navigate("/profile")}
                aria-label="Open profile"
                sx={{ p: 0.25 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    fontWeight: 700,
                    bgcolor: "#28b8c6",
                    color: "#071316",
                  }}
                >
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box sx={{ width: "100%", minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
