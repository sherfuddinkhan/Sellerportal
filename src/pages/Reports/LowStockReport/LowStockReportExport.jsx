import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import {
  Download,
  Description,
  TableView,
  PictureAsPdf,
} from "@mui/icons-material";

import {
  downloadLowStockReport,
} from "./LowStockReportService";

//======================================================
// LowStockReportExport
//======================================================

const LowStockReportExport = ({
  reports = [],
  selectedRows = [],
  loading = false,
  filters = {},
}) => {

  //====================================================
  // State
  //====================================================

  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null);

  const [
    exporting,
    setExporting,
  ] = useState(false);

  //====================================================
  // Menu State
  //====================================================

  const menuOpen =
    Boolean(anchorEl);

  //====================================================
  // Safe Reports
  //====================================================

  const safeReports =
    useMemo(
      () =>
        Array.isArray(reports)
          ? reports
          : [],
      [reports]
    );

  //====================================================
  // Safe Selected Rows
  //====================================================

  const safeSelectedRows =
    useMemo(
      () =>
        Array.isArray(
          selectedRows
        )
          ? selectedRows
          : [],
      [selectedRows]
    );

  //====================================================
  // Exportable Reports
  //====================================================

  const selectedReports =
    useMemo(() => {

      if (
        safeSelectedRows.length ===
        0
      ) {
        return safeReports;
      }

      return safeReports.filter(
        (report) => {
          const id =
            report?.id ??
            report?.reportId ??
            report?.inventoryId;

          return safeSelectedRows.includes(
            id
          );
        }
      );

    }, [
      safeReports,
      safeSelectedRows,
    ]);

  //====================================================
  // Export Count
  //====================================================

  const exportCount =
    selectedReports.length;

  //====================================================
  // Open Menu
  //====================================================

  const handleOpenMenu =
    useCallback(
      (event) => {
        setAnchorEl(
          event.currentTarget
        );
      },
      []
    );

  //====================================================
  // Close Menu
  //====================================================

  const handleCloseMenu =
    useCallback(() => {
      setAnchorEl(null);
    }, []);

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Export Handler
  //====================================================

  const handleExport = useCallback(
    async (format) => {
      handleCloseMenu();

      if (exporting) {
        return;
      }

      setExporting(true);

      try {
        const selectedIds =
          safeSelectedRows;

        const exportFilters = {
          ...filters,

          format,

          selectedIds:
            selectedIds.length > 0
              ? selectedIds.join(",")
              : undefined,
        };

        await downloadLowStockReport({
          ...exportFilters,

          fileName:
            `low-stock-report-${new Date()
              .toISOString()
              .slice(0, 10)}.${format}`,
        });
      } catch (error) {
        console.error(
          "Failed to export low stock report:",
          error
        );
      } finally {
        setExporting(false);
      }
    },
    [
      exporting,
      filters,
      safeSelectedRows,
      handleCloseMenu,
    ]
  );

  //====================================================
  // Export Disabled State
  //====================================================

  const exportDisabled =
    loading ||
    exporting ||
    safeReports.length === 0;

  //====================================================
  // Export Label
  //====================================================

  const exportLabel =
    exporting
      ? "Exporting..."
      : safeSelectedRows.length > 0
      ? `Export Selected (${exportCount})`
      : "Export";

  //====================================================
  // JSX
  //====================================================

  return (
    <>
      <Tooltip
        title={
          exportDisabled
            ? "No reports available to export"
            : "Export low stock reports"
        }
      >
        <span>
          <Button
            variant="outlined"
            color="primary"
            startIcon={
              <Download />
            }
            onClick={
              handleOpenMenu
            }
            disabled={
              exportDisabled
            }
          >
            {exportLabel}
          </Button>
        </span>
      </Tooltip>

      {/*================================================
          Export Menu
      =================================================*/}

      <Menu
        anchorEl={
          anchorEl
        }
        open={
          menuOpen
        }
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
            handleExport(
              "xlsx"
            )
          }
          disabled={
            exporting
          }
        >
          <ListItemIcon>
            <TableView
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Excel (.xlsx)
          </ListItemText>
        </MenuItem>

        {/*==============================================
            CSV
        ==============================================*/}

        <MenuItem
          onClick={() =>
            handleExport(
              "csv"
            )
          }
          disabled={
            exporting
          }
        >
          <ListItemIcon>
            <Description
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            CSV (.csv)
          </ListItemText>
        </MenuItem>

        {/*==============================================
            PDF
        ==============================================*/}

        <MenuItem
          onClick={() =>
            handleExport(
              "pdf"
            )
          }
          disabled={
            exporting
          }
        >
          <ListItemIcon>
            <PictureAsPdf
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            PDF (.pdf)
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

LowStockReportExport.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  selectedRows: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),

  loading: PropTypes.bool,

  filters: PropTypes.object,
};

//======================================================
// Default Props
//======================================================

LowStockReportExport.defaultProps = {
  reports: [],

  selectedRows: [],

  loading: false,

  filters: {},
};

//======================================================
// Export
//======================================================

export default LowStockReportExport;