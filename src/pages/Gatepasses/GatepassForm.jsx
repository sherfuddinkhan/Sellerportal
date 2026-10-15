
// =========================================================
// GatepassForm.jsx
// Create and Edit Gatepass
// =========================================================

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save,
    Refresh
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/Gatepass`;

// =========================================================
// INITIAL FORM VALUES
// Adjust fields to match your ASP.NET Gatepass DTO.
// =========================================================

const initialForm = {
    gatepassCode: "",
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    gatepassDate: "",
    purpose: "",
    remarks: "",
    status: "Pending"
};

// =========================================================
// HELPERS
// =========================================================

const getValue = (data, camelCase, pascalCase, fallback = "") =>
    data?.[camelCase] ?? data?.[pascalCase] ?? fallback;

const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (typeof data === "string") return data;

    return (
        data?.message ||
        data?.title ||
        error.message ||
        "An unexpected error occurred."
    );
};

// =========================================================
// COMPONENT
// =========================================================

const GatepassForm = ({
    mode: modeProp,
    gatepassId: gatepassIdProp,
    sellerId: sellerIdProp,
    customerId: customerIdProp,
    onSaved,
    onCancel
}) => {
    const navigate = useNavigate();
    const params = useParams();

    // -----------------------------------------------------
    // DETERMINE FORM MODE AND RECORD ID
    // -----------------------------------------------------

    const gatepassId =
        gatepassIdProp ??
        params.id ??
        params.gatepassId ??
        null;

    const mode =
        modeProp ||
        (gatepassId != null && gatepassId !== ""
            ? "edit"
            : "create");

    const isEdit = mode.toLowerCase() === "edit";

    // -----------------------------------------------------
    // SELLER / CUSTOMER CONTEXT
    // -----------------------------------------------------

    const sellerId =
        sellerIdProp ??
        localStorage.getItem("sellerId") ??
        localStorage.getItem("SellerId");

    const customerId =
        customerIdProp ??
        localStorage.getItem("customerId") ??
        localStorage.getItem("CustomerId");

    const hasValidScope =
        sellerId != null &&
        String(sellerId).trim() !== "" &&
        customerId != null &&
        String(customerId).trim() !== "";

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // -----------------------------------------------------
    // UPDATE FIELD
    // -----------------------------------------------------

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // -----------------------------------------------------
    // LOAD GATEPASS FOR EDIT MODE
    // -----------------------------------------------------

    useEffect(() => {
        let active = true;

        const loadGatepass = async () => {
            if (!isEdit) return;

            if (gatepassId == null || gatepassId === "") {
                setError(
                    "Gatepass ID is missing. Open this page using a valid record ID."
                );
                return;
            }

            if (!hasValidScope) {
                setError(
                    "Seller ID or Customer ID is missing."
                );
                return;
            }

            try {
                setLoading(true);
                setError("");
                setSuccess("");

                const response = await axios.get(
                    `${API_URL}/${encodeURIComponent(gatepassId)}` +
                    `/seller/${encodeURIComponent(sellerId)}` +
                    `/customer/${encodeURIComponent(customerId)}`
                );

                if (!active) return;

                const data = response.data?.data ?? response.data;

                setForm({
                    gatepassCode: getValue(
                        data,
                        "gatepassCode",
                        "GatepassCode"
                    ),
                    vehicleNumber: getValue(
                        data,
                        "vehicleNumber",
                        "VehicleNumber"
                    ),
                    driverName: getValue(
                        data,
                        "driverName",
                        "DriverName"
                    ),
                    driverPhone: getValue(
                        data,
                        "driverPhone",
                        "DriverPhone"
                    ),
                    gatepassDate: getValue(
                        data,
                        "gatepassDate",
                        "GatepassDate"
                    )?.toString().substring(0, 10) || "",
                    purpose: getValue(
                        data,
                        "purpose",
                        "Purpose"
                    ),
                    remarks: getValue(
                        data,
                        "remarks",
                        "Remarks"
                    ),
                    status: getValue(
                        data,
                        "status",
                        "Status",
                        "Pending"
                    )
                });
            } catch (err) {
                if (!active) return;

                console.error(
                    "LOAD GATEPASS ERROR:",
                    err.response?.status,
                    err.response?.data || err.message
                );

                setError(getErrorMessage(err));
            } finally {
                if (active) setLoading(false);
            }
        };

        loadGatepass();

        return () => {
            active = false;
        };
    }, [
        isEdit,
        gatepassId,
        sellerId,
        customerId,
        hasValidScope
    ]);

    // -----------------------------------------------------
    // SUBMIT FORM
    // -----------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!hasValidScope) {
            setError(
                "Seller ID or Customer ID is required before saving."
            );
            return;
        }

        if (isEdit && (gatepassId == null || gatepassId === "")) {
            setError("Cannot update Gatepass: record ID is missing.");
            return;
        }

        if (!form.vehicleNumber.trim()) {
            setError("Vehicle Number is required.");
            return;
        }

        if (!form.driverName.trim()) {
            setError("Driver Name is required.");
            return;
        }

        // Send only the form fields. IDs are supplied in the route.
        const payload = {
            gatepassCode: form.gatepassCode.trim(),
            vehicleNumber: form.vehicleNumber.trim(),
            driverName: form.driverName.trim(),
            driverPhone: form.driverPhone.trim(),
            gatepassDate: form.gatepassDate || null,
            purpose: form.purpose.trim(),
            remarks: form.remarks.trim(),
            status: form.status
        };

        try {
            setSaving(true);

            let response;

            if (isEdit) {
                response = await axios.put(
                    `${API_URL}/${encodeURIComponent(gatepassId)}` +
                    `/seller/${encodeURIComponent(sellerId)}` +
                    `/customer/${encodeURIComponent(customerId)}`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                setSuccess("Gatepass updated successfully.");
            } else {
                response = await axios.post(
                    `${API_URL}/seller/${encodeURIComponent(sellerId)}` +
                    `/customer/${encodeURIComponent(customerId)}`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                setSuccess("Gatepass created successfully.");
            }

            const savedRecord =
                response.data?.data ?? response.data;

            if (typeof onSaved === "function") {
                onSaved(savedRecord);
            } else {
                navigate("/gatepasses");
            }
        } catch (err) {
            console.error(
                isEdit
                    ? "UPDATE GATEPASS ERROR:"
                    : "CREATE GATEPASS ERROR:",
                err.response?.status,
                err.response?.data || err.message
            );

            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------------------------------
    // RESET FORM
    // -----------------------------------------------------

    const handleReset = () => {
        setError("");
        setSuccess("");

        if (!isEdit) {
            setForm(initialForm);
        }
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
    // RENDER
    // -----------------------------------------------------

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 1100, mx: "auto" }}>
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
                    <Typography variant="h5" fontWeight={700}>
                        {isEdit ? "Edit Gatepass" : "Create Gatepass"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {isEdit
                            ? "Update the selected Gatepass details."
                            : "Enter the information to create a new Gatepass."}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Back to List
                </Button>
            </Box>

            {/* MESSAGES */}
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ mb: 2, whiteSpace: "pre-wrap" }}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    onClose={() => setSuccess("")}
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>
            )}

            {/* FORM */}
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 250
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                        {/* SCOPE INFORMATION */}
                        <Typography variant="h6" fontWeight={600}>
                            Seller and Customer
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 0.5, mb: 3 }}>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Seller ID"
                                    value={sellerId ?? ""}
                                    disabled
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Customer ID"
                                    value={customerId ?? ""}
                                    disabled
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ mb: 3 }} />

                        {/* GATEPASS INFORMATION */}
                        <Typography variant="h6" fontWeight={600}>
                            Gatepass Information
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="gatepassCode"
                                    label="Gatepass Code"
                                    value={form.gatepassCode}
                                    onChange={handleChange}
                                    placeholder="Enter Gatepass code"
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="vehicleNumber"
                                    label="Vehicle Number"
                                    value={form.vehicleNumber}
                                    onChange={handleChange}
                                    placeholder="Enter vehicle number"
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="driverName"
                                    label="Driver Name"
                                    value={form.driverName}
                                    onChange={handleChange}
                                    placeholder="Enter driver name"
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="driverPhone"
                                    label="Driver Phone"
                                    value={form.driverPhone}
                                    onChange={handleChange}
                                    placeholder="Enter driver phone"
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="gatepassDate"
                                    label="Gatepass Date"
                                    type="date"
                                    value={form.gatepassDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    name="status"
                                    label="Status"
                                    value={form.status}
                                    onChange={handleChange}
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

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="purpose"
                                    label="Purpose"
                                    value={form.purpose}
                                    onChange={handleChange}
                                    placeholder="Enter purpose of Gatepass"
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    name="remarks"
                                    label="Remarks"
                                    value={form.remarks}
                                    onChange={handleChange}
                                    placeholder="Enter additional remarks"
                                />
                            </Grid>
                        </Grid>

                        {/* ACTIONS */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                flexWrap: "wrap",
                                gap: 1.5,
                                mt: 4
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={handleReset}
                                disabled={saving}
                            >
                                Reset
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
                                startIcon={<Save />}
                                disabled={saving || !hasValidScope}
                            >
                                {saving
                                    ? "Saving..."
                                    : isEdit
                                        ? "Update Gatepass"
                                        : "Create Gatepass"}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default GatepassForm;

