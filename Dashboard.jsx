import { useEffect, useState } from "react";
import { getAllBugs } from "../services/bugService";
import BugForm from "../components/BugForm";

function Dashboard() {
  alert("Dashboard Started");

  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    alert("Calling Backend");

    try {
      const response = await getAllBugs();

      alert("Backend Returned " + response.data.length + " Bug(s)");

      setBugs(response.data);
    }catch (error) {
  console.error(error);

  alert(
    "Error: " +
      (error.response?.status || "No Status") +
      "\n" +
      (error.message || "No Message")
  );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Bug Detection System</h1>
      <BugForm onBugAdded={loadBugs} />

      <h2>Bug Reports</h2>

      <h3>Total Bugs: {bugs.length}</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Status</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;