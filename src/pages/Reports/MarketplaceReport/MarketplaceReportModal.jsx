import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Close,
  Save,
  Storefront,
} from "@mui/icons-material";

import {
  createMarketplaceReport,
  updateMarketplaceReport,
} from "./MarketplaceReportService";

//======================================================
// MarketplaceReportModal
//======================================================

const MarketplaceReportModal = ({
  open = false,
  mode = "view",
  report = null,
  onClose,
  onSaved,
}) => {

  //====================================================
  // Initial Form
  //====================================================

  const initialForm = useMemo(
    () => ({
      marketplace:
        report?.marketplace ??
        report?.marketplaceName ??
        "",

      orderNumber:
        report?.orderNumber ??
        report?.orderNo ??
        report?.orderId ??
        "",

      productName:
        report?.productName ??
        report?.itemName ??
        report?.product ??
        "",

      sku:
        report?.sku ??
        report?.productCode ??
        report?.itemCode ??
        "",

      quantity:
        report?.quantity ??
        report?.qty ??
        0,

      salesAmount:
        report?.salesAmount ??
        report?.totalAmount ??
        report?.orderAmount ??
        report?.amount ??
        0,

      status:
        report?.status ??
        report?.orderStatus ??
        "Pending",

      shipmentStatus:
        report?.shipmentStatus ??
        report?.shippingStatus ??
        report?.deliveryStatus ??
        "Pending",

      category:
        report?.category ??
        report?.categoryName ??
        "",

      reportDate:
        report?.reportDate ??
        report?.date ??
        report?.orderDate ??
        "",
    }),
    [report]
  );

  //====================================================
  // Form State
  //====================================================

  const [formData, setFormData] =
    useState(initialForm);

  //====================================================
  // Loading State
  //====================================================

  const [loading, setLoading] =
    useState(false);

  //====================================================
  // Error State
  //====================================================

  const [error, setError] =
    useState("");

  //====================================================
  // Success State
  //====================================================

  const [success, setSuccess] =
    useState("");

  //====================================================
  // Is View Mode
  //====================================================

  const isViewMode =
    mode === "view";

  //====================================================
  // Is Edit Mode
  //====================================================

  const isEditMode =
    mode === "edit";

  //====================================================
  // Is Create Mode
  //====================================================

  const isCreateMode =
    mode === "create" ||
    mode === "add";

  //====================================================
  // Modal Title
  //====================================================

  const modalTitle =
    isCreateMode
      ? "Add Marketplace Report"
      : isEditMode
        ? "Edit Marketplace Report"
        : "Marketplace Report Details";

  //====================================================
  // Sync Form When Modal Opens
  //====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData(
      initialForm
    );

    setError("");
    setSuccess("");
    setLoading(false);
  }, [
    open,
    initialForm,
  ]);

  //====================================================
  // Handle Field Change
  //====================================================

  const handleChange =
    useCallback(
      (field) => (event) => {
        const value =
          event?.target?.value ??
          "";

        setFormData(
          (previous) => ({
            ...previous,
            [field]: value,
          })
        );
      },
      []
    );

  //====================================================
  // Handle Close
  //====================================================

  const handleClose =
    useCallback(() => {
      if (loading) {
        return;
      }

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
  // Validate Form
  //====================================================

  const validateForm =
    useCallback(() => {
      if (
        !formData.marketplace
          .toString()
          .trim()
      ) {
        return "Marketplace is required.";
      }

      if (
        !formData.orderNumber
          .toString()
          .trim()
      ) {
        return "Order number is required.";
      }

      if (
        !formData.productName
          .toString()
          .trim()
      ) {
        return "Product name is required.";
      }

      const quantity =
        Number(
          formData.quantity
        );

      if (
        !Number.isFinite(
          quantity
        ) ||
        quantity < 0
      ) {
        return "Quantity must be a valid non-negative number.";
      }

      const salesAmount =
        Number(
          formData.salesAmount
        );

      if (
        !Number.isFinite(
          salesAmount
        ) ||
        salesAmount < 0
      ) {
        return "Sales amount must be a valid non-negative number.";
      }

      return "";
    }, [
      formData,
    ]);

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Save Handler
  //====================================================

  const handleSave =
    useCallback(async () => {
      const validationError =
        validateForm();

      if (validationError) {
        setError(
          validationError
        );
        return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const payload = {
          ...formData,

          quantity:
            Number(
              formData.quantity
            ) || 0,

          salesAmount:
            Number(
              formData.salesAmount
            ) || 0,
        };

        let response;

        if (isEditMode) {
          const reportId =
            report?.id ??
            report?.reportId ??
            report?.orderId;

          response =
            await updateMarketplaceReport(
              reportId,
              payload
            );
        } else {
          response =
            await createMarketplaceReport(
              payload
            );
        }

        setSuccess(
          response?.message ??
            "Marketplace report saved successfully."
        );

        if (
          typeof onSaved ===
          "function"
        ) {
          await onSaved(
            response,
            payload
          );
        }
      } catch (saveError) {
        console.error(
          "MarketplaceReportModal save error:",
          saveError
        );

        setError(
          saveError?.response
            ?.data?.message ??
            saveError?.message ??
            "Unable to save marketplace report."
        );
      } finally {
        setLoading(false);
      }
    }, [
      validateForm,
      formData,
      isEditMode,
      report,
      onSaved,
    ]);

  //====================================================
  // Format Currency
  //====================================================

  const formattedAmount =
    useMemo(() => {
      const amount =
        Number(
          formData.salesAmount
        ) || 0;

      return amount.toLocaleString(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }
      );
    }, [
      formData.salesAmount,
    ]);

  //====================================================
  // Read Only Property
  //====================================================

  const fieldReadOnly =
    isViewMode || loading;

  //====================================================
  // Part 1B Ends Here
  //====================================================
    //====================================================
  // JSX
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      className="marketplace-report-modal"
    >
      {/*================================================
          Dialog Title
      =================================================*/}

      <DialogTitle
        sx={{
          pr: 6,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Storefront
            color="primary"
          />

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {modalTitle}
            </Typography>

            {report && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Order:{" "}
                {formData.orderNumber ||
                  "—"}
              </Typography>
            )}
          </Box>
        </Stack>

        <IconButton
          onClick={handleClose}
          disabled={loading}
          aria-label="Close marketplace report dialog"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/*================================================
          Dialog Content
      =================================================*/}

      <DialogContent
        sx={{
          pt: 3,
        }}
      >
        <Stack spacing={2.5}>
          {/*==============================================
              Alerts
          ==============================================*/}

          {error && (
            <Alert
              severity="error"
              onClose={() =>
                setError("")
              }
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
            >
              {success}
            </Alert>
          )}

          {/*==============================================
              Marketplace Information
          ==============================================*/}

          <Typography
            variant="subtitle1"
            fontWeight={700}
          >
            Marketplace Information
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {/* Marketplace */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                label="Marketplace"
                value={
                  formData.marketplace
                }
                onChange={
                  handleChange(
                    "marketplace"
                  )
                }
                disabled={
                  fieldReadOnly
                }
              />
            </Grid>

            {/* Order Number */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                label="Order Number"
                value={
                  formData.orderNumber
                }
                onChange={
                  handleChange(
                    "orderNumber"
                  )
                }
                disabled={
                  fieldReadOnly
                }
              />
            </Grid>

            {/* Report Date */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Report Date"
                value={
                  formData.reportDate
                }
                onChange={
                  handleChange(
                    "reportDate"
                  )
                }
                disabled={
                  fieldReadOnly
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Category */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                label="Category"
                value={
                  formData.category
                }
                onChange={
                  handleChange(
                    "category"
                  )
                }
                disabled={
                  fieldReadOnly
                }
              />
            </Grid>
          </Grid>

          <Divider />

          {/*==============================================
              Product Information
          ==============================================*/}

          <Typography
            variant="subtitle1"
            fontWeight={700}
          >
            Product Information
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {/* Product */}

            <Grid
              item
              xs={12}
              md={8}
            >
              <TextField
                fullWidth
                size="small"
                label="Product Name"
                value={
                  formData.productName
                }
                onChange={
                  handleChange(
                    "productName"
                  )
                }
                disabled={
                  fieldReadOnly
                }
              />
            </Grid>

            {/* SKU */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                size="small"
                label="SKU"
                value={
                  formData.sku
                }
                onChange={
                  handleChange(
                    "sku"
                  )
                }
                disabled={
                  fieldReadOnly
                }
              />
            </Grid>

            {/* Quantity */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Quantity"
                value={
                  formData.quantity
                }
                onChange={
                  handleChange(
                    "quantity"
                  )
                }
                disabled={
                  fieldReadOnly
                }
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/* Sales Amount */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Sales Amount"
                value={
                  formData.salesAmount
                }
                onChange={
                  handleChange(
                    "salesAmount"
                  )
                }
                disabled={
                  fieldReadOnly
                }
                inputProps={{
                  min: 0,
                  step: "0.01",
                }}
              />
            </Grid>
          </Grid>

          <Divider />

          {/*==============================================
              Order Status
          ==============================================*/}

          <Typography
            variant="subtitle1"
            fontWeight={700}
          >
            Order Status
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {/* Status */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                select
                size="small"
                label="Status"
                value={
                  formData.status
                }
                onChange={
                  handleChange(
                    "status"
                  )
                }
                disabled={
                  fieldReadOnly
                }
              >
                <MenuItem value="Pending">
                  Pending
                </MenuItem>

                <MenuItem value="Processing">
                  Processing
                </MenuItem>

                <MenuItem value="Confirmed">
                  Confirmed
                </MenuItem>

                <MenuItem value="Completed">
                  Completed
                </MenuItem>

                <MenuItem value="Cancelled">
                  Cancelled
                </MenuItem>

                <MenuItem value="Rejected">
                  Rejected
                </MenuItem>
              </TextField>
            </Grid>

            {/* Shipment Status */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                select
                size="small"
                label="Shipment Status"
                value={
                  formData.shipmentStatus
                }
                onChange={
                  handleChange(
                    "shipmentStatus"
                  )
                }
                disabled={
                  fieldReadOnly
                }
              >
                <MenuItem value="Pending">
                  Pending
                </MenuItem>

                <MenuItem value="Processing">
                  Processing
                </MenuItem>

                <MenuItem value="Packed">
                  Packed
                </MenuItem>

                <MenuItem value="Shipped">
                  Shipped
                </MenuItem>

                <MenuItem value="Delivered">
                  Delivered
                </MenuItem>

                <MenuItem value="Cancelled">
                  Cancelled
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/*==============================================
              Summary
          ==============================================*/}

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              justifyContent="space-between"
            >
              <Box>
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
                  {Number(
                    formData.quantity
                  ).toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>

              <Box>
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
                  {formattedAmount}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      {/*================================================
          Dialog Actions
      =================================================*/}

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </Button>

        {!isViewMode && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update"
                : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

//======================================================
// Part 2 Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

MarketplaceReportModal.propTypes = {
  open: PropTypes.bool,

  mode: PropTypes.oneOf([
    "view",
    "edit",
    "create",
    "add",
  ]),

  report: PropTypes.object,

  onClose: PropTypes.func,

  onSaved: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

MarketplaceReportModal.defaultProps = {
  open: false,

  mode: "view",

  report: null,

  onClose: () => {},

  onSaved: () => {},
};

//======================================================
// Export
//======================================================
}
export default MarketplaceReportModal;