//======================================================
// SuppliesReportToolbar.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Box,
  Button,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

//======================================================
// SuppliesReportToolbar
//======================================================

const SuppliesReportToolbar = ({
  onRefresh,
  onExport,
  loading = false,
}) => {
  //====================================================
  // Refresh
  //====================================================

  const handleRefresh = () => {
    if (
      typeof onRefresh ===
      "function"
    ) {
      onRefresh();
    }
  };

  //====================================================
  // Export
  //====================================================

  const handleExport = () => {
    if (
      typeof onExport ===
      "function"
    ) {
      onExport();
    }
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="supplies-report__toolbar"
      sx={{
        width: "100%",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        justifyContent="space-between"
      >
        {/*==============================================
            Title
        ===============================================*/}

        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Supplies Report
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            View and analyze
            supply transactions,
            suppliers, quantities,
            and values.
          </Typography>
        </Box>

        {/*==============================================
            Actions
        ===============================================*/}

        <Stack
          direction="row"
          spacing={1}
          className="supplies-report__toolbar-actions"
          justifyContent={{
            xs: "stretch",
            sm: "flex-end",
          }}
        >
          <Tooltip
            title="Refresh report"
          >
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  <RefreshIcon />
                }
                onClick={
                  handleRefresh
                }
                disabled={
                  loading
                }
              >
                Refresh
              </Button>
            </span>
          </Tooltip>

          <Tooltip
            title="Export report"
          >
            <span>
              <Button
                variant="contained"
                size="small"
                startIcon={
                  <FileDownloadIcon />
                }
                onClick={
                  handleExport
                }
                disabled={
                  loading
                }
              >
                Export
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportToolbar;

//======================================================
// Part 1A Ends Here
//======================================================