//======================================================
// TaxReportToolbar.jsx
// Part 1A
//======================================================

import React from "react";

import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

//======================================================
// TaxReportToolbar
//======================================================

const TaxReportToolbar = ({
  title = "Tax Report",
  subtitle = "View and manage tax report records.",

  onRefresh,
  onFilter,
  onClearFilters,
  onExport,

  loading = false,
  exporting = false,

  filtersApplied = false,
  exportDisabled = false,

  showFilterButton = true,
  showClearButton = true,
  showExportButton = true,
  showRefreshButton = true,

  children,
}) => {
  //====================================================
  // Refresh Handler
  //====================================================

  const handleRefresh = () => {
    if (
      loading ||
      typeof onRefresh !== "function"
    ) {
      return;
    }

    onRefresh();
  };

  //====================================================
  // Filter Handler
  //====================================================

  const handleFilter = () => {
    if (
      loading ||
      typeof onFilter !== "function"
    ) {
      return;
    }

    onFilter();
  };

  //====================================================
  // Clear Handler
  //====================================================

  const handleClearFilters = () => {
    if (
      loading ||
      typeof onClearFilters !== "function"
    ) {
      return;
    }

    onClearFilters();
  };

  //====================================================
  // Export Handler
  //====================================================

  const handleExport = () => {
    if (
      loading ||
      exporting ||
      exportDisabled ||
      typeof onExport !== "function"
    ) {
      return;
    }

    onExport();
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="tax-report__toolbar"
      sx={{
        width: "100%",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        justifyContent="space-between"
      >
        {/*==============================================
            Report Information
        ===============================================*/}

        <Box
          className="tax-report__header"
          sx={{
            mb: {
              xs: 0,
              md: 0,
            },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            className="tax-report__title"
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              className="tax-report__subtitle"
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/*==============================================
            Actions
        ===============================================*/}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          alignItems="center"
          justifyContent={{
            xs: "flex-start",
            md: "flex-end",
          }}
          className="tax-report__toolbar-actions"
        >
          {/*============================================
              Custom Children
          =============================================*/}

          {children}

          {/*============================================
              Filter
          =============================================*/}

          {showFilterButton && (
            <Tooltip title="Filter report">
              <Button
                variant={
                  filtersApplied
                    ? "contained"
                    : "outlined"
                }
                size="small"
                startIcon={
                  <FilterListIcon />
                }
                onClick={
                  handleFilter
                }
                disabled={loading}
              >
                Filter
              </Button>
            </Tooltip>
          )}

          {/*============================================
              Clear Filters
          =============================================*/}

          {showClearButton && (
            <Tooltip title="Clear all filters">
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={
                  <ClearAllIcon />
                }
                onClick={
                  handleClearFilters
                }
                disabled={
                  loading ||
                  !filtersApplied
                }
              >
                Clear
              </Button>
            </Tooltip>
          )}

          {/*============================================
              Refresh
          =============================================*/}

          {showRefreshButton && (
            <Tooltip title="Refresh report">
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  <RefreshIcon />
                }
                onClick={
                  handleRefresh
                }
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : "Refresh"}
              </Button>
            </Tooltip>
          )}

          {/*============================================
              Export
          =============================================*/}

          {showExportButton && (
            <Tooltip title="Export report">
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
                  loading ||
                  exporting ||
                  exportDisabled
                }
              >
                {exporting
                  ? "Exporting..."
                  : "Export"}
              </Button>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {/*==============================================
          Divider
      ===============================================*/}

      <Divider
        sx={{
          mt: 2,
        }}
      />
    </Box>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportToolbar;

//======================================================
// Part 1A Ends Here
//======================================================