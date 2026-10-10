// =========================================================
// ReversePickupCreate.jsx
// =========================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    Alert,
    CircularProgress,
    Divider,
    Stack
} from "@mui/material";

import {
    Inventory2,
    Save,
    ArrowBack,
    RestartAlt
} from "@mui/icons-material";

// =========================================================
// DEFAULT FORM VALUES
// =========================================================

const initialFormData = {
    reversePickupNumber: "",
    orderNumber: "",
    customerName: "",
    customerEmail: "",
    pickupDate: "",
    pickupAddress: "",
    itemName: "",
    sku: "",
    quantity: 1,
    carrierName: "",
    trackingNumber: "",
    pickupCost: 0,
    status: "Pending",
    notes: ""
};

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = process.env.REACT_APP_API_URL || "";

// =========================================================
// COMPONENT
// =========================================================

const ReversePickupCreate = ({
    apiUrl = "/api/ReversePickup",
    sellerId,
    customerId,
    onCreated,
    onCancel,
    embedded = false,
    title = "Create Reverse Pickup"
}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const handleReset = () => {
        setFormData({ ...initialFormData });
        setError("");
        setSuccess("");
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {
        if (!formData.orderNumber.trim()) {
            return "Order number is required.";
        }

        if (!formData.customerName.trim()) {
            return "Customer name is required.";
        }

        if (!formData.customerEmail.trim()) {
            return "Customer email is required.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.customerEmail.trim())) {
            return "Please enter a valid customer email.";
        }

        if (!formData.pickupDate) {
            return "Pickup date is required.";
        }

        if (!formData.pickupAddress.trim()) {
            return "Pickup address is required.";
        }

        if (!formData.itemName.trim()) {
            return "Item name is required.";
        }

        if (
            !Number.isInteger(Number(formData.quantity)) ||
            Number(formData.quantity) < 1
        ) {
            return "Quantity must be a whole number greater than zero.";
        }

        if (
            !Number.isFinite(Number(formData.pickupCost)) ||
            Number(formData.pickupCost) < 0
        ) {
            return "Pickup cost must be zero or greater.";
        }

        return "";
    };

    // =====================================================
    // CREATE REVERSE PICKUP
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
            reversePickupNumber:
                formData.reversePickupNumber.trim() || null,

            orderNumber: formData.orderNumber.trim(),
            customerName: formData.customerName.trim(),
            customerEmail: formData.customerEmail.trim(),
            pickupDate: formData.pickupDate,
            pickupAddress: formData.pickupAddress.trim(),
            itemName: formData.itemName.trim(),
            sku: formData.sku.trim() || null,
            quantity: Number(formData.quantity),
            carrierName: formData.carrierName.trim() || null,
            trackingNumber: formData.trackingNumber.trim() || null,
            pickupCost: Number(formData.pickupCost),
            status: formData.status,
            notes: formData.notes.trim() || null
        };

        // Include IDs in query parameters only when provided.
        const params = {};

        if (sellerId !== undefined && sellerId !== null) {
            params.sellerId = sellerId;
        }

        if (customerId !== undefined && customerId !== null) {
            params.customerId = customerId;
        }

        try {
            setLoading(true);

            const endpoint = `${API_URL}${apiUrl}`;

            const response = await axios.post(
                endpoint,
                payload,
                {
                    params,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const createdPickup = response.data;

            setSuccess("Reverse pickup created successfully.");

            if (typeof onCreated === "function") {
                onCreated(createdPickup);
            } else {
                navigate("/reverse-pickups");
            }
        } catch (err) {
            console.error(
                "CREATE REVERSE PICKUP ERROR:",
                err
            );

            const responseData = err.response?.data;

            const serverMessage =
                typeof responseData === "string"
                    ? responseData
                    : responseData?.message ||
                      responseData?.title ||
                      responseData?.detail;

            const validationMessages =
                responseData?.errors &&
                typeof responseData.errors === "object"
                    ? Object.values(responseData.errors)
                          .flat()
                          .join(" ")
                    : "";

            setError(
                validationMessages ||
                serverMessage ||
                err.message ||
                "Failed to create reverse pickup. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // REUSABLE FORM FIELD
    // =====================================================

    const renderTextField = (
        name,
        label,
        options = {}
    ) => {
        const {
            required = false,
            type = "text",
            multiline = false,
            rows = 1,
            select = false,
            children,
            ...rest
        } = options;

        return (
            <TextField
                fullWidth
                name={name}
                label={label}
                value={formData[name] ?? ""}
                onChange={handleChange}
                required={required}
                type={type}
                multiline={multiline}
                rows={rows}
                select={select}
                disabled={loading}
                InputLabelProps={
                    type === "date"
                        ? { shrink: true }
                        : undefined
                }
                inputProps={
                    type === "number"
                        ? {
                              min:
                                  name === "quantity"
                                      ? 1
                                      : 0,
                              step:
                                  name === "quantity"
                                      ? 1
                                      : 0.01
                          }
                        : undefined
                }
                {...rest}
            >
                {children}
            </TextField>
        );
    };

    // =====================================================
    // FORM CONTENT
    // =====================================================

    const content = (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
        >
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            )}

            {/* PICKUP INFORMATION */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Pickup Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "reversePickupNumber",
                        "Reverse Pickup Number",
                        {
                            helperText:
                                "Leave blank if generated by the backend."
                        }
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "orderNumber",
                        "Order Number",
                        { required: true }
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "pickupDate",
                        "Pickup Date",
                        {
                            required: true,
                            type: "date"
                        }
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "status",
                        "Pickup Status",
                        {
                            required: true,
                            select: true
                        }
                    )}
                </Grid>

                <Grid item xs={12}>
                    {renderTextField(
                        "pickupAddress",
                        "Pickup Address",
                        {
                            required: true,
                            multiline: true,
                            rows: 2
                        }
                    )}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* CUSTOMER INFORMATION */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Customer Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "customerName",
                        "Customer Name",
                        { required: true }
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "customerEmail",
                        "Customer Email",
                        {
                            required: true,
                            type: "email"
                        }
                    )}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* RETURN ITEM INFORMATION */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Return Item Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "itemName",
                        "Item Name",
                        { required: true }
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField("sku", "SKU")}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "quantity",
                        "Quantity",
                        {
                            required: true,
                            type: "number"
                        }
                    )}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* CARRIER AND COST INFORMATION */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Carrier and Cost Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "carrierName",
                        "Carrier Name"
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "trackingNumber",
                        "Tracking Number"
                    )}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField(
                        "pickupCost",
                        "Pickup Cost (₹)",
                        {
                            type: "number"
                        }
                    )}
                </Grid>

                <Grid item xs={12}>
                    {renderTextField(
                        "notes",
                        "Additional Notes",
                        {
                            multiline: true,
                            rows: 3
                        }
                    )}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* FORM ACTIONS */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                justifyContent="flex-end"
            >
                <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    startIcon={<RestartAlt />}
                    onClick={handleReset}
                    disabled={loading}
                >
                    Reset
                </Button>

                <Button
                    type="button"
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={
                        onCancel ||
                        (() => navigate(-1))
                    }
                    disabled={loading}
                >
                    Cancel
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
                        : "Create Reverse Pickup"}
                </Button>
            </Stack>
        </Box>
    );

    // =====================================================
    // EMBEDDED RENDER
    // =====================================================

    if (embedded) {
        return content;
    }

    // =====================================================
    // STANDALONE RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ mb: 1 }}
                >
                    <Inventory2
                        color="primary"
                        sx={{ fontSize: 32 }}
                    />

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Enter the details to create a reverse pickup.
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {content}
            </Paper>
        </Box>
    );
};

export default ReversePickupCreate;
