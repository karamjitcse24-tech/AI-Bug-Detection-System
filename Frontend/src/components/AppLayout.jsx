```jsx
import { useEffect, useState } from "react";
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

function getSavedTheme() {
  try {
    const theme = localStorage.getItem("theme");
    return theme === "light" || theme === "dark" ? theme : "dark";
  } catch {
    return "dark";
  }
}

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = pageNames[location.pathname] || "Dashboard";

  const [user] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [currentTheme, setCurrentTheme] = useState(getSavedTheme);

  // Apply the theme to the whole document.
  useEffect(() => {
    const applyTheme = (theme) => {
      const validTheme =
        theme === "light" || theme === "dark" ? theme : "dark";

      document.documentElement.dataset.theme = validTheme;
      document.documentElement.style.colorScheme = validTheme;

      setCurrentTheme((previousTheme) =>
        previousTheme === validTheme ? previousTheme : validTheme
      );
    };

    applyTheme(getSavedTheme());

    // Listen for theme changes made elsewhere in this tab.
    const handleThemeChange = (event) => {
      applyTheme(event.detail);
    };

    // Listen for changes made in another browser tab.
    const handleStorageChange = (event) => {
      if (event.key === "theme") {
        applyTheme(event.newValue);
      }
    };

    window.addEventListener("bugmanager-theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "bugmanager-theme-change",
        handleThemeChange
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // The current page can still change theme if storage is unavailable.
    }

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;

    setCurrentTheme(nextTheme);

    window.dispatchEvent(
      new CustomEvent("bugmanager-theme-change", {
        detail: nextTheme,
      })
    );
  };

  const initials = (user?.name || user?.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        width: "100%",
        backgroundColor: "var(--bg, #111216)",
        color: "var(--text-h, #f5f5f5)",
        transition: "background-color 180ms ease, color 180ms ease",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: 0,
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "var(--surface, #17171c)",
            color: "var(--text-h, #f5f5f5)",
            borderBottom: "1px solid var(--border, #303039)",
            transition: "background-color 180ms ease, color 180ms ease",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "64px !important",
              px: { xs: 1.5, sm: 2, md: 3 },
              gap: { xs: 0.75, sm: 1.5 },
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
                BugManager
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
                width: { xs: 115, sm: 180, md: 225 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  color: "var(--text-h, #f5f5f5)",
                  backgroundColor: "var(--surface-secondary, #222229)",
                  fontSize: 13,
                  "& fieldset": {
                    borderColor: "var(--border, #303039)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#35c6d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#35c6d2",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "var(--text-muted, #9999a5)",
                  opacity: 1,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{
                          fontSize: 19,
                          color: "var(--text-muted, #9999a5)",
                        }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Tooltip
              title={
                currentTheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              <IconButton
                onClick={toggleTheme}
                aria-label="Toggle light and dark theme"
                sx={{
                  color: "inherit",
                  transition: "transform 180ms ease",
                  "&:hover": {
                    color: "#35c6d2",
                    transform: "rotate(15deg)",
                  },
                }}
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
                    width: 34,
                    height: 34,
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

        <Box
          component="main"
          sx={{
            width: "100%",
            minWidth: 0,
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "var(--bg, #111216)",
            color: "var(--text-h, #f5f5f5)",
            transition: "background-color 180ms ease, color 180ms ease",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
```
