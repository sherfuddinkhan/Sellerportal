// =========================================================
// VendorItemMasterCreate.jsx
// =========================================================

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import {
    Save,
    ArrowBack,
    RestartAlt
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = "http://localhost:5000";

const VENDOR_ITEM_MASTER_API =
    `${API_BASE_URL}/api/VendorItemMaster`;

// =========================================================
// INITIAL FORM DATA
// =========================================================

const INITIAL_FORM_DATA = {
    itemCode: "",
    itemName: "",
    vendorId: "",
    description: "",
    unitOfMeasure: "",
    unitPrice: "",
    taxRate: "",
    status: "Active"
};

// =========================================================
// VENDOR ITEM MASTER CREATE
// =========================================================

const VendorItemMasterCreate = ({
    onCreated,
    onClose,
    initialData
}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => ({
        ...INITIAL_FORM_DATA,
        ...(initialData || {})
    }));

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    // =====================================================
    // HANDLE INPUT CHANGE
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
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {
        const newErrors = {};

        if (!formData.itemCode.trim()) {
            newErrors.itemCode = "Item code is required.";
        }

        if (!formData.itemName.trim()) {
            newErrors.itemName = "Item name is required.";
        }

        if (
            formData.vendorId === "" ||
            !Number.isInteger(Number(formData.vendorId)) ||
            Number(formData.vendorId) <= 0
        ) {
            newErrors.vendorId = "Enter a valid vendor ID.";
        }

        if (!formData.unitOfMeasure.trim()) {
            newErrors.unitOfMeasure =
                "Unit of measure is required.";
        }

        if (
            formData.unitPrice === "" ||
            !Number.isFinite(Number(formData.unitPrice)) ||
            Number(formData.unitPrice) < 0
        ) {
            newErrors.unitPrice =
                "Enter a valid unit price.";
        }

        if (
            formData.taxRate !== "" &&
            (
                !Number.isFinite(Number(formData.taxRate)) ||
                Number(formData.taxRate) < 0 ||
                Number(formData.taxRate) > 100
            )
        ) {
            newErrors.taxRate =
                "Tax rate must be between 0 and 100.";
        }

        if (!formData.status) {
            newErrors.status = "Select a status.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // SHOW NOTIFICATION
    // =====================================================

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            severity,
            message
        });
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const handleReset = () => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
    };

    // =====================================================
    // CREATE VENDOR ITEM MASTER
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showNotification(
                "Please correct the highlighted fields.",
                "error"
            );
            return;
        }

        try {
            setLoading(true);

            const payload = {
                itemCode: formData.itemCode.trim(),
                itemName: formData.itemName.trim(),
                vendorId: Number(formData.vendorId),
                description: formData.description.trim(),
                unitOfMeasure: formData.unitOfMeasure.trim(),
                unitPrice: Number(formData.unitPrice),
                taxRate:
                    formData.taxRate === ""
                        ? 0
                        : Number(formData.taxRate),
                status: formData.status
            };

            const response = await axios.post(
                VENDOR_ITEM_MASTER_API,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const createdItem = response.data;

            showNotification(
                "Vendor item master created successfully.",
                "success"
            );

            if (typeof onCreated === "function") {
                onCreated(createdItem);
            } else if (typeof onClose === "function") {
                onClose();
            } else {
                navigate("/vendor-item-masters");
            }
        } catch (error) {
            console.error(
                "CREATE VENDOR ITEM MASTER ERROR:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.response?.data?.detail ||
                (typeof error.response?.data === "string"
                    ? error.response.data
                    : null) ||
                error.message ||
                "Unable to create vendor item master.";

            showNotification(message, "error");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    p: { xs: 2, md: 3 },
                    borderRadius: 2
                }}
            >
                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    mb={2}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Create Vendor Item Master
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Enter the vendor item details below.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => {
                            if (typeof onClose === "function") {
                                onClose();
                            } else {
                                navigate("/vendor-item-masters");
                            }
                        }}
                        disabled={loading}
                    >
                        Back
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* ========================================= */}
                {/* FORM */}
                {/* ========================================= */}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Grid container spacing={2.5}>
                        {/* ITEM CODE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Item Code"
                                name="itemCode"
                                value={formData.itemCode}
                                onChange={handleChange}
                                error={Boolean(errors.itemCode)}
                                helperText={errors.itemCode}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 100
                                }}
                            />
                        </Grid>

                        {/* ITEM NAME */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Item Name"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                error={Boolean(errors.itemName)}
                                helperText={errors.itemName}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 200
                                }}
                            />
                        </Grid>

                        {/* VENDOR ID */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Vendor ID"
                                name="vendorId"
                                value={formData.vendorId}
                                onChange={handleChange}
                                error={Boolean(errors.vendorId)}
                                helperText={
                                    errors.vendorId ||
                                    "Enter the existing vendor ID."
                                }
                                disabled={loading}
                                inputProps={{
                                    min: 1,
                                    step: 1
                                }}
                            />
                        </Grid>

                        {/* UNIT OF MEASURE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Unit of Measure"
                                name="unitOfMeasure"
                                placeholder="e.g. PCS, KG, LTR"
                                value={formData.unitOfMeasure}
                                onChange={handleChange}
                                error={Boolean(
                                    errors.unitOfMeasure
                                )}
                                helperText={errors.unitOfMeasure}
                                disabled={loading}
                            />
                        </Grid>

                        {/* UNIT PRICE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Unit Price"
                                name="unitPrice"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                error={Boolean(errors.unitPrice)}
                                helperText={errors.unitPrice}
                                disabled={loading}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* TAX RATE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Tax Rate (%)"
                                name="taxRate"
                                value={formData.taxRate}
                                onChange={handleChange}
                                error={Boolean(errors.taxRate)}
                                helperText={
                                    errors.taxRate ||
                                    "Enter a percentage from 0 to 100."
                                }
                                disabled={loading}
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* STATUS */}

                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                required
                                error={Boolean(errors.status)}
                                disabled={loading}
                            >
                                <InputLabel id="vendor-item-status-label">
                                    Status
                                </InputLabel>

                                <Select
                                    labelId="vendor-item-status-label"
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Active">
                                        Active
                                    </MenuItem>

                                    <MenuItem value="Inactive">
                                        Inactive
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* DESCRIPTION */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 1000
                                }}
                            />
                        </Grid>

                        {/* ================================= */}
                        {/* ACTION BUTTONS */}
                        {/* ================================= */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                                flexWrap="wrap"
                                mt={2}
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
                                        : "Create Item"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* ============================================= */}
            {/* NOTIFICATION */}
            {/* ============================================= */}

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                onClose={(event, reason) => {
                    if (reason === "clickaway") {
                        return;
                    }

                    setNotification((previous) => ({
                        ...previous,
                        open: false
                    }));
                }}
            >
                <Alert
                    severity={notification.severity}
                    variant="filled"
                    onClose={() => {
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }));
                    }}
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default VendorItemMasterCreate;

