
import { useEffect, useState } from "react";
import { getAllBugs, deleteBug } from "../services/bugService";
import BugForm from "../components/BugForm";

function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBug, setSelectedBug] = useState(null);

  useEffect(() => {
    loadBugs();
  }, []);

  // Load bug reports from the backend.
  const loadBugs = async () => {
    try {
      setLoading(true);

      const response = await getAllBugs();

      setBugs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading bugs:", error);

      alert(
        "Cannot connect to backend!\n\n" +
          "Please check that the backend is running and accessible."
      );
    } finally {
      setLoading(false);
    }
  };

  // Select a bug for editing.
  const handleEdit = (bug) => {
    setSelectedBug(bug);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Clear the selected bug.
  const clearSelection = () => {
    setSelectedBug(null);
  };

  // Delete a bug report.
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bug?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBug(id);

      if (selectedBug?.id === id) {
        clearSelection();
      }

      await loadBugs();

      alert("Bug deleted successfully!");
    } catch (error) {
      console.error("Error deleting bug:", error);
      alert("Failed to delete bug!");
    }
  };

  // Theme-aware severity badges.
  const getSeverityStyle = (severity) => {
    const value = String(severity || "").toLowerCase();

    if (value.includes("critical") || value.includes("high")) {
      return {
        color: "var(--danger-text, #dc2626)",
        background: "var(--danger-bg, #fee2e2)",
      };
    }

    if (value.includes("medium")) {
      return {
        color: "var(--warning-text, #b45309)",
        background: "var(--warning-bg, #fef3c7)",
      };
    }

    return {
      color: "var(--success-text, #15803d)",
      background: "var(--success-bg, #dcfce7)",
    };
  };

  // Theme-aware status badges.
  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value.includes("resolved") || value.includes("closed")) {
      return {
        color: "var(--success-text, #15803d)",
        background: "var(--success-bg, #dcfce7)",
      };
    }

    if (value.includes("progress")) {
      return {
        color: "var(--accent)",
        background: "var(--accent-bg)",
      };
    }

    return {
      color: "var(--warning-text, #b45309)",
      background: "var(--warning-bg, #fef3c7)",
    };
  };

  const cardStyle = {
    minWidth: 0,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "clamp(16px, 2vw, 26px)",
    boxShadow: "var(--shadow)",
    color: "var(--text)",
    transition: "background-color 0.25s ease, color 0.25s ease",
  };

  const buttonStyle = {
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "8px 13px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    whiteSpace: "nowrap",
  };

  const openBugs = bugs.filter((bug) => {
    const status = String(bug.status || "").toLowerCase();

    return !status.includes("resolved") && !status.includes("closed");
  }).length;

  const closedBugs = bugs.filter((bug) => {
    const status = String(bug.status || "").toLowerCase();

    return status.includes("resolved") || status.includes("closed");
  }).length;

  const highSeverityBugs = bugs.filter((bug) => {
    const severity = String(bug.severity || "").toLowerCase();

    return severity.includes("high") || severity.includes("critical");
  }).length;

  const summaryCards = [
    {
      label: "Total Bugs",
      value: bugs.length,
      color: "#1976d2",
      icon: "🐞",
    },
    {
      label: "Open Bugs",
      value: openBugs,
      color: "#ed7900",
      icon: "!",
    },
    {
      label: "Closed Bugs",
      value: closedBugs,
      color: "#27833a",
      icon: "✓",
    },
    {
      label: "High Severity",
      value: highSeverityBugs,
      color: "#d72f32",
      icon: "⚠",
    },
  ];

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: "100vh",
        margin: 0,
        padding: "clamp(16px, 2.5vw, 36px)",
        boxSizing: "border-box",
        textAlign: "left",
        color: "var(--text)",
        background: "var(--bg)",
        transition: "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      {/* Page heading */}
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "1.5px",
              marginBottom: "8px",
            }}
          >
            PROJECT OVERVIEW
          </p>

          <h1
            style={{
              fontSize: "clamp(25px, 3vw, 38px)",
              fontWeight: 750,
              letterSpacing: "-1px",
              lineHeight: 1.2,
              margin: 0,
              color: "var(--text-h)",
              overflowWrap: "anywhere",
            }}
          >
            AI Bug Detection System
          </h1>

          <p
            style={{
              marginTop: "8px",
              fontSize: "14px",
              color: "var(--text)",
            }}
          >
            Manage, review, and track your bug reports.
          </p>
        </div>

        <button
          type="button"
          onClick={loadBugs}
          disabled={loading}
          style={{
            ...buttonStyle,
            background: "var(--accent)",
            color: "#ffffff",
            borderColor: "var(--accent)",
            padding: "11px 18px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </header>

      {/* Bug form */}
      <section
        style={{
          ...cardStyle,
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            color: "var(--text-h)",
            fontSize: "clamp(19px, 2vw, 23px)",
            margin: "0 0 16px",
          }}
        >
          {selectedBug ? "Edit Bug Report" : "Create Bug Report"}
        </h2>

        <BugForm
          onBugAdded={loadBugs}
          selectedBug={selectedBug}
          clearSelection={clearSelection}
        />
      </section>

      {/* Summary cards */}
      <section
        aria-label="Bug summary"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "18px",
          marginBottom: "24px",
          width: "100%",
        }}
      >
        {summaryCards.map((item) => (
          <div
            key={item.label}
            style={{
              minWidth: 0,
              minHeight: "142px",
              padding: "22px 16px",
              borderRadius: "14px",
              background: item.color,
              color: "#ffffff",
              boxShadow: "var(--shadow)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "8px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontSize: item.label === "Open Bugs" ? "30px" : "28px",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {item.icon}
            </span>

            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {item.label}
            </span>

            <span
              style={{
                fontSize: "32px",
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </section>

      {/* Bug reports table */}
      <section
        style={{
          ...cardStyle,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{
                color: "var(--text-h)",
                fontSize: "clamp(19px, 2vw, 23px)",
                margin: "0 0 6px",
              }}
            >
              Bug Reports
            </h2>

            <p style={{ fontSize: "13px", color: "var(--text)" }}>
              Review bug details and AI recommendations.
            </p>
          </div>

          <span
            style={{
              borderRadius: "20px",
              background: "var(--accent-bg)",
              color: "var(--accent)",
              padding: "7px 12px",
              fontWeight: 700,
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            {bugs.length} reports
          </span>
        </div>

        {loading ? (
          <p style={{ padding: "28px 0" }}>Loading bug reports...</p>
        ) : bugs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "42px 16px",
              background: "var(--surface-secondary)",
              borderRadius: "12px",
              color: "var(--text)",
            }}
          >
            <p
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--text-h)",
              }}
            >
              No bug reports found
            </p>

            <p style={{ fontSize: "13px", marginTop: "8px" }}>
              Create a bug report using the form above.
            </p>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              overflowX: "auto",
              border: "1px solid var(--border)",
              borderRadius: "10px",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "900px",
                borderCollapse: "collapse",
                fontSize: "13px",
                color: "var(--text)",
                background: "var(--surface)",
              }}
            >
              <thead>
                <tr style={{ background: "var(--surface-secondary)" }}>
                  {[
                    "ID",
                    "Title",
                    "Description",
                    "Severity",
                    "Status",
                    "AI Reason",
                    "AI Recommendation",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      style={{
                        padding: "14px 12px",
                        textAlign: "left",
                        color: "var(--text-h)",
                        borderBottom: "1px solid var(--border)",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {bugs.map((bug) => (
                  <tr key={bug.id}>
                    <td style={cellStyle}>{bug.id}</td>

                    <td
                      style={{
                        ...cellStyle,
                        fontWeight: 700,
                        color: "var(--text-h)",
                      }}
                    >
                      {bug.title || "Untitled"}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        minWidth: "160px",
                        maxWidth: "280px",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {bug.description || "—"}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          ...getSeverityStyle(bug.severity),
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: "20px",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bug.severity || "Not set"}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          ...getStatusStyle(bug.status),
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: "20px",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bug.status || "Open"}
                      </span>
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        minWidth: "160px",
                        maxWidth: "280px",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {bug.aiReason || "Not analyzed yet"}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        minWidth: "160px",
                        maxWidth: "280px",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {bug.aiRecommendation || "Not analyzed yet"}
                    </td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleEdit(bug)}
                          style={{
                            ...buttonStyle,
                            background: "var(--accent-bg)",
                            color: "var(--accent)",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(bug.id)}
                          style={{
                            ...buttonStyle,
                            background:
                              "var(--danger-bg, #fee2e2)",
                            color:
                              "var(--danger-text, #dc2626)",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const cellStyle = {
  padding: "13px 12px",
  textAlign: "left",
  verticalAlign: "top",
  borderBottom: "1px solid var(--border)",
  color: "var(--text)",
};

export default Dashboard;
