// =========================================================
// InvoiceTaxDetailForm.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    Divider,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Save,
    ArrowBack,
    ReceiptLong,
    RestartAlt
} from "@mui/icons-material";

// =========================================================
// INITIAL FORM DATA
// =========================================================

const INITIAL_FORM_DATA = {
    salesInvoiceId: "",
    channelProductId: "",
    taxPercentage: "",
    centralGst: "",
    stateGst: "",
    integratedGst: "",
    compensationCess: "",
    sellerId: "",
    customerId: ""
};

// =========================================================
// GET FIELD VALUE
// =========================================================

const getFieldValue = (
    data,
    fields,
    fallback = ""
) => {
    for (const field of fields) {
        const value = data?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return fallback;
};

// =========================================================
// NORMALIZE FORM DATA
// =========================================================

const normalizeFormData = (data) => ({
    salesInvoiceId: getFieldValue(
        data,
        ["salesInvoiceId", "SalesInvoiceId"]
    ),

    channelProductId: getFieldValue(
        data,
        ["channelProductId", "ChannelProductId"]
    ),

    taxPercentage: getFieldValue(
        data,
        ["taxPercentage", "TaxPercentage"]
    ),

    centralGst: getFieldValue(
        data,
        ["centralGst", "CentralGst"]
    ),

    stateGst: getFieldValue(
        data,
        ["stateGst", "StateGst"]
    ),

    integratedGst: getFieldValue(
        data,
        ["integratedGst", "IntegratedGst"]
    ),

    compensationCess: getFieldValue(
        data,
        ["compensationCess", "CompensationCess"]
    ),

    sellerId: getFieldValue(
        data,
        ["sellerId", "SellerId"]
    ),

    customerId: getFieldValue(
        data,
        ["customerId", "CustomerId"]
    )
});

// =========================================================
// FORM COMPONENT
// =========================================================

const InvoiceTaxDetailForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    loading = false,
    mode = "create"
}) => {
    const isEditMode =
        mode === "edit" || Boolean(initialData);

    const [formData, setFormData] = useState(
        INITIAL_FORM_DATA
    );

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // =====================================================
    // INITIALIZE FORM
    // =====================================================

    useEffect(() => {
        setFormData(
            initialData
                ? normalizeFormData(initialData)
                : { ...INITIAL_FORM_DATA }
        );

        setErrors({});
        setSubmitError("");
        setSuccessMessage("");
    }, [initialData]);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

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
        setSuccessMessage("");
    };

    // =====================================================
    // VALIDATE
    // =====================================================

    const validateForm = () => {
        const nextErrors = {};

        const requiredPositiveIds = [
            "salesInvoiceId",
            "sellerId",
            "customerId"
        ];

        for (const field of requiredPositiveIds) {
            const value = formData[field];

            if (
                value === "" ||
                !Number.isFinite(Number(value)) ||
                Number(value) <= 0
            ) {
                nextErrors[field] =
                    "Enter a valid positive ID.";
            }
        }

        if (!String(formData.channelProductId).trim()) {
            nextErrors.channelProductId =
                "Channel product ID is required.";
        }

        const numericFields = [
            "taxPercentage",
            "centralGst",
            "stateGst",
            "integratedGst",
            "compensationCess"
        ];

        for (const field of numericFields) {
            const value = formData[field];

            if (
                value === "" ||
                !Number.isFinite(Number(value)) ||
                Number(value) < 0
            ) {
                nextErrors[field] =
                    "Enter a valid non-negative number.";
            }
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitError("");
        setSuccessMessage("");

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
            salesInvoiceId: Number(
                formData.salesInvoiceId
            ),

            channelProductId: String(
                formData.channelProductId
            ).trim(),

            taxPercentage: Number(
                formData.taxPercentage
            ),

            centralGst: Number(
                formData.centralGst
            ),

            stateGst: Number(
                formData.stateGst
            ),

            integratedGst: Number(
                formData.integratedGst
            ),

            compensationCess: Number(
                formData.compensationCess
            ),

            sellerId: Number(
                formData.sellerId
            ),

            customerId: Number(
                formData.customerId
            )
        };

        try {
            await onSubmit(payload);

            setSuccessMessage(
                isEditMode
                    ? "Invoice tax detail updated successfully."
                    : "Invoice tax detail saved successfully."
            );
        } catch (error) {
            console.error(
                "SAVE INVOICE TAX DETAIL ERROR:",
                error.response?.data || error
            );

            setSubmitError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.message ||
                "Failed to save invoice tax detail."
            );
        }
    };

    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {
        if (loading) return;

        setFormData(
            initialData
                ? normalizeFormData(initialData)
                : { ...INITIAL_FORM_DATA }
        );

        setErrors({});
        setSubmitError("");
        setSuccessMessage("");
    };

    // =====================================================
    // FIELD CONFIGURATION
    // =====================================================

    const fields = [
        {
            name: "salesInvoiceId",
            label: "Sales Invoice ID",
            type: "number",
            required: true
        },
        {
            name: "channelProductId",
            label: "Channel Product ID",
            type: "text",
            required: true
        },
        {
            name: "taxPercentage",
            label: "Tax Percentage (%)",
            type: "number",
            required: true
        },
        {
            name: "centralGst",
            label: "Central GST",
            type: "number",
            required: true
        },
        {
            name: "stateGst",
            label: "State GST",
            type: "number",
            required: true
        },
        {
            name: "integratedGst",
            label: "Integrated GST",
            type: "number",
            required: true
        },
        {
            name: "compensationCess",
            label: "Compensation Cess",
            type: "number",
            required: true
        },
        {
            name: "sellerId",
            label: "Seller ID",
            type: "number",
            required: true
        },
        {
            name: "customerId",
            label: "Customer ID",
            type: "number",
            required: true
        }
    ];

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Paper
            elevation={2}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                mb={2}
            >
                <ReceiptLong
                    color="primary"
                    fontSize="large"
                />

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
                        Enter the invoice, product, GST,
                        seller, and customer information.
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {submitError && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setSubmitError("")}
                >
                    {submitError}
                </Alert>
            )}

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    onClose={() => setSuccessMessage("")}
                >
                    {successMessage}
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <Grid container spacing={2.5}>
                    {fields.map((field) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            key={field.name}
                        >
                            <TextField
                                fullWidth
                                required={field.required}
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={
                                    formData[field.name] ?? ""
                                }
                                onChange={handleChange}
                                error={Boolean(
                                    errors[field.name]
                                )}
                                helperText={
                                    errors[field.name] || ""
                                }
                                disabled={loading}
                                inputProps={
                                    field.type === "number"
                                        ? {
                                            min: 0,
                                            step: "0.01"
                                        }
                                        : undefined
                                }
                            />
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    flexWrap="wrap"
                    gap={1.5}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
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
                </Box>
            </Box>
        </Paper>
    );
};

export default InvoiceTaxDetailForm;
