
//======================================================
// StockLedgerReportExport.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

//======================================================
// Helpers
//======================================================

import {
  normalizeStockLedgerReports,
  formatDate,
  formatNumber,
} from "./StockLedgerReportHelpers";

//======================================================
// Default Export Fields
//======================================================

const DEFAULT_FIELDS = {
  date: true,
  voucherNumber: true,
  voucherType: true,
  transactionType: true,
  stockItem: true,
  warehouse: true,
  godown: true,
  inwardQuantity: true,
  outwardQuantity: true,
  closingQuantity: true,
  unit: true,
  remarks: true,
};

//======================================================
// StockLedgerReportExport
//======================================================

const StockLedgerReportExport = ({
  open = false,
  reports = [],
  loading = false,
  onClose,
  onExport,
  defaultFileName = "StockLedgerReport",
}) => {
  //====================================================
  // State
  //====================================================

  const [fileName, setFileName] =
    useState(
      defaultFileName
    );

  const [fileFormat, setFileFormat] =
    useState("csv");

  const [fields, setFields] =
    useState({
      ...DEFAULT_FIELDS,
    });

  const [error, setError] =
    useState("");

  const [exporting, setExporting] =
    useState(false);

  //====================================================
  // Normalize Reports
  //====================================================

  const normalizedReports = useMemo(() => {
    if (!Array.isArray(reports)) {
      return [];
    }

    return normalizeStockLedgerReports(
      reports
    );
  }, [reports]);

  //====================================================
  // Selected Field Count
  //====================================================

  const selectedFieldCount =
    useMemo(() => {
      return Object.values(
        fields
      ).filter(Boolean).length;
    }, [fields]);

  //====================================================
  // Update Field
  //====================================================

  const handleFieldChange =
    useCallback(
      (field) => (event) => {
        setFields(
          (previous) => ({
            ...previous,
            [field]:
              event.target.checked,
          })
        );

        setError("");
      },
      []
    );

  //====================================================
  // Select All
  //====================================================

  const handleSelectAll =
    useCallback(() => {
      setFields(
        Object.keys(
          DEFAULT_FIELDS
        ).reduce(
          (result, field) => ({
            ...result,
            [field]: true,
          }),
          {}
        )
      );

      setError("");
    }, []);

  //====================================================
  // Clear All
  //====================================================

  const handleClearAll =
    useCallback(() => {
      setFields(
        Object.keys(
          DEFAULT_FIELDS
        ).reduce(
          (result, field) => ({
            ...result,
            [field]: false,
          }),
          {}
        )
      );

      setError("");
    }, []);

  //====================================================
  // Close
  //====================================================

  const handleClose =
    useCallback(() => {
      if (exporting) {
        return;
      }

      setError("");

      if (
        typeof onClose ===
        "function"
      ) {
        onClose();
      }
    }, [
      exporting,
      onClose,
    ]);

  //====================================================
  // Export Data
  //====================================================

  const handleExport =
    useCallback(async () => {
      setError("");

      if (
        normalizedReports.length ===
        0
      ) {
        setError(
          "There are no stock ledger records to export."
        );
        return;
      }

      if (
        selectedFieldCount ===
        0
      ) {
        setError(
          "Please select at least one field to export."
        );
        return;
      }

      const trimmedFileName =
        fileName.trim();

      if (!trimmedFileName) {
        setError(
          "Please enter a file name."
        );
        return;
      }

      const selectedFields =
        Object.keys(fields).filter(
          (field) =>
            fields[field]
        );

      const exportRows =
        normalizedReports.map(
          (report) => {
            const row = {};

            selectedFields.forEach(
              (field) => {
                switch (field) {
                  case "date":
                    row[
                      "Date"
                    ] =
                      formatDate(
                        report.date
                      );
                    break;

                  case "voucherNumber":
                    row[
                      "Voucher Number"
                    ] =
                      report.voucherNumber ||
                      "";
                    break;

                  case "voucherType":
                    row[
                      "Voucher Type"
                    ] =
                      report.voucherType ||
                      "";
                    break;

                  case "transactionType":
                    row[
                      "Transaction Type"
                    ] =
                      report.transactionType ||
                      "";
                    break;

                  case "stockItem":
                    row[
                      "Stock Item"
                    ] =
                      report.stockItem ||
                      report.itemName ||
                      "";
                    break;

                  case "warehouse":
                    row[
                      "Warehouse"
                    ] =
                      report.warehouse ||
                      "";
                    break;

                  case "godown":
                    row[
                      "Godown"
                    ] =
                      report.godown ||
                      "";
                    break;

                  case "inwardQuantity":
                    row[
                      "Inward Quantity"
                    ] =
                      formatNumber(
                        report.inwardQuantity
                      );
                    break;

                  case "outwardQuantity":
                    row[
                      "Outward Quantity"
                    ] =
                      formatNumber(
                        report.outwardQuantity
                      );
                    break;

                  case "closingQuantity":
                    row[
                      "Closing Quantity"
                    ] =
                      formatNumber(
                        report.closingQuantity ??
                          report.balanceQuantity
                      );
                    break;

                  case "unit":
                    row[
                      "Unit"
                    ] =
                      report.unit ||
                      "";
                    break;

                  case "remarks":
                    row[
                      "Remarks"
                    ] =
                      report.remarks ||
                      report.notes ||
                      "";
                    break;

                  default:
                    break;
                }
              }
            );

            return row;
          }
        );

      setExporting(true);

      try {
        if (
          typeof onExport ===
          "function"
        ) {
          await onExport({
            data: exportRows,
            reports:
              normalizedReports,
            fields:
              selectedFields,
            fileName:
              trimmedFileName,
            format:
              fileFormat,
          });
        }
      } catch (exportError) {
        console.error(
          "Stock ledger export failed:",
          exportError
        );

        setError(
          exportError?.message ||
            "Failed to export stock ledger report."
        );
      } finally {
        setExporting(false);
      }
    }, [
      normalizedReports,
      selectedFieldCount,
      fileName,
      fields,
      fileFormat,
      onExport,
    ]);

  //====================================================
  // Render
  //====================================================

 //======================================================
// Render
//======================================================

return (
  <Dialog
    open={open}
    onClose={handleClose}
    fullWidth
    maxWidth="md"
  >
    {/*================================================
        Dialog Title
    =================================================*/}

    <DialogTitle
      sx={{
        pr: 6,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
      >
        Export Stock Ledger Report
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Select the fields and format for
        the exported report.
      </Typography>

      <IconButton
        aria-label="Close"
        onClick={handleClose}
        disabled={exporting}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseOutlinedIcon />
      </IconButton>
    </DialogTitle>

    <Divider />

    {/*================================================
        Dialog Content
    =================================================*/}

    <DialogContent>
      <Stack spacing={3}>

        {/*==============================================
            Error
        ===============================================*/}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {/*==============================================
            Export Information
        ===============================================*/}

        <Alert severity="info">
          {normalizedReports.length}{" "}
          stock ledger record
          {normalizedReports.length === 1
            ? ""
            : "s"} available for export.
        </Alert>

        {/*==============================================
            Export Settings
        ===============================================*/}

        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            gutterBottom
          >
            Export Settings
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {/* File Name */}

            <Grid
              item
              xs={12}
              md={8}
            >
              <TextField
                fullWidth
                size="small"
                label="File Name"
                value={fileName}
                onChange={(event) => {
                  setFileName(
                    event.target.value
                  );
                  setError("");
                }}
                disabled={
                  loading ||
                  exporting
                }
              />
            </Grid>

            {/* File Format */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                select
                fullWidth
                size="small"
                label="File Format"
                value={fileFormat}
                onChange={(event) => {
                  setFileFormat(
                    event.target.value
                  );
                  setError("");
                }}
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
              </TextField>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/*==============================================
            Fields To Export
        ===============================================*/}

        <Box>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            justifyContent="space-between"
            spacing={1}
            sx={{
              mb: 1,
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Fields to Export
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {selectedFieldCount}{" "}
                fields selected
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
            >
              <Button
                size="small"
                onClick={
                  handleSelectAll
                }
                disabled={
                  loading ||
                  exporting
                }
              >
                Select All
              </Button>

              <Button
                size="small"
                onClick={
                  handleClearAll
                }
                disabled={
                  loading ||
                  exporting
                }
              >
                Clear All
              </Button>
            </Stack>
          </Stack>

          <Grid
            container
            spacing={1}
          >

            {/*==========================================
                Date
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.date
                    }
                    onChange={handleFieldChange(
                      "date"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Date"
              />
            </Grid>

            {/*==========================================
                Voucher Number
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.voucherNumber
                    }
                    onChange={handleFieldChange(
                      "voucherNumber"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Voucher Number"
              />
            </Grid>

            {/*==========================================
                Voucher Type
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.voucherType
                    }
                    onChange={handleFieldChange(
                      "voucherType"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Voucher Type"
              />
            </Grid>

            {/*==========================================
                Transaction Type
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.transactionType
                    }
                    onChange={handleFieldChange(
                      "transactionType"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Transaction Type"
              />
            </Grid>

            {/*==========================================
                Stock Item
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.stockItem
                    }
                    onChange={handleFieldChange(
                      "stockItem"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Stock Item"
              />
            </Grid>

            {/*==========================================
                Warehouse
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.warehouse
                    }
                    onChange={handleFieldChange(
                      "warehouse"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Warehouse"
              />
            </Grid>

            {/*==========================================
                Godown
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.godown
                    }
                    onChange={handleFieldChange(
                      "godown"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Godown"
              />
            </Grid>

            {/*==========================================
                Inward Quantity
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.inwardQuantity
                    }
                    onChange={handleFieldChange(
                      "inwardQuantity"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Inward Quantity"
              />
            </Grid>

            {/*==========================================
                Outward Quantity
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.outwardQuantity
                    }
                    onChange={handleFieldChange(
                      "outwardQuantity"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Outward Quantity"
              />
            </Grid>

            {/*==========================================
                Closing Quantity
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.closingQuantity
                    }
                    onChange={handleFieldChange(
                      "closingQuantity"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Closing Quantity"
              />
            </Grid>

            {/*==========================================
                Unit
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.unit
                    }
                    onChange={handleFieldChange(
                      "unit"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Unit"
              />
            </Grid>

            {/*==========================================
                Remarks
            ===========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      fields.remarks
                    }
                    onChange={handleFieldChange(
                      "remarks"
                    )}
                    disabled={
                      loading ||
                      exporting
                    }
                  />
                }
                label="Remarks"
              />
            </Grid>

          </Grid>
        </Box>

        {/*==============================================
            Selected Records Preview
        ===============================================*/}

        <Divider />

        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            gutterBottom
          >
            Export Summary
          </Typography>

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={4}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Records
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {
                  normalizedReports.length
                }
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={4}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Fields
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {selectedFieldCount}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={4}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Format
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                textTransform="uppercase"
              >
                {fileFormat}
              </Typography>
            </Grid>
          </Grid>
        </Box>

      </Stack>
    </DialogContent>

    {/*================================================
        Dialog Actions
    =================================================*/}

    <DialogActions
      sx={{
        px: 3,
        py: 2,
      }}
    >
      <Button
        onClick={handleClose}
        disabled={exporting}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        startIcon={
          <FileDownloadOutlinedIcon />
        }
        onClick={
          handleExport
        }
        disabled={
          loading ||
          exporting ||
          normalizedReports.length ===
            0 ||
          selectedFieldCount === 0
        }
      >
        {exporting
          ? "Exporting..."
          : "Export Report"}
      </Button>
    </DialogActions>
  </Dialog>
);
}
export default StockLedgerReportExport;
