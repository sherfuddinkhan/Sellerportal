import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import {
  Close,
  Edit,
  Save,
} from "@mui/icons-material";

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
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  createProfitLossReport,
  updateProfitLossReport,
} from "./ProfitLossReportService";

import {
  formatCurrency,
  formatDate,
  getProfitLossId,
  normalizeProfitLossReport,
} from "./ProfitLossReportHelpers";

//======================================================
// ProfitLossReportModal
//======================================================

const ProfitLossReportModal = ({
  open = false,
  mode = "view",
  report = null,
  onClose,
  onSaved,
}) => {
  //====================================================
  // Form State
  //====================================================

  const [formData, setFormData] =
    useState({
      date: "",
      orderNumber: "",
      marketplace: "",
      product: "",
      category: "",
      revenue: "",
      totalCost: "",
      grossProfit: "",
      operatingExpenses: "",
      netProfit: "",
      status: "Completed",
      notes: "",
    });

  //====================================================
  // Loading
  //====================================================

  const [loading, setLoading] =
    useState(false);

  //====================================================
  // Error
  //====================================================

  const [error, setError] =
    useState("");

  //====================================================
  // Success
  //====================================================

  const [success, setSuccess] =
    useState("");

  //====================================================
  // View Mode
  //====================================================

  const isViewMode =
    mode === "view";

  const isEditMode =
    mode === "edit";

  const isCreateMode =
    mode === "create";

  const canEdit =
    isCreateMode ||
    isEditMode;

  //====================================================
  // Dialog Title
  //====================================================

  const dialogTitle =
    useMemo(() => {
      if (isCreateMode) {
        return "Create Profit & Loss Report";
      }

      if (isEditMode) {
        return "Edit Profit & Loss Report";
      }

      return "Profit & Loss Report Details";
    }, [
      isCreateMode,
      isEditMode,
    ]);

  //====================================================
  // Initialize Form
  //====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");
    setSuccess("");

    if (report) {
      const normalized =
        normalizeProfitLossReport(
          report
        );

      setFormData({
        date:
          normalized?.date ||
          normalized?.reportDate ||
          "",
        orderNumber:
          normalized?.orderNumber ||
          normalized?.orderNo ||
          "",
        marketplace:
          normalized?.marketplace ||
          "",
        product:
          normalized?.product ||
          normalized?.productName ||
          "",
        category:
          normalized?.category ||
          "",
        revenue:
          normalized?.revenue ??
          "",
        totalCost:
          normalized?.totalCost ??
          normalized?.cost ??
          "",
        grossProfit:
          normalized?.grossProfit ??
          "",
        operatingExpenses:
          normalized?.operatingExpenses ??
          "",
        netProfit:
          normalized?.netProfit ??
          "",
        status:
          normalized?.status ||
          "Completed",
        notes:
          normalized?.notes ||
          "",
      });

      return;
    }

    setFormData({
      date: "",
      orderNumber: "",
      marketplace: "",
      product: "",
      category: "",
      revenue: "",
      totalCost: "",
      grossProfit: "",
      operatingExpenses: "",
      netProfit: "",
      status: "Completed",
      notes: "",
    });
  }, [
    open,
    report,
  ]);

  //====================================================
  // Field Change
  //====================================================

  const handleChange =
    useCallback(
      (field) =>
        (event) => {
          const value =
            event?.target?.value ??
            "";

          setFormData(
            (previous) => ({
              ...previous,
              [field]: value,
            })
          );

          setError("");
          setSuccess("");
        },
      []
    );

  //====================================================
  // Calculate Gross Profit
  //====================================================

  const calculatedGrossProfit =
    useMemo(() => {
      const revenue =
        Number(
          formData.revenue
        ) || 0;

      const totalCost =
        Number(
          formData.totalCost
        ) || 0;

      return (
        revenue -
        totalCost
      );
    }, [
      formData.revenue,
      formData.totalCost,
    ]);

  //====================================================
  // Calculate Net Profit
  //====================================================

  const calculatedNetProfit =
    useMemo(() => {
      const grossProfit =
        Number(
          formData.grossProfit
        ) ||
        calculatedGrossProfit;

      const operatingExpenses =
        Number(
          formData.operatingExpenses
        ) || 0;

      return (
        grossProfit -
        operatingExpenses
      );
    }, [
      formData.grossProfit,
      formData.operatingExpenses,
      calculatedGrossProfit,
    ]);

  //====================================================
  // Report ID
  //====================================================

  const reportId =
    getProfitLossId(
      report
    );

  ```jsx id="v8j4qp"
  //====================================================
  // Submit
  //====================================================

  const handleSubmit =
    useCallback(
      async (event) => {
        event?.preventDefault();

        if (!canEdit || loading) {
          return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
          const revenue =
            Number(
              formData.revenue
            ) || 0;

          const totalCost =
            Number(
              formData.totalCost
            ) || 0;

          const grossProfit =
            formData.grossProfit !== ""
              ? Number(
                  formData.grossProfit
                ) || 0
              : revenue -
                totalCost;

          const operatingExpenses =
            Number(
              formData.operatingExpenses
            ) || 0;

          const netProfit =
            formData.netProfit !== ""
              ? Number(
                  formData.netProfit
                ) || 0
              : grossProfit -
                operatingExpenses;

          const payload = {
            date:
              formData.date || null,

            orderNumber:
              formData.orderNumber.trim(),

            marketplace:
              formData.marketplace.trim(),

            product:
              formData.product.trim(),

            category:
              formData.category.trim(),

            revenue,

            totalCost,

            grossProfit,

            operatingExpenses,

            netProfit,

            status:
              formData.status,

            notes:
              formData.notes.trim(),
          };

          if (isEditMode) {
            if (!reportId) {
              throw new Error(
                "Profit and loss report ID is missing."
              );
            }

            await updateProfitLossReport(
              reportId,
              payload
            );

            setSuccess(
              "Profit and loss report updated successfully."
            );
          } else {
            await createProfitLossReport(
              payload
            );

            setSuccess(
              "Profit and loss report created successfully."
            );
          }

          if (onSaved) {
            await onSaved();
          }
        } catch (submitError) {
          console.error(
            "ProfitLossReportModal submit error:",
            submitError
          );

          setError(
            submitError?.message ||
              "Unable to save the profit and loss report."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        canEdit,
        loading,
        formData,
        isEditMode,
        reportId,
        onSaved,
      ]
    );

  //====================================================
  // Render Field Helper
  //====================================================

  const renderTextField = (
    field,
    label,
    options = {}
  ) => {
    const {
      type = "text",
      multiline = false,
      minRows,
      required = false,
      placeholder,
    } = options;

    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        type={type}
        value={
          formData[field] ?? ""
        }
        onChange={handleChange(
          field
        )}
        disabled={!canEdit || loading}
        required={required}
        multiline={multiline}
        minRows={minRows}
        placeholder={placeholder}
        InputLabelProps={
          type === "date"
            ? {
                shrink: true,
              }
            : undefined
        }
      />
    );
  };

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
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          {dialogTitle}
        </Typography>

        <IconButton
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={2}>
          {/*==========================================
              Messages
          ==========================================*/}

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
              onClose={() =>
                setSuccess("")
              }
            >
              {success}
            </Alert>
          )}

          {/*==========================================
              Basic Details
          ==========================================*/}

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              {renderTextField(
                "date",
                "Date",
                {
                  type: "date",
                  required: true,
                }
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              {renderTextField(
                "orderNumber",
                "Order Number",
                {
                  required: true,
                }
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              {renderTextField(
                "marketplace",
                "Marketplace",
                {
                  required: true,
                }
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              {renderTextField(
                "category",
                "Category"
              )}
            </Grid>

            <Grid
              item
              xs={12}
            >
              {renderTextField(
                "product",
                "Product",
                {
                  required: true,
                }
              )}
            </Grid>
          </Grid>

          {/*==========================================
              Financial Details
          ==========================================*/}

          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ pt: 1 }}
          >
            Financial Details
          </Typography>

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
              {renderTextField(
                "revenue",
                "Revenue",
                {
                  type: "number",
                  required: true,
                }
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              {renderTextField(
                "totalCost",
                "Total Cost",
                {
                  type: "number",
                  required: true,
                }
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              {renderTextField(
                "grossProfit",
                "Gross Profit"
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              {renderTextField(
                "operatingExpenses",
                "Operating Expenses",
                {
                  type: "number",
                }
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              {renderTextField(
                "netProfit",
                "Net Profit"
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <TextField
                fullWidth
                size="small"
                label="Status"
                select
                value={
                  formData.status
                }
                onChange={handleChange(
                  "status"
                )}
                disabled={
                  !canEdit ||
                  loading
                }
              >
                <MenuItem value="Completed">
                  Completed
                </MenuItem>

                <MenuItem value="Pending">
                  Pending
                </MenuItem>

                <MenuItem value="Cancelled">
                  Cancelled
                </MenuItem>

                <MenuItem value="Draft">
                  Draft
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/*==========================================
              Calculated Values
          ==========================================*/}

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                "action.hover",
            }}
          >
            <Stack
              spacing={1}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Calculated Gross Profit
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                color={
                  calculatedGrossProfit >=
                  0
                    ? "success.main"
                    : "error.main"
                }
              >
                {formatCurrency(
                  calculatedGrossProfit
                )}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Calculated Net Profit
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                color={
                  calculatedNetProfit >=
                  0
                    ? "success.main"
                    : "error.main"
                }
              >
                {formatCurrency(
                  calculatedNetProfit
                )}
              </Typography>
            </Stack>
          </Box>

          {/*==========================================
              Notes
          ==========================================*/}

          {renderTextField(
            "notes",
            "Notes",
            {
              multiline: true,
              minRows: 4,
              placeholder:
                "Enter additional notes...",
            }
          )}

          {/*==========================================
              View Information
          ==========================================*/}

          {isViewMode &&
            report && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor:
                    "action.hover",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Report ID
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {reportId || "—"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 1,
                  }}
                >
                  Report Date
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {formatDate(
                    formData.date
                  )}
                </Typography>
              </Box>
            )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Close
        </Button>

        {canEdit && (
          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : isEditMode ? (
                <Edit />
              ) : (
                <Save />
              )
            }
            onClick={handleSubmit}
            disabled={loading}
          >
            {isEditMode
              ? "Update"
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

ProfitLossReportModal.propTypes = {
  open:
    PropTypes.bool,

  mode:
    PropTypes.oneOf([
      "view",
      "create",
      "edit",
    ]),

  report:
    PropTypes.object,

  onClose:
    PropTypes.func,

  onSaved:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

ProfitLossReportModal.defaultProps = {
  open: false,

  mode: "view",

  report: null,

  onClose: () => {},

  onSaved: () => {},
};

//======================================================
// Export
//======================================================

export default ProfitLossReportModal;
