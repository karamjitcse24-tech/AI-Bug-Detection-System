
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppLayout from "./components/AppLayout";

// Protect all application pages.
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

// Temporary placeholder until each real page is built.
function ComingSoon({ title, description }) {
  return (
    <div
      style={{
        padding: "32px",
        minHeight: "70vh",
        color: "var(--text-h, #f5f5f5)",
        background: "var(--bg, #111216)",
        boxSizing: "border-box",
      }}
    >
      <p style={{ color: "#35c6d2", fontWeight: 700 }}>
        AI BUG MANAGEMENT SYSTEM
      </p>
      <h1>{title}</h1>
      <p style={{ color: "var(--text, #a0a0a0)", lineHeight: 1.7 }}>
        {description}
      </p>
      <p>This section will be developed in the next step.</p>
    </div>
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

        {/* Protected application sections */}
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
                description="Search, filter, create, edit, delete, and analyze bug reports."
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
                description="Review bug trends, severity distributions, and resolution statistics."
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
                description="View project activity, assignments, and workload."
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
