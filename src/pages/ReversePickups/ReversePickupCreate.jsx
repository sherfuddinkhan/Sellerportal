// =========================================================
// ReversePickupCreate.jsx
// Standalone Create Page - No Popup
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
// API CONFIGURATION
// Axios calls go through the Node proxy.
// =========================================================

const API_URL = "/api/ReversePickup";

// =========================================================
// INITIAL FORM VALUES
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
// GET SELLER / CUSTOMER IDS
// =========================================================

const getStoredIds = () => {
    let storedUser = {};

    try {
        storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch {
        storedUser = {};
    }

    return {
        sellerId:
            localStorage.getItem("sellerId") ||
            storedUser.sellerId ||
            storedUser.SellerId ||
            "",

        customerId:
            localStorage.getItem("customerId") ||
            storedUser.customerId ||
            storedUser.CustomerId ||
            ""
    };
};

// =========================================================
// COMPONENT
// =========================================================

const ReversePickupCreate = ({
    sellerId: sellerIdProp,
    customerId: customerIdProp,
    title = "Create Reverse Pickup"
}) => {
    const navigate = useNavigate();

    const storedIds = getStoredIds();

    const sellerId =
        sellerIdProp ?? storedIds.sellerId;

    const customerId =
        customerIdProp ?? storedIds.customerId;

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // INPUT CHANGE
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
        if (!sellerId || !customerId) {
            return (
                "Seller ID or Customer ID is missing. " +
                "Please select the correct seller and customer."
            );
        }

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

        if (
            !emailPattern.test(
                formData.customerEmail.trim()
            )
        ) {
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

        if (!formData.sku.trim()) {
            return "Item SKU is required.";
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

        // Map the form to the backend model fields discussed
        // for ReversePickupModel.
        const payload = {
            reversePickupNo:
                formData.reversePickupNumber.trim() || null,

            saleOrderCode:
                formData.orderNumber.trim(),

            saleOrderItemCode: null,

            itemSkuCode:
                formData.sku.trim(),

            trackingNo:
                formData.trackingNumber.trim() || null,

            returnReason:
                formData.notes.trim() || null,

            qcComment: null,

            reversePickupStatus:
                formData.status,

            courierProviderName:
                formData.carrierName.trim() || null,

            facilityCode: null,

            channelName: null,

            putawayCode: null,

            sellerId: Number(sellerId),

            customerId: Number(customerId)
        };

        try {
            setLoading(true);

            const endpoint =
                `${API_URL}/seller/${encodeURIComponent(sellerId)}` +
                `/customer/${encodeURIComponent(customerId)}`;

            await axios.post(
                endpoint,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // Redirect to the list page after successful creation.
            navigate("/reverse-pickups", {
                replace: true,
                state: {
                    successMessage:
                        "Reverse pickup created successfully."
                }
            });
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
    // REUSABLE TEXT FIELD
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
            helperText,
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
                helperText={helperText}
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

    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 1, sm: 3 }
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2
                }}
            >
                {/* PAGE HEADER */}

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ mb: 2 }}
                >
                    <Inventory2
                        color="primary"
                        sx={{ fontSize: 34 }}
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

                <Divider sx={{ mb: 3 }} />

                {/* ALERTS */}

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
                    >
                        {success}
                    </Alert>
                )}

                {/* FORM */}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* PICKUP INFORMATION */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Pickup Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "reversePickupNumber",
                                "Reverse Pickup Number",
                                {
                                    helperText:
                                        "Leave blank if generated by the backend."
                                }
                            )}
                        </Grid>

                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "orderNumber",
                                "Sales Order Code",
                                { required: true }
                            )}
                        </Grid>

                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "pickupDate",
                                "Pickup Date",
                                {
                                    required: true,
                                    type: "date"
                                }
                            )}
                        </Grid>

                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "status",
                                "Pickup Status",
                                {
                                    required: true,
                                    select: true
                                }
                            )}
                            <Box />
                        </Grid>

                        <Grid xs={12}>
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
                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "customerName",
                                "Customer Name",
                                { required: true }
                            )}
                        </Grid>

                        <Grid xs={12} sm={6}>
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
                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "itemName",
                                "Item Name",
                                { required: true }
                            )}
                        </Grid>

                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "sku",
                                "Item SKU",
                                { required: true }
                            )}
                        </Grid>

                        <Grid xs={12} sm={6}>
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

                    {/* CARRIER INFORMATION */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Carrier and Cost Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "carrierName",
                                "Courier Provider"
                            )}
                        </Grid>

                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "trackingNumber",
                                "Tracking Number"
                            )}
                        </Grid>

                        <Grid xs={12} sm={6}>
                            {renderTextField(
                                "pickupCost",
                                "Pickup Cost (₹)",
                                { type: "number" }
                            )}
                        </Grid>

                        <Grid xs={12}>
                            {renderTextField(
                                "notes",
                                "Return Reason / Notes",
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
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
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
                            onClick={() =>
                                navigate("/reverse-pickups")
                            }
                            disabled={loading}
                        >
                            Back to List
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
            </Paper>
        </Box>
    );
};

export default ReversePickupCreate;
