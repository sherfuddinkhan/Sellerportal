import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Download,
  Description,
  TableView,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

import {
  formatCurrency,
  formatDate,
  normalizePurchaseReport,
  toNumber,
} from "./PurchaseReportHelpers";

//======================================================
// PurchaseReportExport
//======================================================

const PurchaseReportExport = ({
  reports = [],
  filteredReports = null,
  loading = false,
  fileName = "purchase-report",
  title = "Purchase Report",
  onExport,
}) => {
  //====================================================
  // Menu State
  //====================================================

  const [anchorEl, setAnchorEl] =
    useState(null);

  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(() => {
    const source =
      Array.isArray(filteredReports)
        ? filteredReports
        : reports;

    return Array.isArray(source)
      ? source
      : [];
  }, [
    reports,
    filteredReports,
  ]);

  //====================================================
  // Normalized Reports
  //====================================================

  const normalizedReports =
    useMemo(
      () =>
        safeReports.map(
          (report) =>
            normalizePurchaseReport(
              report
            )
        ),
      [safeReports]
    );

  //====================================================
  // Export Data
  //====================================================

  const exportData = useMemo(
    () =>
      normalizedReports.map(
        (report, index) => ({
          SNo: index + 1,

          Date: formatDate(
            report.date
          ),

          PurchaseOrder:
            report.purchaseOrderNumber ||
            report.orderNumber ||
            report.orderNo ||
            "",

          Supplier:
            report.supplierName ||
            report.supplier ||
            "",

          Marketplace:
            report.marketplace || "",

          Product:
            report.productName ||
            report.product ||
            "",

          Quantity: toNumber(
            report.quantity
          ),

          UnitCost: formatCurrency(
            toNumber(
              report.unitCost
            )
          ),

          Tax: formatCurrency(
            toNumber(report.tax)
          ),

          Discount: formatCurrency(
            toNumber(
              report.discount
            )
          ),

          TotalAmount:
            formatCurrency(
              toNumber(
                report.totalAmount ??
                  report.purchaseAmount ??
                  report.amount
              )
            ),

          Status:
            report.status ||
            "Completed",
        })
      ),
    [normalizedReports]
  );

  //====================================================
  // Menu Open
  //====================================================

  const handleOpen = useCallback(
    (event) => {
      if (loading) {
        return;
      }

      setAnchorEl(
        event.currentTarget
      );
    },
    [loading]
  );

  //====================================================
  // Menu Close
  //====================================================

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  //====================================================
  // Export Handler
  //====================================================

  const handleExport = useCallback(
    (format) => {
      if (loading) {
        return;
      }

      handleClose();

      onExport?.({
        format,
        fileName,
        title,
        data: exportData,
        reports: normalizedReports,
      });
    },
    [
      loading,
      handleClose,
      onExport,
      fileName,
      title,
      exportData,
      normalizedReports,
    ]
  );
  //====================================================
  // Render
  //====================================================

  const menuOpen = Boolean(anchorEl);

  return (
    <Box
      className="purchase-report-export"
      sx={{
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleOpen}
          disabled={
            loading ||
            normalizedReports.length === 0
          }
          aria-haspopup="menu"
          aria-expanded={
            menuOpen
              ? "true"
              : undefined
          }
        >
          Export
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {normalizedReports.length}{" "}
          record
          {normalizedReports.length ===
          1
            ? ""
            : "s"}
        </Typography>
      </Stack>

      {/*==============================================
          Export Menu
      ==============================================*/}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby":
            "purchase-report-export-button",
        }}
      >
        <MenuItem
          onClick={() =>
            handleExport("csv")
          }
        >
          <TableView
            fontSize="small"
            sx={{
              mr: 1,
            }}
          />

          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
            >
              Export CSV
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Spreadsheet-compatible
              format
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleExport("excel")
          }
        >
          <TableView
            fontSize="small"
            sx={{
              mr: 1,
            }}
          />

          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
            >
              Export Excel
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Excel workbook format
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleExport("pdf")
          }
        >
          <Description
            fontSize="small"
            sx={{
              mr: 1,
            }}
          />

          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
            >
              Export PDF
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Printable report
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportExport.propTypes = {
  reports:
    PropTypes.array,

  filteredReports:
    PropTypes.array,

  loading:
    PropTypes.bool,

  fileName:
    PropTypes.string,

  title:
    PropTypes.string,

  onExport:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

PurchaseReportExport.defaultProps = {
  reports: [],

  filteredReports: null,

  loading: false,

  fileName:
    "purchase-report",

  title:
    "Purchase Report",

  onExport: () => {},
};

//======================================================
// Export
//======================================================

export default PurchaseReportExport;


