import React, { useEffect, useState } from "react";

import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
Grid,
TextField,
Typography,
Divider,
Box,
IconButton,
CircularProgress,
Alert,
MenuItem
} from "@mui/material";

import {
Close,
Save,
ReceiptLong
} from "@mui/icons-material";

/* =========================================================
INITIAL FORM DATA
========================================================= */

const INITIAL_FORM_DATA = {
invoiceTaxDetailId: "",
invoiceId: "",
taxName: "",
taxCode: "",
taxRate: "",
taxableAmount: "",
taxAmount: "",
status: "Active"
};

/* =========================================================
FIELD VALUE HELPER
========================================================= */

const getFieldValue = (data, fields, fallback = "") => {
for (const field of fields) {
if (
data?.[field] !== undefined &&
data?.[field] !== null
) {
return data[field];
}
}

```
return fallback;
```

};

/* =========================================================
INVOICE TAX DETAIL MODAL
========================================================= */

const InvoiceTaxDetailModal = ({
open = false,
onClose,
onSubmit,
initialData = null,
mode = "create",
loading = false
}) => {
const isEditMode =
mode === "edit" || Boolean(initialData);
const [formData, setFormData] = useState(
    INITIAL_FORM_DATA
);

const [errors, setErrors] = useState({});
const [submitError, setSubmitError] = useState("");

/* =====================================================
   INITIALIZE FORM
===================================================== */

useEffect(() => {
    if (open && initialData) {
        setFormData({
            invoiceTaxDetailId: getFieldValue(
                initialData,
                [
                    "invoiceTaxDetailId",
                    "InvoiceTaxDetailId"
                ]
            ),
            invoiceId: getFieldValue(
                initialData,
                ["invoiceId", "InvoiceId"]
            ),
            taxName: getFieldValue(
                initialData,
                ["taxName", "TaxName"]
            ),
            taxCode: getFieldValue(
                initialData,
                ["taxCode", "TaxCode"]
            ),
            taxRate: getFieldValue(
                initialData,
                ["taxRate", "TaxRate"]
            ),
            taxableAmount: getFieldValue(
                initialData,
                [
                    "taxableAmount",
                    "TaxableAmount"
                ]
            ),
            taxAmount: getFieldValue(
                initialData,
                ["taxAmount", "TaxAmount"]
            ),
            status: getFieldValue(
                initialData,
                ["status", "Status"],
                "Active"
            )
        });
    } else if (open) {
        setFormData(INITIAL_FORM_DATA);
    }

    setErrors({});
    setSubmitError("");
}, [open, initialData]);

/* =====================================================
   HANDLE INPUT CHANGE
===================================================== */

const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
        ...previous,
        [name]: value
    }));

    setErrors((previous) => ({
        ...previous,
        [name]: ""
    }));

    setSubmitError("");
};

/* =====================================================
   VALIDATE FORM
===================================================== */

