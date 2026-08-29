import { useEffect, useState } from "react";
import { getAllBugs, deleteBug } from "../services/bugService";
import BugForm from "../components/BugForm";

function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBugs();
  }, []);

  // Load all bugs from backend
  const loadBugs = async () => {
    try {
      setLoading(true);

      const response = await getAllBugs();

      setBugs(response.data);
    } catch (error) {
      console.error("Error loading bugs:", error);

      alert(
        "Cannot connect to backend!\n\n" +
        "Make sure Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a bug
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bug?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteBug(id);

      alert("Bug deleted successfully!");

      // Reload bug list
      loadBugs();

    } catch (error) {
      console.error("Error deleting bug:", error);

      alert("Failed to delete bug!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🤖 AI Bug Detection System</h1>

      {/* Bug Form */}
      <BugForm onBugAdded={loadBugs} />

      <hr />

      <h2>Bug Reports</h2>

      <h3>Total Bugs: {bugs.length}</h3>

      {loading ? (
        <h3>Loading bugs...</h3>
      ) : bugs.length === 0 ? (
        <h3>No bugs found.</h3>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Status</th>
              <th>AI Reason</th>
              <th>AI Recommendation</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bugs.map((bug) => (
              <tr key={bug.id}>
                <td>{bug.id}</td>

                <td>{bug.title}</td>

                <td>{bug.description}</td>

                <td>{bug.severity}</td>

                <td>{bug.status}</td>

                <td>
                  {bug.aiReason || "Not analyzed yet"}
                </td>

                <td>
                  {bug.aiRecommendation || "Not analyzed yet"}
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(bug.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
