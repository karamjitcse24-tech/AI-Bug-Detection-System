
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

  const handleEdit = (bug) => {
    setSelectedBug(bug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSelection = () => {
    setSelectedBug(null);
  };

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
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "var(--shadow)",
    color: "var(--text)",
  };

  const buttonStyle = {
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "8px 13px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  };

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "1440px",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "24px",
        textAlign: "left",
        color: "var(--text)",
        background: "var(--bg)",
        minHeight: "100vh",
        transition: "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
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
              fontSize: "clamp(26px, 4vw, 36px)",
              fontWeight: 750,
              letterSpacing: "-1px",
              margin: 0,
              color: "var(--text-h)",
            }}
          >
            AI Bug Detection System
          </h1>

          <p style={{ marginTop: "8px", fontSize: "14px" }}>
            Manage, review, and track your bug reports.
          </p>
        </div>

        <button
          onClick={loadBugs}
          disabled={loading}
          style={{
            ...buttonStyle,
            background: "var(--accent)",
            color: "#ffffff",
            borderColor: "var(--accent)",
            padding: "11px 17px",
          }}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </header>

      <section
        style={{
          ...cardStyle,
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            color: "var(--text-h)",
            fontSize: "20px",
            marginBottom: "18px",
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

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <p style={{ fontSize: "13px", fontWeight: 600 }}>
            TOTAL BUG REPORTS
          </p>
          <p
            style={{
              fontSize: "36px",
              fontWeight: 750,
              color: "var(--text-h)",
              marginTop: "10px",
            }}
          >
            {bugs.length}
          </p>
        </div>

        <div style={cardStyle}>
          <p style={{ fontSize: "13px", fontWeight: 600 }}>
            OPEN / UNRESOLVED
          </p>
          <p
            style={{
              fontSize: "36px",
              fontWeight: 750,
              color: "var(--accent)",
              marginTop: "10px",
            }}
          >
            {
              bugs.filter((bug) => {
                const status = String(bug.status || "").toLowerCase();
                return !status.includes("resolved") &&
                  !status.includes("closed");
              }).length
            }
          </p>
        </div>
      </section>

      <section style={cardStyle}>
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
                fontSize: "21px",
                marginBottom: "6px",
              }}
            >
              Bug Reports
            </h2>
            <p style={{ fontSize: "13px" }}>
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
            }}
          >
            <p style={{ fontSize: "17px", fontWeight: 700 }}>
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
              overflowX: "auto",
              border: "1px solid var(--border)",
              borderRadius: "10px",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "1050px",
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
                        minWidth: "180px",
                        maxWidth: "260px",
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
                        minWidth: "180px",
                        maxWidth: "260px",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {bug.aiReason || "Not analyzed yet"}
                    </td>
                    <td
                      style={{
                        ...cellStyle,
                        minWidth: "180px",
                        maxWidth: "260px",
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
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <button
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
                          onClick={() => handleDelete(bug.id)}
                          style={{
                            ...buttonStyle,
                            background: "var(--danger-bg, #fee2e2)",
                            color: "var(--danger-text, #dc2626)",
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
