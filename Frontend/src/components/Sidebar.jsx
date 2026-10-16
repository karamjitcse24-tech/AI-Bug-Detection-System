import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: DashboardRoundedIcon },
  { label: "Bugs", path: "/bugs", icon: BugReportRoundedIcon },
  { label: "Reports", path: "/reports", icon: AssessmentRoundedIcon },
  { label: "Tasks", path: "/tasks", icon: TaskAltRoundedIcon },
  { label: "Team Project", path: "/team", icon: GroupsRoundedIcon },
  { label: "Profile", path: "/profile", icon: AccountCircleRoundedIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <Box
      component="aside"
      sx={{
        width: { xs: 220, md: 245 },
        flexShrink: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--surface)",
        color: "var(--text)",
        borderRight: "1px solid var(--border)",
        boxSizing: "border-box",
        transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease",
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          minHeight: 76,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            display: "grid",
            placeItems: "center",
            borderRadius: "12px",
            background: "linear-gradient(135deg, var(--accent), #7764f6)",
            flexShrink: 0,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ color: "#fff", fontSize: 23 }} />
        </Box>

        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: -0.8,
            whiteSpace: "nowrap",
            color: "var(--text-h)",
          }}
        >
          Bug<span style={{ color: "var(--accent)" }}>Manager</span>
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 1.25, py: 2, flex: 1 }}>
        {navigationItems.map(({ label, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={NavLink}
            to={path}
            sx={{
              position: "relative",
              minHeight: 48,
              mb: 0.75,
              px: 1.75,
              gap: 1,
              borderRadius: "9px",
              color: "var(--text)",
              transition: "background-color 160ms ease, color 160ms ease",
              "& .MuiListItemIcon-root": {
                color: "inherit",
                minWidth: 29,
              },
              "& .MuiListItemText-primary": {
                fontSize: 13,
                fontWeight: 600,
              },
              "&:hover": {
                backgroundColor: "var(--surface-secondary)",
                color: "var(--text-h)",
              },
              "&.active": {
                backgroundColor: "var(--accent-bg)",
                color: "var(--accent)",
              },
              "&.active::before": {
                content: '""',
                position: "absolute",
                left: -10,
                top: 5,
                bottom: 5,
                width: 4,
                borderRadius: "0 5px 5px 0",
                backgroundColor: "var(--accent)",
              },
            }}
          >
            <ListItemIcon>
              <Icon sx={{ fontSize: 21 }} />
            </ListItemIcon>

            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      {/* Logout */}
      <Divider sx={{ borderColor: "var(--border)" }} />

      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<LogoutRoundedIcon />}
          sx={{
            justifyContent: "flex-start",
            px: 1.75,
            py: 1.25,
            color: "var(--text)",
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: "9px",
            "&:hover": {
              backgroundColor: "rgba(251, 113, 133, 0.10)",
              color: "#fb7185",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
