import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import {
  Download,
  FileDownload,
  PictureAsPdf,
  Print,
  TableChart,
} from "@mui/icons-material";

import {
  customersToExportRows,
} from "./CustomerReportHelper";

//======================================================
// CustomerReportExport
//======================================================

const CustomerReportExport = ({
  customers = [],
  filename = "customer-report",

  loading = false,

  onExportExcel,
  onExportCsv,
  onExportPdf,
  onPrint,
}) => {

  //====================================================
  // Menu State
  //====================================================

  const [anchorEl, setAnchorEl] =
    useState(null);

  const [exporting, setExporting] =
    useState(false);

  //====================================================
  // Menu Status
  //====================================================

  const menuOpen =
    Boolean(anchorEl);

  //====================================================
  // Open Menu
  //====================================================

  const handleOpenMenu = (event) => {

    setAnchorEl(
      event.currentTarget
    );

  };

  //====================================================
  // Close Menu
  //====================================================

  const handleCloseMenu = () => {

    setAnchorEl(null);

  };

  //====================================================
  // Prepare Export Data
  //====================================================

  const getExportData = () => {

    return customersToExportRows(
      customers
    );

  };

  //====================================================
  // Excel Export
  //====================================================

  const handleExcelExport = async () => {

    handleCloseMenu();

    const rows =
      getExportData();

    if (!rows.length) {
      return;
    }

    try {

      setExporting(true);

      if (onExportExcel) {

        await onExportExcel(
          rows,
          filename
        );

      }

    } finally {

      setExporting(false);

    }

  };

  //====================================================
  // CSV Export
  //====================================================

  const handleCsvExport = async () => {

    handleCloseMenu();

    const rows =
      getExportData();

    if (!rows.length) {
      return;
    }

    try {

      setExporting(true);

      if (onExportCsv) {

        await onExportCsv(
          rows,
          filename
        );

      }

    } finally {

      setExporting(false);

    }

  };

  //====================================================
  // PDF Export
  //====================================================

  const handlePdfExport = async () => {

    handleCloseMenu();

    const rows =
      getExportData();

    if (!rows.length) {
      return;
    }

    try {

      setExporting(true);

      if (onExportPdf) {

        await onExportPdf(
          rows,
          filename
        );

      }

    } finally {

      setExporting(false);

    }

  };

  //====================================================
  // Print
  //====================================================

  const handlePrint = async () => {

    handleCloseMenu();

    const rows =
      getExportData();

    if (!rows.length) {
      return;
    }

    try {

      setExporting(true);

      if (onPrint) {

        await onPrint(
          rows,
          filename
        );

      } else {

        window.print();

      }

    } finally {

      setExporting(false);

    }

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Export Button + Menu
  //====================================================

  const isDisabled =
    loading ||
    exporting ||
    !Array.isArray(customers) ||
    customers.length === 0;

  return (
    <Box>
      {/*================================================
          Export Button
      =================================================*/}

      <Tooltip title="Export Customer Report">
        <span>
          <Button
            variant="outlined"
            startIcon={
              exporting ? (
                <CircularProgress
                  size={18}
                />
              ) : (
                <Download />
              )
            }
            onClick={handleOpenMenu}
            disabled={isDisabled}
            aria-controls={
              menuOpen
                ? "customer-report-export-menu"
                : undefined
            }
            aria-haspopup="true"
            aria-expanded={
              menuOpen
                ? "true"
                : undefined
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
        id="customer-report-export-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby":
            "customer-report-export-button",
        }}
      >

        {/*==============================================
            Excel
        ==============================================*/}

        <MenuItem
          onClick={handleExcelExport}
          disabled={exporting}
        >
          <ListItemIcon>
            <TableChart
              fontSize="small"
              color="success"
            />
          </ListItemIcon>

          <ListItemText
            primary="Export to Excel"
            secondary="Download .xlsx report"
          />
        </MenuItem>

        {/*==============================================
            CSV
        ==============================================*/}

        <MenuItem
          onClick={handleCsvExport}
          disabled={exporting}
        >
          <ListItemIcon>
            <FileDownload
              fontSize="small"
              color="primary"
            />
          </ListItemIcon>

          <ListItemText
            primary="Export to CSV"
            secondary="Download .csv report"
          />
        </MenuItem>

        {/*==============================================
            PDF
        ==============================================*/}

        <MenuItem
          onClick={handlePdfExport}
          disabled={exporting}
        >
          <ListItemIcon>
            <PictureAsPdf
              fontSize="small"
              color="error"
            />
          </ListItemIcon>

          <ListItemText
            primary="Export to PDF"
            secondary="Generate PDF report"
          />
        </MenuItem>

        {/*==============================================
            Print
        ==============================================*/}

        <MenuItem
          onClick={handlePrint}
          disabled={exporting}
        >
          <ListItemIcon>
            <Print
              fontSize="small"
              color="action"
            />
          </ListItemIcon>

          <ListItemText
            primary="Print Report"
            secondary="Print customer report"
          />
        </MenuItem>

      </Menu>

    </Box>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

CustomerReportExport.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.object
  ),

  filename: PropTypes.string,

  loading: PropTypes.bool,

  onExportExcel: PropTypes.func,

  onExportCsv: PropTypes.func,

  onExportPdf: PropTypes.func,

  onPrint: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

CustomerReportExport.defaultProps = {
  customers: [],

  filename: "customer-report",

  loading: false,

  onExportExcel: null,

  onExportCsv: null,

  onExportPdf: null,

  onPrint: null,
};

//======================================================
// Export
//======================================================

export default CustomerReportExport;