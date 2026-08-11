//======================================================
// StockMovementReportToolbar.jsx
// Part 1A
//======================================================

import React from "react";

import PropTypes from "prop-types";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

//======================================================
// StockMovementReportToolbar
//======================================================

const StockMovementReportToolbar = ({
  title = "Stock Movement Report",
  subtitle = "Track inward, outward, transfer and adjustment movements.",
  onRefresh,
  onExport,
  loading = false,
  exporting = false,
  refreshLabel = "Refresh",
  exportLabel = "Export",
  showTitle = true,
  showRefresh = true,
  showExport = true,
  disabled = false,
  children,
}) => {
  //====================================================
  // Refresh Disabled
  //====================================================

  const refreshDisabled =
    disabled ||
    loading ||
    exporting;

  //====================================================
  // Export Disabled
  //====================================================

  const exportDisabled =
    disabled ||
    loading ||
    exporting;

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-movement-report__toolbar"
      sx={{
        width: "100%",
        boxSizing: "border-box",
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
        sx={{
          width: "100%",
        }}
      >

        {/*==============================================
            Title Section
        ===============================================*/}

        {showTitle && (
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              fontWeight={700}
              sx={{
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/*==============================================
            Action Section
        ===============================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          justifyContent="flex-end"
          sx={{
            flexShrink: 0,
          }}
        >

          {/*============================================
              Custom Actions
          =============================================*/}

          {children}

          {/*============================================
              Refresh Button
          =============================================*/}

          {showRefresh && (
            <Tooltip
              title={
                loading
                  ? "Refreshing..."
                  : refreshLabel
              }
            >
              <span>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={17}
                      />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  onClick={onRefresh}
                  disabled={
                    refreshDisabled
                  }
                  sx={{
                    minWidth: 110,
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {loading
                    ? "Refreshing..."
                    : refreshLabel}
                </Button>
              </span>
            </Tooltip>
          )}

          {/*============================================
              Export Button
          =============================================*/}

          {showExport && (
            <Tooltip
              title={
                exporting
                  ? "Exporting..."
                  : exportLabel
              }
            >
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    exporting ? (
                      <CircularProgress
                        size={17}
                        color="inherit"
                      />
                    ) : (
                      <FileDownloadIcon />
                    )
                  }
                  onClick={onExport}
                  disabled={
                    exportDisabled
                  }
                  sx={{
                    minWidth: 110,
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {exporting
                    ? "Exporting..."
                    : exportLabel}
                </Button>
              </span>
            </Tooltip>
          )}

        </Stack>
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportToolbar.propTypes = {
  title:
    PropTypes.string,

  subtitle:
    PropTypes.string,

  onRefresh:
    PropTypes.func,

  onExport:
    PropTypes.func,

  loading:
    PropTypes.bool,

  exporting:
    PropTypes.bool,

  refreshLabel:
    PropTypes.string,

  exportLabel:
    PropTypes.string,

  showTitle:
    PropTypes.bool,

  showRefresh:
    PropTypes.bool,

  showExport:
    PropTypes.bool,

  disabled:
    PropTypes.bool,

  children:
    PropTypes.node,
};

//======================================================
// Default Props
//======================================================

StockMovementReportToolbar.defaultProps = {
  title: "Stock Movement Report",

  subtitle:
    "Track inward, outward, transfer and adjustment movements.",

  onRefresh:
    undefined,

  onExport:
    undefined,

  loading:
    false,

  exporting:
    false,

  refreshLabel:
    "Refresh",

  exportLabel:
    "Export",

  showTitle:
    true,

  showRefresh:
    true,

  showExport:
    true,

  disabled:
    false,

  children:
    null,
};

//======================================================
// Export
//======================================================

export default StockMovementReportToolbar;

//======================================================
// Part 1A Ends Here
//======================================================