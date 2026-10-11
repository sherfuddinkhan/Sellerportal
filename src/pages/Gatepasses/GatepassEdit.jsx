// =========================================================
// GatepassEdit.jsx
// =========================================================

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
    Edit
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
// GET VALUE SUPPORTING CAMELCASE / PASCALCASE
// =========================================================

const getValue = (record, keys, fallback = "") => {
    for (const key of keys) {
        const value = record?.[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return fallback;
};

// =========================================================
// UNWRAP API RESPONSE
// =========================================================

const unwrapGatepass = (responseData) => {
    if (!responseData) return null;

    if (Array.isArray(responseData)) {
        return responseData[0] ?? null;
    }

    return (
        responseData.gatepass ??
        responseData.Gatepass ??
        responseData.gatePass ??
        responseData.GatePass ??
        responseData.data?.gatepass ??
        responseData.data?.Gatepass ??
        responseData.data ??
        responseData
    );
};

// =========================================================
// FORM INITIAL VALUES
// =========================================================

const initialFormData = {
    gatepassCode: "",
    gatepassDate: "",
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    purpose: "",
    status: "Pending",
    remarks: ""
};

// =========================================================
// NORMALIZE DATE FOR DATE INPUT
// =========================================================

const normalizeDate = (value) => {
    if (!value) return "";

    const text = String(value);

    // Preserve the date portion of an ISO date/time.
    if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
        return text.slice(0, 10);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// =========================================================
// GATEPASS EDIT
// =========================================================

const GatepassEdit = ({
    gatepassId: gatepassIdProp,
    sellerId: sellerIdProp,
    customerId: customerIdProp,
    onUpdated,
    onCancel
}) => {
    const navigate = useNavigate();
    const params = useParams();

    const gatepassId =
        gatepassIdProp ||
        params.id ||
        params.gatepassId;

    const sellerId =
        sellerIdProp ||
        getStoredId("sellerId", "SellerId");

    const customerId =
        customerIdProp ||
        getStoredId("customerId", "CustomerId");

    const [formData, setFormData] = useState(initialFormData);
    const [originalData, setOriginalData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // -----------------------------------------------------
    // LOAD EXISTING GATEPASS
    // -----------------------------------------------------

    const fetchGatepass = useCallback(async () => {
        if (!gatepassId) {
            setError(
                "Gatepass ID is missing. Open this page using a valid gatepass record ID."
            );
            setLoading(false);
            return;
        }

        if (!sellerId || !customerId) {
            setError(
                "Seller ID or Customer ID is missing. Please select the seller and customer first."
            );
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const endpoint =
                `${API_URL}/${encodeURIComponent(gatepassId)}` +
                `/seller/${encodeURIComponent(sellerId)}` +
                `/customer/${encodeURIComponent(customerId)}`;

            const response = await axios.get(endpoint);
            const gatepass = unwrapGatepass(response.data);

            if (!gatepass) {
                setError("Gatepass record was not found.");
                setOriginalData(null);
                return;
            }

            const loadedData = {
                gatepassCode: getValue(gatepass, [
                    "gatepassCode",
                    "GatepassCode",
                    "gatepassNumber",
                    "GatepassNumber",
                    "gatePassCode",
                    "GatePassCode"
                ]),

                gatepassDate: normalizeDate(
                    getValue(gatepass, [
                        "gatepassDate",
                        "GatepassDate",
                        "gatePassDate",
                        "GatePassDate",
                        "date",
                        "Date"
                    ])
                ),

                vehicleNumber: getValue(gatepass, [
                    "vehicleNumber",
                    "VehicleNumber",
                    "vehicleNo",
                    "VehicleNo"
                ]),

                driverName: getValue(gatepass, [
                    "driverName",
                    "DriverName"
                ]),

                driverPhone: getValue(gatepass, [
                    "driverPhone",
                    "DriverPhone",
                    "driverMobile",
                    "DriverMobile"
                ]),

                purpose: getValue(gatepass, [
                    "purpose",
                    "Purpose"
                ]),

                status: getValue(gatepass, [
                    "status",
                    "Status",
                    "gatepassStatus",
                    "GatepassStatus"
                ], "Pending"),

                remarks: getValue(gatepass, [
                    "remarks",
                    "Remarks"
                ])
            };

            setFormData(loadedData);
            setOriginalData(loadedData);
        } catch (err) {
            console.error(
                "Error loading gatepass:",
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
                      "Unable to load gatepass details."
            );
        } finally {
            setLoading(false);
        }
    }, [gatepassId, sellerId, customerId]);

    // -----------------------------------------------------
    // LOAD ON PAGE OPEN
    // -----------------------------------------------------

    useEffect(() => {
        fetchGatepass();
    }, [fetchGatepass]);

    // -----------------------------------------------------
    // HANDLE FIELD CHANGES
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
    // RESET TO LOADED VALUES
    // -----------------------------------------------------

    const handleReset = () => {
        if (originalData) {
            setFormData({ ...originalData });
        }

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
        if (!gatepassId) {
            return "Gatepass ID is missing.";
        }

        if (!sellerId || !customerId) {
            return "Seller ID or Customer ID is missing.";
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
    // UPDATE GATEPASS
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
            setSaving(true);

            const endpoint =
                `${API_URL}/${encodeURIComponent(gatepassId)}` +
                `/seller/${encodeURIComponent(sellerId)}` +
                `/customer/${encodeURIComponent(customerId)}`;

            const response = await axios.put(
                endpoint,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            setSuccess("Gatepass updated successfully.");

            if (typeof onUpdated === "function") {
                onUpdated(response.data);
            } else {
                navigate("/gatepasses", {
                    state: {
                        successMessage: "Gatepass updated successfully."
                    }
                });
            }
        } catch (err) {
            console.error(
                "Error updating gatepass:",
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
                      "Unable to update gatepass. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------------------------------
    // LOADING STATE
    // -----------------------------------------------------

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading gatepass information...
                </Typography>
            </Box>
        );
    }

    // -----------------------------------------------------
    // PAGE UI
    // -----------------------------------------------------

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Edit Gatepass
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update the gatepass information below.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Back to Gatepasses
                </Button>
            </Box>

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
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            )}

            {/* FORM */}

            <Card elevation={2} sx={{ borderRadius: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 2
                    }}
                >
                    <Edit color="primary" />

                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            Gatepass Information
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Gatepass ID: {gatepassId}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    {originalData ? (
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <Grid container spacing={2.5}>
                                {/* GATEPASS CODE */}

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Gatepass Code"
                                        name="gatepassCode"
                                        value={formData.gatepassCode}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* DATE */}

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        type="date"
                                        label="Gatepass Date"
                                        name="gatepassDate"
                                        value={formData.gatepassDate}
                                        onChange={handleChange}
                                        disabled={saving}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* VEHICLE */}

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Vehicle Number"
                                        name="vehicleNumber"
                                        value={formData.vehicleNumber}
                                        onChange={handleChange}
                                        inputProps={{
                                            maxLength: 20
                                        }}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* DRIVER */}

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Driver Name"
                                        name="driverName"
                                        value={formData.driverName}
                                        onChange={handleChange}
                                        inputProps={{
                                            maxLength: 100
                                        }}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* PHONE */}

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Driver Phone"
                                        name="driverPhone"
                                        value={formData.driverPhone}
                                        onChange={handleChange}
                                        inputProps={{
                                            maxLength: 20
                                        }}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* STATUS */}

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        disabled={saving}
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

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Purpose"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        multiline
                                        minRows={2}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* REMARKS */}

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Remarks"
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        multiline
                                        minRows={3}
                                        disabled={saving}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            {/* ACTIONS */}

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
                                    disabled={saving}
                                >
                                    Reset Changes
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBack />}
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        saving
                                            ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            )
                                            : <Save />
                                    }
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Alert severity="warning">
                            Gatepass details could not be loaded. Check the
                            error message above and try again.
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={fetchGatepass}
                                >
                                    Retry
                                </Button>
                            </Box>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default GatepassEdit;

