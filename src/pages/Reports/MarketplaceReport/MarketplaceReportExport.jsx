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

//======================================================
// MarketplaceReportExport
//======================================================

const MarketplaceReportExport = ({
  reports = [],
  loading = false,
  disabled = false,
  fileName = "marketplace-report",
  onExport,
}) => {

  //====================================================
  // Menu State
  //====================================================

  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null);

  const menuOpen =
    Boolean(anchorEl);

  //====================================================
  // Safe Reports
  //====================================================

  const safeReports = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : [],
    [reports]
  );

  //====================================================
  // Open Menu
  //====================================================

  const handleOpen =
    useCallback((event) => {
      setAnchorEl(
        event.currentTarget
      );
    }, []);

  //====================================================
  // Close Menu
  //====================================================

  const handleClose =
    useCallback(() => {
      setAnchorEl(null);
    }, []);

  //====================================================
  // Prepare Export Data
  //====================================================

  const prepareExportData =
    useCallback(() => {
      return safeReports.map(
        (report, index) => ({
          "S.No":
            index + 1,

          Marketplace:
            report?.marketplace ??
            report?.marketplaceName ??
            "",

          "Order Number":
            report?.orderNumber ??
            report?.orderNo ??
            report?.orderId ??
            "",

          "Product Name":
            report?.productName ??
            report?.itemName ??
            "",

          SKU:
            report?.sku ??
            report?.productCode ??
            "",

          Quantity:
            report?.quantity ??
            report?.qty ??
            0,

          "Sales Amount":
            report?.salesAmount ??
            report?.totalAmount ??
            report?.amount ??
            0,

          Status:
            report?.status ??
            "",

          "Shipment Status":
            report?.shipmentStatus ??
            report?.shippingStatus ??
            "",

          Category:
            report?.category ??
            report?.categoryName ??
            "",

          Date:
            report?.reportDate ??
            report?.date ??
            report?.orderDate ??
            "",
        })
      );
    }, [
      safeReports,
    ]);

  //====================================================
  // Export Handler
  //====================================================

  const handleExport =
    useCallback(
      (format) => {
        handleClose();

        if (
          safeReports.length === 0
        ) {
          return;
        }

        const exportData =
          prepareExportData();

        if (
          typeof onExport ===
          "function"
        ) {
          onExport({
            format,
            fileName,
            data: exportData,
            reports:
              safeReports,
          });
        }
      },
      [
        handleClose,
        safeReports,
        prepareExportData,
        onExport,
        fileName,
      ]
    );

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Disabled State
  //====================================================

  const isDisabled =
    loading ||
    disabled ||
    safeReports.length === 0;

  //====================================================
  // JSX
  //====================================================

  return (
    <>
      <Tooltip
        title={
          safeReports.length === 0
            ? "No marketplace reports to export"
            : "Export marketplace report"
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
              handleOpen
            }
            disabled={
              isDisabled
            }
            aria-haspopup="true"
            aria-expanded={
              menuOpen
                ? "true"
                : undefined
            }
          >
            Export
          </Button>
        </span>
      </Tooltip>

      {/*================================================
          Export Menu
      =================================================*/}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={
          handleClose
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
            CSV
        ==============================================*/}

        <MenuItem
          onClick={() =>
            handleExport("csv")
          }
        >
          <ListItemIcon>
            <Description
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Export CSV
          </ListItemText>
        </MenuItem>

        {/*==============================================
            Excel
        ==============================================*/}

        <MenuItem
          onClick={() =>
            handleExport("excel")
          }
        >
          <ListItemIcon>
            <TableView
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Export Excel
          </ListItemText>
        </MenuItem>

        {/*==============================================
            PDF
        ==============================================*/}

        <MenuItem
          onClick={() =>
            handleExport("pdf")
          }
        >
          <ListItemIcon>
            <PictureAsPdf
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Export PDF
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportExport.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  loading: PropTypes.bool,

  disabled: PropTypes.bool,

  fileName: PropTypes.string,

  onExport: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportExport.defaultProps = {
  reports: [],

  loading: false,

  disabled: false,

  fileName:
    "marketplace-report",

  onExport: () => {},
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportExport;