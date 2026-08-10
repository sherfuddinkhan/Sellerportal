
//======================================================
// SalesReportExport.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Download,
  PictureAsPdf,
  TableView,
} from "@mui/icons-material";

import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";

import {
  exportSalesReportCSV,
  exportSalesReportExcel,
  exportSalesReportPDF,
} from "./SalesReportHelpers";

//======================================================
// SalesReportExport
//======================================================

const SalesReportExport = ({
  reports = [],
  filteredReports = [],
  loading = false,
  fileName = "sales-report",
}) => {
  //====================================================
  // Menu State
  //====================================================

  const [anchorEl, setAnchorEl] =
    useState(null);

  //====================================================
  // Export Data
  //====================================================

  const exportData = useMemo(
    () =>
      Array.isArray(filteredReports) &&
      filteredReports.length > 0
        ? filteredReports
        : Array.isArray(reports)
        ? reports
        : [],
    [
      filteredReports,
      reports,
    ]
  );

  //====================================================
  // Menu Open
  //====================================================

  const handleMenuOpen = useCallback(
    (event) => {
      if (
        loading ||
        exportData.length === 0
      ) {
        return;
      }

      setAnchorEl(
        event.currentTarget
      );
    },
    [
      exportData.length,
      loading,
    ]
  );

  //====================================================
  // Menu Close
  //====================================================

  const handleMenuClose =
    useCallback(() => {
      setAnchorEl(null);
    }, []);

  //====================================================
  // CSV Export
  //====================================================

  const handleCSVExport =
    useCallback(() => {
      if (
        loading ||
        exportData.length === 0
      ) {
        return;
      }

      exportSalesReportCSV(
        exportData,
        fileName
      );

      handleMenuClose();
    }, [
      exportData,
      fileName,
      handleMenuClose,
      loading,
    ]);

  //====================================================
  // Excel Export
  //====================================================

  const handleExcelExport =
    useCallback(() => {
      if (
        loading ||
        exportData.length === 0
      ) {
        return;
      }

      exportSalesReportExcel(
        exportData,
        fileName
      );

      handleMenuClose();
    }, [
      exportData,
      fileName,
      handleMenuClose,
      loading,
    ]);

  //====================================================
  // PDF Export
  //====================================================

  const handlePDFExport =
    useCallback(() => {
      if (
        loading ||
        exportData.length === 0
      ) {
        return;
      }

      exportSalesReportPDF(
        exportData,
        fileName
      );

      handleMenuClose();
    }, [
      exportData,
      fileName,
      handleMenuClose,
      loading,
    ]);
  //====================================================
  // Render
  //====================================================

  return (
    <Stack
      direction="row"
      spacing={1}
      className="sales-report-export"
    >
      <Tooltip title="Export sales report">
        <span>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={
              handleMenuOpen
            }
            disabled={
              loading ||
              exportData.length === 0
            }
          >
            Export
          </Button>
        </span>
      </Tooltip>

      {/*==============================================
          Export Menu
      ==============================================*/}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={
          handleMenuClose
        }
      >
        {/*============================================
            CSV
        =============================================*/}

        <MenuItem
          onClick={
            handleCSVExport
          }
        >
          <ListItemIcon>
            <TableView fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Export CSV
          </ListItemText>
        </MenuItem>

        {/*============================================
            Excel
        =============================================*/}

        <MenuItem
          onClick={
            handleExcelExport
          }
        >
          <ListItemIcon>
            <TableView fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Export Excel
          </ListItemText>
        </MenuItem>

        {/*============================================
            PDF
        =============================================*/}

        <MenuItem
          onClick={
            handlePDFExport
          }
        >
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Export PDF
          </ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

//======================================================
// PropTypes
//======================================================

SalesReportExport.propTypes = {
  reports:
    PropTypes.array,

  filteredReports:
    PropTypes.array,

  loading:
    PropTypes.bool,

  fileName:
    PropTypes.string,
};

//======================================================
// Default Props
//======================================================

SalesReportExport.defaultProps = {
  reports: [],

  filteredReports: [],

  loading: false,

  fileName:
    "sales-report",
};

//======================================================
// Export
//======================================================

export default SalesReportExport;


