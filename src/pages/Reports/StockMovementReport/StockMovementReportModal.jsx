//======================================================
// StockMovementReportModal.jsx
// Part 1A
//======================================================

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
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
import CancelIcon from "@mui/icons-material/Cancel";

//======================================================
// Default Form Data
//======================================================

const DEFAULT_FORM_DATA = {
  date: "",
  stockItem: "",
  itemName: "",
  movementType: "",
  voucherNumber: "",
  documentNumber: "",
  voucherType: "",
  warehouse: "",
  godown: "",
  quantity: "",
  rate: "",
  amount: "",
  status: "",
  remarks: "",
  notes: "",
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
    return String(value);
  }

  return date.toISOString().slice(0, 10);
};

//======================================================
// Number Formatter
//======================================================

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value || "0";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(number);
};

//======================================================
// StockMovementReportModal
//======================================================

const StockMovementReportModal = ({
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

  const [isEditMode, setIsEditMode] = useState(
    mode === "edit"
  );

  //====================================================
  // Form Data
  //====================================================

  const [formData, setFormData] = useState(
    DEFAULT_FORM_DATA
  );

  //====================================================
  // Normalize Report
  //====================================================

  const normalizedReport = useMemo(() => {
    if (!report || typeof report !== "object") {
      return {
        ...DEFAULT_FORM_DATA,
      };
    }

    return {
      ...DEFAULT_FORM_DATA,
      ...report,

      date: formatDate(report.date),

      stockItem:
        report.stockItem ??
        report.itemName ??
        "",

      itemName:
        report.itemName ??
        report.stockItem ??
        "",

      voucherNumber:
        report.voucherNumber ??
        report.documentNumber ??
        "",

      documentNumber:
        report.documentNumber ??
        report.voucherNumber ??
        "",

      warehouse:
        report.warehouse ??
        report.godown ??
        "",

      godown:
        report.godown ??
        report.warehouse ??
        "",

      quantity:
        report.quantity ??
        report.movementQuantity ??
        "",

      amount:
        report.amount ??
        report.totalAmount ??
        "",

      remarks:
        report.remarks ??
        report.notes ??
        "",

      notes:
        report.notes ??
        report.remarks ??
        "",
    };
  }, [report]);

  //====================================================
  // Sync Form Data
  //====================================================

  useEffect(() => {
    setFormData(
      normalizedReport
    );

    setIsEditMode(
      mode === "edit"
    );
  }, [
    normalizedReport,
    mode,
    open,
  ]);

  //====================================================
  // Handle Field Change
  //====================================================

  const handleChange = (field) => (event) => {
    const value =
      event?.target?.value ?? "";

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  //====================================================
  // Edit
  //====================================================

  const handleEdit = () => {
    setIsEditMode(true);

    if (onEdit) {
      onEdit(report);
    }
  };

  //====================================================
  // Cancel Edit
  //====================================================

  const handleCancelEdit = () => {
    setFormData(
      normalizedReport
    );

    setIsEditMode(false);
  };

  //====================================================
  // Save
  //====================================================

  const handleSave = async () => {
    if (!onSave) {
      return;
    }

    await onSave(
      formData,
      report
    );
  };

  //====================================================
  // Close
  //====================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    setIsEditMode(
      mode === "edit"
    );

    onClose?.();
  };

  //====================================================
  // Render Read-Only Field
  //====================================================

  const renderValue = (
    label,
    value
  ) => (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={500}
        sx={{
          minHeight: 22,
          wordBreak: "break-word",
        }}
      >
        {value !== undefined &&
        value !== null &&
        value !== ""
          ? value
          : "-"}
      </Typography>
    </Box>
  );

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
      aria-labelledby="stock-movement-report-dialog-title"
    >
      {/*==============================================
          Dialog Title
      ===============================================*/}

      <DialogTitle
        id="stock-movement-report-dialog-title"
        sx={{
          pr: 6,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          {isEditMode
            ? "Edit Stock Movement"
            : "Stock Movement Details"}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {isEditMode
            ? "Update stock movement information."
            : "View complete stock movement information."}
        </Typography>

        <IconButton
          aria-label="Close"
          onClick={handleClose}
          disabled={saving}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/*==============================================
          Dialog Content
      ===============================================*/}

      <DialogContent
        dividers
        sx={{
          backgroundColor:
            "background.default",
        }}
      >
        <Stack spacing={3}>

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
                      formData.date || ""
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
                  renderValue(
                    "Date",
                    normalizedReport.date
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
                    label="Stock Item"
                    value={
                      formData.stockItem ||
                      formData.itemName ||
                      ""
                    }
                    onChange={handleChange(
                      "stockItem"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderValue(
                    "Stock Item",
                    normalizedReport.stockItem
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
                    label="Movement Type"
                    value={
                      formData.movementType ||
                      ""
                    }
                    onChange={handleChange(
                      "movementType"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderValue(
                    "Movement Type",
                    normalizedReport.movementType
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
                  renderValue(
                    "Status",
                    normalizedReport.status
                  )
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Voucher Information
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Voucher Information
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
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Voucher Number"
                    value={
                      formData.voucherNumber ||
                      formData.documentNumber ||
                      ""
                    }
                    onChange={handleChange(
                      "voucherNumber"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderValue(
                    "Voucher Number",
                    normalizedReport.voucherNumber
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
                    label="Voucher Type"
                    value={
                      formData.voucherType ||
                      ""
                    }
                    onChange={handleChange(
                      "voucherType"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderValue(
                    "Voucher Type",
                    normalizedReport.voucherType
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
                    label="Warehouse"
                    value={
                      formData.warehouse ||
                      formData.godown ||
                      ""
                    }
                    onChange={handleChange(
                      "warehouse"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderValue(
                    "Warehouse",
                    normalizedReport.warehouse
                  )
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Quantity / Amount
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Quantity & Amount
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
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Quantity"
                    value={
                      formData.quantity ??
                      ""
                    }
                    onChange={handleChange(
                      "quantity"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                    inputProps={{
                      min: 0,
                    }}
                  />
                ) : (
                  renderValue(
                    "Quantity",
                    formatNumber(
                      normalizedReport.quantity
                    )
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
                    type="number"
                    label="Rate"
                    value={
                      formData.rate ??
                      ""
                    }
                    onChange={handleChange(
                      "rate"
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
                  renderValue(
                    "Rate",
                    formatNumber(
                      normalizedReport.rate
                    )
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
                    type="number"
                    label="Amount"
                    value={
                      formData.amount ??
                      ""
                    }
                    onChange={handleChange(
                      "amount"
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
                  renderValue(
                    "Amount",
                    formatNumber(
                      normalizedReport.amount
                    )
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
                      formData.notes ||
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
                  renderValue(
                    "Remarks",
                    normalizedReport.remarks ||
                      normalizedReport.notes ||
                      "No remarks available"
                  )
                )}
              </Grid>
            </Grid>
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
        {isEditMode ? (
          <>
            <Button
              variant="outlined"
              startIcon={
                <CancelIcon />
              }
              onClick={
                handleCancelEdit
              }
              disabled={saving}
            >
              Cancel
            </Button>

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
                : "Save Changes"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
            >
              Close
            </Button>

            {onEdit && (
              <Button
                variant="contained"
                startIcon={
                  <EditIcon />
                }
                onClick={
                  handleEdit
                }
                disabled={loading}
              >
                Edit
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportModal.propTypes = {
  open:
    PropTypes.bool,

  report:
    PropTypes.object,

  mode:
    PropTypes.oneOf([
      "view",
      "edit",
    ]),

  loading:
    PropTypes.bool,

  saving:
    PropTypes.bool,

  onClose:
    PropTypes.func,

  onSave:
    PropTypes.func,

  onEdit:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

StockMovementReportModal.defaultProps = {
  open: false,
  report: null,
  mode: "view",
  loading: false,
  saving: false,
  onClose: undefined,
  onSave: undefined,
  onEdit: undefined,
};

//======================================================
// Export
//======================================================

export default StockMovementReportModal;

//======================================================
// Part 1A Ends Here
//======================================================