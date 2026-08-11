//======================================================
// TaxReportModal.jsx
// Part 1A
//======================================================

import React, {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

//======================================================
// Format Number
//======================================================

const formatNumber = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

//======================================================
// Format Date
//======================================================

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN");
};

//======================================================
// Normalize Report
//======================================================

const normalizeReport = (report) => {
  if (!report) {
    return {};
  }

  const cgst = Number(
    report.cgst ??
      report.cgstAmount ??
      0
  );

  const sgst = Number(
    report.sgst ??
      report.sgstAmount ??
      0
  );

  const igst = Number(
    report.igst ??
      report.igstAmount ??
      0
  );

  const cess = Number(
    report.cess ??
      report.cessAmount ??
      0
  );

  return {
    ...report,

    date:
      report.date ??
      report.taxDate ??
      report.invoiceDate ??
      "",

    invoiceNumber:
      report.invoiceNumber ??
      report.invoiceNo ??
      report.documentNumber ??
      report.docNo ??
      "",

    partyName:
      report.partyName ??
      report.customerName ??
      report.supplierName ??
      report.customer ??
      report.supplier ??
      "",

    gstin:
      report.gstin ??
      report.customerGstin ??
      report.supplierGstin ??
      "",

    taxableAmount:
      report.taxableAmount ??
      report.taxableValue ??
      report.taxable ??
      0,

    cgst,
    sgst,
    igst,
    cess,

    totalTax:
      report.totalTax ??
      report.taxAmount ??
      cgst +
        sgst +
        igst +
        cess,

    invoiceTotal:
      report.invoiceTotal ??
      report.totalAmount ??
      report.grandTotal ??
      0,

    status:
      report.status ??
      report.taxStatus ??
      "Pending",

    remarks:
      report.remarks ??
      report.notes ??
      "",
  };
};

//======================================================
// TaxReportModal
//======================================================

