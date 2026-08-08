import React, {
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";

import {
  Download,
  FileDownload,
} from "@mui/icons-material";

import {
  exportInventoryReports,
  downloadInventoryReportFile,
} from "./InventoryReportService";

//======================================================
// InventoryReportExport
//======================================================

const InventoryReportExport = ({
  filters = {},
  reports = [],
  selectedRows = [],
  disabled = false,
}) => {

  //====================================================
  // State
  //====================================================

  const [anchorEl, setAnchorEl] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const menuOpen =
    Boolean(anchorEl);

  //====================================================
  // Open Menu
  //====================================================

  const handleOpenMenu = (
    event
  ) => {
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
  // Build Export Parameters
  //====================================================

  const buildParams = (
    format
  ) => {

    const params = {
      ...filters,
      format,
    };

    if (
      Array.isArray(
        selectedRows
      ) &&
      selectedRows.length > 0
    ) {
      params.ids =
        selectedRows.join(",");
    }

    return params;
  };

  //====================================================
  // Export Report
  //====================================================

  const handleExport = async (
    format
  ) => {

    handleCloseMenu();

    setLoading(true);

    setError("");

    setMessage("");

    try {

      const params =
        buildParams(format);

      const blob =
        await exportInventoryReports(
          params
        );

      const extension =
        format === "csv"
          ? "csv"
          : format === "pdf"
          ? "pdf"
          : "xlsx";

      const fileName =
        `inventory-reports-${Date.now()}.${extension}`;

      downloadInventoryReportFile(
        blob,
        fileName
      );

      setMessage(
        `Inventory report exported successfully as ${format.toUpperCase()}.`
      );

    } catch (exportError) {

      setError(
        exportError?.message ||
        "Unable to export inventory report."
      );

    } finally {

      setLoading(false);

    }
  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={
          loading ? (
            <CircularProgress
              size={18}
              color="inherit"
            />
          ) : (
            <FileDownload />
          )
        }
        onClick={
          handleOpenMenu
        }
        disabled={
          disabled ||
          loading
        }
      >
        {loading
          ? "Exporting..."
          : "Export"}
      </Button>

      {/*================================================
          Export Menu
      =================================================*/}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={
          handleCloseMenu
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

        {/*==============================================
            Excel
        ==============================================*/}

        <MenuItem
          onClick={() =>
            handleExport("xlsx")
          }
        >
          <Download
            fontSize="small"
            sx={{ mr: 1 }}
          />

          Export Excel
        </MenuItem>

        {/*==============================================
            CSV
        ==============================================*/}

        <MenuItem
          onClick={() =>
            handleExport("csv")
          }
        >
          <Download
            fontSize="small"
            sx={{ mr: 1 }}
          />

          Export CSV
        </MenuItem>

        {/*==============================================
            PDF
        ==============================================*/}

        <MenuItem
          onClick={() =>
            handleExport("pdf")
          }
        >
          <Download
            fontSize="small"
            sx={{ mr: 1 }}
          />

          Export PDF
        </MenuItem>

      </Menu>

      {/*================================================
          Success Message
      =================================================*/}

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={() =>
          setMessage("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setMessage("")
          }
        >
          {message}
        </Alert>
      </Snackbar>

      {/*================================================
          Error Message
      =================================================*/}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() =>
          setError("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

InventoryReportExport.propTypes = {
  filters: PropTypes.object,

  reports: PropTypes.array,

  selectedRows: PropTypes.array,

  disabled: PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

InventoryReportExport.defaultProps = {
  filters: {},

  reports: [],

  selectedRows: [],

  disabled: false,
};

//======================================================
// Export
//======================================================

export default InventoryReportExport;