import React, {
  useCallback,
  useEffect,
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
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Close,
  Delete,
  Save,
} from "@mui/icons-material";

import {
  createLowStockReport,
  updateLowStockReport,
} from "./LowStockReportService";

//======================================================
// LowStockReportModal
//======================================================

const LowStockReportModal = ({
  open = false,
  mode = "view",
  report = null,
  onClose,
  onConfirmDelete,
  onSaved,
}) => {

  //====================================================
  // Form State
  //====================================================

  const [formData, setFormData] =
    useState({
      productName: "",
      productCode: "",
      category: "",
      warehouse: "",
      currentStock: "",
      minimumStock: "",
      reorderQuantity: "",
      unit: "Units",
      supplierName: "",
      notes: "",
    });

  //====================================================
  // Loading State
  //====================================================

  const [saving, setSaving] =
    useState(false);

  //====================================================
  // Error State
  //====================================================

  const [error, setError] =
    useState("");

  //====================================================
  // Initialize Form
  //====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    if (report) {
      setFormData({
        productName:
          report?.productName ??
          report?.itemName ??
          report?.name ??
          "",

        productCode:
          report?.productCode ??
          report?.itemCode ??
          report?.sku ??
          "",

        category:
          report?.categoryName ??
          report?.category ??
          "",

        warehouse:
          report?.warehouseName ??
          report?.warehouse ??
          "",

        currentStock:
          report?.currentStock ??
          report?.stockQuantity ??
          report?.quantity ??
          "",

        minimumStock:
          report?.minimumStock ??
          report?.minStock ??
          report?.reorderLevel ??
          "",

        reorderQuantity:
          report?.reorderQuantity ??
          report?.reorderQty ??
          "",

        unit:
          report?.unit ??
          report?.uom ??
          "Units",

        supplierName:
          report?.supplierName ??
          report?.supplier ??
          "",

        notes:
          report?.notes ??
          report?.remarks ??
          "",
      });

      return;
    }

    setFormData({
      productName: "",
      productCode: "",
      category: "",
      warehouse: "",
      currentStock: "",
      minimumStock: "",
      reorderQuantity: "",
      unit: "Units",
      supplierName: "",
      notes: "",
    });
  }, [
    open,
    report,
  ]);

  //====================================================
  // Handle Field Change
  //====================================================

  const handleChange =
    useCallback(
      (event) => {
        const {
          name,
          value,
        } = event.target;

        setFormData(
          (previous) => ({
            ...previous,
            [name]: value,
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
      if (saving) {
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
      saving,
      onClose,
    ]);

  //====================================================
  // Validate Form
  //====================================================

  const validateForm =
    useCallback(() => {

      if (
        !formData.productName
          .trim()
      ) {
        return "Product name is required.";
      }

      if (
        formData.currentStock ===
        ""
      ) {
        return "Current stock is required.";
      }

      if (
        formData.minimumStock ===
        ""
      ) {
        return "Minimum stock is required.";
      }

      const currentStock =
        Number(
          formData.currentStock
        );

      const minimumStock =
        Number(
          formData.minimumStock
        );

      if (
        !Number.isFinite(
          currentStock
        ) ||
        currentStock < 0
      ) {
        return "Current stock must be a valid non-negative number.";
      }

      if (
        !Number.isFinite(
          minimumStock
        ) ||
        minimumStock < 0
      ) {
        return "Minimum stock must be a valid non-negative number.";
      }

      if (
        formData.reorderQuantity !==
        ""
      ) {
        const reorderQuantity =
          Number(
            formData.reorderQuantity
          );

        if (
          !Number.isFinite(
            reorderQuantity
          ) ||
          reorderQuantity < 0
        ) {
          return "Reorder quantity must be a valid non-negative number.";
        }
      }

      return "";
    }, [
      formData,
    ]);

  //====================================================
  // Part 1A Ends Here
  //====================================================
    //====================================================
  // Save Report
  //====================================================

  const handleSave = useCallback(
    async () => {
      const validationError =
        validateForm();

      if (validationError) {
        setError(
          validationError
        );
        return;
      }

      setSaving(true);
      setError("");

      try {
        const payload = {
          ...formData,

          currentStock:
            Number(
              formData.currentStock
            ),

          minimumStock:
            Number(
              formData.minimumStock
            ),

          reorderQuantity:
            formData.reorderQuantity ===
            ""
              ? 0
              : Number(
                  formData.reorderQuantity
                ),
        };

        const reportId =
          report?.id ??
          report?.reportId ??
          report?.inventoryId;

        if (
          mode === "edit" &&
          reportId !==
            undefined &&
          reportId !== null &&
          reportId !== ""
        ) {
          await updateLowStockReport(
            reportId,
            payload
          );
        } else {
          await createLowStockReport(
            payload
          );
        }

        if (
          typeof onSaved ===
          "function"
        ) {
          await onSaved(
            payload
          );
        } else if (
          typeof onClose ===
          "function"
        ) {
          onClose();
        }
      } catch (err) {
        console.error(
          "Failed to save low stock report:",
          err
        );

        setError(
          err?.response?.data?.message ??
          err?.message ??
          "Failed to save low stock report."
        );
      } finally {
        setSaving(false);
      }
    },
    [
      formData,
      mode,
      report,
      validateForm,
      onSaved,
      onClose,
    ]
  );

  //====================================================
  // Delete
  //====================================================

  const handleDelete =
    useCallback(() => {
      if (
        typeof onConfirmDelete ===
        "function"
      ) {
        onConfirmDelete(
          report
        );
      }
    }, [
      onConfirmDelete,
      report,
    ]);

  //====================================================
  // Dialog Title
  //====================================================

  const dialogTitle =
    mode === "view"
      ? "Low Stock Report Details"
      : mode === "edit"
      ? "Edit Low Stock Report"
      : mode === "delete"
      ? "Delete Low Stock Report"
      : "Low Stock Report";

  //====================================================
  // View Mode
  //====================================================

  const isViewMode =
    mode === "view";

  //====================================================
  // Delete Mode
  //====================================================

  const isDeleteMode =
    mode === "delete";

  //====================================================
  // Edit Mode
  //====================================================

  const isEditMode =
    mode === "edit";

  //====================================================
  // JSX
  //====================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      {/*================================================
          Dialog Title
      =================================================*/}

      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            {dialogTitle}
          </Typography>

          <Button
            onClick={handleClose}
            color="inherit"
            size="small"
            disabled={saving}
            startIcon={<Close />}
          >
            Close
          </Button>
        </Stack>
      </DialogTitle>

      <Divider />

      {/*================================================
          Dialog Content
      =================================================*/}

      <DialogContent>
        {/*==============================================
            Error
        ==============================================*/}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
            }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        {/*==============================================
            Delete Confirmation
        ==============================================*/}

        {isDeleteMode ? (
          <Box
            sx={{
              py: 3,
              textAlign: "center",
            }}
          >
            <Delete
              color="error"
              sx={{
                fontSize: 52,
                mb: 1,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
            >
              Delete this report?
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              You are about to delete the
              low stock report for{" "}
              <strong>
                {formData.productName ||
                  "this product"}
              </strong>
              . This action cannot be
              undone.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={2}
            sx={{
              pt: 1,
            }}
          >
            {/*==========================================
                Product Name
            ==========================================*/}

            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={
                  formData.productName
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
                required
              />
            </Grid>

            {/*==========================================
                Product Code
            ==========================================*/}

            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                label="Product Code / SKU"
                name="productCode"
                value={
                  formData.productCode
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
              />
            </Grid>

            {/*==========================================
                Category
            ==========================================*/}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={
                  formData.category
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
              />
            </Grid>

            {/*==========================================
                Warehouse
            ==========================================*/}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Warehouse"
                name="warehouse"
                value={
                  formData.warehouse
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
              />
            </Grid>

            {/*==========================================
                Supplier
            ==========================================*/}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                label="Supplier"
                name="supplierName"
                value={
                  formData.supplierName
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
              />
            </Grid>

            {/*==========================================
                Current Stock
            ==========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <TextField
                fullWidth
                type="number"
                label="Current Stock"
                name="currentStock"
                value={
                  formData.currentStock
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
                required
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/*==========================================
                Minimum Stock
            ==========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <TextField
                fullWidth
                type="number"
                label="Minimum Stock"
                name="minimumStock"
                value={
                  formData.minimumStock
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
                required
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/*==========================================
                Reorder Quantity
            ==========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <TextField
                fullWidth
                type="number"
                label="Reorder Quantity"
                name="reorderQuantity"
                value={
                  formData.reorderQuantity
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            {/*==========================================
                Unit
            ==========================================*/}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <TextField
                fullWidth
                label="Unit"
                name="unit"
                value={
                  formData.unit
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
              />
            </Grid>

            {/*==========================================
                Notes
            ==========================================*/}

            <Grid
              item
              xs={12}
            >
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Notes"
                name="notes"
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
                disabled={
                  isViewMode ||
                  saving
                }
              />
            </Grid>
          </Grid>
        )}
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
          disabled={saving}
          color="inherit"
        >
          Cancel
        </Button>

        {isDeleteMode ? (
          <Button
            variant="contained"
            color="error"
            startIcon={
              saving ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <Delete />
              )
            }
            onClick={
              handleDelete
            }
            disabled={saving}
          >
            Delete
          </Button>
        ) : isEditMode ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={
              saving ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <Save />
              )
            }
            onClick={
              handleSave
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );

  //====================================================
  // Part 1B Ends Here
  //====================================================
  //======================================================
// PropTypes
//======================================================

LowStockReportModal.propTypes = {
  open: PropTypes.bool,

  mode: PropTypes.oneOf([
    "view",
    "edit",
    "delete",
    "create",
  ]),

  report: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reportId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    inventoryId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    productName: PropTypes.string,

    itemName: PropTypes.string,

    name: PropTypes.string,

    productCode: PropTypes.string,

    itemCode: PropTypes.string,

    sku: PropTypes.string,

    categoryName: PropTypes.string,

    category: PropTypes.string,

    warehouseName: PropTypes.string,

    warehouse: PropTypes.string,

    currentStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    stockQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    quantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    minimumStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    minStock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderLevel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    reorderQty: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    unit: PropTypes.string,

    uom: PropTypes.string,

    supplierName: PropTypes.string,

    supplier: PropTypes.string,

    notes: PropTypes.string,

    remarks: PropTypes.string,
  }),

  onClose: PropTypes.func,

  onConfirmDelete: PropTypes.func,

  onSaved: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

LowStockReportModal.defaultProps = {
  open: false,

  mode: "view",

  report: null,

  onClose: () => {},

  onConfirmDelete: () => {},

  onSaved: () => {},
};

//======================================================
// Export
//======================================================
}
export default LowStockReportModal;
