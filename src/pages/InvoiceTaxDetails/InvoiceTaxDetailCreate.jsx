
import React, { useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save,
    ReceiptLong
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = "http://localhost:5000/api";

const INVOICE_TAX_DETAIL_API =
    `${API_BASE_URL}/invoice-tax-details`;

// =========================================================
// INITIAL FORM VALUES
// =========================================================

const initialForm = {
    salesInvoiceId: "",
    channelProductId: "",
    taxPercentage: "",
    centralGst: "0",
    stateGst: "0",
    integratedGst: "0",
    compensationCess: "0",
    sellerId: "",
    customerId: ""
};

// =========================================================
// CREATE INVOICE TAX DETAIL
// =========================================================

const InvoiceTaxDetailCreate = ({
    onCreated,
    onCancel
}) => {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // BACK / CANCEL
    // =====================================================

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
        } else {
            navigate("/invoice-tax-details");
        }
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {
        if (!form.salesInvoiceId.trim()) {
            return "Sales Invoice ID is required.";
        }

        if (!form.channelProductId.trim()) {
            return "Channel Product ID is required.";
        }

        if (!form.sellerId.trim()) {
            return "Seller ID is required.";
        }

        if (!form.customerId.trim()) {
            return "Customer ID is required.";
        }

        const numericFields = [
            ["Sales Invoice ID", form.salesInvoiceId],
            ["Tax Percentage", form.taxPercentage || "0"],
            ["Central GST", form.centralGst || "0"],
            ["State GST", form.stateGst || "0"],
            ["Integrated GST", form.integratedGst || "0"],
            ["Compensation Cess", form.compensationCess || "0"],
            ["Seller ID", form.sellerId],
            ["Customer ID", form.customerId]
        ];

        for (const [label, value] of numericFields) {
            const number = Number(value);

            if (!Number.isFinite(number) || number < 0) {
                return `${label} must be a valid non-negative number.`;
            }
        }

        return "";
    };

    // =====================================================
    // CREATE RECORD
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        const payload = {
            salesInvoiceId: Number(form.salesInvoiceId),
            channelProductId: form.channelProductId.trim(),
            taxPercentage: Number(form.taxPercentage || 0),
            centralGst: Number(form.centralGst || 0),
            stateGst: Number(form.stateGst || 0),
            integratedGst: Number(form.integratedGst || 0),
            compensationCess: Number(form.compensationCess || 0),
            sellerId: Number(form.sellerId),
            customerId: Number(form.customerId)
        };

        try {
            setLoading(true);

            const response = await axios.post(
                INVOICE_TAX_DETAIL_API,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            setSuccess(
                "Invoice tax detail created successfully."
            );

            if (typeof onCreated === "function") {
                onCreated(response.data);
            } else {
                navigate("/invoice-tax-details");
            }
        } catch (err) {
            console.error(
                "CREATE INVOICE TAX DETAIL ERROR:",
                err.response?.data || err
            );

            const responseData = err.response?.data;

            const validationErrors = responseData?.errors;

            const validationMessage =
                validationErrors &&
                typeof validationErrors === "object"
                    ? Object.values(validationErrors)
                        .flat()
                        .join(" ")
                    : "";

            setError(
                validationMessage ||
                responseData?.message ||
                responseData?.title ||
                err.message ||
                "Failed to create invoice tax detail."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // REUSABLE NUMERIC FIELD
    // =====================================================

    const renderNumberField = (
        name,
        label,
        required = false
    ) => (
        <Grid item xs={12} sm={6} md={4} key={name}>
            <TextField
                fullWidth
                name={name}
                label={label}
                type="number"
                value={form[name]}
                onChange={handleChange}
                required={required}
                disabled={loading}
                inputProps={{
                    min: 0,
                    step: "any"
                }}
            />
        </Grid>
    );

    // =====================================================
    // RENDER CREATE FORM
    // =====================================================

    return (
        <Box sx={{ p: { xs: 1.5, md: 3 } }}>

            {/* HEADER */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    alignItems={{
                        xs: "flex-start",
                        sm: "center"
                    }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                    >
                        <ReceiptLong
                            color="primary"
                            sx={{ fontSize: 38 }}
                        />

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Create Invoice Tax Detail
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Add invoice tax and GST information.
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Back to List
                    </Button>
                </Stack>
            </Paper>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* SUCCESS */}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>
            )}

            {/* FORM */}

            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 2
                }}
            >
                {/* INVOICE INFORMATION */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2.5 }}
                >
                    Invoice Information
                </Typography>

                <Grid container spacing={3}>
                    {renderNumberField(
                        "salesInvoiceId",
                        "Sales Invoice ID",
                        true
                    )}

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            name="channelProductId"
                            label="Channel Product ID"
                            value={form.channelProductId}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Grid>

                    {renderNumberField(
                        "sellerId",
                        "Seller ID",
                        true
                    )}

                    {renderNumberField(
                        "customerId",
                        "Customer ID",
                        true
                    )}
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* TAX INFORMATION */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2.5 }}
                >
                    Tax Information
                </Typography>

                <Grid container spacing={3}>
                    {renderNumberField(
                        "taxPercentage",
                        "Tax Percentage (%)",
                        true
                    )}

                    {renderNumberField(
                        "centralGst",
                        "Central GST (CGST) (%)"
                    )}

                    {renderNumberField(
                        "stateGst",
                        "State GST (SGST) (%)"
                    )}

                    {renderNumberField(
                        "integratedGst",
                        "Integrated GST (IGST) (%)"
                    )}

                    {renderNumberField(
                        "compensationCess",
                        "Compensation Cess (%)"
                    )}
                </Grid>

                <Alert
                    severity="info"
                    sx={{ mt: 3 }}
                >
                    Enter the tax rates applicable to the invoice.
                    CGST and SGST are generally used for intra-state
                    transactions, while IGST is generally used for
                    inter-state transactions.
                </Alert>

                {/* ACTIONS */}

                <Stack
                    direction={{
                        xs: "column-reverse",
                        sm: "row"
                    }}
                    justifyContent="flex-end"
                    spacing={1.5}
                    sx={{ mt: 3 }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading
                                ? <CircularProgress
                                    size={18}
                                    color="inherit"
                                  />
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Create Tax Detail"}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default InvoiceTaxDetailCreate;