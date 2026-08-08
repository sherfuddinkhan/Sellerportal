import React, {
  useEffect,
  useMemo,
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
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Close,
  Delete,
} from "@mui/icons-material";

//======================================================
// InventoryReportModal
//======================================================

const InventoryReportModal = ({
  open = false,
  mode = "add",
  report = null,
  loading = false,
  error = "",
  onClose,
  onSubmit,
}) => {

  //====================================================
  // Initial Form State
  //====================================================

  const initialFormState = {
    reportName: "",
    reportType: "inventory",
    status: "active",
    description: "",
    createdBy: "",
    totalRecords: 0,
    totalStock: 0,
    totalValue: 0,
  };

  //====================================================
  // Form State
  //====================================================

  const [formData, setFormData] =
    useState(initialFormState);

  //====================================================
  // Validation State
  //====================================================

  const [formErrors, setFormErrors] =
    useState({});

  //====================================================
  // Item State
  //====================================================

  const [items, setItems] =
    useState([]);

  //====================================================
  // Edit Mode
  //====================================================

  const isEditMode =
    mode === "edit" ||
    Boolean(report);

  //====================================================
  // Dialog Title
  //====================================================

  const dialogTitle = useMemo(
    () =>
      isEditMode
        ? "Edit Inventory Report"
        : "Add Inventory Report",
    [isEditMode]
  );

  //====================================================
  // Populate Form
  //====================================================

  useEffect(() => {

    if (!open) {
      return;
    }

    if (report) {

      setFormData({
        reportName:
          report?.reportName ||
          report?.name ||
          report?.title ||
          "",

        reportType:
          report?.reportType ||
          report?.type ||
          "inventory",

        status:
          report?.status ||
          report?.reportStatus ||
          "active",

        description:
          report?.description ||
          report?.summary ||
          report?.remarks ||
          "",

        createdBy:
          report?.createdByName ||
          report?.createdBy ||
          "",

        totalRecords:
          report?.totalRecords ??
          report?.recordCount ??
          0,

        totalStock:
          report?.totalStock ??
          report?.stockQuantity ??
          report?.quantity ??
          0,

        totalValue:
          report?.totalValue ??
          report?.inventoryValue ??
          report?.stockValue ??
          0,
      });

      setItems(
        Array.isArray(
          report?.items
        )
          ? report.items
          : []
      );

    } else {

      setFormData(
        initialFormState
      );

      setItems([]);

    }

    setFormErrors({});

  }, [
    open,
    report,
  ]);

  //====================================================
  // Input Change
  //====================================================

  const handleChange = (
    event
  ) => {

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

    setFormErrors(
      (previous) => {

        if (!previous[name]) {
          return previous;
        }

        const nextErrors = {
          ...previous,
        };

        delete nextErrors[name];

        return nextErrors;
      }
    );

  };

  //====================================================
  // Add Item
  //====================================================

  const handleAddItem = () => {

    setItems(
      (previous) => [
        ...previous,
        {
          itemCode: "",
          itemName: "",
          quantity: 0,
          unitPrice: 0,
          value: 0,
        },
      ]
    );

  };

  //====================================================
  // Remove Item
  //====================================================

  const handleRemoveItem = (
    index
  ) => {

    setItems(
      (previous) =>
        previous.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    );

  };

  //====================================================
  // Item Change
  //====================================================

  const handleItemChange = (
    index,
    field,
    value
  ) => {

    setItems(
      (previous) =>
        previous.map(
          (item, itemIndex) => {

            if (
              itemIndex !== index
            ) {
              return item;
            }

            const updatedItem = {
              ...item,
              [field]: value,
            };

            const quantity =
              Number(
                updatedItem.quantity
              ) || 0;

            const unitPrice =
              Number(
                updatedItem.unitPrice
              ) || 0;

            updatedItem.value =
              quantity *
              unitPrice;

            return updatedItem;
          }
        )
    );

  };

  //====================================================
  // Validation
  //====================================================

  const validateForm = () => {

    const errors = {};

    if (
      !String(
        formData.reportName
      ).trim()
    ) {
      errors.reportName =
        "Report name is required.";
    }

    if (
      !String(
        formData.reportType
      ).trim()
    ) {
      errors.reportType =
        "Report type is required.";
    }

    if (
      formData.totalRecords !== "" &&
      Number(formData.totalRecords) < 0
    ) {
      errors.totalRecords =
        "Records cannot be negative.";
    }

    if (
      formData.totalStock !== "" &&
      Number(formData.totalStock) < 0
    ) {
      errors.totalStock =
        "Stock quantity cannot be negative.";
    }

    if (
      formData.totalValue !== "" &&
      Number(formData.totalValue) < 0
    ) {
      errors.totalValue =
        "Inventory value cannot be negative.";
    }

    setFormErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };

  //====================================================
  // Submit
  //====================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,

      totalRecords:
        Number(
          formData.totalRecords
        ) || 0,

      totalStock:
        Number(
          formData.totalStock
        ) || 0,

      totalValue:
        Number(
          formData.totalValue
        ) || 0,

      items,
    };

    if (
      typeof onSubmit ===
      "function"
    ) {
      await onSubmit(
        payload,
        report
      );
    }

  };

  //====================================================
  // Close
  //====================================================

  const handleClose = () => {

    if (loading) {
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
  // Part 1A Ends Here
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
      fullScreen={false}
    >

      {/*================================================
          Dialog Title
      =================================================*/}

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >

        <Typography
          variant="h6"
          fontWeight={600}
        >
          {dialogTitle}
        </Typography>

        <IconButton
          onClick={handleClose}
          disabled={loading}
          aria-label="close inventory report dialog"
        >
          <Close />
        </IconButton>

      </DialogTitle>

      <Divider />

      {/*================================================
          Dialog Content
      =================================================*/}

      <DialogContent
        dividers
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >

        {/*================================================
            General Error
        =================================================*/}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/*================================================
            Report Information
        =================================================*/}

        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          Report Information
        </Typography>

        <Grid
          container
          spacing={2}
        >

          {/*==============================================
              Report Name
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              required
              label="Report Name"
              name="reportName"
              value={
                formData.reportName
              }
              onChange={
                handleChange
              }
              error={
                Boolean(
                  formErrors.reportName
                )
              }
              helperText={
                formErrors.reportName
              }
              disabled={loading}
              placeholder="Enter report name"
            />
          </Grid>

          {/*==============================================
              Report Type
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              required
              select
              label="Report Type"
              name="reportType"
              value={
                formData.reportType
              }
              onChange={
                handleChange
              }
              error={
                Boolean(
                  formErrors.reportType
                )
              }
              helperText={
                formErrors.reportType
              }
              disabled={loading}
            >
              <MenuItem value="inventory">
                Inventory
              </MenuItem>

              <MenuItem value="stock">
                Stock
              </MenuItem>

              <MenuItem value="valuation">
                Valuation
              </MenuItem>

              <MenuItem value="movement">
                Stock Movement
              </MenuItem>
            </TextField>
          </Grid>

          {/*==============================================
              Status
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
              disabled={loading}
            >
              <MenuItem value="active">
                Active
              </MenuItem>

              <MenuItem value="inactive">
                Inactive
              </MenuItem>

              <MenuItem value="draft">
                Draft
              </MenuItem>

              <MenuItem value="archived">
                Archived
              </MenuItem>
            </TextField>
          </Grid>

          {/*==============================================
              Created By
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              fullWidth
              label="Created By"
              name="createdBy"
              value={
                formData.createdBy
              }
              onChange={
                handleChange
              }
              disabled={loading}
              placeholder="Enter creator name"
            />
          </Grid>

          {/*==============================================
              Description
          ==============================================*/}

          <Grid
            item
            xs={12}
          >
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              label="Description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              disabled={loading}
              placeholder="Enter report description"
            />
          </Grid>

        </Grid>

        <Divider
          sx={{ my: 3 }}
        />

        {/*================================================
            Inventory Summary
        =================================================*/}

        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          Inventory Summary
        </Typography>

        <Grid
          container
          spacing={2}
        >

          {/*==============================================
              Total Records
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={4}
          >
            <TextField
              fullWidth
              type="number"
              label="Total Records"
              name="totalRecords"
              value={
                formData.totalRecords
              }
              onChange={
                handleChange
              }
              error={
                Boolean(
                  formErrors.totalRecords
                )
              }
              helperText={
                formErrors.totalRecords
              }
              disabled={loading}
              inputProps={{
                min: 0,
              }}
            />
          </Grid>

          {/*==============================================
              Total Stock
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={4}
          >
            <TextField
              fullWidth
              type="number"
              label="Total Stock Quantity"
              name="totalStock"
              value={
                formData.totalStock
              }
              onChange={
                handleChange
              }
              error={
                Boolean(
                  formErrors.totalStock
                )
              }
              helperText={
                formErrors.totalStock
              }
              disabled={loading}
              inputProps={{
                min: 0,
              }}
            />
          </Grid>

          {/*==============================================
              Total Value
          ==============================================*/}

          <Grid
            item
            xs={12}
            sm={4}
          >
            <TextField
              fullWidth
              type="number"
              label="Total Inventory Value"
              name="totalValue"
              value={
                formData.totalValue
              }
              onChange={
                handleChange
              }
              error={
                Boolean(
                  formErrors.totalValue
                )
              }
              helperText={
                formErrors.totalValue
              }
              disabled={loading}
              inputProps={{
                min: 0,
                step: "0.01",
              }}
            />
          </Grid>

        </Grid>

        <Divider
          sx={{ my: 3 }}
        />

        {/*================================================
            Inventory Items
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          spacing={1}
          sx={{ mb: 2 }}
        >

          <Typography
            variant="subtitle1"
            fontWeight={600}
          >
            Inventory Items
          </Typography>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={
              handleAddItem
            }
            disabled={loading}
          >
            Add Item
          </Button>

        </Stack>

        {/*================================================
            Item Rows
        =================================================*/}

        {items.length === 0 ? (

          <Box
            sx={{
              p: 3,
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No inventory items added.
            </Typography>
          </Box>

        ) : (

          <Stack
            spacing={2}
          >

            {items.map(
              (item, index) => (

                <Box
                  key={`inventory-item-${index}`}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor:
                      "divider",
                    borderRadius: 1,
                  }}
                >

                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                  >

                    {/*================================
                        Item Code
                    =================================*/}

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={2.2}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label="Item Code"
                        value={
                          item.itemCode ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleItemChange(
                            index,
                            "itemCode",
                            event.target.value
                          )
                        }
                        disabled={loading}
                      />
                    </Grid>

                    {/*================================
                        Item Name
                    =================================*/}

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={2.5}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label="Item Name"
                        value={
                          item.itemName ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleItemChange(
                            index,
                            "itemName",
                            event.target.value
                          )
                        }
                        disabled={loading}
                      />
                    </Grid>

                    {/*================================
                        Quantity
                    =================================*/}

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={2}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Quantity"
                        value={
                          item.quantity ??
                          0
                        }
                        onChange={(
                          event
                        ) =>
                          handleItemChange(
                            index,
                            "quantity",
                            event.target.value
                          )
                        }
                        disabled={loading}
                        inputProps={{
                          min: 0,
                        }}
                      />
                    </Grid>

                    {/*================================
                        Unit Price
                    =================================*/}

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={2}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Unit Price"
                        value={
                          item.unitPrice ??
                          0
                        }
                        onChange={(
                          event
                        ) =>
                          handleItemChange(
                            index,
                            "unitPrice",
                            event.target.value
                          )
                        }
                        disabled={loading}
                        inputProps={{
                          min: 0,
                          step: "0.01",
                        }}
                      />
                    </Grid>

                    {/*================================
                        Value
                    =================================*/}

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={2}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label="Value"
                        value={
                          new Intl.NumberFormat(
                            "en-IN",
                            {
                              style:
                                "currency",
                              currency:
                                "INR",
                              maximumFractionDigits:
                                2,
                            }
                          ).format(
                            Number(
                              item.value
                            ) || 0
                          )
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    {/*================================
                        Remove
                    =================================*/}

                    <Grid
                      item
                      xs={12}
                      md={1.3}
                    >
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleRemoveItem(
                            index
                          )
                        }
                        disabled={loading}
                        aria-label={
                          `remove inventory item ${
                            index + 1
                          }`
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Grid>

                  </Grid>

                </Box>

              )
            )}

          </Stack>

        )}

      </DialogContent>

      {/*================================================
          Dialog Actions
      =================================================*/}

      <DialogActions
        sx={{
          p: 2,
          gap: 1,
        }}
      >

        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : null
          }
        >
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Report"
            : "Create Report"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};

//======================================================
// Part 1B Ends Here
//======================================================
//======================================================
// PropTypes
//======================================================

InventoryReportModal.propTypes = {
  open: PropTypes.bool,

  mode: PropTypes.oneOf([
    "add",
    "edit",
    "view",
  ]),

  report: PropTypes.object,

  loading: PropTypes.bool,

  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),

  onClose: PropTypes.func,

  onSubmit: PropTypes.func,
};

//======================================================
// Default Props
//======================================================

InventoryReportModal.defaultProps = {
  open: false,

  mode: "add",

  report: null,

  loading: false,

  error: "",

  onClose: () => {},

  onSubmit: async () => {},
};

//======================================================
// Export
//======================================================

export default InventoryReportModal;