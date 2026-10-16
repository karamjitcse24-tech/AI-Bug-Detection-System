
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import BugReportIcon from "@mui/icons-material/BugReport";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonOutlineIcon from "@mui/icons-material/Person";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

function Navbar() {
  const navigate = useNavigate();

  // ================= USER DETAILS =================

  const [user] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  });

  // ================= MENU AND DIALOG STATE =================

  const [anchorEl, setAnchorEl] = useState(null);
  const [dialog, setDialog] = useState("");

  // ================= THEME STATE =================

  const [theme, setTheme] = useState(
    () => localStorage.getItem("dashboard-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const handleThemeChange = (event) => {
    const nextTheme = event.target.checked ? "dark" : "light";

    setTheme(nextTheme);
    localStorage.setItem("dashboard-theme", nextTheme);
  };

  const menuOpen = Boolean(anchorEl);

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Developer";

  const userInitial = displayName.charAt(0).toUpperCase();

  // ================= OPEN/CLOSE MENU =================

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ================= OPEN DIALOG =================

  const handleOpenDialog = (dialogName) => {
    handleMenuClose();
    setDialog(dialogName);
  };

  const handleCloseDialog = () => {
    setDialog("");
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    handleMenuClose();

    const confirmLogout = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmLogout) return;

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <AppBar
        position="static"
        elevation={4}
        sx={{
          background:
            theme === "dark"
              ? "linear-gradient(90deg, #191f29, #222b38)"
              : "linear-gradient(90deg, #1d4ed8, #2563eb)",
          color: "var(--text-h)",
          borderBottom: "1px solid var(--border)",
          transition: "background 0.25s ease, color 0.25s ease",
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 60,
              sm: 68,
            },
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {/* ================= LOGO ================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              mr: 1.5,
              flexShrink: 0,
            }}
          >
            <BugReportIcon
              sx={{
                fontSize: 28,
                color: "white",
              }}
            />
          </Box>

          {/* ================= TITLE ================= */}

          <Box
            sx={{
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "16px",
                  sm: "20px",
                  md: "22px",
                },
                fontWeight: 700,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              AI Bug Management Dashboard
            </Typography>

            <Typography
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                fontSize: "11px",
                opacity: 0.85,
                mt: 0.3,
              }}
            >
              Intelligent Bug Management System
            </Typography>
          </Box>

          {/* ================= USER PROFILE ================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              ml: 1,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                textAlign: "right",
                display: {
                  xs: "none",
                  sm: "block",
                },
                maxWidth: {
                  sm: 150,
                  md: 220,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Welcome, {displayName}
              </Typography>

              <Typography
                sx={{
                  fontSize: "10px",
                  opacity: 0.8,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email || "Logged-in user"}
              </Typography>
            </Box>

            <IconButton
              onClick={handleAvatarClick}
              aria-label="Open profile menu"
              aria-controls={menuOpen ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              sx={{
                p: 0,
                borderRadius: "50%",
                "&:focus-visible": {
                  outline: "2px solid white",
                  outlineOffset: "3px",
                },
              }}
            >
              <Avatar
                sx={{
                  width: {
                    xs: 36,
                    sm: 42,
                  },
                  height: {
                    xs: 36,
                    sm: 42,
                  },
                  bgcolor: theme === "dark" ? "var(--accent)" : "#f59e0b",
                  color: theme === "dark" ? "#101319" : "#ffffff",
                  fontWeight: "bold",
                  fontSize: {
                    xs: "15px",
                    sm: "18px",
                  },
                  boxShadow: 2,
                }}
              >
                {userInitial}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= PROFILE DROPDOWN ================= */}

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
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
              mt: 1,
              minWidth: 220,
              borderRadius: 2,
              boxShadow: "var(--shadow)",
              backgroundColor: "var(--surface)",
              color: "var(--text-h)",
              border: "1px solid var(--border)",
              "& .MuiMenuItem-root": {
                color: "var(--text)",
                transition: "background-color 0.2s ease",
              },
              "& .MuiMenuItem-root:hover": {
                backgroundColor: "var(--accent-bg)",
              },
              "& .MuiDivider-root": {
                borderColor: "var(--border)",
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={700} fontSize={14}>
            {displayName}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.4,
              overflowWrap: "anywhere",
            }}
          >
            {user?.email || "No email available"}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "var(--border)" }} />

        <MenuItem onClick={() => handleOpenDialog("profile")}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>

        <MenuItem onClick={() => handleOpenDialog("settings")}>
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider sx={{ borderColor: "var(--border)" }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* ================= PROFILE DIALOG ================= */}

      <Dialog
        open={dialog === "profile"}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "var(--surface)",
            color: "var(--text-h)",
            border: "1px solid var(--border)",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          My Profile

          <IconButton
            aria-label="Close profile"
            onClick={handleCloseDialog}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 2,
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: theme === "dark" ? "var(--accent)" : "#f59e0b",
                color: theme === "dark" ? "#101319" : "#ffffff",
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              {userInitial}
            </Avatar>

            <Typography variant="h6" fontWeight={700}>
              {displayName}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflowWrap: "anywhere",
                textAlign: "center",
              }}
            >
              {user?.email || "No email available"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderColor: "var(--border)" }} />

          <Typography variant="body2" color="text.secondary">
            Account information
          </Typography>

          <Typography sx={{ mt: 1 }}>
            Name: {displayName}
          </Typography>

          <Typography sx={{ mt: 1, overflowWrap: "anywhere" }}>
            Email: {user?.email || "Not available"}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= SETTINGS DIALOG ================= */}

      <Dialog
        open={dialog === "settings"}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "var(--surface)",
            color: "var(--text-h)",
            border: "1px solid var(--border)",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Settings

          <IconButton
            aria-label="Close settings"
            onClick={handleCloseDialog}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* ACCOUNT */}

          <Typography fontWeight={700} gutterBottom>
            Account
          </Typography>

          <Typography variant="body2" color="text.secondary">
            You are signed in as {displayName}.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflowWrap: "anywhere", mt: 0.5 }}
          >
            {user?.email || "No email available"}
          </Typography>

          <Divider sx={{ my: 2, borderColor: "var(--border)" }} />

          {/* APPEARANCE */}

          <Typography fontWeight={700} gutterBottom>
            Appearance
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={theme === "dark"}
                onChange={handleThemeChange}
                color="primary"
                inputProps={{
                  "aria-label": "Toggle dark mode",
                }}
              />
            }
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {theme === "dark" ? (
                  <DarkModeOutlinedIcon fontSize="small" />
                ) : (
                  <LightModeOutlinedIcon fontSize="small" />
                )}

                {theme === "dark" ? "Dark mode" : "Light mode"}
              </Box>
            }
          />

          <Typography variant="body2" color="text.secondary">
            Your theme preference is saved in this browser.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;
