//======================================================
// StockMovementReportExport.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";

//======================================================
// Export Columns
//======================================================

const EXPORT_COLUMNS = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "stockItem",
    label: "Stock Item",
  },
  {
    key: "movementType",
    label: "Movement Type",
  },
  {
    key: "voucherNumber",
    label: "Voucher Number",
  },
  {
    key: "voucherType",
    label: "Voucher Type",
  },
  {
    key: "warehouse",
    label: "Warehouse",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
  {
    key: "rate",
    label: "Rate",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "status",
    label: "Status",
  },
];

//======================================================
// Helpers
//======================================================

const getValue = (
  row,
  key
) => {
  if (!row) {
    return "";
  }

  if (key === "stockItem") {
    return (
      row.stockItem ??
      row.itemName ??
      ""
    );
  }

  if (key === "voucherNumber") {
    return (
      row.voucherNumber ??
      row.documentNumber ??
      ""
    );
  }

  if (key === "warehouse") {
    return (
      row.warehouse ??
      row.godown ??
      ""
    );
  }

  if (key === "quantity") {
    return (
      row.quantity ??
      row.movementQuantity ??
      row.qty ??
      ""
    );
  }

  if (key === "amount") {
    return (
      row.amount ??
      row.totalAmount ??
      row.value ??
      ""
    );
  }

  return row[key] ?? "";
};

//======================================================
// CSV Escape
//======================================================

const escapeCsvValue = (
  value
) => {
  const stringValue =
    String(
      value ?? ""
    );

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(
      /"/g,
      '""'
    )}"`;
  }

  return stringValue;
};

//======================================================
// CSV Builder
//======================================================

const buildCsv = (
  reports
) => {
  const headers =
    EXPORT_COLUMNS.map(
      (column) =>
        escapeCsvValue(
          column.label
        )
    ).join(",");

  const rows =
    reports.map(
      (report) =>
        EXPORT_COLUMNS.map(
          (column) =>
            escapeCsvValue(
              getValue(
                report,
                column.key
              )
            )
        ).join(",")
    );

  return [
    headers,
    ...rows,
  ].join("\n");
};

//======================================================
// File Download
//======================================================

const downloadCsv = (
  csv,
  filename
) => {
  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;
  link.download = filename;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(
    url
  );
};

//======================================================
// StockMovementReportExport
//======================================================

