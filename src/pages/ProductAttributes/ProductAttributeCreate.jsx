// =========================================================
// ProductAttributeCreate.jsx
// Create Product Attribute
// Uses Node server.js - NO apiService
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Save,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductAttributeCreate = () => {

    const navigate = useNavigate();

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        ProductId: "",
        SellerId: "",
        CustomerId: "",
        AttributeName: "",
        AttributeValue: "",
        IsActive: true,
        CreatedDate: new Date().toISOString(),
    });

    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setError("");
    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!formData.ProductId) {
            setError("Product ID is required.");
            return false;
        }

        if (!formData.SellerId) {
            setError("Seller ID is required.");
            return false;
        }

        if (!formData.CustomerId) {
            setError("Customer ID is required.");
            return false;
        }

        if (!formData.AttributeName.trim()) {
            setError("Attribute name is required.");
            return false;
        }

        if (!formData.AttributeValue.trim()) {
            setError("Attribute value is required.");
            return false;
        }

        return true;
    };

    // =====================================================
    // CREATE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {

            const payload = {
                ProductId: Number(formData.ProductId),

                SellerId: Number(formData.SellerId),

                CustomerId: Number(formData.CustomerId),

                AttributeName:
                    formData.AttributeName.trim(),

                AttributeValue:
                    formData.AttributeValue.trim(),

                IsActive:
                    Boolean(formData.IsActive),

                CreatedDate:
                    formData.CreatedDate
                        ? new Date(
                            formData.CreatedDate
                        ).toISOString()
                        : new Date().toISOString(),
            };

            console.log(
                "Creating Product Attribute:",
                payload
            );

            const response = await fetch(
                `${SERVER_URL}/api/product-attributes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json()
                .catch(() => null);

            console.log(
                "Create Product Attribute Response:",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to create product attribute."
                );
            }

            setSuccess(true);

            // =================================================
            // REDIRECT TO LIST
            // =================================================

            setTimeout(() => {
                navigate("/product-attributes");
            }, 800);

        }
        catch (err) {

            console.error(
                "Create Product Attribute Error:",
                err
            );

            setError(
                err.message ||
                "Failed to create product attribute."
            );

        }
        finally {

            setLoading(false);
        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {
        navigate("/product-attributes");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                p: 3,
                maxWidth: 1000,
                mx: "auto",
            }}
        >

            {/* =================================================
                HEADER
                ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Create Product Attribute
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add a new attribute for a product.
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                >
                    Back to List
                </Button>

            </Box>

            {/* =================================================
                ERROR
                ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* =================================================
                FORM
                ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                    borderRadius: 2,
                }}
            >

                <form onSubmit={handleSubmit}>

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =====================================
                            PRODUCT ID
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Product ID"
                                name="ProductId"
                                type="number"
                                value={formData.ProductId}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            SELLER ID
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Seller ID"
                                name="SellerId"
                                type="number"
                                value={formData.SellerId}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            CUSTOMER ID
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Customer ID"
                                name="CustomerId"
                                type="number"
                                value={formData.CustomerId}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            ATTRIBUTE NAME
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Attribute Name"
                                name="AttributeName"
                                value={formData.AttributeName}
                                onChange={handleChange}
                                placeholder="Example: Bluetooth Version"
                            />

                        </Grid>

                        {/* =====================================
                            ATTRIBUTE VALUE
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                label="Attribute Value"
                                name="AttributeValue"
                                value={formData.AttributeValue}
                                onChange={handleChange}
                                placeholder="Example: Bluetooth 5.3"
                            />

                        </Grid>

                        {/* =====================================
                            ACTIVE
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            formData.IsActive
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        name="IsActive"
                                    />
                                }
                                label="Active"
                            />

                        </Grid>

                        {/* =====================================
                            CREATED DATE
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Created Date"
                                name="CreatedDate"
                                type="datetime-local"
                                value={
                                    formData.CreatedDate
                                        ? new Date(
                                            formData.CreatedDate
                                        )
                                            .toISOString()
                                            .slice(
                                                0,
                                                16
                                            )
                                        : ""
                                }
                                onChange={(event) => {

                                    const value =
                                        event.target.value;

                                    setFormData(
                                        (previous) => ({
                                            ...previous,
                                            CreatedDate:
                                                value
                                                    ? new Date(
                                                        value
                                                    ).toISOString()
                                                    : null,
                                        })
                                    );
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            BUTTONS
                            ===================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: 2,
                                    mt: 2,
                                    flexWrap: "wrap",
                                }}
                            >

                                <Button
                                    variant="outlined"
                                    onClick={
                                        handleCancel
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
                                        : "Create Attribute"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </form>

            </Paper>

            {/* =================================================
                SUCCESS
                ================================================= */}

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                message="Product attribute created successfully."
            />

        </Box>
    );
};

export default ProductAttributeCreate;

