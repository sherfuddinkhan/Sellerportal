import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Paper,
    Grid,
    Typography,
    TextField,
    Button,
    Divider,
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    Save,
    RestartAlt,
    ArrowBack,
    AddBusiness,
    Store,
    Inventory2,
    Apartment
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const DEFAULT_API_BASE_URL =
    "http://localhost:5000/api/FacilityChannel";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    sellerId: "6",
    customerId: "3",
    productId: "6",
    skuCode: "",
    facilityCode: "",
    channelCode: "",
    sellableQuantity: "0"
};

/* =========================================================
   ERROR MESSAGE
========================================================= */

const getErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (responseData?.title) {
        return responseData.title;
    }

    if (responseData?.detail) {
        return responseData.detail;
    }

    if (responseData?.errors) {
        return Object.values(responseData.errors)
            .flat()
            .join(" ");
    }

    if (error?.code === "ERR_NETWORK") {
        return "Unable to connect to the API. Check that the Node.js server is running.";
    }

    return (
        error?.message ||
        "Unable to create facility channel inventory."
    );
};

/* =========================================================
   FACILITY CHANNEL CREATE
========================================================= */

const FacilityChannelCreate = ({
    apiBaseUrl = DEFAULT_API_BASE_URL,
    onCreated,
    onCancel,
    onError
}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =====================================================
       BACK / CANCEL NAVIGATION
    ===================================================== */

    const handleBack = () => {
        if (loading) return;

        if (typeof onCancel === "function") {
            onCancel();
        } else {
            navigate("/facility-channels");
        }
    };

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setError("");
        setSuccess("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        const sellerId = Number(formData.sellerId);
        const customerId = Number(formData.customerId);
        const productId = Number(formData.productId);
        const sellableQuantity = Number(formData.sellableQuantity);

        if (
            !formData.sellerId.trim() ||
            !Number.isInteger(sellerId) ||
            sellerId <= 0
        ) {
            errors.sellerId = "Enter a valid positive Seller ID.";
        }

        if (
            !formData.customerId.trim() ||
            !Number.isInteger(customerId) ||
            customerId <= 0
        ) {
            errors.customerId = "Enter a valid positive Customer ID.";
        }

        if (
            !formData.productId.trim() ||
            !Number.isInteger(productId) ||
            productId <= 0
        ) {
            errors.productId = "Enter a valid positive Product ID.";
        }

        if (!formData.skuCode.trim()) {
            errors.skuCode = "SKU Code is required.";
        } else if (formData.skuCode.trim().length > 100) {
            errors.skuCode = "SKU Code cannot exceed 100 characters.";
        }

        if (!formData.facilityCode.trim()) {
            errors.facilityCode = "Facility Code is required.";
        } else if (formData.facilityCode.trim().length > 100) {
            errors.facilityCode =
                "Facility Code cannot exceed 100 characters.";
        }

        if (!formData.channelCode.trim()) {
            errors.channelCode = "Channel Code is required.";
        } else if (formData.channelCode.trim().length > 100) {
            errors.channelCode =
                "Channel Code cannot exceed 100 characters.";
        }

        if (
            formData.sellableQuantity.trim() === "" ||
            !Number.isInteger(sellableQuantity) ||
            sellableQuantity < 0
        ) {
            errors.sellableQuantity =
                "Sellable Quantity must be a non-negative whole number.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        if (loading) return;

        setFormData({ ...initialFormData });
        setFormErrors({});
        setError("");
        setSuccess("");
    };

    /* =====================================================
       CREATE FACILITY CHANNEL INVENTORY
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setError("");
        setSuccess("");

        if (!validateForm()) return;

        const payload = {
            sellerId: Number(formData.sellerId),
            customerId: Number(formData.customerId),
            productId: Number(formData.productId),
            skuCode: formData.skuCode.trim(),
            facilityCode: formData.facilityCode.trim(),
            channelCode: formData.channelCode.trim(),
            sellableQuantity: Number(formData.sellableQuantity)
        };

        try {
            setLoading(true);

            const response = await axios.post(
                apiBaseUrl,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 15000
                }
            );

            setSuccess(
                "Facility channel inventory created successfully."
            );

            setFormData({ ...initialFormData });
            setFormErrors({});

            if (typeof onCreated === "function") {
                onCreated(response.data);
            }
        } catch (requestError) {
            const message = getErrorMessage(requestError);

            setError(message);

            console.error(
                "CREATE FACILITY CHANNEL ERROR:",
                requestError.response?.data || requestError.message
            );

            if (typeof onError === "function") {
                onError(requestError);
            }
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden"
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            bgcolor: "action.hover"
                        }}
                    >
                        <AddBusiness
                            color="primary"
                            fontSize="large"
                        />
                    </Box>

                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Create Facility Channel
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Register product inventory for a facility and sales channel.
                        </Typography>
                    </Box>
                </Stack>

                {/* BACK BUTTON - ALWAYS VISIBLE */}

                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={loading}
                >
                    Back
                </Button>
            </Box>

            <Divider />

            {/* FORM */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <Box sx={{ p: 3 }}>
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

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Account and Product Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="sellerId"
                                label="Seller ID"
                                value={formData.sellerId}
                                onChange={handleChange}
                                error={Boolean(formErrors.sellerId)}
                                helperText={
                                    formErrors.sellerId ||
                                    "Enter a positive integer."
                                }
                                disabled={loading}
                                inputProps={{ min: 1, step: 1 }}
                                InputProps={{
                                    startAdornment: (
                                        <Store
                                            sx={{
                                                mr: 1,
                                                color: "action.active"
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Grid>

                        <Grid xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="customerId"
                                label="Customer ID"
                                value={formData.customerId}
                                onChange={handleChange}
                                error={Boolean(formErrors.customerId)}
                                helperText={
                                    formErrors.customerId ||
                                    "Enter a positive integer."
                                }
                                disabled={loading}
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>

                        <Grid xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="productId"
                                label="Product ID"
                                value={formData.productId}
                                onChange={handleChange}
                                error={Boolean(formErrors.productId)}
                                helperText={
                                    formErrors.productId ||
                                    "Enter a positive integer."
                                }
                                disabled={loading}
                                inputProps={{ min: 1, step: 1 }}
                                InputProps={{
                                    startAdornment: (
                                        <Inventory2
                                            sx={{
                                                mr: 1,
                                                color: "action.active"
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="skuCode"
                                label="SKU Code"
                                placeholder="e.g. TN-WBH-001"
                                value={formData.skuCode}
                                onChange={handleChange}
                                error={Boolean(formErrors.skuCode)}
                                helperText={
                                    formErrors.skuCode || "Product SKU"
                                }
                                disabled={loading}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="facilityCode"
                                label="Facility Code"
                                placeholder="e.g. WH-TN-001"
                                value={formData.facilityCode}
                                onChange={handleChange}
                                error={Boolean(formErrors.facilityCode)}
                                helperText={
                                    formErrors.facilityCode ||
                                    "Warehouse or facility identifier."
                                }
                                disabled={loading}
                                inputProps={{ maxLength: 100 }}
                                InputProps={{
                                    startAdornment: (
                                        <Apartment
                                            sx={{
                                                mr: 1,
                                                color: "action.active"
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="channelCode"
                                label="Channel Code"
                                placeholder="e.g. AMAZON"
                                value={formData.channelCode}
                                onChange={handleChange}
                                error={Boolean(formErrors.channelCode)}
                                helperText={
                                    formErrors.channelCode ||
                                    "Marketplace or sales channel identifier."
                                }
                                disabled={loading}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="sellableQuantity"
                                label="Sellable Quantity"
                                value={formData.sellableQuantity}
                                onChange={handleChange}
                                error={Boolean(formErrors.sellableQuantity)}
                                helperText={
                                    formErrors.sellableQuantity ||
                                    "Available quantity for sale."
                                }
                                disabled={loading}
                                inputProps={{ min: 0, step: 1 }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider />

                {/* ACTION BUTTONS */}

                <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    spacing={1.5}
                    justifyContent="flex-end"
                    sx={{ p: 3 }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="outlined"
                        color="inherit"
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
                            loading ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <Save />
                            )
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Facility Channel"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default FacilityChannelCreate;
