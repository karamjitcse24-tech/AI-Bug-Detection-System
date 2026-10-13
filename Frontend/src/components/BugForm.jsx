
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

  // Theme-aware colors shared by the form controls.
  const inputStyles = {
    "& .MuiInputLabel-root": {
      color: "var(--text)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--accent)",
    },
    "& .MuiOutlinedInput-root": {
      color: "var(--text-h)",
      backgroundColor: "var(--surface)",
      "& fieldset": {
        borderColor: "var(--border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--accent)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--accent)",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "var(--text)",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "var(--text)",
      opacity: 0.8,
    },
  };

  // Load selected bug data for editing.
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

      if (selectedBug.aiReason || selectedBug.aiRecommendation) {
        setAiAnalysis(
          `Reason: ${
            selectedBug.aiReason || "Not available"
          }\n\nRecommendation: ${
            selectedBug.aiRecommendation || "Not available"
          }`
        );
      } else {
        setAiAnalysis("");
      }
    } else {
      resetFormData();
    }
  }, [selectedBug]);

  // Reset form fields.
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

  // Handle changes in input fields.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setBug((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Analyze the bug using the existing AI API.
  const analyzeWithAI = async () => {
    if (!bug.description.trim()) {
      alert("Please enter Bug Description first.");
      return;
    }

    try {
      setLoadingAI(true);
      setAiAnalysis("");

      const result = await analyzeBugWithAI(bug.description);

      console.log("AI Response:", result);

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
        setAiAnalysis("AI did not return any result.");
        return;
      }

      setAiAnalysis(aiResult);

      // Detect severity from the AI response.
      const severityMatch = aiResult.match(
        /\b(Low|Medium|High|Critical)\b/i
      );

      let detectedSeverity = bug.severity;

      if (severityMatch) {
        detectedSeverity =
          severityMatch[1].charAt(0).toUpperCase() +
          severityMatch[1].slice(1).toLowerCase();
      }

      // Extract the reason, when present.
      let reason = "";

      const reasonMatch = aiResult.match(
        /Reason:\s*([\s\S]*?)(?=\n\s*Recommendation:|$)/i
      );

      if (reasonMatch) {
        reason = reasonMatch[1].trim();
      }

      // Extract the recommendation, when present.
      let recommendation = "";

      const recommendationMatch = aiResult.match(
        /Recommendation:\s*([\s\S]*)/i
      );

      if (recommendationMatch) {
        recommendation = recommendationMatch[1].trim();
      }

      // Update the form with the AI results.
      setBug((prev) => ({
        ...prev,
        severity: detectedSeverity,
        aiReason: reason,
        aiRecommendation: recommendation,
      }));
    } catch (error) {
      console.error("AI Analysis Error:", error);

      setAiAnalysis(
        "Unable to analyze the bug. Please try again."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  // Create a new bug or update an existing bug.
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
      console.error("Error saving bug:", error);
      alert("Failed to save bug");
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 900,
        width: "100%",
        boxSizing: "border-box",
        margin: "30px auto",
        borderRadius: 4,
        boxShadow: 6,
        padding: { xs: 0.5, sm: 2 },
        backgroundColor: "var(--surface)",
        color: "var(--text)",
        border: "1px solid var(--border)",
        transition:
          "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      <CardContent
        sx={{
          "&:last-child": {
            paddingBottom: 3,
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: "var(--text-h)",
            fontSize: { xs: "25px", sm: "30px" },
            mb: 3,
          }}
        >
          {selectedBug ? "Update Bug" : "Add New Bug"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            {/* Bug title */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bug Title"
                name="title"
                value={bug.title}
                onChange={handleChange}
                required
                sx={inputStyles}
              />
            </Grid>

            {/* Severity */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Severity"
                name="severity"
                value={bug.severity}
                onChange={handleChange}
                sx={inputStyles}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </TextField>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={bug.status}
                onChange={handleChange}
                sx={inputStyles}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">
                  In Progress
                </MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>
            </Grid>

            {/* Bug description */}
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
                sx={inputStyles}
              />
            </Grid>

            {/* AI loading indicator */}
            {loadingAI && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1.5,
                    color: "var(--text)",
                    py: 1,
                  }}
                >
                  <CircularProgress
                    size={25}
                    sx={{ color: "var(--accent)" }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ color: "var(--text)" }}
                  >
                    AI analyzing bug...
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* AI analysis card */}
            {aiAnalysis && !loadingAI && (
              <Grid item xs={12}>
                <Paper
                  elevation={2}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    backgroundColor: "var(--surface-secondary)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    overflowWrap: "anywhere",
                    transition:
                      "background-color 0.25s ease, color 0.25s ease",
                  }}
                >
                  {/* AI header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <AutoAwesomeIcon
                      sx={{ color: "var(--accent)" }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "var(--text-h)" }}
                    >
                      AI Bug Analysis
                    </Typography>
                  </Box>

                  {/* Detected severity */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        color: "var(--text)",
                      }}
                    >
                      Detected Severity
                    </Typography>

                    <Chip
                      label={bug.severity}
                      color={
                        bug.severity === "Critical" ||
                        bug.severity === "High"
                          ? "error"
                          : bug.severity === "Medium"
                          ? "warning"
                          : "success"
                      }
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>

                  <Divider
                    sx={{
                      mb: 2,
                      borderColor: "var(--border)",
                    }}
                  />

                  {/* AI reason */}
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
                          sx={{ color: "var(--text-h)" }}
                        >
                          Why this severity?
                        </Typography>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.7,
                          color: "var(--text)",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {bug.aiReason}
                      </Typography>
                    </Box>
                  )}

                  {/* AI recommendation */}
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
                          sx={{ color: "var(--text-h)" }}
                        >
                          Recommended Action
                        </Typography>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.7,
                          color: "var(--text)",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {bug.aiRecommendation}
                      </Typography>
                    </Box>
                  )}

                  {/* Fallback for responses without parsed fields */}
                  {!bug.aiReason && !bug.aiRecommendation && (
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-line",
                        lineHeight: 1.7,
                        color: "var(--text)",
                      }}
                    >
                      {aiAnalysis}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Form buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1.5,
                  mt: 1,
                }}
              >
                {/* Add or update */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={
                    selectedBug ? <UpdateIcon /> : <AddIcon />
                  }
                  sx={{
                    px: 3.5,
                    py: 1.4,
                    borderRadius: 3,
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedBug ? "Update Bug" : "Add Bug"}
                </Button>

                {/* Analyze with AI */}
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={analyzeWithAI}
                  disabled={loadingAI}
                  sx={{
                    px: 2.5,
                    py: 1.4,
                    borderRadius: 3,
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {loadingAI ? "Analyzing..." : "Analyze with AI"}
                </Button>

                {/* Cancel edit */}
                {selectedBug && (
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => {
                      resetFormData();

                      if (clearSelection) {
                        clearSelection();
                      }
                    }}
                    sx={{
                      color: "var(--text)",
                      borderRadius: 2,
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default BugForm;