const StockMovementReportExport = ({
  reports = [],
  filteredReports = [],
  onExport,
  disabled = false,
  defaultFormat = "csv",
}) => {
  //====================================================
  // State
  //====================================================

  const [open, setOpen] =
    useState(false);

  const [format, setFormat] =
    useState(
      defaultFormat
    );

  const [exporting, setExporting] =
    useState(false);

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      severity: "success",
      message: "",
    });

  //====================================================
  // Open Dialog
  //====================================================

  const handleOpen = useCallback(
    () => {
      if (disabled) {
        return;
      }

      setOpen(true);
    },
    [disabled]
  );

  //====================================================
  // Close Dialog
  //====================================================

  const handleClose = useCallback(
    () => {
      if (exporting) {
        return;
      }

      setOpen(false);
    },
    [exporting]
  );

  //====================================================
  // Close Snackbar
  //====================================================

  const handleSnackbarClose =
    useCallback(() => {
      setSnackbar(
        (previous) => ({
          ...previous,
          open: false,
        })
      );
    }, []);

  //====================================================
  // Export
  //====================================================

  const handleExport =
    useCallback(async () => {
      const data =
        Array.isArray(
          filteredReports
        ) &&
        filteredReports.length > 0
          ? filteredReports
          : Array.isArray(
                reports
              )
            ? reports
            : [];

      if (data.length === 0) {
        setSnackbar({
          open: true,
          severity: "warning",
          message:
            "There are no stock movement records to export.",
        });

        return;
      }

      setExporting(true);

      try {
        //==============================================
        // Custom Export Handler
        //==============================================

        if (onExport) {
          await onExport(
            data,
            format
          );

          setSnackbar({
            open: true,
            severity: "success",
            message:
              "Stock movement report exported successfully.",
          });

          setOpen(false);

          return;
        }

        //==============================================
        // CSV Export
        //==============================================

        if (format === "csv") {
          const csv =
            buildCsv(data);

          const date =
            new Date()
              .toISOString()
              .slice(0, 10);

          downloadCsv(
            csv,
            `stock-movement-report-${date}.csv`
          );

          setSnackbar({
            open: true,
            severity: "success",
            message:
              "CSV report downloaded successfully.",
          });

          setOpen(false);

          return;
        }

        //==============================================
        // Unsupported Format
        //==============================================

        setSnackbar({
          open: true,
          severity: "warning",
          message:
            `${format.toUpperCase()} export requires a custom onExport handler.`,
        });
      } catch (error) {
        console.error(
          "Stock movement export failed:",
          error
        );

        setSnackbar({
          open: true,
          severity: "error",
          message:
            "Unable to export the stock movement report.",
        });
      } finally {
        setExporting(false);
      }
    }, [
      filteredReports,
      reports,
      onExport,
      format,
    ]);

  //====================================================
  // Render
  //====================================================

  return (
    <>
      {/*==============================================
          Export Button
      ===============================================*/}

      <Button
        variant="contained"
        color="primary"
        startIcon={
          <FileDownloadIcon />
        }
        onClick={
          handleOpen
        }
        disabled={
          disabled ||
          exporting
        }
      >
        Export
      </Button>

      {/*==============================================
          Export Dialog
      ===============================================*/}

      <Dialog
        open={open}
        onClose={
          handleClose
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            pr: 6,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Export Stock Movement Report
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Select the format for
            exporting the current
            stock movement records.
          </Typography>

          <Button
            size="small"
            onClick={
              handleClose
            }
            disabled={
              exporting
            }
            sx={{
              position:
                "absolute",
              right: 12,
              top: 12,
              minWidth: 0,
            }}
          >
            <CloseIcon
              fontSize="small"
            />
          </Button>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Stack
            spacing={3}
          >

            {/*========================================
                Record Count
            =========================================*/}

            <Alert
              severity="info"
              variant="outlined"
            >
              {(
                Array.isArray(
                  filteredReports
                )
                  ? filteredReports
                      .length
                  : 0
              ) ||
                (
                  Array.isArray(
                    reports
                  )
                    ? reports.length
                    : 0
                )}{" "}
              stock movement
              record(s) will be
              exported.
            </Alert>

            {/*========================================
                Format
            =========================================*/}

            <FormControl
              fullWidth
              size="small"
              disabled={
                exporting
              }
            >
              <InputLabel>
                Export Format
              </InputLabel>

              <Select
                value={
                  format
                }
                label="Export Format"
                onChange={(
                  event
                ) =>
                  setFormat(
                    event.target.value
                  )
                }
              >
                <MenuItem value="csv">
                  CSV
                </MenuItem>

                <MenuItem value="xlsx">
                  Excel
                </MenuItem>

                <MenuItem value="pdf">
                  PDF
                </MenuItem>
              </Select>
            </FormControl>

            {/*========================================
                Information
            =========================================*/}

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Export includes:
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                }}
              >
                Date, Stock Item,
                Movement Type, Voucher
                Number, Voucher Type,
                Warehouse, Quantity,
                Rate, Amount and
                Status.
              </Typography>
            </Box>

          </Stack>
        </DialogContent>

        {/*==============================================
            Dialog Actions
        ===============================================*/}

        <DialogActions
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={
              handleClose
            }
            disabled={
              exporting
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={
              exporting ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <FileDownloadIcon />
              )
            }
            onClick={
              handleExport
            }
            disabled={
              exporting
            }
          >
            {exporting
              ? "Exporting..."
              : "Export Report"}
          </Button>
        </DialogActions>
      </Dialog>

      {/*==============================================
          Snackbar
      ===============================================*/}

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={4000}
        onClose={
          handleSnackbarClose
        }
      >
        <Alert
          severity={
            snackbar.severity
          }
          onClose={
            handleSnackbarClose
          }
          variant="filled"
        >
          {
            snackbar.message
          }
        </Alert>
      </Snackbar>
    </>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportExport.propTypes = {
  reports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  filteredReports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  onExport:
    PropTypes.func,

  disabled:
    PropTypes.bool,

  defaultFormat:
    PropTypes.oneOf([
      "csv",
      "xlsx",
      "pdf",
    ]),
};

//======================================================
// Default Props
//======================================================

StockMovementReportExport.defaultProps = {
  reports: [],

  filteredReports: [],

  onExport:
    undefined,

  disabled: false,

  defaultFormat:
    "csv",
};

//======================================================
// Export
//======================================================

export default StockMovementReportExport;

//======================================================
// Part 1A Ends Here
//======================================================