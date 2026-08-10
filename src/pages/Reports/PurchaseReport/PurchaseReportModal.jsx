import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Close,
  Edit,
  ReceiptLong,
  Visibility,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
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
  getStatusColor,
  normalizePurchaseReport,
  toNumber,
} from "./PurchaseReportHelpers";

//======================================================
// PurchaseReportModal
//======================================================

const PurchaseReportModal = ({
  open = false,
  report = null,
  mode = "view",
  loading = false,
  onClose,
  onSave,
  onEdit,
}) => {
  //====================================================
  // Normalize Report
  //====================================================

  const normalizedReport = useMemo(
    () =>
      normalizePurchaseReport(
        report || {}
      ),
    [report]
  );

  //====================================================
  // Local Form State
  //====================================================

  const [formData, setFormData] =
    useState({
      purchaseOrderNumber: "",
      date: "",
      supplierName: "",
      marketplace: "",
      productName: "",
      quantity: "",
      unitCost: "",
      tax: "",
      discount: "",
      totalAmount: "",
      status: "",
      notes: "",
    });

  //====================================================
  // Sync Report
  //====================================================

  useEffect(() => {
    setFormData({
      purchaseOrderNumber:
        normalizedReport.purchaseOrderNumber ||
        normalizedReport.orderNumber ||
        "",

      date:
        normalizedReport.date || "",

      supplierName:
        normalizedReport.supplierName ||
        normalizedReport.supplier ||
        "",

      marketplace:
        normalizedReport.marketplace || "",

      productName:
        normalizedReport.productName ||
        normalizedReport.product ||
        "",

      quantity:
        normalizedReport.quantity ?? "",

      unitCost:
        normalizedReport.unitCost ?? "",

      tax:
        normalizedReport.tax ?? "",

      discount:
        normalizedReport.discount ?? "",

      totalAmount:
        normalizedReport.totalAmount ??
        normalizedReport.purchaseAmount ??
        "",

      status:
        normalizedReport.status ||
        "Completed",

      notes:
        normalizedReport.notes || "",
    });
  }, [normalizedReport]);

  //====================================================
  // Editable Mode
  //====================================================

  const isEditable =
    mode === "edit";

  //====================================================
  // Change Handler
  //====================================================

  const handleChange =
    (field) => (event) => {
      setFormData(
        (previous) => ({
          ...previous,
          [field]:
            event.target.value,
        })
      );
    };

  //====================================================
  // Numeric Values
  //====================================================

  const quantity = toNumber(
    formData.quantity
  );

  const unitCost = toNumber(
    formData.unitCost
  );

  const tax = toNumber(
    formData.tax
  );

  const discount = toNumber(
    formData.discount
  );

  const calculatedAmount =
    quantity * unitCost;

  const calculatedTotal =
    calculatedAmount +
    tax -
    discount;

  //====================================================
  // Save Handler
  //====================================================

  const handleSave = () => {
    if (loading) {
      return;
    }

    const payload = {
      ...formData,
      quantity: toNumber(
        formData.quantity
      ),
      unitCost: toNumber(
        formData.unitCost
      ),
      tax: toNumber(
        formData.tax
      ),
      discount: toNumber(
        formData.discount
      ),
      totalAmount: toNumber(
        formData.totalAmount
      ),
    };

    onSave?.(
      payload,
      report
    );
  };

  //====================================================
  // Edit Handler
  //====================================================

  const handleEdit = () => {
    if (loading) {
      return;
    }

    onEdit?.(report);
  };

  //====================================================
  // Modal Title
  //====================================================

  const modalTitle =
    isEditable
      ? "Edit Purchase Report"
      : "Purchase Report Details";

  //====================================================
  // Status
  //====================================================

  const status =
    formData.status ||
    "Completed";

  //====================================================
  // Render
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="md"
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
            {isEditable ? (
              <Edit fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}

            <Typography
              variant="h6"
              fontWeight={700}
            >
              {modalTitle}
            </Typography>
          </Stack>

          <IconButton
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
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
              Basic Information
          ============================================*/}

          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                mb: 2,
              }}
            >
              <ReceiptLong fontSize="small" />

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Purchase Information
              </Typography>
            </Stack>

            <Grid
              container
              spacing={2}
            >
              {/* Purchase Order */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Purchase Order Number"
                  value={
                    formData.purchaseOrderNumber
                  }
                  onChange={handleChange(
                    "purchaseOrderNumber"
                  )}
                  disabled={!isEditable || loading}
                />
              </Grid>

              {/* Date */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Date"
                  value={formData.date}
                  onChange={handleChange(
                    "date"
                  )}
                  disabled={!isEditable || loading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Supplier */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Supplier"
                  value={
                    formData.supplierName
                  }
                  onChange={handleChange(
                    "supplierName"
                  )}
                  disabled={!isEditable || loading}
                />
              </Grid>

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
                  onChange={handleChange(
                    "marketplace"
                  )}
                  disabled={!isEditable || loading}
                />
              </Grid>

              {/* Product */}

              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Product"
                  value={
                    formData.productName
                  }
                  onChange={handleChange(
                    "productName"
                  )}
                  disabled={!isEditable || loading}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Amount Information
          ============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                mb: 2,
              }}
            >
              Amount Information
            </Typography>

            <Grid
              container
              spacing={2}
            >
              {/* Quantity */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Quantity"
                  value={formData.quantity}
                  onChange={handleChange(
                    "quantity"
                  )}
                  disabled={!isEditable || loading}
                  inputProps={{
                    min: 0,
                  }}
                />
              </Grid>

              {/* Unit Cost */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Unit Cost"
                  value={formData.unitCost}
                  onChange={handleChange(
                    "unitCost"
                  )}
                  disabled={!isEditable || loading}
                  inputProps={{
                    min: 0,
                    step: "0.01",
                  }}
                />
              </Grid>

              {/* Tax */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Tax"
                  value={formData.tax}
                  onChange={handleChange(
                    "tax"
                  )}
                  disabled={!isEditable || loading}
                  inputProps={{
                    min: 0,
                    step: "0.01",
                  }}
                />
              </Grid>

              {/* Discount */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Discount"
                  value={
                    formData.discount
                  }
                  onChange={handleChange(
                    "discount"
                  )}
                  disabled={!isEditable || loading}
                  inputProps={{
                    min: 0,
                    step: "0.01",
                  }}
                />
              </Grid>

              {/* Total */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Total Amount"
                  value={
                    formData.totalAmount
                  }
                  onChange={handleChange(
                    "totalAmount"
                  )}
                  disabled={!isEditable || loading}
                  inputProps={{
                    min: 0,
                    step: "0.01",
                  }}
                />
              </Grid>

              {/* Status */}

              <Grid
                item
                xs={12}
                sm={4}
              >
                {isEditable ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Status"
                    value={status}
                    onChange={handleChange(
                      "status"
                    )}
                    disabled={loading}
                  />
                ) : (
                  <Stack
                    spacing={0.5}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Status
                    </Typography>

                    <Box>
                      <Chip
                        size="small"
                        label={status}
                        color={getStatusColor(
                          status
                        )}
                        variant="outlined"
                      />
                    </Box>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Box>

          {/*============================================
              Calculated Summary
          ============================================*/}

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                "action.hover",
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
                  Calculated Amount
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={700}
                >
                  {formatCurrency(
                    calculatedAmount
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Tax
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={700}
                >
                  {formatCurrency(
                    tax
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Discount
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={700}
                >
                  {formatCurrency(
                    discount
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Calculated Total
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {formatCurrency(
                    calculatedTotal
                  )}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/*============================================
              Notes
          ============================================*/}

          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            label="Notes"
            value={formData.notes}
            onChange={handleChange(
              "notes"
            )}
            disabled={!isEditable || loading}
            placeholder="Add purchase notes..."
          />
        </Stack>
      </DialogContent>

      {/*==============================================
          Dialog Actions
      ==============================================*/}

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
        >
          Close
        </Button>

        {!isEditable && (
          <Button
            onClick={handleEdit}
            disabled={
              loading || !report
            }
            variant="contained"
            startIcon={<Edit />}
          >
            Edit
          </Button>
        )}

        {isEditable && (
          <Button
            onClick={handleSave}
            disabled={
              loading || !report
            }
            variant="contained"
            startIcon={<Edit />}
          >
            Save Changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportModal.propTypes = {
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

PurchaseReportModal.defaultProps = {
  open: false,

  report: null,

  mode: "view",

  loading: false,

  onClose: () => {},

  onSave: () => {},

  onEdit: () => {},
};

//======================================================
// Export
//======================================================

export default PurchaseReportModal;


