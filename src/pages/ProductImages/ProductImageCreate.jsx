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
    MenuItem,
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
    ProductId: "",
    ImageUrl: "",
    ImageName: "",
    ImageType: "Main",
    IsPrimary: false,
    IsActive: true
};

// =========================================================
// PRODUCT IMAGE CREATE
// =========================================================

const ProductImageCreate = () => {

    const navigate = useNavigate();

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [formData, setFormData] = useState(
        INITIAL_FORM
    );

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // -----------------------------------------------------
    // HANDLE INPUT CHANGE
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // HANDLE SWITCH CHANGE
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // VALIDATE FORM
    // -----------------------------------------------------

    const validateForm = () => {

        if (
            !formData.ProductId ||
            Number(formData.ProductId) <= 0
        ) {

            setError(
                "Please enter a valid Product ID."
            );

            return false;
        }

        if (!formData.ImageName.trim()) {

            setError(
                "Image Name is required."
            );

            return false;
        }

        if (!formData.ImageUrl.trim()) {

            setError(
                "Image URL is required."
            );

            return false;
        }

        if (!formData.ImageType.trim()) {

            setError(
                "Image Type is required."
            );

            return false;
        }

        return true;
    };

    // -----------------------------------------------------
    // CREATE PRODUCT IMAGE
    // -----------------------------------------------------

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {

            setSaving(true);

            const payload = {
                ProductId: Number(
                    formData.ProductId
                ),

                ImageUrl:
                    formData.ImageUrl.trim(),

                ImageName:
                    formData.ImageName.trim(),

                ImageType:
                    formData.ImageType,

                IsPrimary:
                    Boolean(formData.IsPrimary),

                IsActive:
                    Boolean(formData.IsActive)
            };

            console.log(
                "Creating Product Image:",
                payload
            );

            const response = await fetch(
                `${SERVER_URL}/api/product-images`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {

                let message =
                    "Failed to create product image.";

                try {

                    const errorData =
                        await response.json();

                    message =
                        errorData?.message ||
                        errorData?.title ||
                        message;

                } catch {
                    // Ignore invalid response
                }

                throw new Error(message);
            }

            const data =
                await response.json();

            console.log(
                "Product Image Created:",
                data
            );

            setSuccess(
                "Product image created successfully."
            );

            // -------------------------------------------------
            // REDIRECT AFTER SUCCESS
            // -------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/product-images"
                );

            }, 1000);

        } catch (err) {

            console.error(
                "Create Product Image Error:",
                err
            );

            setError(
                err.message ||
                "Failed to create product image."
            );

        } finally {

            setSaving(false);
        }
    };

    // -----------------------------------------------------
    // BACK
    // -----------------------------------------------------

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
                                helperText="Enter the Product ID associated with this image"
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE NAME
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                name="ImageName"
                                label="Image Name"
                                value={
                                    formData.ImageName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="product-image.jpg"
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE TYPE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
                                select
                                name="ImageType"
                                label="Image Type"
                                value={
                                    formData.ImageType
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="Main">
                                    Main
                                </MenuItem>

                                <MenuItem value="Gallery">
                                    Gallery
                                </MenuItem>

                                <MenuItem value="Thumbnail">
                                    Thumbnail
                                </MenuItem>

                            </TextField>

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
                                placeholder="https://example.com/image.jpg"
                                helperText="Enter the complete URL of the product image"
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE PREVIEW
                        ================================================= */}

                        {formData.ImageUrl && (

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
                                        alt={
                                            formData.ImageName ||
                                            "Product Image"
                                        }
                                        sx={{
                                            maxWidth: "100%",
                                            maxHeight: 300,
                                            objectFit: "contain",
                                            borderRadius: 1
                                        }}
                                        onError={(
                                            event
                                        ) => {

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
                                    onClick={
                                        handleBack
                                    }
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

