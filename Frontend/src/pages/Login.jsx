import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

export default function Login() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0b1220, #172554)",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={12}
          sx={{
            padding: { xs: 3, sm: 4 },
            borderRadius: 4,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            color="#172554"
            gutterBottom
          >
            Welcome Back
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Sign in to your AI Bug Management System
          </Typography>

          <Box component="form">
            <TextField
              fullWidth
              required
              label="Email Address"
              type="email"
              autoComplete="email"
              margin="normal"
            />

            <TextField
              fullWidth
              required
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.4,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 700,
                backgroundColor: "#2563eb",
              }}
            >
              Sign In
            </Button>

            <Typography textAlign="center" variant="body2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#2563eb",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
