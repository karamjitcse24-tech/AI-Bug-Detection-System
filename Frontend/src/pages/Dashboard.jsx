
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import BugForm from "../components/BugForm";
import DashboardCards from "../components/DashboardCards";
import BugTable from "../components/BugTable";
import SearchFilter from "../components/SearchFilter";
import Charts from "../components/Charts";

import {
  getAllBugs,
  deleteBug,
} from "../services/bugService";

function Dashboard() {
  const navigate = useNavigate();

  // ================= USER PROFILE =================

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  // ================= STATE =================

  const [bugs, setBugs] = useState([]);
  const [selectedBug, setSelectedBug] = useState(null);

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");

  // ================= LOGOUT =================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmLogout) return;

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  // ================= LOAD BUGS =================

  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    try {
      const response = await getAllBugs();

      console.log("API Response:", response.data);

      setBugs(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Error loading bugs:", error);
      setBugs([]);
    }
  };

  // ================= EDIT BUG =================

  const handleEdit = (bug) => {
    setSelectedBug(bug);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE BUG =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bug?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBug(id);
      alert("Bug Deleted Successfully!");
      await loadBugs();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Delete Failed");
    }
  };

  // ================= FILTER BUGS =================

  const filteredBugs = bugs.filter((bug) => {
    const title = bug.title || "";
    const bugSeverity = bug.severity || "";
    const bugStatus = bug.status || "";

    const matchesSearch = title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSeverity =
      severity === "" || bugSeverity === severity;

    const matchesStatus =
      status === "" || bugStatus === status;

    return (
      matchesSearch &&
      matchesSeverity &&
      matchesStatus
    );
  });

  // ================= CLEAR FILTERS =================

  const clearFilters = () => {
    setSearch("");
    setSeverity("");
    setStatus("");
  };

  const filtersApplied =
    search !== "" ||
    severity !== "" ||
    status !== "";

  // ================= USER DISPLAY =================

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Developer";

  // ================= DASHBOARD =================

  return (
    <>
      <Navbar />

      <main
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "20px 30px 50px",
          boxSizing: "border-box",
        }}
      >
        {/* ================= WELCOME HEADER ================= */}

        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            padding: "25px 28px",
            marginBottom: "25px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
            border: "1px solid #e0e7ff",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                color: "#4f46e5",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              AI Bug Management System
            </p>

            <h1
              style={{
                margin: "0 0 8px",
                color: "#111827",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: "800",
              }}
            >
              Welcome back, {displayName}! 👋
            </h1>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Track, analyze, and manage your bug reports in one place.
            </p>

            {user?.email && (
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#4b5563",
                  fontSize: "13px",
                }}
              >
                Signed in as: {user.email}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "11px 20px",
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(event) => {
              event.currentTarget.style.background = "#b91c1c";
            }}
            onMouseOut={(event) => {
              event.currentTarget.style.background = "#dc2626";
            }}
          >
            Logout
          </button>
        </section>

        {/* ================= BUG FORM ================= */}

        <BugForm
          onBugAdded={loadBugs}
          selectedBug={selectedBug}
          clearSelection={() => setSelectedBug(null)}
        />

        {/* ================= DASHBOARD CARDS ================= */}

        <section style={{ marginTop: "25px" }}>
          <DashboardCards bugs={bugs} />
        </section>

        {/* ================= CHARTS ================= */}

        <section style={{ marginTop: "25px" }}>
          <Charts bugs={bugs} />
        </section>

        {/* ================= SEARCH & FILTER ================= */}

        <section style={{ marginTop: "25px" }}>
          <SearchFilter
            search={search}
            setSearch={setSearch}
            severity={severity}
            setSeverity={setSeverity}
            status={status}
            setStatus={setStatus}
          />
        </section>

        {/* ================= BUG REPORTS ================= */}

        <section style={{ marginTop: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "26px",
                  fontWeight: "700",
                }}
              >
                Bug Reports
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                Manage, analyze and track reported bugs
              </p>
            </div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Showing {filteredBugs.length} of {bugs.length} bugs
            </div>
          </div>

          {/* ================= ACTIVE FILTER MESSAGE ================= */}

          {filtersApplied && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                padding: "10px 15px",
                marginBottom: "15px",
                borderRadius: "8px",
                background: "#f5f5f5",
                fontSize: "14px",
              }}
            >
              <span>Filters are currently applied.</span>

              <button
                type="button"
                onClick={clearFilters}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* ================= BUG TABLE ================= */}

          {filteredBugs.length > 0 ? (
            <BugTable
              bugs={filteredBugs}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div
              style={{
                padding: "50px 20px",
                textAlign: "center",
                borderRadius: "10px",
                background: "#fafafa",
                border: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "10px",
                }}
              >
                🐞
              </div>

              <h3 style={{ margin: "0 0 8px" }}>
                No Bugs Found
              </h3>

              <p style={{ margin: 0, color: "#777" }}>
                Try changing your search or filter options.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Dashboard;
