//======================================================
// SuppliesReportExport.jsx
// Part 1A
//======================================================

import React, {
  useState,
} from "react";

import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import {
  downloadSupplyReportsCSV,
} from "./SuppliesReportHelpers";

//======================================================
// SuppliesReportExport
//======================================================

const SuppliesReportExport = ({
  reports = [],
  filters = {},
  disabled = false,
  onExport,
}) => {
  //====================================================
  // State
  //====================================================

  const [
    exportFormat,
    setExportFormat,
  ] = useState("csv");

  const [
    exporting,
    setExporting,
  ] = useState(false);

  //====================================================
  // Safe Reports
  //====================================================

  const reportList =
    Array.isArray(reports)
      ? reports
      : [];

  //====================================================
  // File Name
  //====================================================

  const createFileName =
    () => {
      const date =
        new Date()
          .toISOString()
          .split("T")[0];

      return `supplies-report-${date}`;
    };

  //====================================================
  // CSV Export
  //====================================================

  const handleCSVExport =
    async () => {
      if (
        reportList.length ===
        0
      ) {
        return;
      }

      setExporting(true);

      try {
        if (
          typeof onExport ===
          "function"
        ) {
          const result =
            await onExport(
              "csv",
              reportList,
              filters
            );

          // If parent handled the export,
          // do not download another file.
          if (
            result === true
          ) {
            return;
          }
        }

        downloadSupplyReportsCSV(
          reportList,
          `${createFileName()}.csv`
        );
      } catch (error) {
        console.error(
          "CSV export failed:",
          error
        );
      } finally {
        setExporting(false);
      }
    };

  //====================================================
  // Export Handler
  //====================================================

  const handleExport =
    async () => {
      if (
        exportFormat ===
        "csv"
      ) {
        await handleCSVExport();
        return;
      }

      if (
        typeof onExport !==
        "function"
      ) {
        return;
      }

      setExporting(true);

      try {
        await onExport(
          exportFormat,
          reportList,
          filters
        );
      } catch (error) {
        console.error(
          `${exportFormat.toUpperCase()} export failed:`,
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
      className="supplies-report__export"
      sx={{
        p: 1.5,
      }}
    >
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
      >

        {/*==============================================
            Export Format
        ===============================================*/}

        <TextField
          select
          size="small"
          label="Format"
          value={
            exportFormat
          }
          onChange={(
            event
          ) =>
            setExportFormat(
              event.target.value
            )
          }
          disabled={
            disabled ||
            exporting
          }
          sx={{
            minWidth: 130,
          }}
        >
          <MenuItem value="csv">
            CSV / Excel
          </MenuItem>

          <MenuItem value="pdf">
            PDF
          </MenuItem>
        </TextField>

        {/*==============================================
            Export Button
        ===============================================*/}

        <Tooltip
          title={
            reportList.length ===
            0
              ? "No reports available for export"
              : `Export ${reportList.length} report(s)`
          }
        >
          <span>
            <Button
              variant="outlined"
              size="small"
              startIcon={
                exportFormat ===
                "pdf" ? (
                  <PictureAsPdfIcon />
                ) : (
                  <TableViewIcon />
                )
              }
              onClick={
                handleExport
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
          </span>
        </Tooltip>

        {/*==============================================
            Quick CSV Download
        ===============================================*/}

        <Tooltip
          title="Download current report data as CSV"
        >
          <span>
            <Button
              variant="contained"
              size="small"
              startIcon={
                <DownloadIcon />
              }
              onClick={
                handleCSVExport
              }
              disabled={
                disabled ||
                exporting ||
                reportList.length ===
                  0
              }
            >
              CSV
            </Button>
          </span>
        </Tooltip>

      </Stack>
    </Paper>
  );
};

//======================================================
// Export
//======================================================

export default SuppliesReportExport;

//======================================================
// Part 1A Ends Here
//======================================================