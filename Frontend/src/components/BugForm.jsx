import { useState, useEffect } from "react";

import {
  createBug,
  updateBug,
  analyzeBugWithAI,
} from "../services/bugService";

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

function BugForm({
  onBugAdded,
  selectedBug,
  clearSelection,
}) {
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

  // Load selected bug data for editing
  useEffect(() => {
    if (selectedBug) {
      setBug({
        title: selectedBug.title || "",
        description: selectedBug.description || "",
        severity: selectedBug.severity || "Low",
        status: selectedBug.status || "Open",
        aiReason: selectedBug.aiReason || "",
        aiRecommendation:
          selectedBug.aiRecommendation || "",
      });

      if (
        selectedBug.aiReason ||
        selectedBug.aiRecommendation
      ) {
        setAiAnalysis(
          `Reason: ${
            selectedBug.aiReason || "Not available"
          }\n\nRecommendation: ${
            selectedBug.aiRecommendation ||
            "Not available"
          }`
        );
      } else {
        setAiAnalysis("");
      }
    } else {
      resetFormData();
    }
  }, [selectedBug]);

  const resetFormData = () => {
    setBug({
      title: "",
      description: "",
      severity: "Low",
      status: "Open",
      aiReason: "",
      aiRecommendation: "",
    });

    setAiAnalysis("");
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setBug((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // AI Analysis using your CURRENT working API
  const analyzeWithAI = async () => {
    if (!bug.description.trim()) {
      alert("Please enter Bug Description first.");
      return;
    }

    try {
      setLoadingAI(true);
      setAiAnalysis("");

      const result = await analyzeBugWithAI(
        bug.description
      );

      console.log("AI Response:", result);

      // Convert response to readable text
      let aiResult = "";

      if (typeof result === "string") {
        aiResult = result.trim();
      } else if (result?.result) {
        aiResult = String(result.result).trim();
      } else if (result?.analysis) {
        aiResult = String(result.analysis).trim();
      } else {
        aiResult = JSON.stringify(result, null, 2);
      }

      if (!aiResult) {
        setAiAnalysis(
          "AI did not return any result."
        );
        return;
      }

      setAiAnalysis(aiResult);

      // Detect severity
      const severityMatch = aiResult.match(
        /\b(Low|Medium|High|Critical)\b/i
      );

      let detectedSeverity = bug.severity;

      if (severityMatch) {
        detectedSeverity =
          severityMatch[1]
            .charAt(0)
            .toUpperCase() +
          severityMatch[1]
            .slice(1)
            .toLowerCase();
      }

      // Extract reason
      let reason = "";

      const reasonMatch = aiResult.match(
        /Reason:\s*([\s\S]*?)(?=\n\s*Recommendation:|$)/i
      );

      if (reasonMatch) {
        reason = reasonMatch[1].trim();
      }

      // Extract recommendation
      let recommendation = "";

      const recommendationMatch =
        aiResult.match(
          /Recommendation:\s*([\s\S]*)/i
        );

      if (recommendationMatch) {
        recommendation =
          recommendationMatch[1].trim();
      }

      // Save AI result in current form state
      setBug((prev) => ({
        ...prev,
        severity: detectedSeverity,
        aiReason: reason,
        aiRecommendation: recommendation,
      }));
    } catch (error) {
      console.error(
        "AI Analysis Error:",
        error
      );

      setAiAnalysis(
        "Unable to analyze the bug. Please try again."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  // Submit Bug
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

      resetFormData();

      if (clearSelection) {
        clearSelection();
      }

      if (onBugAdded) {
        await onBugAdded();
      }
    } catch (error) {
      console.error(
        "Error saving bug:",
        error
      );

      alert("Failed to save bug");
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
        {/* HEADING */}

        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          {selectedBug
            ? "Update Bug"
            : "Add New Bug"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3}>
            {/* BUG TITLE */}

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

            {/* SEVERITY */}

            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Severity"
                name="severity"
                value={bug.severity}
                onChange={handleChange}
              >
                <MenuItem value="Low">
                  Low
                </MenuItem>

                <MenuItem value="Medium">
                  Medium
                </MenuItem>

                <MenuItem value="High">
                  High
                </MenuItem>

                <MenuItem value="Critical">
                  Critical
                </MenuItem>
              </TextField>
            </Grid>

            {/* STATUS */}

            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={bug.status}
                onChange={handleChange}
              >
                <MenuItem value="Open">
                  Open
                </MenuItem>

                <MenuItem value="In Progress">
                  In Progress
                </MenuItem>

                <MenuItem value="Resolved">
                  Resolved
                </MenuItem>

                <MenuItem value="Closed">
                  Closed
                </MenuItem>
              </TextField>
            </Grid>

            {/* DESCRIPTION */}

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

            {/* AI LOADING */}

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

            {/* AI ANALYSIS CARD */}

            {aiAnalysis && !loadingAI && (
              <Grid item xs={12}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "#faf7ff",
                    border:
                      "1px solid #d1c4e9",
                  }}
                >
                  {/* HEADER */}

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

                  {/* SEVERITY */}

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
                        bug.severity === "Critical" ||
                        bug.severity === "High"
                          ? "error"
                          : bug.severity ===
                            "Medium"
                          ? "warning"
                          : "success"
                      }
                      sx={{
                        fontWeight: "bold",
                      }}
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* REASON */}

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

                  {/* RECOMMENDATION */}

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

                  {/* FALLBACK */}

                  {!bug.aiReason &&
                    !bug.aiRecommendation && (
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace:
                            "pre-line",
                          lineHeight: 1.7,
                        }}
                      >
                        {aiAnalysis}
                      </Typography>
                    )}
                </Paper>
              </Grid>
            )}

            {/* BUTTONS */}

            <Grid
              item
              xs={12}
              textAlign="center"
            >
              {/* ADD / UPDATE */}

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

              {/* AI BUTTON */}

              <Button
                type="button"
                variant="outlined"
                color="secondary"
                startIcon={
                  <AutoAwesomeIcon />
                }
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

              {/* CANCEL EDIT */}

              {selectedBug && (
                <Button
                  type="button"
                  onClick={() => {
                    resetFormData();

                    if (clearSelection) {
                      clearSelection();
                    }
                  }}
                  sx={{
                    ml: 2,
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default BugForm;
