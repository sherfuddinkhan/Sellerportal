// =========================================================
// WarehouseCreate.jsx
// Create New Warehouse
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// CONSTANTS
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    SellerId: "",
    CustomerId: "",
    WarehouseCode: "",
    WarehouseName: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    Country: "",
    PostalCode: "",
    ContactPerson: "",
    Phone: "",
    Email: "",
    IsActive: true
};

// =========================================================
// COMPONENT
// =========================================================

const WarehouseCreate = () => {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState(initialState);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (!formData.SellerId) {
            setError("Seller ID is required.");
            return;
        }

        if (!formData.CustomerId) {
            setError("Customer ID is required.");
            return;
        }

        if (!formData.WarehouseCode.trim()) {
            setError("Warehouse Code is required.");
            return;
        }

        if (!formData.WarehouseName.trim()) {
            setError("Warehouse Name is required.");
            return;
        }

        // -----------------------------------------------------
        // PAYLOAD
        // -----------------------------------------------------

        const payload = {
            ...formData,

            SellerId: Number(formData.SellerId),
            CustomerId: Number(formData.CustomerId),

            WarehouseCode:
                formData.WarehouseCode.trim(),

            WarehouseName:
                formData.WarehouseName.trim()
        };

        try {

            setLoading(true);

            const response = await fetch(
                `${SERVER_URL}/api/warehouse`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            const data =
                await response
                    .json()
                    .catch(() => ({}));

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.title ||
                    "Failed to create warehouse."
                );
            }

            setSuccess(
                "Warehouse created successfully."
            );

            // -------------------------------------------------
            // Redirect after successful creation
            // -------------------------------------------------

            setTimeout(() => {
                navigate("/warehouses");
            }, 800);

        } catch (err) {

            console.error(
                "Create Warehouse Error:",
                err
            );

            setError(
                err.message ||
                "Failed to create warehouse."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Create Warehouse
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/warehouses")
                    }
                >
                    Back
                </Button>

            </Box>

            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
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

            {/* =================================================
                FORM
            ================================================= */}

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 2
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* Seller ID */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Seller ID"
                                name="SellerId"
                                value={formData.SellerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Customer ID */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Customer ID"
                                name="CustomerId"
                                value={formData.CustomerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Warehouse Code */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Warehouse Code"
                                name="WarehouseCode"
                                value={formData.WarehouseCode}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Warehouse Name */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Warehouse Name"
                                name="WarehouseName"
                                value={formData.WarehouseName}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Address Line 1 */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 1"
                                name="AddressLine1"
                                value={formData.AddressLine1}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Address Line 2 */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                name="AddressLine2"
                                value={formData.AddressLine2}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* City */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="City"
                                name="City"
                                value={formData.City}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* State */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="State"
                                name="State"
                                value={formData.State}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Country */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Country"
                                name="Country"
                                value={formData.Country}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Postal Code */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Postal Code"
                                name="PostalCode"
                                value={formData.PostalCode}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Contact Person */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Contact Person"
                                name="ContactPerson"
                                value={formData.ContactPerson}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Phone */}

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="Phone"
                                value={formData.Phone}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Email */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Status */}

                        <Grid item xs={12} md={6}>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="IsActive"
                                        checked={
                                            formData.IsActive
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                }
                                label="Active Warehouse"
                            />

                        </Grid>

                        {/* Submit */}

                        <Grid item xs={12}>

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                            >

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        navigate(
                                            "/warehouses"
                                        )
                                    }
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<Save />}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Create Warehouse"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>
    );
};

export default WarehouseCreate;