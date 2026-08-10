//======================================================
// StockLedgerReportToolbar.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";

//======================================================
// StockLedgerReportToolbar
//======================================================

const StockLedgerReportToolbar = ({
  reports = [],
  filteredReports = [],
  loading = false,
  title = "Stock Ledger Report",
  viewMode = "table",
  onViewModeChange,
  onRefresh,
  onAdd,
  onExport,
  onPrint,
  showAdd = false,
  showExport = true,
  showPrint = true,
  showViewToggle = true,
}) => {
  //====================================================
  // Record Count
  //====================================================

  const totalRecords = useMemo(() => {
    return Array.isArray(reports)
      ? reports.length
      : 0;
  }, [reports]);

  const filteredCount = useMemo(() => {
    return Array.isArray(
      filteredReports
    )
      ? filteredReports.length
      : 0;
  }, [filteredReports]);

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh = useCallback(() => {
    if (
      loading ||
      typeof onRefresh !== "function"
    ) {
      return;
    }

    onRefresh();
  }, [
    loading,
    onRefresh,
  ]);

  //====================================================
  // Add
  //====================================================

  const handleAdd = useCallback(() => {
    if (
      loading ||
      typeof onAdd !== "function"
    ) {
      return;
    }

    onAdd();
  }, [
    loading,
    onAdd,
  ]);

  //====================================================
  // Export
  //====================================================

  const handleExport = useCallback(() => {
    if (
      loading ||
      typeof onExport !== "function"
    ) {
      return;
    }

    onExport(filteredReports);
  }, [
    loading,
    onExport,
    filteredReports,
  ]);

  //====================================================
  // Print
  //====================================================

  const handlePrint = useCallback(() => {
    if (
      loading ||
      typeof onPrint !== "function"
    ) {
      return;
    }

    onPrint(filteredReports);
  }, [
    loading,
    onPrint,
    filteredReports,
  ]);

  //====================================================
  // View Mode
  //====================================================

  const handleViewModeChange =
    useCallback(
      (mode) => {
        if (
          loading ||
          typeof onViewModeChange !==
            "function"
        ) {
          return;
        }

        onViewModeChange(mode);
      },
      [
        loading,
        onViewModeChange,
      ]
    );

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-ledger-report-toolbar"
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        justifyContent="space-between"
        spacing={2}
      >
        {/*==============================================
            Title & Statistics
        ===============================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={1.5}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Stock movement and
              inventory balance
              details
            </Typography>
          </Box>

          <Chip
            size="small"
            label={`${filteredCount} records`}
            variant="outlined"
          />

          {filteredCount !==
            totalRecords && (
            <Chip
              size="small"
              label={`${totalRecords} total`}
              color="info"
              variant="outlined"
            />
          )}
        </Stack>

        {/*==============================================
            Actions
        ===============================================*/}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent={{
            xs: "flex-start",
            md: "flex-end",
          }}
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          {/*============================================
              Add
          =============================================*/}

          {showAdd &&
            typeof onAdd ===
              "function" && (
              <Button
                variant="contained"
                startIcon={
                  <AddOutlinedIcon />
                }
                onClick={
                  handleAdd
                }
                disabled={loading}
              >
                Add
              </Button>
            )}

          {/*============================================
              Export
          =============================================*/}

          {showExport &&
            typeof onExport ===
              "function" && (
              <Tooltip title="Export stock ledger">
                <Button
                  variant="outlined"
                  startIcon={
                    <FileDownloadOutlinedIcon />
                  }
                  onClick={
                    handleExport
                  }
                  disabled={
                    loading ||
                    filteredCount ===
                      0
                  }
                >
                  Export
                </Button>
              </Tooltip>
            )}

          {/*============================================
              Print
          =============================================*/}

          {showPrint &&
            typeof onPrint ===
              "function" && (
              <Tooltip title="Print stock ledger">
                <Button
                  variant="outlined"
                  startIcon={
                    <PrintOutlinedIcon />
                  }
                  onClick={
                    handlePrint
                  }
                  disabled={
                    loading ||
                    filteredCount ===
                      0
                  }
                >
                  Print
                </Button>
              </Tooltip>
            )}

          {/*============================================
              View Mode
          =============================================*/}

          {showViewToggle && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              />

              <Tooltip title="Table view">
                <span>
                  <IconButton
                    size="small"
                    color={
                      viewMode ===
                      "table"
                        ? "primary"
                        : "default"
                    }
                    onClick={() =>
                      handleViewModeChange(
                        "table"
                      )
                    }
                    disabled={loading}
                  >
                    <ViewListOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Card view">
                <span>
                  <IconButton
                    size="small"
                    color={
                      viewMode ===
                      "card"
                        ? "primary"
                        : "default"
                    }
                    onClick={() =>
                      handleViewModeChange(
                        "card"
                      )
                    }
                    disabled={loading}
                  >
                    <GridViewOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}

          {/*============================================
              Refresh
          =============================================*/}

          <Tooltip title="Refresh">
            <span>
              <IconButton
                color="primary"
                onClick={
                  handleRefresh
                }
                disabled={loading}
              >
                <RefreshOutlinedIcon
                  className={
                    loading
                      ? "stock-ledger-refresh-loading"
                      : ""
                  }
                />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {/*===============================================
          Part 1A Ends Here
      ================================================*/}
    </Box>
  );
};

export default StockLedgerReportToolbar;