const TaxReportModal = ({
  open = false,
  report = null,
  mode = "view",
  loading = false,
  saving = false,
  onClose,
  onSave,
  onEdit,
}) => {
  //====================================================
  // Edit Mode
  //====================================================

  const isEditMode =
    mode === "edit";

  //====================================================
  // Form Data
  //====================================================

  const [
    formData,
    setFormData,
  ] = useState({});

  //====================================================
  // Validation Error
  //====================================================

  const [
    validationError,
    setValidationError,
  ] = useState("");

  //====================================================
  // Load Report
  //====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const normalized =
      normalizeReport(report);

    setFormData(normalized);
    setValidationError("");
  }, [
    open,
    report,
  ]);

  //====================================================
  // Field Change
  //====================================================

  const handleChange =
    (field) =>
    (event) => {
      const value =
        event.target.value;

      setFormData(
        (previous) => ({
          ...previous,
          [field]: value,
        })
      );
    };

  //====================================================
  // Save
  //====================================================

  const handleSave = async () => {
    if (!formData) {
      return;
    }

    if (
      !formData.invoiceNumber
    ) {
      setValidationError(
        "Invoice number is required."
      );

      return;
    }

    setValidationError("");

    if (
      typeof onSave ===
      "function"
    ) {
      await onSave(formData);
    }
  };

  //====================================================
  // Edit
  //====================================================

  const handleEdit = () => {
    if (
      typeof onEdit ===
      "function"
    ) {
      onEdit(formData);
    }
  };

  //====================================================
  // Close
  //====================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    if (
      typeof onClose ===
      "function"
    ) {
      onClose();
    }
  };

  //====================================================
  // Render Field
  //====================================================

  const renderField = (
    label,
    value
  ) => {
    return (
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.25,
            wordBreak:
              "break-word",
          }}
        >
          {value === null ||
          value === undefined ||
          value === ""
            ? "-"
            : value}
        </Typography>
      </Box>
    );
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      {/*==============================================
          Dialog Title
      ===============================================*/}

      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {isEditMode
                ? "Edit Tax Report"
                : "Tax Report Details"}
            </Typography>

            {!isEditMode &&
            formData.invoiceNumber ? (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Invoice:{" "}
                {
                  formData.invoiceNumber
                }
              </Typography>
            ) : null}
          </Box>

          <IconButton
            onClick={handleClose}
            disabled={saving}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/*==============================================
          Dialog Content
      ===============================================*/}

      <DialogContent dividers>
        <Stack spacing={3}>

          {/*============================================
              Validation Error
          =============================================*/}

          {validationError ? (
            <Alert
              severity="error"
              onClose={() =>
                setValidationError("")
              }
            >
              {validationError}
            </Alert>
          ) : null}

          {/*============================================
              Basic Information
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Basic Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Date"
                    value={
                      formData.date ||
                      ""
                    }
                    onChange={handleChange(
                      "date"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ) : (
                  renderField(
                    "Date",
                    formatDate(
                      formData.date
                    )
                  )
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Invoice Number"
                    value={
                      formData.invoiceNumber ||
                      ""
                    }
                    onChange={handleChange(
                      "invoiceNumber"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderField(
                    "Invoice Number",
                    formData.invoiceNumber
                  )
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Party Name"
                    value={
                      formData.partyName ||
                      ""
                    }
                    onChange={handleChange(
                      "partyName"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderField(
                    "Party Name",
                    formData.partyName
                  )
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="GSTIN"
                    value={
                      formData.gstin ||
                      ""
                    }
                    onChange={handleChange(
                      "gstin"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderField(
                    "GSTIN",
                    formData.gstin
                  )
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Taxable Amount
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Taxable Value
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Taxable Amount"
                    value={
                      formData.taxableAmount ??
                      ""
                    }
                    onChange={handleChange(
                      "taxableAmount"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                    inputProps={{
                      min: 0,
                      step: "0.01",
                    }}
                  />
                ) : (
                  renderField(
                    "Taxable Amount",
                    `₹ ${formatNumber(
                      formData.taxableAmount
                    )}`
                  )
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Tax Breakdown
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Tax Breakdown
            </Typography>

            <Grid
              container
              spacing={2}
            >
              {[
                {
                  key: "cgst",
                  label: "CGST",
                },
                {
                  key: "sgst",
                  label: "SGST",
                },
                {
                  key: "igst",
                  label: "IGST",
                },
                {
                  key: "cess",
                  label: "Cess",
                },
              ].map(
                ({
                  key,
                  label,
                }) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={key}
                  >
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label={label}
                        value={
                          formData[
                            key
                          ] ?? ""
                        }
                        onChange={handleChange(
                          key
                        )}
                        disabled={
                          loading ||
                          saving
                        }
                        inputProps={{
                          min: 0,
                          step: "0.01",
                        }}
                      />
                    ) : (
                      renderField(
                        label,
                        `₹ ${formatNumber(
                          formData[
                            key
                          ]
                        )}`
                      )
                    )}
                  </Grid>
                )
              )}
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Totals
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Tax Totals
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
              >
                {renderField(
                  "Total Tax",
                  `₹ ${formatNumber(
                    formData.totalTax
                  )}`
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Invoice Total"
                    value={
                      formData.invoiceTotal ??
                      ""
                    }
                    onChange={handleChange(
                      "invoiceTotal"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                    inputProps={{
                      min: 0,
                      step: "0.01",
                    }}
                  />
                ) : (
                  renderField(
                    "Invoice Total",
                    `₹ ${formatNumber(
                      formData.invoiceTotal
                    )}`
                  )
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Status"
                    value={
                      formData.status ||
                      ""
                    }
                    onChange={handleChange(
                      "status"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderField(
                    "Status",
                    formData.status
                  )
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Remarks / Notes
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Additional Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={6}
                    label="Remarks"
                    value={
                      formData.remarks ||
                      ""
                    }
                    onChange={handleChange(
                      "remarks"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderField(
                    "Remarks",
                    formData.remarks ||
                      "No remarks available"
                  )
                )}
              </Grid>
            </Grid>
          </Box>

          {/*============================================
              Part 1A Ends Here
          =============================================*/}

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
          onClick={handleClose}
          disabled={saving}
        >
          Close
        </Button>

        {!isEditMode ? (
          <Button
            variant="contained"
            startIcon={
              <EditIcon />
            }
            onClick={handleEdit}
            disabled={
              loading ||
              saving ||
              !formData
            }
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={
              <SaveIcon />
            }
            onClick={handleSave}
            disabled={
              loading ||
              saving
            }
          >
            {saving
              ? "Saving..."
              : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

//======================================================
// Export
//======================================================

export default TaxReportModal;

//======================================================
// Part 1A Ends Here
//======================================================