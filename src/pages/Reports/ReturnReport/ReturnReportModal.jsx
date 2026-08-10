import React, {useEffect,useState} from "react";
import PropTypes from "prop-types";
import {Close,DeleteOutline,EditOutlined,Save} from "@mui/icons-material";
import {Alert,Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,Divider,Grid,IconButton,Stack,TextField,Typography} from "@mui/material";
import {formatCurrency,formatDate,normalizeReturnReport} from "./ReturnReportHelpers";

//======================================================
// ReturnReportModal
//======================================================

const ReturnReportModal = ({
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

  //====================================================
  // Error State
  //====================================================

  const [error, setError] =
    useState("");

  //====================================================
  // Normalize Report
  //====================================================

  useEffect(() => {
    if (report) {
      setFormData(
        normalizeReturnReport(
          report
        )
      );
    } else {
      setFormData({});
    }

    setError("");
  }, [report, open]);

  //====================================================
  // Change Handler
  //====================================================

  const handleChange = (field) => (
    event
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        [field]:
          event.target.value,
      })
    );
  };

  //====================================================
  // Edit Handler
  //====================================================

  const handleEdit = () => {
    setError("");

    if (onEdit && report) {
      onEdit(report);
    }
  };

  //====================================================
  // Delete Handler
  //====================================================

  const handleDelete = () => {
    if (!onDelete || !report) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this return report?"
      );

    if (!confirmed) {
      return;
    }

    onDelete(report);
  };

  //====================================================
  // Save Handler
  //====================================================

  const handleSave = async () => {
    if (!onSave) {
      return;
    }

    setError("");

    try {
      await onSave(formData);
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Unable to save return report."
      );
    }
  };

  //====================================================
  // Dialog Title
  //====================================================

  const dialogTitle =
    mode === "edit"
      ? "Edit Return Report"
      : "Return Report Details";

  //====================================================
  // Safe Report
  //====================================================

  const safeReport =
    report
      ? normalizeReturnReport(
          report
        )
      : {};

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
      aria-labelledby="return-report-modal-title"
    >
      {/*==============================================
          Dialog Title
      ==============================================*/}

      <DialogTitle
        id="return-report-modal-title"
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
          onClick={onClose}
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

      {/*==============================================
          Dialog Content
      ==============================================*/}

      <DialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {mode === "edit" ? (
          <Grid
            container
            spacing={2}
            sx={{ pt: 1 }}
          >
            {/* Return Number */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                label="Return Number"
                value={
                  formData.returnNumber ||
                  ""
                }
                onChange={handleChange(
                  "returnNumber"
                )}
                disabled={loading}
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
                  formData.orderNumber ||
                  ""
                }
                onChange={handleChange(
                  "orderNumber"
                )}
                disabled={loading}
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
                value={
                  formData.date
                    ? String(
                        formData.date
                      ).slice(
                        0,
                        10
                      )
                    : ""
                }
                onChange={handleChange(
                  "date"
                )}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
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
                  formData.customerName ||
                  formData.customer ||
                  ""
                }
                onChange={handleChange(
                  "customerName"
                )}
                disabled={loading}
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
                  formData.productName ||
                  formData.product ||
                  ""
                }
                onChange={handleChange(
                  "productName"
                )}
                disabled={loading}
              />
            </Grid>

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
                value={
                  formData.quantity ??
                  ""
                }
                onChange={handleChange(
                  "quantity"
                )}
                disabled={loading}
              />
            </Grid>

            {/* Return Amount */}

            <Grid
              item
              xs={12}
              sm={4}
            >
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Return Amount"
                value={
                  formData.returnAmount ??
                  ""
                }
                onChange={handleChange(
                  "returnAmount"
                )}
                disabled={loading}
              />
            </Grid>

            {/* Refund Amount */}

            <Grid
              item
              xs={12}
              sm={4}
            >
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Refund Amount"
                value={
                  formData.refundAmount ??
                  ""
                }
                onChange={handleChange(
                  "refundAmount"
                )}
                disabled={loading}
              />
            </Grid>

            {/* Reason */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                label="Return Reason"
                value={
                  formData.reason ||
                  ""
                }
                onChange={handleChange(
                  "reason"
                )}
                disabled={loading}
              />
            </Grid>

            {/* Status */}

            <Grid
              item
              xs={12}
              sm={6}
            >
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
            </Grid>
          </Grid>
        ) : (
          /*============================================
              View Mode
          ============================================*/

          <Stack spacing={2}>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Return Number
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={600}
                >
                  {safeReport.returnNumber ||
                    safeReport.returnOrderNumber ||
                    "-"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Return Date
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={600}
                >
                  {formatDate(
                    safeReport.date
                  )}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Order Number
                </Typography>

                <Typography
                  variant="body1"
                >
                  {safeReport.orderNumber ||
                    safeReport.orderId ||
                    "-"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Customer
                </Typography>

                <Typography
                  variant="body1"
                >
                  {safeReport.customerName ||
                    safeReport.customer ||
                    "-"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Product
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={600}
                >
                  {safeReport.productName ||
                    safeReport.product ||
                    "-"}
                </Typography>
              </Grid>
            </Grid>

            <Divider />

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
                  variant="caption"
                  color="text.secondary"
                >
                  Returned Quantity
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {safeReport.quantity ??
                    0}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Return Amount
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {formatCurrency(
                    safeReport.returnAmount ??
                      safeReport.totalAmount ??
                      safeReport.amount
                  )}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Refund Amount
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {formatCurrency(
                    safeReport.refundAmount
                  )}
                </Typography>
              </Grid>
            </Grid>

            <Divider />

            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Return Reason
                </Typography>

                <Typography variant="body1">
                  {safeReport.reason ||
                    "Not specified"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
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
                  {safeReport.status ||
                    "Pending"}
                </Typography>
              </Grid>
            </Grid>

            {safeReport.marketplace && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Marketplace
                </Typography>

                <Typography variant="body1">
                  {
                    safeReport.marketplace
                  }
                </Typography>
              </Box>
            )}

            {safeReport.notes && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Notes
                </Typography>

                <Typography
                  variant="body1"
                >
                  {safeReport.notes}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>

      <Divider />

      {/*==============================================
          Dialog Actions
      ==============================================*/}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Close />}
          onClick={onClose}
          disabled={loading}
        >
          Close
        </Button>

        {mode === "view" ? (
          <>
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={
                  <DeleteOutline />
                }
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            )}

            {onEdit && (
              <Button
                variant="contained"
                startIcon={
                  <EditOutlined />
                }
                onClick={handleEdit}
                disabled={loading}
              >
                Edit
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={
              loading || !onSave
            }
          >
            {loading
              ? "Saving..."
              : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

//======================================================
// PropTypes
//======================================================

ReturnReportModal.propTypes = {
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

ReturnReportModal.defaultProps = {
  open: false,

  report: null,

  mode: "view",

  loading: false,

  onClose: () => {},

  onEdit: null,

  onDelete: null,

  onSave: null,
};

//======================================================
// Export
//======================================================

export default ReturnReportModal;

