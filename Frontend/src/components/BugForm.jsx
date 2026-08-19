import { useState, useEffect } from "react";
import { createBug, updateBug } from "../services/bugService";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  CircularProgress,
  Paper,
  Chip,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import BuildIcon from "@mui/icons-material/Build";

function BugForm({ onBugAdded, selectedBug, clearSelection }) {
  const [bug, setBug] = useState({
    title: "",
    description: "",
    severity: "Low",
    status: "Open",
    aiReason: "",
    aiRecommendation: "",
  });

  const [loadingAI, setLoadingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");

  useEffect(() => {
    if (selectedBug) {
      setBug({
        title: selectedBug.title || "",
        description: selectedBug.description || "",
        severity: selectedBug.severity || "Low",
        status: selectedBug.status || "Open",
        aiReason: selectedBug.aiReason || "",
        aiRecommendation: selectedBug.aiRecommendation || "",
      });

      setAiAnalysis(
        selectedBug.aiReason || selectedBug.aiRecommendation
          ? `Reason: ${selectedBug.aiReason || "Not available"}\n\nRecommendation: ${
              selectedBug.aiRecommendation || "Not available"
            }`
          : ""
      );
    } else {
      setBug({
        title: "",
        description: "",
        severity: "Low",
        status: "Open",
        aiReason: "",
        aiRecommendation: "",
      });

      setAiAnalysis("");
    }
  }, [selectedBug]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setBug((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🤖 Analyze bug with AI
  const analyzeWithAI = async () => {
    if (!bug.description.trim()) {
      alert("Please enter Bug Description first.");
      return;
    }

    try {
      setLoadingAI(true);
      setAiAnalysis("");

      const res = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: bug.description,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      console.log("AI Response:", data);

      const aiResult = String(data.result || "").trim();

      if (!aiResult) {
        setAiAnalysis("AI did not return any result.");
        return;
      }

      setAiAnalysis(aiResult);

      // -------------------------------
      // Find severity
      // -------------------------------
      const severityMatch = aiResult.match(
        /\b(Low|Medium|High)\b/i
      );

      let detectedSeverity = bug.severity;

      if (severityMatch) {
        detectedSeverity =
          severityMatch[1].charAt(0).toUpperCase() +
          severityMatch[1].slice(1).toLowerCase();
      }

      // -------------------------------
      // Extract Reason
      // -------------------------------
      let reason = "";

      const reasonMatch = aiResult.match(
        /Reason:\s*([\s\S]*?)(?=\n\s*Recommendation:|$)/i
      );

      if (reasonMatch) {
        reason = reasonMatch[1].trim();
      }

      // -------------------------------
      // Extract Recommendation
      // -------------------------------
      let recommendation = "";

      const recommendationMatch = aiResult.match(
        /Recommendation:\s*([\s\S]*)/i
      );

      if (recommendationMatch) {
        recommendation = recommendationMatch[1].trim();
      }

      // -------------------------------
      // Save AI information in bug state
      // -------------------------------
      setBug((prev) => ({
        ...prev,
        severity: detectedSeverity,
        aiReason: reason,
        aiRecommendation: recommendation,
      }));

    } catch (error) {
      console.error("AI Error:", error);

      setAiAnalysis(
        "Unable to analyze the bug. Please make sure the backend is running."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  // Submit bug
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedBug) {
        await updateBug(selectedBug.id, bug);
        alert("Bug Updated Successfully!");
      } else {
        await createBug(bug);
        alert("Bug Added Successfully!");
      }

      // Reset
      setBug({
        title: "",
        description: "",
        severity: "Low",
        status: "Open",
        aiReason: "",
        aiRecommendation: "",
      });

      setAiAnalysis("");

      if (clearSelection) {
        clearSelection();
      }

      onBugAdded();

    } catch (error) {
      console.error(error);
      alert("Operation Failed");
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 900,
        margin: "30px auto",
        borderRadius: 4,
        boxShadow: 6,
        padding: 2,
      }}
    >
      <CardContent>

        {/* Heading */}
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          {selectedBug ? "Update Bug" : "Add New Bug"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>

          <Grid container spacing={3}>

            {/* Bug Title */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bug Title"
                name="title"
                value={bug.title}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Severity */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Severity"
                name="severity"
                value={bug.severity}
                onChange={handleChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={bug.status}
                onChange={handleChange}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bug Description"
                name="description"
                value={bug.description}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* AI Loading */}
            {loadingAI && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={25} />

                  <Typography variant="body2">
                    AI analyzing bug...
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* AI Analysis */}
            {aiAnalysis && !loadingAI && (
              <Grid item xs={12}>

                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "#faf7ff",
                    border: "1px solid #d1c4e9",
                  }}
                >

                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <AutoAwesomeIcon color="secondary" />

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      AI Bug Analysis
                    </Typography>
                  </Box>

                  {/* Severity */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1 }}
                    >
                      Detected Severity
                    </Typography>

                    <Chip
                      label={bug.severity}
                      color={
                        bug.severity === "High"
                          ? "error"
                          : bug.severity === "Medium"
                          ? "warning"
                          : "success"
                      }
                      sx={{
                        fontWeight: "bold",
                      }}
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Reason */}
                  {bug.aiReason && (
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <LightbulbIcon color="warning" />

                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                        >
                          Why this severity?
                        </Typography>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.7,
                        }}
                      >
                        {bug.aiReason}
                      </Typography>
                    </Box>
                  )}

                  {/* Recommendation */}
                  {bug.aiRecommendation && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <BuildIcon color="primary" />

                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                        >
                          Recommended Action
                        </Typography>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.7,
                        }}
                      >
                        {bug.aiRecommendation}
                      </Typography>
                    </Box>
                  )}

                  {/* Fallback */}
                  {!bug.aiReason &&
                    !bug.aiRecommendation && (
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: "pre-line",
                          lineHeight: 1.7,
                        }}
                      >
                        {aiAnalysis}
                      </Typography>
                    )}

                </Paper>
              </Grid>
            )}

            {/* Buttons */}
            <Grid item xs={12} textAlign="center">

              {/* Add / Update */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={
                  selectedBug
                    ? <UpdateIcon />
                    : <AddIcon />
                }
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "16px",
                  fontWeight: "bold",
                  mr: 2,
                }}
              >
                {selectedBug
                  ? "Update Bug"
                  : "Add Bug"}
              </Button>

              {/* AI Button */}
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                startIcon={<AutoAwesomeIcon />}
                onClick={analyzeWithAI}
                disabled={loadingAI}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {loadingAI
                  ? "Analyzing..."
                  : "Analyze with AI"}
              </Button>

            </Grid>

          </Grid>

        </Box>

      </CardContent>
    </Card>
  );
}

export default BugForm;