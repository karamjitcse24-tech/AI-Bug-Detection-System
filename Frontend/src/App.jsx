
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protect all application pages using the existing JWT token.
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Temporary page until the real section is built.
function ComingSoon({ title, description }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        boxSizing: "border-box",
        background: "var(--bg, #111216)",
        color: "var(--text-h, #f5f5f5)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <p style={{ color: "#31b8c6", fontWeight: 700 }}>
        AI BUG MANAGEMENT SYSTEM
      </p>

      <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>{title}</h1>

      <p style={{ color: "var(--text, #a0a0a0)", lineHeight: 1.7 }}>
        {description}
      </p>

      <p style={{ marginTop: 28 }}>
        This section will be implemented in the next development step.
      </p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Public authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected application routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bugs"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Bug Management"
                description="Create, search, filter, update, delete, and analyze bug reports."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Reports & Analytics"
                description="Explore bug trends, severity distributions, and resolution statistics."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Tasks"
                description="Organize bug-fixing work and track task progress."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Team Project"
                description="View project activity, assignments, and team workload."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Profile & Settings"
                description="Manage your account and dashboard preferences."
              />
            </ProtectedRoute>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