const validateForm = () => {
    const newErrors = {};

    if (
        formData.invoiceId === "" ||
        formData.invoiceId === null
    ) {
        newErrors.invoiceId = "Invoice ID is required.";
    }

    if (!String(formData.taxName).trim()) {
        newErrors.taxName = "Tax name is required.";
    }

    if (
        formData.taxRate === "" ||
        !Number.isFinite(Number(formData.taxRate)) ||
        Number(formData.taxRate) < 0
    ) {
        newErrors.taxRate =
            "Enter a valid non-negative tax rate.";
    }

    if (
        formData.taxableAmount === "" ||
        !Number.isFinite(
            Number(formData.taxableAmount)
        ) ||
        Number(formData.taxableAmount) < 0
    ) {
        newErrors.taxableAmount =
            "Enter a valid non-negative taxable amount.";
    }

    if (
        formData.taxAmount !== "" &&
        (
            !Number.isFinite(
                Number(formData.taxAmount)
            ) ||
            Number(formData.taxAmount) < 0
        )
    ) {
        newErrors.taxAmount =
            "Enter a valid non-negative tax amount.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};

/* =====================================================
   HANDLE SUBMIT
===================================================== */

const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    if (typeof onSubmit !== "function") {
        setSubmitError(
            "Submit handler is not configured."
        );
        return;
    }

    const payload = {
        invoiceId: Number(formData.invoiceId),
        taxName: String(formData.taxName).trim(),
        taxCode: String(formData.taxCode).trim(),
        taxRate: Number(formData.taxRate),
        taxableAmount: Number(
            formData.taxableAmount
        ),
        taxAmount:
            formData.taxAmount === ""
                ? null
                : Number(formData.taxAmount),
        status: formData.status
    };

    if (isEditMode) {
        payload.invoiceTaxDetailId =
            formData.invoiceTaxDetailId;
    }

    try {
        setSubmitError("");

        await onSubmit(payload);
    } catch (error) {
        console.error(
            "SAVE INVOICE TAX DETAIL ERROR:",
            error
        );

        setSubmitError(
            error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message ||
            "Failed to save invoice tax detail."
        );
    }
};

/* =====================================================
   HANDLE CLOSE
===================================================== */

const handleClose = () => {
    if (loading) {
        return;
    }

    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmitError("");

    if (onClose) {
        onClose();
    }
};

/* =====================================================
   RENDER
===================================================== */

return (
    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="invoice-tax-detail-modal-title"
    >
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
        >
            {/* DIALOG TITLE */}

            <DialogTitle
                id="invoice-tax-detail-modal-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    pr: 2
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                >
                    <ReceiptLong color="primary" />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {isEditMode
                                ? "Edit Invoice Tax Detail"
                                : "Create Invoice Tax Detail"}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Enter the invoice tax information below.
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Close modal"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* DIALOG CONTENT */}

            <DialogContent sx={{ pt: 3 }}>
                {submitError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setSubmitError("")}
                    >
                        {submitError}
                    </Alert>
                )}

                <Grid container spacing={2.5}>
                    {/* INVOICE ID */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Invoice ID"
                            name="invoiceId"
                            type="number"
                            value={formData.invoiceId}
                            onChange={handleChange}
                            error={Boolean(errors.invoiceId)}
                            helperText={errors.invoiceId}
                            disabled={loading}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>

                    {/* TAX NAME */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Tax Name"
                            name="taxName"
                            value={formData.taxName}
                            onChange={handleChange}
                            error={Boolean(errors.taxName)}
                            helperText={errors.taxName}
                            disabled={loading}
                            placeholder="e.g. GST"
                        />
                    </Grid>

                    {/* TAX CODE */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Tax Code"
                            name="taxCode"
                            value={formData.taxCode}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="e.g. GST18"
                        />
                    </Grid>

                    {/* TAX RATE */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Tax Rate (%)"
                            name="taxRate"
                            type="number"
                            value={formData.taxRate}
                            onChange={handleChange}
                            error={Boolean(errors.taxRate)}
                            helperText={errors.taxRate}
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>

                    {/* TAXABLE AMOUNT */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Taxable Amount (₹)"
                            name="taxableAmount"
                            type="number"
                            value={formData.taxableAmount}
                            onChange={handleChange}
                            error={Boolean(
                                errors.taxableAmount
                            )}
                            helperText={
                                errors.taxableAmount
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>

                    {/* TAX AMOUNT */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Tax Amount (₹)"
                            name="taxAmount"
                            type="number"
                            value={formData.taxAmount}
                            onChange={handleChange}
                            error={Boolean(errors.taxAmount)}
                            helperText={
                                errors.taxAmount ||
                                "Optional if calculated by the backend."
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>

                    {/* STATUS */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <MenuItem value="Active">
                                Active
                            </MenuItem>

                            <MenuItem value="Inactive">
                                Inactive
                            </MenuItem>

                            <MenuItem value="Pending">
                                Pending
                            </MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            {/* DIALOG ACTIONS */}

            <DialogActions sx={{ p: 2.5, gap: 1 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                        loading
                            ? <CircularProgress size={18} color="inherit" />
                            : <Save />
                    }
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : isEditMode
                            ? "Update Tax Detail"
                            : "Save Tax Detail"}
                </Button>
            </DialogActions>
        </Box>
    </Dialog>
);
};

export default InvoiceTaxDetailModal;
