
import React, { useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
    CircularProgress
} from "@mui/material";

import {
    ArrowBack,
    Save,
    ReceiptLong
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/invoice-tax-details";

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

const InvoiceTaxDetailCreate = ({ onCreated, onCancel }) => {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/invoice-tax-details");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (
            !form.salesInvoiceId.trim() ||
            !form.channelProductId.trim() ||
            !form.sellerId.trim() ||
            !form.customerId.trim() ||
            form.taxPercentage === ""
        ) {
            setError(
                "Please enter Sales Invoice ID, Channel Product ID, Tax Percentage, Seller ID, and Customer ID."
            );
            return;
        }

        const payload = {
            salesInvoiceId: Number(form.salesInvoiceId),
            channelProductId: form.channelProductId.trim(),
            taxPercentage: Number(form.taxPercentage),
            centralGst: Number(form.centralGst || 0),
            stateGst: Number(form.stateGst || 0),
            integratedGst: Number(form.integratedGst || 0),
            compensationCess: Number(form.compensationCess || 0),
            sellerId: Number(form.sellerId),
            customerId: Number(form.customerId)
        };

        const invalid = Object.entries(payload).some(
            ([key, value]) =>
                key !== "channelProductId" &&
                (!Number.isFinite(value) || value < 0)
        );

        if (invalid) {
            setError("Please enter valid non-negative numeric values.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(API_URL, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setSuccess("Invoice tax detail created successfully.");

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

            const data = err.response?.data;
            const validationMessage = data?.errors
                ? Object.values(data.errors).flat().join(" ")
                : "";

            setError(
                validationMessage ||
                data?.message ||
                data?.title ||
                err.message ||
                "Unable to create invoice tax detail."
            );
        } finally {
            setLoading(false);
        }
    };

    const numberField = (name, label, required = false) => (
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
                inputProps={{ min: 0, step: "any" }}
            />
        </Grid>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <ReceiptLong color="primary" sx={{ fontSize: 38 }} />
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Create Invoice Tax Detail
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                                Enter invoice and tax information.
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Back to List
                    </Button>
                </Stack>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
            >
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Invoice Information
                </Typography>

                <Grid container spacing={3}>
                    {numberField("salesInvoiceId", "Sales Invoice ID", true)}

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

                    {numberField("sellerId", "Seller ID", true)}
                    {numberField("customerId", "Customer ID", true)}
                </Grid>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mt: 4, mb: 2 }}
                >
                    Tax Information
                </Typography>

                <Grid container spacing={3}>
                    {numberField("taxPercentage", "Tax Percentage (%)", true)}
                    {numberField("centralGst", "Central GST (CGST) (%)")}
                    {numberField("stateGst", "State GST (SGST) (%)")}
                    {numberField("integratedGst", "Integrated GST (IGST) (%)")}
                    {numberField("compensationCess", "Compensation Cess (%)")}
                </Grid>

                <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    justifyContent="flex-end"
                    spacing={2}
                    sx={{ mt: 4 }}
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
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Create Tax Detail"}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default InvoiceTaxDetailCreate;