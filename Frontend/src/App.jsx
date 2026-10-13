
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Bugs from "./pages/Bugs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AppLayout from "./components/AppLayout";

// Protect application pages using the existing JWT token.
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

// Temporary page until the full section is implemented.
function ComingSoon({ title, description }) {
  return (
    <main
      style={{
        minHeight: "70vh",
        padding: "32px",
        boxSizing: "border-box",
        background: "var(--bg, #111216)",
        color: "var(--text-h, #f5f5f5)",
      }}
    >
      <p style={{ color: "#35c6d2", fontWeight: 700 }}>
        BUGMANAGER
      </p>

      <h1>{title}</h1>

      <p
        style={{
          color: "var(--text, #a0a0a0)",
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>

      <p>This section will be developed in a later step.</p>
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

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Bug management */}
        <Route
          path="/bugs"
          element={
            <ProtectedRoute>
              <Bugs />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Reports & Analytics"
                description="Review bug trends, severity distributions, and resolution statistics."
              />
            </ProtectedRoute>
          }
        />

        {/* Tasks */}
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

        {/* Team project */}
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Team Project"
                description="View project activity, assignments, and workload."
              />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Profile & Settings"
                description="Manage account information and preferences."
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
