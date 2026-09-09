// =========================================================
// ProductImageCreate.jsx
// Create Product Image
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    Grid,
    Paper,
    Switch,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// INITIAL FORM
// =========================================================

const INITIAL_FORM = {

    SellerId: "6",

    CustomerId: "3",

    ProductId: "",

    ImageSize: "125000",

    ImageUrl: "",

    DisplayOrder: "1",

    IsPrimary: false,

    IsActive: true
};

// =========================================================
// PRODUCT IMAGE CREATE
// =========================================================

const ProductImageCreate = () => {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [formData, setFormData] = useState(
        INITIAL_FORM
    );

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // HANDLE SWITCH CHANGE
    // =====================================================

    const handleSwitchChange = (event) => {

        const {
            name,
            checked
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: checked
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        // -------------------------------------------------
        // SELLER ID
        // -------------------------------------------------

        if (
            !formData.SellerId ||
            Number(formData.SellerId) <= 0
        ) {

            setError(
                "Please enter a valid Seller ID."
            );

            return false;
        }

        // -------------------------------------------------
        // CUSTOMER ID
        // -------------------------------------------------

        if (
            !formData.CustomerId ||
            Number(formData.CustomerId) <= 0
        ) {

            setError(
                "Please enter a valid Customer ID."
            );

            return false;
        }

        // -------------------------------------------------
        // PRODUCT ID
        // -------------------------------------------------

        if (
            !formData.ProductId ||
            Number(formData.ProductId) <= 0
        ) {

            setError(
                "Please enter a valid Product ID."
            );

            return false;
        }

        // -------------------------------------------------
        // IMAGE SIZE
        // -------------------------------------------------

        if (
            !formData.ImageSize ||
            Number(formData.ImageSize) < 0
        ) {

            setError(
                "Please enter a valid image size."
            );

            return false;
        }

        // -------------------------------------------------
        // IMAGE URL
        // -------------------------------------------------

        if (!formData.ImageUrl.trim()) {

            setError(
                "Image URL is required."
            );

            return false;
        }

        // -------------------------------------------------
        // DISPLAY ORDER
        // -------------------------------------------------

        if (
            formData.DisplayOrder === "" ||
            Number(formData.DisplayOrder) < 0
        ) {

            setError(
                "Please enter a valid display order."
            );

            return false;
        }

        return true;
    };

    // =====================================================
    // CREATE PRODUCT IMAGE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!validateForm()) {
            return;
        }

        try {

            setSaving(true);

            // =================================================
            // API PAYLOAD
            // =================================================

            const payload = {

                sellerId:
                    Number(formData.SellerId),

                customerId:
                    Number(formData.CustomerId),

                productId:
                    Number(formData.ProductId),

                imageSize:
                    Number(formData.ImageSize),

                imageUrl:
                    formData.ImageUrl.trim(),

                displayOrder:
                    Number(formData.DisplayOrder),

                isPrimary:
                    Boolean(formData.IsPrimary),

                isActive:
                    Boolean(formData.IsActive)
            };

            // -------------------------------------------------
            // DEBUG
            // -------------------------------------------------

            console.log(
                "========================================"
            );

            console.log(
                "CREATE PRODUCT IMAGE"
            );

            console.log(
                "POST URL:",
                `${SERVER_URL}/api/product-images`
            );

            console.log(
                "Payload:",
                payload
            );

            console.log(
                "========================================"
            );

            // =================================================
            // POST REQUEST
            // =================================================

            const response = await fetch(
                `${SERVER_URL}/api/product-images`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            // =================================================
            // READ RESPONSE
            // =================================================

            const responseText =
                await response.text();

            let responseData = null;

            try {

                responseData =
                    responseText
                        ? JSON.parse(responseText)
                        : null;

            } catch {

                responseData = null;
            }

            // -------------------------------------------------
            // DEBUG RESPONSE
            // -------------------------------------------------

            console.log(
                "CREATE RESPONSE STATUS:",
                response.status
            );

            console.log(
                "CREATE RESPONSE:",
                responseData || responseText
            );

            // =================================================
            // ERROR RESPONSE
            // =================================================

            if (!response.ok) {

                let message =
                    "Failed to create product image.";

                if (
                    responseData?.message
                ) {

                    message =
                        responseData.message;

                } else if (
                    responseData?.title
                ) {

                    message =
                        responseData.title;

                } else if (
                    responseData?.errors
                ) {

                    const validationErrors =
                        Object.values(
                            responseData.errors
                        )
                            .flat()
                            .join(" ");

                    if (validationErrors) {

                        message =
                            validationErrors;
                    }

                } else if (
                    typeof responseText === "string" &&
                    responseText.trim()
                ) {

                    message =
                        responseText;
                }

                throw new Error(message);
            }

            // =================================================
            // SUCCESS
            // =================================================

            console.log(
                "Product Image Created Successfully:",
                responseData
            );

            setSuccess(
                "Product image created successfully."
            );

            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/product-images"
                );

            }, 1000);

        } catch (err) {

            console.error(
                "========================================"
            );

            console.error(
                "CREATE PRODUCT IMAGE ERROR"
            );

            console.error(
                err
            );

            console.error(
                "========================================"
            );

            setError(
                err.message ||
                "Failed to create product image."
            );

        } finally {

            setSaving(false);
        }
    };

    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(
            "/product-images"
        );
    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap"
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Create Product Image
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Add a new image for a product
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={saving}
                >
                    Back
                </Button>

            </Box>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>

            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

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
                elevation={2}
                sx={{
                    p: 3
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =================================================
                            SELLER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="SellerId"
                                label="Seller ID"
                                value={
                                    formData.SellerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                                helperText="Seller associated with this image"
                            />

                        </Grid>

                        {/* =================================================
                            CUSTOMER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="CustomerId"
                                label="Customer ID"
                                value={
                                    formData.CustomerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                                helperText="Customer associated with this image"
                            />

                        </Grid>

                        {/* =================================================
                            PRODUCT ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="ProductId"
                                label="Product ID"
                                value={
                                    formData.ProductId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                                helperText="Enter an existing Product ID"
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE SIZE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="ImageSize"
                                label="Image Size"
                                value={
                                    formData.ImageSize
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0
                                }}
                                helperText="Image size in bytes"
                            />

                        </Grid>

                        {/* =================================================
                            DISPLAY ORDER
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                name="DisplayOrder"
                                label="Display Order"
                                value={
                                    formData.DisplayOrder
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0
                                }}
                                helperText="Order in which the image is displayed"
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE URL
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                required
                                name="ImageUrl"
                                label="Image URL"
                                value={
                                    formData.ImageUrl
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="https://picsum.photos/seed/product6/800/800"
                                helperText="Enter the complete URL of the product image"
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE PREVIEW
                        ================================================= */}

                        {formData.ImageUrl.trim() && (

                            <Grid
                                item
                                xs={12}
                            >

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        textAlign: "center"
                                    }}
                                >

                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 2
                                        }}
                                    >
                                        Image Preview
                                    </Typography>

                                    <Box
                                        component="img"
                                        src={
                                            formData.ImageUrl
                                        }
                                        alt="Product Preview"
                                        sx={{
                                            maxWidth: "100%",
                                            width: 300,
                                            height: 300,
                                            objectFit: "contain",
                                            borderRadius: 1
                                        }}
                                        onError={(event) => {

                                            event.currentTarget.style.display =
                                                "none";

                                        }}
                                    />

                                </Paper>

                            </Grid>

                        )}

                        {/* =================================================
                            PRIMARY IMAGE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <FormControlLabel
                                control={

                                    <Switch
                                        name="IsPrimary"
                                        checked={
                                            Boolean(
                                                formData.IsPrimary
                                            )
                                        }
                                        onChange={
                                            handleSwitchChange
                                        }
                                    />

                                }
                                label="Primary Image"
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                            >
                                Mark this image as the primary
                                product image.
                            </Typography>

                        </Grid>

                        {/* =================================================
                            ACTIVE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <FormControlLabel
                                control={

                                    <Switch
                                        name="IsActive"
                                        checked={
                                            Boolean(
                                                formData.IsActive
                                            )
                                        }
                                        onChange={
                                            handleSwitchChange
                                        }
                                    />

                                }
                                label="Active"
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                            >
                                Active images are available
                                for use.
                            </Typography>

                        </Grid>

                        {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    mt: 2
                                }}
                            >

                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={

                                        saving ? (

                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />

                                        ) : (

                                            <Save />

                                        )

                                    }
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Create Image"}

                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>
    );
};

export default ProductImageCreate;