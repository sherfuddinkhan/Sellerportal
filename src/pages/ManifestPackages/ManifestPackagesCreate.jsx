import React, { useState, useEffect } from "react";
import {
    Box, Paper, Typography, TextField, Button, Grid,
    Divider, CircularProgress, Alert, Stack
} from "@mui/material";
import { ArrowBack, RestartAlt, Inventory2, Add, Save } from "@mui/icons-material";

const initialFormData = {
    sellerId: "",
    customerId: "",
    shippingManifestCode: "",
    shippingPackageCode: ""
};

const ManifestPackagesCreate = ({
    onSubmit,
    onCancel,
    loading = false,
    error = "",
    successMessage = "",
    title = "Create Manifest Package",
    initialData = null,
    isEdit = false
}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [validationErrors, setValidationErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                sellerId: initialData.sellerId?? "",
                customerId: initialData.customerId?? "",
                shippingManifestCode: initialData.shippingManifestCode?? "",
                shippingPackageCode: initialData.shippingPackageCode?? ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
        setValidationErrors(prev => ({...prev, [name]: "" }));
        setSubmitError("");
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.sellerId || Number(formData.sellerId) <= 0 ||!Number.isInteger(Number(formData.sellerId))) errors.sellerId = "Enter valid Seller ID";
        if (!formData.customerId || Number(formData.customerId) <= 0 ||!Number.isInteger(Number(formData.customerId))) errors.customerId = "Enter valid Customer ID";
        if (!String(formData.shippingManifestCode || "").trim()) errors.shippingManifestCode = "Manifest Code is required";
        if (!String(formData.shippingPackageCode || "").trim()) errors.shippingPackageCode = "Package Code is required";
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (typeof onSubmit!== "function") {
            setSubmitError("The onSubmit handler has not been configured. Pass onSubmit={fn}");
            return;
        }

        const payload = {
            sellerId: Number(formData.sellerId),
            customerId: Number(formData.customerId),
            shippingManifestCode: formData.shippingManifestCode.trim(),
            shippingPackageCode: formData.shippingPackageCode.trim()
        };

        // For update, include ID if present
        if (initialData?.manifestPackageId) {
            payload.manifestPackageId = initialData.manifestPackageId;
        }

        try {
            await onSubmit(payload);
        } catch (err) {
            setSubmitError(err?.response?.data?.message || err?.message || "Failed to save record.");
        }
    };

    const handleReset = () => {
        setFormData(initialData? {
            sellerId: initialData.sellerId?? "",
            customerId: initialData.customerId?? "",
            shippingManifestCode: initialData.shippingManifestCode?? "",
            shippingPackageCode: initialData.shippingPackageCode?? ""
        } : initialFormData);
        setValidationErrors({});
        setSubmitError("");
    };

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, width: "100%" }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ display: "flex", bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 2, p: 1.5 }}><Inventory2 /></Box>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>{title}</Typography>
                        <Typography variant="body2" color="text.secondary">Enter manifest package details.</Typography>
                    </Box>
                </Stack>
                {typeof onCancel === "function" && <Button variant="outlined" startIcon={<ArrowBack />} onClick={onCancel} disabled={loading}>Back</Button>}
            </Stack>

            <Divider sx={{ mb: 3 }} />
            {(error || submitError) && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError("")}>{submitError || error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required type="number" label="Seller ID" name="sellerId" value={formData.sellerId} onChange={handleChange} error={!!validationErrors.sellerId} helperText={validationErrors.sellerId} disabled={loading} inputProps={{ min: 1, step: 1 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required type="number" label="Customer ID" name="customerId" value={formData.customerId} onChange={handleChange} error={!!validationErrors.customerId} helperText={validationErrors.customerId} disabled={loading} inputProps={{ min: 1, step: 1 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Shipping Manifest Code" name="shippingManifestCode" value={formData.shippingManifestCode} onChange={handleChange} error={!!validationErrors.shippingManifestCode} helperText={validationErrors.shippingManifestCode} disabled={loading} placeholder="e.g. MAN-001" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Shipping Package Code" name="shippingPackageCode" value={formData.shippingPackageCode} onChange={handleChange} error={!!validationErrors.shippingPackageCode} helperText={validationErrors.shippingPackageCode} disabled={loading} placeholder="e.g. PKG-001" />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />
                <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" spacing={2}>
                    <Button variant="outlined" color="inherit" startIcon={<RestartAlt />} onClick={handleReset} disabled={loading}>Reset</Button>
                    {typeof onCancel === "function" && <Button variant="outlined" color="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>}
                    <Button type="submit" variant="contained" startIcon={loading? <CircularProgress size={18} color="inherit" /> : isEdit? <Save /> : <Add />} disabled={loading}>
                        {loading? "Saving..." : isEdit? "Update Package" : "Create Package"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default ManifestPackagesCreate;