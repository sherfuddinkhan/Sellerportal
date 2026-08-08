import React, {
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

import {
  Download,
  Description,
} from "@mui/icons-material";

//======================================================
// DashboardReportExport
//======================================================

const DashboardReportExport = ({
  reports = [],
  selectedRows = [],
  loading = false,
  onExport,
}) => {

  //====================================================
  // Export Format
  //====================================================

  const [exportFormat, setExportFormat] =
    useState("csv");

  //====================================================
  // Exporting State
  //====================================================

  const [exporting, setExporting] =
    useState(false);

  //====================================================
  // Normalize Reports
  //====================================================

  const normalizedReports =
    useMemo(() => {

      if (!Array.isArray(reports)) {
        return [];
      }

      return reports;

    }, [reports]);

  //====================================================
  // Normalize Selected Rows
  //====================================================

  const normalizedSelectedRows =
    useMemo(() => {

      if (
        !Array.isArray(selectedRows)
      ) {
        return [];
      }

      return selectedRows;

    }, [selectedRows]);

  //====================================================
  // Get Report ID
  //====================================================

  const getReportId = (
    report
  ) => {

    if (
      report &&
      typeof report === "object"
    ) {
      return (
        report?.id ??
        report?.reportId ??
        report?.dashboardReportId ??
        ""
      );
    }

    return report ?? "";
  };

  //====================================================
  // Reports To Export
  //====================================================

  const reportsToExport =
    useMemo(() => {

      // If rows are selected, export
      // only those reports.

      if (
        normalizedSelectedRows.length > 0
      ) {

        const selectedIds =
          new Set(
            normalizedSelectedRows.map(
              (row) =>
                String(
                  getReportId(row)
                )
            )
          );

        return normalizedReports.filter(
          (report) =>
            selectedIds.has(
              String(
                getReportId(report)
              )
            )
        );

      }

      // Otherwise export all reports.

      return normalizedReports;

    }, [
      normalizedReports,
      normalizedSelectedRows,
    ]);

  //====================================================
  // Export Availability
  //====================================================

  const canExport =
    !loading &&
    !exporting &&
    reportsToExport.length > 0;

  //====================================================
  // Format Change
  //====================================================

  const handleFormatChange = (
    event
  ) => {

    setExportFormat(
      event.target.value
    );

  };

  //====================================================
  // Export Handler
  //====================================================

  const handleExport = async () => {

    if (!canExport) {
      return;
    }

    if (
      typeof onExport !== "function"
    ) {
      return;
    }

    try {

      setExporting(true);

      await onExport(
        reportsToExport,
        exportFormat
      );

    } catch (exportError) {

      console.error(
        "Dashboard report export failed:",
        exportError
      );

    } finally {

      setExporting(false);

    }

  };

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Stack
      className="dashboard-report-export"
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={1.5}
      alignItems={{
        xs: "stretch",
        sm: "center",
      }}
    >

      {/*================================================
          Export Format
      =================================================*/}

      <FormControl
        size="small"
        sx={{
          minWidth: {
            xs: "100%",
            sm: 150,
          },
        }}
      >
        <InputLabel id="dashboard-report-export-format-label">
          Format
        </InputLabel>

        <Select
          labelId="dashboard-report-export-format-label"
          value={exportFormat}
          label="Format"
          onChange={handleFormatChange}
          disabled={
            loading ||
            exporting
          }
        >

          <MenuItem value="csv">
            CSV
          </MenuItem>

          <MenuItem value="xlsx">
            Excel
          </MenuItem>

          <MenuItem value="json">
            JSON
          </MenuItem>

        </Select>
      </FormControl>

      {/*================================================
          Export Button
      =================================================*/}

      <Button
        variant="outlined"
        color="primary"
        startIcon={
          exportFormat === "csv"
            ? <Description />
            : <Download />
        }
        onClick={handleExport}
        disabled={!canExport}
        fullWidth={{
          xs: true,
          sm: false,
        }}
      >
        {exporting
          ? "Exporting..."
          : normalizedSelectedRows.length > 0
            ? `Export Selected (${reportsToExport.length})`
            : "Export Reports"}
      </Button>

    </Stack>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

DashboardReportExport.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.object
  ),

  selectedRows: PropTypes.array,

  loading: PropTypes.bool,

  onExport: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

DashboardReportExport.defaultProps = {
  reports: [],

  selectedRows: [],

  loading: false,

  onExport: () => {},
};

//======================================================
// Export
//======================================================

export default DashboardReportExport;