// =========================================================
// GatepassCreate.jsx
// =========================================================

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

import {
    Save,
    ArrowBack,
    RestartAlt,
    ConfirmationNumber
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/Gatepass";

// =========================================================
// GET ID FROM LOCAL STORAGE
// =========================================================

const getStoredId = (...keys) => {
    for (const key of keys) {
        const value = localStorage.getItem(key);

        if (value && value !== "null" && value !== "undefined") {
            return value;
        }
    }

    return "";
};

// =========================================================
// INITIAL FORM
// =========================================================

const initialFormData = {
    gatepassCode: "",
    gatepassDate: new Date().toISOString().slice(0, 10),
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    purpose: "",
    status: "Pending",
    remarks: ""
};

// =========================================================
// GATEPASS CREATE
// =========================================================

const GatepassCreate = ({
    sellerId: sellerIdProp,
    customerId: customerIdProp,
    onCreated,
    onCancel
}) => {
    const navigate = useNavigate();

    const sellerId =
        sellerIdProp ||
        getStoredId("sellerId", "SellerId");

    const customerId =
        customerIdProp ||
        getStoredId("customerId", "CustomerId");

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // -----------------------------------------------------
    // HANDLE FIELD CHANGE
    // -----------------------------------------------------

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // -----------------------------------------------------
    // RESET FORM
    // -----------------------------------------------------

    const handleReset = () => {
        setFormData({
            ...initialFormData,
            gatepassDate: new Date().toISOString().slice(0, 10)
        });

        setError("");
        setSuccess("");
    };

    // -----------------------------------------------------
    // CANCEL
    // -----------------------------------------------------

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
        } else {
            navigate("/gatepasses");
        }
    };

    // -----------------------------------------------------
    // VALIDATE FORM
    // -----------------------------------------------------

    const validateForm = () => {
        if (!sellerId) {
            return "Seller ID is missing. Please select or sign in to a seller account.";
        }

        if (!customerId) {
            return "Customer ID is missing. Please select a customer.";
        }

        if (!formData.vehicleNumber.trim()) {
            return "Please enter the vehicle number.";
        }

        if (!formData.driverName.trim()) {
            return "Please enter the driver name.";
        }

        if (!formData.gatepassDate) {
            return "Please select the gatepass date.";
        }

        if (
            formData.driverPhone.trim() &&
            !/^[+()\-\s\d]{7,20}$/.test(formData.driverPhone.trim())
        ) {
            return "Please enter a valid driver phone number.";
        }

        return "";
    };

    // -----------------------------------------------------
    // CREATE GATEPASS
    // -----------------------------------------------------

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
            gatepassCode: formData.gatepassCode.trim(),
            gatepassDate: formData.gatepassDate,
            vehicleNumber: formData.vehicleNumber.trim(),
            driverName: formData.driverName.trim(),
            driverPhone: formData.driverPhone.trim(),
            purpose: formData.purpose.trim(),
            status: formData.status,
            remarks: formData.remarks.trim()
        };

        // Remove optional empty fields.
        Object.keys(payload).forEach((key) => {
            if (payload[key] === "") {
                delete payload[key];
            }
        });

        try {
            setLoading(true);

            const endpoint =
                `${API_URL}/seller/${encodeURIComponent(sellerId)}` +
                `/customer/${encodeURIComponent(customerId)}`;

            const response = await axios.post(
                endpoint,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const createdGatepass = response.data;

            setSuccess("Gatepass created successfully.");

            if (typeof onCreated === "function") {
                onCreated(createdGatepass);
            } else {
                navigate("/gatepasses", {
                    state: {
                        successMessage: "Gatepass created successfully."
                    }
                });
            }
        } catch (err) {
            console.error(
                "Error creating gatepass:",
                err.response?.data || err.message
            );

            const responseData = err.response?.data;

            setError(
                typeof responseData === "string"
                    ? responseData
                    : responseData?.message ||
                      responseData?.title ||
                      responseData?.detail ||
                      err.message ||
                      "Unable to create gatepass. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------
    // UI
    // -----------------------------------------------------

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            {/* PAGE HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Create Gatepass
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Enter the vehicle, driver and gatepass details.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Back to Gatepasses
                </Button>
            </Box>

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
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            )}

            {/* FORM CARD */}

            <Card elevation={2} sx={{ borderRadius: 2 }}>
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <ConfirmationNumber color="primary" />

                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            Gatepass Information
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Fields marked with * are required.
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Grid container spacing={2.5}>
                            {/* GATEPASS CODE */}

                            <Grid xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Gatepass Code"
                                    name="gatepassCode"
                                    value={formData.gatepassCode}
                                    onChange={handleChange}
                                    placeholder="Enter gatepass code"
                                    helperText="Leave blank if the server generates the code."
                                    disabled={loading}
                                />
                            </Grid>

                            {/* DATE */}

                            <Grid xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Gatepass Date"
                                    name="gatepassDate"
                                    value={formData.gatepassDate}
                                    onChange={handleChange}
                                    disabled={loading}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true
                                        }
                                    }}
                                />
                            </Grid>

                            {/* VEHICLE NUMBER */}

                            <Grid xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Vehicle Number"
                                    name="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. TS09AB1234"
                                    inputProps={{
                                        maxLength: 20
                                    }}
                                    disabled={loading}
                                />
                            </Grid>

                            {/* DRIVER NAME */}

                            <Grid xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Driver Name"
                                    name="driverName"
                                    value={formData.driverName}
                                    onChange={handleChange}
                                    placeholder="Enter driver name"
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                    disabled={loading}
                                />
                            </Grid>

                            {/* DRIVER PHONE */}

                            <Grid xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Driver Phone"
                                    name="driverPhone"
                                    value={formData.driverPhone}
                                    onChange={handleChange}
                                    placeholder="Enter driver phone number"
                                    inputProps={{
                                        maxLength: 20
                                    }}
                                    disabled={loading}
                                />
                            </Grid>

                            {/* STATUS */}

                            <Grid xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <MenuItem value="Pending">
                                        Pending
                                    </MenuItem>

                                    <MenuItem value="Approved">
                                        Approved
                                    </MenuItem>

                                    <MenuItem value="Completed">
                                        Completed
                                    </MenuItem>

                                    <MenuItem value="Rejected">
                                        Rejected
                                    </MenuItem>

                                    <MenuItem value="Cancelled">
                                        Cancelled
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            {/* PURPOSE */}

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    label="Purpose"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    placeholder="Enter the purpose of the gatepass"
                                    multiline
                                    minRows={2}
                                    disabled={loading}
                                />
                            </Grid>

                            {/* REMARKS */}

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    label="Remarks"
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    placeholder="Additional notes or remarks"
                                    multiline
                                    minRows={3}
                                    disabled={loading}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* ACTION BUTTONS */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1.5,
                                flexWrap: "wrap"
                            }}
                        >
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
                                variant="outlined"
                                startIcon={<ArrowBack />}
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
                                {loading ? "Creating..." : "Create Gatepass"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default GatepassCreate;

