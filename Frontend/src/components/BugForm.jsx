import { useEffect, useState } from "react";

import {
  createBug,
  updateBug,
  analyzeBugWithAI,
} from "../services/bugService";

function BugForm({
  onBugAdded,
  selectedBug,
  clearSelection,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [status, setStatus] = useState("Open");

  // Load selected bug data for editing
  useEffect(() => {
    if (selectedBug) {
      setTitle(selectedBug.title || "");
      setDescription(selectedBug.description || "");
      setSeverity(selectedBug.severity || "Low");
      setStatus(selectedBug.status || "Open");
    }
  }, [selectedBug]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSeverity("Low");
    setStatus("Open");

    if (clearSelection) {
      clearSelection();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bug = {
      title,
      description,
      severity,
      status,
    };

    try {
      if (selectedBug) {
        await updateBug(selectedBug.id, bug);
        alert("Bug Updated Successfully!");
      } else {
        await createBug(bug);
        alert("Bug Added Successfully!");
      }

      resetForm();

      if (onBugAdded) {
        onBugAdded();
      }
    } catch (error) {
      console.error("Error saving bug:", error);
      alert("Failed to save bug");
    }
  };

  const handleAIAnalysis = async () => {
    if (!description.trim()) {
      alert("Please enter a bug description first.");
      return;
    }

    try {
      const result = await analyzeBugWithAI(description);

      alert(
        typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2)
      );
    } catch (error) {
      console.error("AI Analysis Error:", error);
      alert("AI analysis failed");
    }
  };

  return (
    <section
      style={{
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#fff",
      }}
    >
      <h2>
        {selectedBug ? "Edit Bug" : "Report a Bug"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Bug Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Severity</label>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          >
            <option value="Open">Open</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button type="submit">
            {selectedBug ? "Update Bug" : "Add Bug"}
          </button>

          <button
            type="button"
            onClick={handleAIAnalysis}
          >
            Analyze with AI
          </button>

          {selectedBug && (
            <button
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default BugForm;
