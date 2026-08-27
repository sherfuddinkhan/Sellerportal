// ======================================================
// OrderReportModal.jsx
// ======================================================

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Close,
  Save,
} from "@mui/icons-material";

import {
  Box,
  Button,
  CircularProgress,
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
  createOrderReport,
  updateOrderReport,
} from "./OrderReportService";

import {
  getOrderNumber,
  getOrderDate,
  getCustomerName,
  getChannelName,
  getOrderStatus,
  getPaymentStatus,
  getQuantity,
  getSalesAmount,
} from "./OrderReportHelpers";



// ======================================================
// Initial Form
// ======================================================

const INITIAL_FORM_DATA = {
  orderNumber: "",
  orderDate: "",
  customerName: "",
  channel: "",
  quantity: "",
  salesAmount: "",
  orderStatus: "",
  paymentStatus: "",
  fulfillmentStatus: "",
  notes: "",
};

// ======================================================
// OrderReportModal
// ======================================================

const OrderReportModal = ({
  open = false,
  mode = "view",
  order = null,
  onClose,
  onSaved,
}) => {
  // ====================================================
  // State
  // ====================================================

  const [formData, setFormData] = useState(
    INITIAL_FORM_DATA
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ====================================================
  // Mode
  // ====================================================

  const isViewMode = mode === "view";

  const isEditMode =
    mode === "edit";

  const isCreateMode =
    mode === "create" ||
    mode === "add";

  // ====================================================
  // Populate Form
  // ====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    // ----------------------------------------------
    // New Order
    // ----------------------------------------------

    if (!order) {
      setFormData({
        ...INITIAL_FORM_DATA,
      });

      return;
    }

    // ----------------------------------------------
    // Existing Order
    // ----------------------------------------------

    setFormData({
      orderNumber:
        getOrderNumber(order) || "",

      orderDate:
        getOrderDate(order) || "",

      customerName:
        getCustomerName(order) || "",

      channel:
        getChannelName(order) || "",

      quantity:
        getQuantity(order) ?? "",

      salesAmount:
        getSalesAmount(order) ?? "",

      orderStatus:
        getOrderStatus(order) || "",

      paymentStatus:
        getPaymentStatus(order) || "",

      fulfillmentStatus:
        order?.fulfillmentStatus ??
        order?.fulfilmentStatus ??
        "",

      notes:
        order?.notes ??
        order?.remarks ??
        "",
    });
  }, [open, order]);

  // ====================================================
  // Change Handler
  // ====================================================

  const handleChange = useCallback(
    (field, value) => {
      setFormData((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    []
  );

  // ====================================================
  // Close Handler
  // ====================================================

  const handleClose = useCallback(() => {
    if (loading) {
      return;
    }

    if (typeof onClose === "function") {
      onClose();
    }
  }, [loading, onClose]);

  // ====================================================
  // Save Handler
  // ====================================================

  const handleSave = useCallback(
    async () => {
      if (isViewMode) {
        return;
      }

      setError("");

      // ----------------------------------------------
      // Validate Order Number
      // ----------------------------------------------

      const orderNumber =
        formData.orderNumber
          ?.toString()
          .trim();

      if (!orderNumber) {
        setError(
          "Order number is required."
        );

        return;
      }

      // ----------------------------------------------
      // Validate Order Date
      // ----------------------------------------------

      if (!formData.orderDate) {
        setError(
          "Order date is required."
        );

        return;
      }

      // ----------------------------------------------
      // Validate Edit ID
      // ----------------------------------------------

      let orderId = null;

      if (isEditMode) {
        orderId =
          order?.id ??
          order?.orderId ??
          order?.orderID;

        if (
          orderId === undefined ||
          orderId === null ||
          orderId === ""
        ) {
          setError(
            "Order ID is required for updating."
          );

          return;
        }
      }

      // ----------------------------------------------
      // Loading
      // ----------------------------------------------

      setLoading(true);

      try {
        // --------------------------------------------
        // Payload
        // --------------------------------------------

        const payload = {
          orderNumber,

          orderDate:
            formData.orderDate,

          customerName:
            formData.customerName
              ?.toString()
              .trim() || "",

          channel:
            formData.channel
              ?.toString()
              .trim() || "",

          quantity:
            Number(formData.quantity) || 0,

          salesAmount:
            Number(formData.salesAmount) || 0,

          orderStatus:
            formData.orderStatus || "",

          paymentStatus:
            formData.paymentStatus || "",

          fulfillmentStatus:
            formData.fulfillmentStatus || "",

          notes:
            formData.notes
              ?.toString()
              .trim() || "",
        };

        // --------------------------------------------
        // API
        // --------------------------------------------

        let response;

        if (isEditMode) {
          response =
            await updateOrderReport(
              orderId,
              payload
            );
        } else {
          response =
            await createOrderReport(
              payload
            );
        }

        // --------------------------------------------
        // API Failure
        // --------------------------------------------

        if (
          response?.success === false
        ) {
          throw new Error(
            response?.message ||
              "Unable to save order report."
          );
        }

        // --------------------------------------------
        // Callback
        // --------------------------------------------

        if (
          typeof onSaved === "function"
        ) {
          await onSaved(response);
        }
      } catch (saveError) {
        console.error(
          "OrderReportModal save error:",
          saveError
        );

        const message =
          saveError?.response?.data
            ?.message ||
          saveError?.response?.data
            ?.error ||
          saveError?.message ||
          "Unable to save order report.";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      isViewMode,
      isEditMode,
      order,
      onSaved,
    ]
  );

  // ====================================================
  // Dialog Title
  // ====================================================

  const dialogTitle = isCreateMode
    ? "Add Order Report"
    : isEditMode
      ? "Edit Order Report"
      : "Order Report Details";

  // ====================================================
  // Disabled
  // ====================================================

  const fieldsDisabled =
    isViewMode || loading;

  // ====================================================
  // Render
  // ====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      {/* ==================================================
          TITLE
      ================================================== */}

      <DialogTitle
        sx={{
          pr: 6,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          {dialogTitle}
        </Typography>

        <IconButton
          aria-label="Close"
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* ==================================================
          CONTENT
      ================================================== */}

      <DialogContent
        sx={{
          pt: 3,
        }}
      >
        <Stack spacing={3}>

          {/* ==============================================
              ERROR
          ============================================== */}

          {error && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: "error.lighter",
                color: "error.main",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
              >
                {error}
              </Typography>
            </Box>
          )}

          {/* ==============================================
              ORDER INFORMATION
          ============================================== */}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                mb: 2,
              }}
            >
              Order Information
            </Typography>

            <Grid
              container
              spacing={2}
            >

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
                  disabled={
                    fieldsDisabled
                  }
                  required
                  onChange={(event) =>
                    handleChange(
                      "orderNumber",
                      event.target.value
                    )
                  }
                />
              </Grid>

              {/* Order Date */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Order Date"
                  value={
                    formData.orderDate
                  }
                  disabled={
                    fieldsDisabled
                  }
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) =>
                    handleChange(
                      "orderDate",
                      event.target.value
                    )
                  }
                />
              </Grid>

              {/* Customer */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Customer"
                  value={
                    formData.customerName
                  }
                  disabled={
                    fieldsDisabled
                  }
                  onChange={(event) =>
                    handleChange(
                      "customerName",
                      event.target.value
                    )
                  }
                />
              </Grid>

              {/* Channel */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Channel"
                  value={
                    formData.channel
                  }
                  disabled={
                    fieldsDisabled
                  }
                  onChange={(event) =>
                    handleChange(
                      "channel",
                      event.target.value
                    )
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
                  disabled={
                    fieldsDisabled
                  }
                  inputProps={{
                    min: 0,
                  }}
                  onChange={(event) =>
                    handleChange(
                      "quantity",
                      event.target.value
                    )
                  }
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
                  disabled={
                    fieldsDisabled
                  }
                  inputProps={{
                    min: 0,
                    step: "0.01",
                  }}
                  onChange={(event) =>
                    handleChange(
                      "salesAmount",
                      event.target.value
                    )
                  }
                />
              </Grid>

            </Grid>
          </Box>

          <Divider />

          {/* ==============================================
              STATUS
          ============================================== */}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                mb: 2,
              }}
            >
              Status Information
            </Typography>

            <Grid
              container
              spacing={2}
            >

              {/* Order Status */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Order Status"
                  value={
                    formData.orderStatus
                  }
                  disabled={
                    fieldsDisabled
                  }
                  onChange={(event) =>
                    handleChange(
                      "orderStatus",
                      event.target.value
                    )
                  }
                >
                  <MenuItem value="">
                    Select Status
                  </MenuItem>

                  <MenuItem value="Pending">
                    Pending
                  </MenuItem>

                  <MenuItem value="Processing">
                    Processing
                  </MenuItem>

                  <MenuItem value="Confirmed">
                    Confirmed
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

              {/* Payment Status */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Payment Status"
                  value={
                    formData.paymentStatus
                  }
                  disabled={
                    fieldsDisabled
                  }
                  onChange={(event) =>
                    handleChange(
                      "paymentStatus",
                      event.target.value
                    )
                  }
                >
                  <MenuItem value="">
                    Select Status
                  </MenuItem>

                  <MenuItem value="Pending">
                    Pending
                  </MenuItem>

                  <MenuItem value="Paid">
                    Paid
                  </MenuItem>

                  <MenuItem value="Failed">
                    Failed
                  </MenuItem>

                  <MenuItem value="Refunded">
                    Refunded
                  </MenuItem>

                  <MenuItem value="Partially Paid">
                    Partially Paid
                  </MenuItem>
                </TextField>
              </Grid>

              {/* Fulfillment Status */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Fulfillment Status"
                  value={
                    formData.fulfillmentStatus
                  }
                  disabled={
                    fieldsDisabled
                  }
                  onChange={(event) =>
                    handleChange(
                      "fulfillmentStatus",
                      event.target.value
                    )
                  }
                >
                  <MenuItem value="">
                    Select Status
                  </MenuItem>

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
          </Box>

          {/* ==============================================
              NOTES
          ============================================== */}

          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            label="Notes"
            value={
              formData.notes
            }
            disabled={
              fieldsDisabled
            }
            onChange={(event) =>
              handleChange(
                "notes",
                event.target.value
              )
            }
          />

        </Stack>
      </DialogContent>

      <Divider />

      {/* ==================================================
          ACTIONS
      ================================================== */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >

        <Button
          variant="outlined"
          startIcon={<Close />}
          onClick={handleClose}
          disabled={loading}
        >
          {isViewMode
            ? "Close"
            : "Cancel"}
        </Button>

        {!isViewMode && (
          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <Save />
              )
            }
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Order"
                : "Save Order"}
          </Button>
        )}

      </DialogActions>
    </Dialog>
  );
};

// ======================================================
// PropTypes
// ======================================================

OrderReportModal.propTypes = {
  open: PropTypes.bool,

  mode: PropTypes.oneOf([
    "view",
    "edit",
    "create",
    "add",
  ]),

  order: PropTypes.object,

  onClose: PropTypes.func,

  onSaved: PropTypes.func,
};

// ======================================================
// Default Props
// ======================================================

OrderReportModal.defaultProps = {
  open: false,

  mode: "view",

  order: null,

  onClose: () => {},

  onSaved: () => {},
};

// ======================================================
// Export
// ======================================================

export default OrderReportModal;