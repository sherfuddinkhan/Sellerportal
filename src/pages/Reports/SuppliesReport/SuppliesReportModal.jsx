//======================================================
// SuppliesReportModal.jsx
// Part 1A
//======================================================

import React, {
  useEffect,
  useState,
} from "react";

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
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

//======================================================
// Helper
//======================================================

const getValue = (
  report,
  ...fields
) => {
  for (
    const field of fields
  ) {
    if (
      report?.[field] !==
        undefined &&
      report?.[field] !==
        null &&
      report?.[field] !== ""
    ) {
      return report[field];
    }
  }

  return "";
};

//======================================================
// Date Formatter
//======================================================

const formatDate = (
  value
) => {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date
    .toISOString()
    .split("T")[0];
};

//======================================================
// SuppliesReportModal
//======================================================

const SuppliesReportModal = ({
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
  // Form State
  //====================================================

  const [formData, setFormData] =
    useState({
      date: "",
      supplier: "",
      stockItem: "",
      category: "",
      voucherNumber: "",
      voucherType: "",
      warehouse: "",
      quantity: "",
      rate: "",
      amount: "",
      status: "",
      remarks: "",
      notes: "",
    });

  //====================================================
  // Load Report
  //====================================================

  useEffect(() => {
    if (!report) {
      setFormData({
        date: "",
        supplier: "",
        stockItem: "",
        category: "",
        voucherNumber: "",
        voucherType: "",
        warehouse: "",
        quantity: "",
        rate: "",
        amount: "",
        status: "",
        remarks: "",
        notes: "",
      });

      return;
    }

    setFormData({
      id:
        report?.id ??
        report?.reportId ??
        report?.supplyId ??
        "",

      date: formatDate(
        getValue(
          report,
          "date",
          "supplyDate",
          "transactionDate",
          "voucherDate"
        )
      ),

      supplier:
        getValue(
          report,
          "supplier",
          "supplierName",
          "partyName",
          "vendorName"
        ),

      stockItem:
        getValue(
          report,
          "stockItem",
          "itemName",
          "stockItemName",
          "item"
        ),

      category:
        getValue(
          report,
          "category",
          "categoryName",
          "itemCategory"
        ),

      voucherNumber:
        getValue(
          report,
          "voucherNumber",
          "voucherNo",
          "documentNumber",
          "docNo"
        ),

      voucherType:
        getValue(
          report,
          "voucherType",
          "documentType",
          "docType"
        ),

      warehouse:
        getValue(
          report,
          "warehouse",
          "warehouseName",
          "godown",
          "location"
        ),

      quantity:
        getValue(
          report,
          "quantity",
          "qty",
          "supplyQuantity"
        ),

      rate:
        getValue(
          report,
          "rate",
          "unitRate",
          "price"
        ),

      amount:
        getValue(
          report,
          "amount",
          "totalAmount",
          "value",
          "totalValue"
        ),

      status:
        getValue(
          report,
          "status",
          "state"
        ),

      remarks:
        getValue(
          report,
          "remarks",
          "notes",
          "comment"
        ),

      notes:
        getValue(
          report,
          "notes",
          "remarks",
          "comment"
        ),
    });
  }, [
    report,
    open,
  ]);

  //====================================================
  // Handle Change
  //====================================================

  const handleChange = (
    field
  ) => (
    event
  ) => {
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

  const handleSave = () => {
    if (
      typeof onSave !==
      "function"
    ) {
      return;
    }

    onSave(formData);
  };

  //====================================================
  // Edit
  //====================================================

  const handleEdit = () => {
    if (
      typeof onEdit !==
      "function"
    ) {
      return;
    }

    onEdit(
      report || formData
    );
  };

  //====================================================
  // Close
  //====================================================

  const handleClose = () => {
    if (
      loading ||
      saving
    ) {
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
  ) => (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={500}
        sx={{
          mt: 0.25,
          wordBreak:
            "break-word",
        }}
      >
        {value !==
            undefined &&
          value !==
            null &&
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
      onClose={
        handleClose
      }
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      {/*==============================================
          Dialog Header
      ===============================================*/}

      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {isEditMode
                ? "Edit Supply Report"
                : "Supply Report Details"}
            </Typography>

            {report ? (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {getValue(
                  report,
                  "voucherNumber",
                  "voucherNo",
                  "documentNumber",
                  "docNo"
                ) ||
                  "Supply transaction"}
              </Typography>
            ) : null}
          </Box>

          <IconButton
            onClick={
              handleClose
            }
            disabled={
              loading ||
              saving
            }
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/*==============================================
          Dialog Content
      ===============================================*/}

      <DialogContent>
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
                md={4}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Supply Date"
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
                    "Supply Date",
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
                md={4}
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Supplier"
                    value={
                      formData.supplier ||
                      ""
                    }
                    onChange={handleChange(
                      "supplier"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderField(
                    "Supplier",
                    formData.supplier
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
                    label="Stock Item"
                    value={
                      formData.stockItem ||
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
                  renderField(
                    "Stock Item",
                    formData.stockItem
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
                    label="Category"
                    value={
                      formData.category ||
                      ""
                    }
                    onChange={handleChange(
                      "category"
                    )}
                    disabled={
                      loading ||
                      saving
                    }
                  />
                ) : (
                  renderField(
                    "Category",
                    formData.category
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
                  renderField(
                    "Warehouse",
                    formData.warehouse
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
              >
                {isEditMode ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Voucher Number"
                    value={
                      formData.voucherNumber ||
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
                  renderField(
                    "Voucher Number",
                    formData.voucherNumber
                  )
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
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
                  renderField(
                    "Voucher Type",
                    formData.voucherType
                  )
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Quantity and Amount
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
                sm={4}
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
                  renderField(
                    "Quantity",
                    formData.quantity
                  )
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
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
                  renderField(
                    "Rate",
                    formData.rate
                  )
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
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
                  renderField(
                    "Amount",
                    formData.amount
                  )
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/*============================================
              Status
          =============================================*/}

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
            >
              Status
            </Typography>

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
                  renderField(
                    "Remarks",
                    formData.remarks ||
                      formData.notes ||
                      "No remarks available"
                  )
                )}
              </Grid>
            </Grid>
          </Box>

        </Stack>
      </DialogContent>

      <Divider />

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
          onClick={
            handleClose
          }
          disabled={
            loading ||
            saving
          }
        >
          Close
        </Button>

        {!isEditMode ? (
          <Button
            variant="contained"
            startIcon={
              <EditIcon />
            }
            onClick={
              handleEdit
            }
            disabled={
              loading ||
              saving ||
              !report
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
            onClick={
              handleSave
            }
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

export default SuppliesReportModal;

//======================================================
// Part 1A Ends Here
//======================================================