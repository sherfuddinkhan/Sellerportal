//======================================================
// TaxReportExport.jsx
// Part 1A
//======================================================

import React, { useMemo, useState } from "react";

import {
  Box,
  Button,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import DescriptionIcon from "@mui/icons-material/Description";

//======================================================
// Number Formatter
//======================================================

const formatNumber = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

//======================================================
// Date Formatter
//======================================================

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN");
};

//======================================================
// CSV Escape
//======================================================

const escapeCsvValue = (value) => {
  const text =
    value === null ||
    value === undefined
      ? ""
      : String(value);

  return `"${text.replace(/"/g, '""')}"`;
};

//======================================================
// Convert Reports To CSV
//======================================================

const reportsToCsv = (reports = []) => {
  const headers = [
    "Date",
    "Invoice Number",
    "Party Name",
    "GSTIN",
    "Taxable Amount",
    "CGST",
    "SGST",
    "IGST",
    "Cess",
    "Total Tax",
    "Invoice Total",
    "Status",
    "Remarks",
  ];

  const rows = reports.map((report) => {
    const cgst = Number(
      report?.cgst ??
        report?.cgstAmount ??
        0
    );

    const sgst = Number(
      report?.sgst ??
        report?.sgstAmount ??
        0
    );

    const igst = Number(
      report?.igst ??
        report?.igstAmount ??
        0
    );

    const cess = Number(
      report?.cess ??
        report?.cessAmount ??
        0
    );

    const totalTax = Number(
      report?.totalTax ??
        report?.taxAmount ??
        cgst +
          sgst +
          igst +
          cess
    );

    return [
      formatDate(
        report?.date ??
          report?.taxDate ??
          report?.invoiceDate
      ),

      report?.invoiceNumber ??
        report?.invoiceNo ??
        report?.documentNumber ??
        report?.docNo ??
        "",

      report?.partyName ??
        report?.customerName ??
        report?.supplierName ??
        "",

      report?.gstin ??
        report?.customerGstin ??
        report?.supplierGstin ??
        "",

      formatNumber(
        report?.taxableAmount ??
          report?.taxableValue ??
          report?.taxable ??
          0
      ),

      formatNumber(cgst),

      formatNumber(sgst),

      formatNumber(igst),

      formatNumber(cess),

      formatNumber(totalTax),

      formatNumber(
        report?.invoiceTotal ??
          report?.totalAmount ??
          report?.grandTotal ??
          0
      ),

      report?.status ??
        report?.taxStatus ??
        "Pending",

      report?.remarks ??
        report?.notes ??
        "",
    ];
  });

  return [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map(escapeCsvValue)
        .join(",")
    )
    .join("\r\n");
};

//======================================================
// Download File
//======================================================

