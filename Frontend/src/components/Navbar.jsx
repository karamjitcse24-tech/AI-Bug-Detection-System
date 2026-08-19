import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import BugReportIcon from "@mui/icons-material/BugReport";

function Navbar() {
  return (
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
            AI Bug Detection Dashboard
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

        {/* ================= DEVELOPER PROFILE ================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              textAlign: "right",
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Welcome, Developer
            </Typography>

            <Typography
              sx={{
                fontSize: "10px",
                opacity: 0.8,
              }}
            >
              Project Admin
            </Typography>
          </Box>

          <Avatar
            sx={{
              width: {
                xs: 34,
                sm: 40,
              },
              height: {
                xs: 34,
                sm: 40,
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
            D
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;