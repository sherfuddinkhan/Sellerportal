
import React, {
  useCallback,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Download,
  FileDownload,
} from "@mui/icons-material";

import {
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import {
  exportOrderReport,
} from "./OrderReportService";

//======================================================
// OrderReportExport
//======================================================

const OrderReportExport = ({
  reports = [],
  filters = {},
  loading = false,
  fileName = "order-report",
  onExport,
}) => {
  //====================================================
  // Menu State
  //====================================================

  const [anchorEl, setAnchorEl] =
    useState(null);

  const [exporting, setExporting] =
    useState(false);

  //====================================================
  // Menu Open Handler
  //====================================================

  const handleMenuOpen =
    useCallback((event) => {
      setAnchorEl(
        event.currentTarget
      );
    }, []);

  //====================================================
  // Menu Close Handler
  //====================================================

  const handleMenuClose =
    useCallback(() => {
      setAnchorEl(null);
    }, []);

  //====================================================
  // Export Handler
  //====================================================

  const handleExport =
    useCallback(
      async (format) => {
        handleMenuClose();

        if (exporting || loading) {
          return;
        }

        setExporting(true);

        try {
          const payload = {
            format,
            fileName,
            filters,
            reports,
          };

          const response =
            await exportOrderReport(
              payload
            );

          if (
            typeof onExport ===
            "function"
          ) {
            onExport(
              response,
              format
            );
          }
        } catch (error) {
          console.error(
            "OrderReportExport error:",
            error
          );
        } finally {
          setExporting(false);
        }
      },
      [
        exporting,
        loading,
        fileName,
        filters,
        reports,
        handleMenuClose,
        onExport,
      ]
    );
  //====================================================
  // Render
  //====================================================

  return (
    <>
      <Tooltip title="Export Order Report">
        <span>
          <Button
            variant="outlined"
            color="primary"
            startIcon={
              exporting ? (
                <CircularProgress
                  size={18}
                />
              ) : (
                <Download />
              )
            }
            onClick={
              handleMenuOpen
            }
            disabled={
              loading ||
              exporting
            }
          >
            {exporting
              ? "Exporting..."
              : "Export"}
          </Button>
        </span>
      </Tooltip>

      {/*================================================
          Export Menu
      =================================================*/}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={
          handleMenuClose
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Excel */}

        <MenuItem
          onClick={() =>
            handleExport(
              "excel"
            )
          }
        >
          <ListItemIcon>
            <FileDownload
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Export to Excel
          </ListItemText>
        </MenuItem>

        {/* CSV */}

        <MenuItem
          onClick={() =>
            handleExport(
              "csv"
            )
          }
        >
          <ListItemIcon>
            <FileDownload
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Export to CSV
          </ListItemText>
        </MenuItem>

        {/* PDF */}

        <MenuItem
          onClick={() =>
            handleExport(
              "pdf"
            )
          }
        >
          <ListItemIcon>
            <FileDownload
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Export to PDF
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

//======================================================
// PropTypes
//======================================================

OrderReportExport.propTypes = {
  reports:
    PropTypes.array,

  filters:
    PropTypes.object,

  loading:
    PropTypes.bool,

  fileName:
    PropTypes.string,

  onExport:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

OrderReportExport.defaultProps = {
  reports: [],

  filters: {},

  loading: false,

  fileName:
    "order-report",

  onExport: () => {},
};

//======================================================
// Export
//======================================================

export default OrderReportExport;


