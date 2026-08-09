import React, {useCallback,useMemo,useState} from "react";
import PropTypes from "prop-types";
import {Download,PictureAsPdf,TableView} from "@mui/icons-material";
import {Alert,Box,Button,MenuItem,Paper,Select,Stack,Typography} from "@mui/material";
import {exportProfitLossReport} from "./ProfitLossReportService";

//======================================================
// ProfitLossReportExport
//======================================================

const ProfitLossReportExport = ({
  reports = [],
  data = [],
  filters = {},
  loading = false,
  onExport,
}) => {
  //====================================================
  // State
  //====================================================

  const [exportFormat, setExportFormat] = useState("excel");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  //====================================================
  // Source Data
  //====================================================

  const reportData = useMemo(
    () =>
      Array.isArray(reports)
        ? reports
        : Array.isArray(data)
          ? data
          : [],
    [reports, data]
  );

  //====================================================
  // Format Change
  //====================================================

  const handleFormatChange =
    useCallback((event) => {
      setExportFormat(
        event?.target?.value ||
          "excel"
      );

      setError("");
    }, []);

  //====================================================
  // Export
  //====================================================

  const handleExport =
    useCallback(async () => {
      if (
        exporting ||
        loading
      ) {
        return;
      }

      setError("");
      setExporting(true);

      try {
        const result = await exportProfitLossReport({
            reports: reportData,
            filters,
            format: exportFormat,
          });
        if (onExport) {
          onExport(
            result,
            exportFormat
          );
        }
      } catch (exportError) {
        console.error(
          "ProfitLossReportExport error:",
          exportError
        );
        setError(
          exportError?.message ||
            "Unable to export profit and loss report."
        );
      } finally {
        setExporting(false);
      }
    }, [
      exporting,
      loading,
      reportData,
      filters,
      exportFormat,
      onExport,
    ]);

  //====================================================
  // Export Icon
  //====================================================

  const ExportIcon =
    exportFormat === "pdf"
      ? PictureAsPdf
      : TableView;

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="profit-loss-report-export"
      variant="outlined"
      sx={{
        width: "100%",
        p: 1.5,
        borderRadius: 2,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={1.5}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        justifyContent="space-between"
      >
        {/*==============================================
            Export Information
        ==============================================*/}

        <Box>
          <Typography
            variant="subtitle2"
            fontWeight={700}
          >
            Export Report
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Export the current profit & loss
            report data.
          </Typography>
        </Box>

        {/*==============================================
            Export Controls
        ==============================================*/}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Select
            size="small"
            value={exportFormat}
            onChange={
              handleFormatChange
            }
            disabled={
              exporting ||
              loading
            }
            sx={{
              minWidth: 120,
            }}
          >
            <MenuItem value="excel">
              Excel
            </MenuItem>

            <MenuItem value="csv">
              CSV
            </MenuItem>

            <MenuItem value="pdf">
              PDF
            </MenuItem>
          </Select>

          <Button
            variant="contained"
            size="small"
            startIcon={
              exporting ? (
                <Download />
              ) : (
                <ExportIcon />
              )
            }
            onClick={handleExport}
            disabled={
              exporting ||
              loading ||
              reportData.length === 0
            }
          >
            {exporting
              ? "Exporting..."
              : "Export"}
          </Button>
        </Stack>
      </Stack>

      {/*==============================================
          Error
      ==============================================*/}

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 1.5 }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {/*==============================================
          Report Count
      ==============================================*/}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          mt: 1,
        }}
      >
        {reportData.length}{" "}
        {reportData.length === 1
          ? "record"
          : "records"}{" "}
        available for export
      </Typography>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

ProfitLossReportExport.propTypes = {
  reports:
    PropTypes.array,

  data:
    PropTypes.array,

  filters:
    PropTypes.object,

  loading:
    PropTypes.bool,

  onExport:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

ProfitLossReportExport.defaultProps = {
  reports: [],

  data: [],

  filters: {},

  loading: false,

  onExport: () => {},
};

export default ProfitLossReportExport;

