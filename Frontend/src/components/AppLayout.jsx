```jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";

import Sidebar from "./Sidebar";
import { getAllBugs } from "../services/bugService";

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

function getBugId(bug) {
  return bug?.id ?? bug?.bugId ?? "unknown";
}

function AppLayout({ children }) {
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
  const [bugs, setBugs] = useState([]);
  const [notificationError, setNotificationError] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("bugmanager_read_notifications") || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const notificationsOpen = Boolean(notificationsAnchor);

  // Apply and synchronize the selected theme.
  useEffect(() => {
    const applyTheme = (theme) => {
      const validTheme =
        theme === "light" || theme === "dark" ? theme : "dark";

      document.documentElement.dataset.theme = validTheme;
      document.documentElement.style.colorScheme = validTheme;
      setCurrentTheme(validTheme);
    };

    applyTheme(getSavedTheme());

    const handleThemeChange = (event) => {
      applyTheme(event.detail);
    };

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

  // Load bug reports for the notification menu.
  useEffect(() => {
    let active = true;

    async function loadBugs() {
      try {
        const response = await getAllBugs();
        const data = response?.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];

        if (active) {
          setBugs(list);
          setNotificationError(false);
        }
      } catch {
        if (active) {
          setNotificationError(true);
        }
      }
    }

    loadBugs();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  const toggleTheme = () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // Apply the theme even if browser storage is unavailable.
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

  const notifications = bugs
    .filter((bug) => {
      const severity = String(bug?.severity || "").toLowerCase();
      const status = String(bug?.status || "").toLowerCase();

      const isHighPriority =
        severity === "high" || severity === "critical";

      const isUnresolved = ![
        "resolved",
        "closed",
        "fixed",
      ].includes(status);

      return isHighPriority && isUnresolved;
    })
    .map((bug) => ({
      id: String(getBugId(bug)),
      title: bug?.title ||; `Bug #${getBugId(bug)}`,
      severity: bug?.severity || "High",
      status: bug?.status || "Open",
    }));

  const unreadNotifications = notifications.filter(
    (notification) => !readNotificationIds.includes(notification.id)
  );

  const markAllNotificationsRead = () => {
    const updated = Array.from(
      new Set([
        ...readNotificationIds,
        ...notifications.map((notification) => notification.id),
      ])
    );

    setReadNotificationIds(updated);

    try {
      sessionStorage.setItem(
        "bugmanager_read_notifications",
        JSON.stringify(updated)
      );
    } catch {
      // The current page still updates if storage is unavailable.
    }
  };

  const openNotification = () => {
    markAllNotificationsRead();
    setNotificationsAnchor(null);
    navigate("/bugs");
  };

  const initials = String(user?.name || user?.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg, #111216)",
        color: "var(--text-h, #f5f5f5)",
        transition: "background-color 180ms ease, color 180ms ease",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "var(--surface, #17171c)",
            color: "var(--text-h, #f5f5f5)",
            borderBottom: "1px solid var(--border, #303039)",
            backgroundImage: "none",
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
                  "&:hover fieldset, &.Mui-focused fieldset": {
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
                aria-label="Toggle theme"
                sx={{
                  color: "inherit",
                  "&:hover": { color: "#35c6d2" },
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
                onClick={(event) =>
                  setNotificationsAnchor(event.currentTarget)
                }
                aria-label="Open notifications"
                aria-haspopup="true"
                aria-expanded={notificationsOpen}
                sx={{ color: "inherit" }}
              >
                <Badge
                  badgeContent={unreadNotifications.length}
                  color="error"
                  max={99}
                >
                  <NotificationsNoneRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notificationsAnchor}
              open={notificationsOpen}
              onClose={() => setNotificationsAnchor(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  sx: {
                    width: { xs: 300, sm: 360 },
                    maxWidth: "calc(100vw - 24px)",
                    maxHeight: 440,
                    mt: 1,
                    backgroundColor: "var(--surface, #17171c)",
                    color: "var(--text-h, #f5f5f5)",
                    border: "1px solid var(--border, #303039)",
                    backgroundImage: "none",
                  },
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography fontWeight={700}>
                    Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    High-priority unresolved bugs
                  </Typography>
                </Box>

                {unreadNotifications.length > 0 && (
                  <Button
                    size="small"
                    onClick={markAllNotificationsRead}
                    sx={{
                      textTransform: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Mark all read
                  </Button>
                )}
              </Box>

              <Divider
                sx={{ borderColor: "var(--border, #303039)" }}
              />

              {notificationError ? (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2">
                    Notifications couldn't be loaded.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Check your connection and reopen this menu.
                  </Typography>
                </Box>
              ) : notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <NotificationsNoneRoundedIcon
                    sx={{
                      fontSize: 34,
                      color: "text.secondary",
                      mb: 1,
                    }}
                  />
                  <Typography fontWeight={600}>
                    You're all caught up
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No high-priority unresolved bugs found.
                  </Typography>
                </Box>
              ) : (
                notifications.map((notification) => {
                  const unread = !readNotificationIds.includes(
                    notification.id
                  );

                  return (
                    <MenuItem
                      key={notification.id}
                      onClick={openNotification}
                      sx={{
                        whiteSpace: "normal",
                        alignItems: "flex-start",
                        gap: 1.5,
                        py: 1.5,
                        backgroundColor: unread
                          ? "var(--surface-secondary, #222229)"
                          : "transparent",
                      }}
                    >
                      {String(notification.severity).toLowerCase() ===
                      "critical" ? (
                        <PriorityHighRoundedIcon color="error" />
                      ) : (
                        <BugReportOutlinedIcon
                          sx={{ color: "#e6a23c" }}
                        />
                      )}

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight={unread ? 700 : 500}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.4 }}
                        >
                          {notification.severity} priority ·{" "}
                          {notification.status}
                        </Typography>
                      </Box>

                      {unread && (
                        <Box
                          aria-label="Unread"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#35c6d2",
                            mt: 0.7,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </MenuItem>
                  );
                })
              )}

              <Divider
                sx={{ borderColor: "var(--border, #303039)" }}
              />

              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  onClick={() => {
                    setNotificationsAnchor(null);
                    navigate("/bugs");
                  }}
                  sx={{ textTransform: "none" }}
                >
                  View all bugs
                </Button>
              </Box>
            </Menu>

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

export default AppLayout;
```
