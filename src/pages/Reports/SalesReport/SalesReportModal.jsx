
//======================================================
// SalesReportModal.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Close,
  DeleteOutline,
  EditOutlined,
  Save,
  VisibilityOutlined,
} from "@mui/icons-material";

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

import {
  formatCurrency,
  formatDate,
  normalizeSalesReport,
} from "./SalesReportHelpers";

//======================================================
// SalesReportModal
//======================================================

const SalesReportModal = ({
  open = false,
  report = null,
  mode = "view",
  loading = false,
  onClose,
  onEdit,
  onDelete,
  onSave,
}) => {
  //====================================================
  // Local Form State
  //====================================================

  const [formData, setFormData] =
    useState({});

  const [validationError, setValidationError] =
    useState("");

  //====================================================
  // Normalize Report
  //====================================================

  const normalizedReport = useMemo(
    () =>
      normalizeSalesReport(
        report || {}
      ),
    [report]
  );

  //====================================================
  // Edit Mode
  //====================================================

  const isEditMode =
    mode === "edit" ||
    mode === "approve";

  const isViewMode =
    !isEditMode;

  //====================================================
  // Sync Form Data
  //====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      ...normalizedReport,
    });

    setValidationError("");
  }, [
    open,
    normalizedReport,
  ]);

  //====================================================
  // Field Change
  //====================================================

  const handleChange = useCallback(
    (field) => (event) => {
      const value =
        event?.target?.value ?? "";

      setFormData(
        (previous) => ({
          ...previous,
          [field]: value,
        })
      );

      setValidationError("");
    },
    []
  );

  //====================================================
  // Close Handler
  //====================================================

  const handleClose = useCallback(() => {
    if (loading) {
      return;
    }

    setValidationError("");

    if (
      typeof onClose ===
      "function"
    ) {
      onClose();
    }
  }, [
    loading,
    onClose,
  ]);

  //====================================================
  // Edit Handler
  //====================================================

  const handleEdit = useCallback(() => {
    if (
      !report ||
      typeof onEdit !==
        "function"
    ) {
      return;
    }

    onEdit(report);
  }, [
    onEdit,
    report,
  ]);

  //====================================================
  // Delete Handler
  //====================================================

  const handleDelete = useCallback(() => {
    if (
      !report ||
      loading ||
      typeof onDelete !==
        "function"
    ) {
      return;
    }

    onDelete(report);
  }, [
    loading,
    onDelete,
    report,
  ]);

  //====================================================
  // Validation
  //====================================================

  const validateForm = useCallback(() => {
    if (!formData) {
      setValidationError(
        "Sales report data is missing."
      );

      return false;
    }

    if (
      !formData.orderNumber &&
      !formData.invoiceNumber &&
      !formData.orderId
    ) {
      setValidationError(
        "Order number is required."
      );

      return false;
    }

    return true;
  }, [formData]);

  //====================================================
  // Save Handler
  //====================================================

  const handleSave = useCallback(
    async () => {
      if (
        loading ||
        typeof onSave !==
          "function"
      ) {
        return;
      }

      if (!validateForm()) {
        return;
      }

      setValidationError("");

      try {
        await onSave({
          ...formData,
        });
      } catch (saveError) {
        setValidationError(
          saveError?.message ||
            "Unable to save sales report."
        );
      }
    },
    [
      formData,
      loading,
      onSave,
      validateForm,
    ]
  );

  //====================================================
  // Display Values
  //====================================================

  const displayValues = useMemo(
    () => ({
      orderNumber:
        normalizedReport.orderNumber ||
        normalizedReport.invoiceNumber ||
        normalizedReport.orderId ||
        "-",

      customer:
        normalizedReport.customerName ||
        normalizedReport.customer ||
        "-",

      product:
        normalizedReport.productName ||
        normalizedReport.product ||
        normalizedReport.itemName ||
        "-",

      date: formatDate(
        normalizedReport.date
      ),

      quantity:
        normalizedReport.quantity ??
        normalizedReport.totalQuantity ??
        0,

      salesAmount: formatCurrency(
        normalizedReport.salesAmount ??
          normalizedReport.totalSales ??
          normalizedReport.amount ??
          0
      ),

      taxAmount: formatCurrency(
        normalizedReport.taxAmount ??
          normalizedReport.tax ??
          0
      ),

      totalAmount: formatCurrency(
        normalizedReport.totalAmount ??
          normalizedReport.total ??
          normalizedReport.salesAmount ??
          0
      ),

      status:
        normalizedReport.status ||
        "Pending",

      marketplace:
        normalizedReport.marketplace ||
        "-",

      category:
        normalizedReport.category ||
        "-",
    }),
    [normalizedReport]
  );

  //====================================================
  // Render
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      className="sales-report-modal"
    >
      {/*==============================================
          Dialog Title
      ==============================================*/}

      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {isViewMode ? (
              <VisibilityOutlined />
            ) : (
              <EditOutlined />
            )}

            <Typography
              variant="h6"
              fontWeight={700}
            >
              {isViewMode
                ? "Sales Report Details"
                : "Edit Sales Report"}
            </Typography>
          </Stack>

          <IconButton
            onClick={handleClose}
            disabled={loading}
            aria-label="Close sales report"
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/*==============================================
          Dialog Content
      ==============================================*/}

      <DialogContent>
        <Stack spacing={3}>
          {/*============================================
              Validation Error
          =============================================*/}

          {validationError && (
            <Alert
              severity="error"
              onClose={() =>
                setValidationError("")
              }
            >
              {validationError}
            </Alert>
          )}

          {/*============================================
              Report Summary
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Report Summary
            </Typography>

            <Grid
              container
              spacing={2}
            >
              {/*========================================
                  Order Number
              =========================================*/}

              <Grid
                item
                xs={12}
                sm={6}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Order Number"
                    value={
                      formData.orderNumber ||
                      formData.invoiceNumber ||
                      ""
                    }
                    onChange={handleChange(
                      "orderNumber"
                    )}
                    disabled={loading}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Order Number
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                    >
                      {
                        displayValues.orderNumber
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Date
              =========================================*/}

              <Grid
                item
                xs={12}
                sm={6}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Date"
                    type="date"
                    value={
                      formData.date ||
                      ""
                    }
                    onChange={handleChange(
                      "date"
                    )}
                    disabled={loading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Date
                    </Typography>

                    <Typography
                      variant="body1"
                    >
                      {
                        displayValues.date
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Customer
              =========================================*/}

              <Grid
                item
                xs={12}
                sm={6}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Customer"
                    value={
                      formData.customerName ||
                      formData.customer ||
                      ""
                    }
                    onChange={handleChange(
                      "customerName"
                    )}
                    disabled={loading}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Customer
                    </Typography>

                    <Typography
                      variant="body1"
                    >
                      {
                        displayValues.customer
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Product
              =========================================*/}

              <Grid
                item
                xs={12}
                sm={6}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Product"
                    value={
                      formData.productName ||
                      formData.product ||
                      ""
                    }
                    onChange={handleChange(
                      "productName"
                    )}
                    disabled={loading}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Product
                    </Typography>

                    <Typography
                      variant="body1"
                    >
                      {
                        displayValues.product
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Marketplace
              =========================================*/}

              <Grid
                item
                xs={12}
                sm={6}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Marketplace"
                    value={
                      formData.marketplace ||
                      ""
                    }
                    onChange={handleChange(
                      "marketplace"
                    )}
                    disabled={loading}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Marketplace
                    </Typography>

                    <Typography
                      variant="body1"
                    >
                      {
                        displayValues.marketplace
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Category
              =========================================*/}

              <Grid
                item
                xs={12}
                sm={6}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Category"
                    value={
                      formData.category ||
                      ""
                    }
                    onChange={handleChange(
                      "category"
                    )}
                    disabled={loading}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Category
                    </Typography>

                    <Typography
                      variant="body1"
                    >
                      {
                        displayValues.category
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Sales Information
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Sales Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              {/*========================================
                  Quantity
              =========================================*/}

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
                    label="Quantity"
                    type="number"
                    value={
                      formData.quantity ??
                      ""
                    }
                    onChange={handleChange(
                      "quantity"
                    )}
                    disabled={loading}
                    inputProps={{
                      min: 0,
                    }}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Quantity
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {
                        displayValues.quantity
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Sales Amount
              =========================================*/}

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
                    label="Sales Amount"
                    type="number"
                    value={
                      formData.salesAmount ??
                      ""
                    }
                    onChange={handleChange(
                      "salesAmount"
                    )}
                    disabled={loading}
                    inputProps={{
                      min: 0,
                      step: "0.01",
                    }}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Sales Amount
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {
                        displayValues.salesAmount
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Tax
              =========================================*/}

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
                    label="Tax Amount"
                    type="number"
                    value={
                      formData.taxAmount ??
                      ""
                    }
                    onChange={handleChange(
                      "taxAmount"
                    )}
                    disabled={loading}
                    inputProps={{
                      min: 0,
                      step: "0.01",
                    }}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Tax Amount
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {
                        displayValues.taxAmount
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Total
              =========================================*/}

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
                    label="Total Amount"
                    type="number"
                    value={
                      formData.totalAmount ??
                      ""
                    }
                    onChange={handleChange(
                      "totalAmount"
                    )}
                    disabled={loading}
                    inputProps={{
                      min: 0,
                      step: "0.01",
                    }}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Total Amount
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {
                        displayValues.totalAmount
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>

              {/*========================================
                  Status
              =========================================*/}

              <Grid
                item
                xs={12}
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
                    disabled={loading}
                  />
                ) : (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Status
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                    >
                      {
                        displayValues.status
                      }
                    </Typography>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </DialogContent>

      {/*==============================================
          Dialog Actions
      ==============================================*/}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          width="100%"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1}
          >
            {isViewMode &&
              onDelete && (
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={
                    <DeleteOutline />
                  }
                  onClick={
                    handleDelete
                  }
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
          </Stack>

          <Stack
            direction="row"
            spacing={1}
          >
            <Button
              variant="outlined"
              startIcon={<Close />}
              onClick={
                handleClose
              }
              disabled={loading}
            >
              Close
            </Button>

            {isViewMode &&
              onEdit && (
                <Button
                  variant="contained"
                  startIcon={
                    <EditOutlined />
                  }
                  onClick={
                    handleEdit
                  }
                  disabled={loading}
                >
                  Edit
                </Button>
              )}

            {isEditMode &&
              onSave && (
                <Button
                  variant="contained"
                  startIcon={
                    <Save />
                  }
                  onClick={
                    handleSave
                  }
                  disabled={loading}
                >
                  Save
                </Button>
              )}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
//======================================================
// PropTypes
//======================================================

SalesReportModal.propTypes = {
  open:
    PropTypes.bool,

  report:
    PropTypes.object,

  mode:
    PropTypes.oneOf([
      "view",
      "edit",
      "approve",
    ]),

  loading:
    PropTypes.bool,

  onClose:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,

  onSave:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

SalesReportModal.defaultProps = {
  open: false,
  report: null,
  mode: "view",
  loading: false,
  onClose: null,
  onEdit: null,
  onDelete: null,
  onSave: null,
};
}
//======================================================
// Export
//======================================================

export default SalesReportModal;
