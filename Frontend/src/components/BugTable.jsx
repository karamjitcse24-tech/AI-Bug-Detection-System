import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import {
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";

function BugTable({ bugs, onEdit, onDelete }) {
  const [selectedBug, setSelectedBug] = useState(null);

  // Detect smaller screens
  const isSmallScreen = useMediaQuery(
    "(max-width:900px)"
  );

  const handleAIAnalysis = (bug) => {
    setSelectedBug(bug);
  };

  const handleCloseAI = () => {
    setSelectedBug(null);
  };

  // ================= COLUMNS =================

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 55,
      sortable: true,
    },

    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 100,

      renderCell: (params) => (
        <Typography
          variant="body2"
          noWrap
          sx={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </Typography>
      ),
    },

    // Hide Description on smaller screens
    ...(!isSmallScreen
      ? [
          {
            field: "description",
            headerName: "Description",
            flex: 1.5,
            minWidth: 180,

            renderCell: (params) => (
              <Typography
                variant="body2"
                noWrap
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {params.value}
              </Typography>
            ),
          },
        ]
      : []),

    {
      field: "severity",
      headerName: "Severity",
      width: isSmallScreen ? 75 : 100,

      renderCell: (params) => {
        let color = "success";

        if (params.value === "High") {
          color = "error";
        } else if (params.value === "Medium") {
          color = "warning";
        }

        return (
          <Chip
            label={params.value}
            color={color}
            size="small"
            sx={{
              fontWeight: "bold",
            }}
          />
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: isSmallScreen ? 70 : 90,

      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Open"
              ? "primary"
              : "success"
          }
          size="small"
          sx={{
            fontWeight: "bold",
          }}
        />
      ),
    },

    // ================= AI ANALYSIS =================

    {
      field: "aiAnalysis",
      headerName: "AI Analysis",
      width: isSmallScreen ? 105 : 130,
      sortable: false,

      renderCell: (params) => (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() =>
            handleAIAnalysis(params.row)
          }
          sx={{
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
            minWidth: isSmallScreen ? 95 : 115,
            fontSize: isSmallScreen
              ? "11px"
              : "12px",
          }}
        >
          ✨ AI Analysis
        </Button>
      ),
    },

    // ================= ACTIONS =================

    {
      field: "actions",
      headerName: "Actions",
      width: isSmallScreen ? 120 : 150,
      sortable: false,

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              onEdit(params.row)
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              minWidth: isSmallScreen
                ? 45
                : 55,
              px: isSmallScreen ? 1 : 1.5,
              fontSize: "11px",
            }}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() =>
              onDelete(params.row.id)
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              minWidth: isSmallScreen
                ? 55
                : 65,
              px: isSmallScreen ? 1 : 1.5,
              fontSize: "11px",
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // ================= UI =================

  return (
    <>
      {/* ================= BUG TABLE ================= */}

      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={bugs}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          rowHeight={52}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          disableColumnMenu={isSmallScreen}
          sx={{
            border: "none",

            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
            },

            "& .MuiDataGrid-cell": {
              fontSize: "12px",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fafafa",
            },
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
        />
      </Box>

      {/* ================================================= */}
      {/* AI ANALYSIS DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={Boolean(selectedBug)}
        onClose={handleCloseAI}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          ✨ AI Bug Analysis
        </DialogTitle>

        <DialogContent>
          {selectedBug && (
            <Box>

              {/* Bug Title */}

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
              >
                {selectedBug.title}
              </Typography>

              {/* Severity */}

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Detected Severity
                </Typography>

                <Chip
                  label={selectedBug.severity}
                  color={
                    selectedBug.severity ===
                    "High"
                      ? "error"
                      : selectedBug.severity ===
                        "Medium"
                      ? "warning"
                      : "success"
                  }
                  sx={{
                    fontWeight: "bold",
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Bug Description */}

              <Typography
                variant="body1"
                fontWeight="bold"
                gutterBottom
              >
                🐞 Bug Description
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: "text.secondary",
                  lineHeight: 1.6,
                }}
              >
                {selectedBug.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* AI Reason */}

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 1,
                }}
              >
                💡 Why this severity?
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.7,
                }}
              >
                {selectedBug.aiReason ||
                  "AI analysis is not available for this bug."}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* AI Recommendation */}

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 1,
                }}
              >
                🔧 Recommended Action
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.7,
                }}
              >
                {selectedBug.aiRecommendation ||
                  "No AI recommendation is available for this bug."}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseAI}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              px: 3,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BugTable;