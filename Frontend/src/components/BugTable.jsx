
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

function BugTable({ bugs = [], onEdit, onDelete }) {
  const [selectedBug, setSelectedBug] = useState(null);

  // Detect smaller screens
  const isSmallScreen = useMediaQuery("(max-width:900px)");

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
            color: "var(--text)",
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
                  color: "var(--text)",
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
            sx={{ fontWeight: "bold" }}
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
          color={params.value === "Open" ? "primary" : "success"}
          size="small"
          sx={{ fontWeight: "bold" }}
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
          onClick={() => handleAIAnalysis(params.row)}
          sx={{
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
            minWidth: isSmallScreen ? 95 : 115,
            fontSize: isSmallScreen ? "11px" : "12px",
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
            onClick={() => onEdit(params.row)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              minWidth: isSmallScreen ? 45 : 55,
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
            onClick={() => onDelete(params.row.id)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              minWidth: isSmallScreen ? 55 : 65,
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
          backgroundColor: "var(--surface)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          overflow: "hidden",
          transition: "background-color 0.2s ease",
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
            color: "var(--text)",
            backgroundColor: "var(--surface)",

            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
              backgroundColor: "var(--surface-secondary)",
              color: "var(--text-h)",
              borderBottom: "1px solid var(--border)",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },

            "& .MuiDataGrid-cell": {
              fontSize: "12px",
              color: "var(--text)",
              borderBottom: "1px solid var(--border)",
            },

            "& .MuiDataGrid-row": {
              backgroundColor: "var(--surface)",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "var(--surface-secondary)",
            },

            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "var(--accent-bg)",
            },

            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: "var(--accent-bg)",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid var(--border)",
              color: "var(--text)",
              backgroundColor: "var(--surface)",
            },

            "& .MuiTablePagination-root": {
              color: "var(--text)",
            },

            "& .MuiTablePagination-selectIcon": {
              color: "var(--text)",
            },

            "& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton":
              {
                color: "var(--text)",
              },

            "& .MuiDataGrid-overlay": {
              backgroundColor: "var(--surface)",
              color: "var(--text)",
            },

            "& .MuiDataGrid-filler": {
              backgroundColor: "var(--surface)",
            },

            "& .MuiDataGrid-scrollbar": {
              scrollbarColor: "var(--border) var(--surface)",
            },

            transition: "background-color 0.2s ease",
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

      {/* ================= AI ANALYSIS DIALOG ================= */}

      <Dialog
        open={Boolean(selectedBug)}
        onClose={handleCloseAI}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 3,
            boxShadow: "var(--shadow)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "24px",
            color: "var(--text-h)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          ✨ AI Bug Analysis
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {selectedBug && (
            <Box>
              {/* Bug Title */}

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "var(--text-h)" }}
              >
                {selectedBug.title}
              </Typography>

              {/* Severity */}

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ mb: 1, color: "var(--text-h)" }}
                >
                  Detected Severity
                </Typography>

                <Chip
                  label={selectedBug.severity}
                  color={
                    selectedBug.severity === "High"
                      ? "error"
                      : selectedBug.severity === "Medium"
                      ? "warning"
                      : "success"
                  }
                  sx={{ fontWeight: "bold" }}
                />
              </Box>

              <Divider sx={{ my: 2, borderColor: "var(--border)" }} />

              {/* Bug Description */}

              <Typography
                variant="body1"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "var(--text-h)" }}
              >
                🐞 Bug Description
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: "var(--text)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {selectedBug.description || "No description provided."}
              </Typography>

              <Divider sx={{ my: 2, borderColor: "var(--border)" }} />

              {/* AI Reason */}

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  color: "var(--text-h)",
                }}
              >
                💡 Why this severity?
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.7,
                  color: "var(--text)",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {selectedBug.aiReason ||
                  "AI analysis is not available for this bug."}
              </Typography>

              <Divider sx={{ my: 2, borderColor: "var(--border)" }} />

              {/* AI Recommendation */}

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  color: "var(--text-h)",
                }}
              >
                🔧 Recommended Action
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.7,
                  color: "var(--text)",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {selectedBug.aiRecommendation ||
                  "No AI recommendation is available for this bug."}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            borderTop: "1px solid var(--border)",
          }}
        >
          <Button
            onClick={handleCloseAI}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
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