const downloadFile = (
  content,
  filename,
  mimeType
) => {
  const blob = new Blob(
    [content],
    {
      type: mimeType,
    }
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(
    anchor
  );

  anchor.click();

  document.body.removeChild(
    anchor
  );

  URL.revokeObjectURL(url);
};

//======================================================
// TaxReportExport
//======================================================

const TaxReportExport = ({
  reports = [],
  filters = {},
  disabled = false,
  onExport,
}) => {
  //====================================================
  // Menu State
  //====================================================

  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null);

  //====================================================
  // Exporting State
  //====================================================

  const [
    exporting,
    setExporting,
  ] = useState(false);

  //====================================================
  // Safe Reports
  //====================================================

  const reportList = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : [],
    [reports]
  );

  //====================================================
  // Menu Open
  //====================================================

  const handleOpenMenu = (
    event
  ) => {
    if (
      disabled ||
      exporting ||
      reportList.length === 0
    ) {
      return;
    }

    setAnchorEl(
      event.currentTarget
    );
  };

  //====================================================
  // Menu Close
  //====================================================

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //====================================================
  // CSV Export
  //====================================================

  const handleCsvExport =
    async () => {
      handleCloseMenu();

      if (
        reportList.length === 0
      ) {
        return;
      }

      setExporting(true);

      try {
        const csv =
          reportsToCsv(
            reportList
          );

        const date =
          new Date()
            .toISOString()
            .slice(0, 10);

        downloadFile(
          csv,
          `tax-report-${date}.csv`,
          "text/csv;charset=utf-8;"
        );

        if (
          typeof onExport ===
          "function"
        ) {
          await onExport(
            "csv",
            reportList,
            filters
          );
        }
      } catch (error) {
        console.error(
          "Tax report CSV export failed:",
          error
        );
      } finally {
        setExporting(false);
      }
    };

  //====================================================
  // Excel Export
  //====================================================

  const handleExcelExport =
    async () => {
      handleCloseMenu();

      if (
        reportList.length === 0
      ) {
        return;
      }

      setExporting(true);

      try {
        const csv =
          reportsToCsv(
            reportList
          );

        const date =
          new Date()
            .toISOString()
            .slice(0, 10);

        downloadFile(
          csv,
          `tax-report-${date}.xls`,
          "application/vnd.ms-excel;charset=utf-8;"
        );

        if (
          typeof onExport ===
          "function"
        ) {
          await onExport(
            "excel",
            reportList,
            filters
          );
        }
      } catch (error) {
        console.error(
          "Tax report Excel export failed:",
          error
        );
      } finally {
        setExporting(false);
      }
    };

  //====================================================
  // PDF Export
  //====================================================

  const handlePdfExport =
    async () => {
      handleCloseMenu();

      if (
        reportList.length === 0
      ) {
        return;
      }

      setExporting(true);

      try {
        /*
         * PDF generation can be connected
         * to jsPDF / backend PDF service
         * later.
         */

        if (
          typeof onExport ===
          "function"
        ) {
          await onExport(
            "pdf",
            reportList,
            filters
          );
        } else {
          console.warn(
            "PDF export service is not configured."
          );
        }
      } catch (error) {
        console.error(
          "Tax report PDF export failed:",
          error
        );
      } finally {
        setExporting(false);
      }
    };

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      variant="outlined"
      className="tax-report__export"
      sx={{
        width: "100%",
        p: 2,
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
      >
        {/*==============================================
            Information
        ===============================================*/}

        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
          >
            Export Tax Report
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Export the currently
            filtered tax records.
            {reportList.length > 0
              ? ` ${reportList.length} records available.`
              : " No records available."}
          </Typography>
        </Box>

        {/*==============================================
            Export Button
        ===============================================*/}

        <Box>
          <Button
            variant="contained"
            startIcon={
              <FileDownloadIcon />
            }
            onClick={
              handleOpenMenu
            }
            disabled={
              disabled ||
              exporting ||
              reportList.length ===
                0
            }
          >
            {exporting
              ? "Exporting..."
              : "Export"}
          </Button>

          <Menu
            anchorEl={
              anchorEl
            }
            open={Boolean(
              anchorEl
            )}
            onClose={
              handleCloseMenu
            }
          >
            {/*==========================================
                CSV
            ===========================================*/}

            <MenuItem
              onClick={
                handleCsvExport
              }
            >
              <TableViewIcon
                fontSize="small"
                sx={{
                  mr: 1,
                }}
              />

              Export CSV
            </MenuItem>

            {/*==========================================
                Excel
            ===========================================*/}

            <MenuItem
              onClick={
                handleExcelExport
              }
            >
              <DescriptionIcon
                fontSize="small"
                sx={{
                  mr: 1,
                }}
              />

              Export Excel
            </MenuItem>

            {/*==========================================
                PDF
            ===========================================*/}

            <MenuItem
              onClick={
                handlePdfExport
              }
            >
              <PictureAsPdfIcon
                fontSize="small"
                sx={{
                  mr: 1,
                }}
              />

              Export PDF
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    </Paper>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportExport;

//======================================================
// Part 1A Ends Here
//======================================================