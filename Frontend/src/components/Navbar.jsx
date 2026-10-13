
import { useState } from "react";
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
          background: "linear-gradient(90deg, #1565c0, #1976d2)",
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
                  bgcolor: "#ff9800",
                  color: "white",
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
              boxShadow: 4,
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

        <Divider />

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

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <LogoutIcon
              fontSize="small"
              color="error"
            />
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
                bgcolor: "#ff9800",
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
              sx={{ overflowWrap: "anywhere", textAlign: "center" }}
            >
              {user?.email || "No email available"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

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
          <Typography fontWeight={700} gutterBottom>
            Account
          </Typography>

          <Typography variant="body2" color="text.secondary">
            You are signed in as {displayName}.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={700} gutterBottom>
            Dashboard
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Your dashboard currently uses its existing layout and
            preferences. No database or account settings are changed
            by opening this panel.
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

