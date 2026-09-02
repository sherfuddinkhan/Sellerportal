// =========================================================
// ProductImageEdit.jsx
// Edit Product Image
// =========================================================

import React, { useEffect, useState } from "react";
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
    Save,
    ArrowBack
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
    ProductImageId: "",
    ProductId: "",
    ImageUrl: "",
    ImageName: "",
    ImageType: "Main",
    IsPrimary: false,
    IsActive: true
};

// =========================================================
// PRODUCT IMAGE EDIT
// =========================================================

const ProductImageEdit = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [formData, setFormData] = useState(EMPTY_FORM);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // -----------------------------------------------------
    // LOAD PRODUCT IMAGE
    // -----------------------------------------------------

    useEffect(() => {
        loadProductImage();
    }, [id]);

    const loadProductImage = async () => {

        if (!id) {
            setError("Product Image ID is missing.");
            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-images/${id}`
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to load product image. Status: ${response.status}`
                );
            }

            const data = await response.json();

            const image = data?.data || data?.item || data;

            if (!image) {
                throw new Error("Product image not found.");
            }

            setFormData({
                ProductImageId:
                    image.ProductImageId ??
                    image.productImageId ??
                    id,

                ProductId:
                    image.ProductId ??
                    image.productId ??
                    "",

                ImageUrl:
                    image.ImageUrl ??
                    image.imageUrl ??
                    "",

                ImageName:
                    image.ImageName ??
                    image.imageName ??
                    "",

                ImageType:
                    image.ImageType ??
                    image.imageType ??
                    "Main",

                IsPrimary:
                    image.IsPrimary ??
                    image.isPrimary ??
                    false,

                IsActive:
                    image.IsActive ??
                    image.isActive ??
                    true
            });

        } catch (err) {

            console.error(
                "Load Product Image Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load product image."
            );

        } finally {

            setLoading(false);
        }
    };

    // -----------------------------------------------------
    // HANDLE INPUT
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
    };

    // -----------------------------------------------------
    // HANDLE SWITCH
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
    };

    // -----------------------------------------------------
    // VALIDATE
    // -----------------------------------------------------

    const validateForm = () => {

        if (
            !formData.ProductId ||
            Number(formData.ProductId) <= 0
        ) {
            setError("Product ID is required.");
            return false;
        }

        if (!formData.ImageName.trim()) {
            setError("Image Name is required.");
            return false;
        }

        if (!formData.ImageUrl.trim()) {
            setError("Image URL is required.");
            return false;
        }

        if (!formData.ImageType.trim()) {
            setError("Image Type is required.");
            return false;
        }

        return true;
    };

    // -----------------------------------------------------
    // SAVE
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
                ProductId: Number(formData.ProductId),
                ImageUrl: formData.ImageUrl.trim(),
                ImageName: formData.ImageName.trim(),
                ImageType: formData.ImageType,
                IsPrimary: Boolean(formData.IsPrimary),
                IsActive: Boolean(formData.IsActive)
            };

            const response = await fetch(
                `${SERVER_URL}/api/product-images/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {

                let errorMessage =
                    "Failed to update product image.";

                try {

                    const errorData =
                        await response.json();

                    errorMessage =
                        errorData?.message ||
                        errorData?.title ||
                        errorMessage;

                } catch {
                    // Ignore invalid error JSON
                }

                throw new Error(errorMessage);
            }

            setSuccess(
                "Product image updated successfully."
            );

            setTimeout(() => {
                navigate("/product-images");
            }, 1000);

        } catch (err) {

            console.error(
                "Update Product Image Error:",
                err
            );

            setError(
                err.message ||
                "Failed to update product image."
            );

        } finally {

            setSaving(false);
        }
    };

    // -----------------------------------------------------
    // LOADING
    // -----------------------------------------------------

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // -----------------------------------------------------
    // UI
    // -----------------------------------------------------

    return (
        <Box sx={{ p: 3 }}>

            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Edit Product Image
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update product image information
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/product-images")}
                >
                    Back
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
                >
                    {success}
                </Alert>
            )}

            {/* FORM */}

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

                        {/* IMAGE ID */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Product Image ID"
                                value={formData.ProductImageId}
                                disabled
                            />

                        </Grid>

                        {/* PRODUCT ID */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="ProductId"
                                label="Product ID"
                                value={formData.ProductId}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>

                        {/* IMAGE NAME */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                required
                                name="ImageName"
                                label="Image Name"
                                placeholder="product-image.jpg"
                                value={formData.ImageName}
                                onChange={handleChange}
                            />

                        </Grid>

                        {/* IMAGE TYPE */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                select
                                required
                                name="ImageType"
                                label="Image Type"
                                value={formData.ImageType}
                                onChange={handleChange}
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

                        {/* IMAGE URL */}

                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                required
                                name="ImageUrl"
                                label="Image URL"
                                placeholder="https://example.com/image.jpg"
                                value={formData.ImageUrl}
                                onChange={handleChange}
                            />

                        </Grid>

                        {/* IMAGE PREVIEW */}

                        {formData.ImageUrl && (
                            <Grid item xs={12}>

                                <Box
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        textAlign: "center"
                                    }}
                                >

                                    <Typography
                                        variant="subtitle2"
                                        sx={{ mb: 1 }}
                                    >
                                        Image Preview
                                    </Typography>

                                    <Box
                                        component="img"
                                        src={formData.ImageUrl}
                                        alt={formData.ImageName}
                                        sx={{
                                            maxWidth: "100%",
                                            maxHeight: 250,
                                            objectFit: "contain",
                                            borderRadius: 1
                                        }}
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </Box>

                            </Grid>
                        )}

                        {/* PRIMARY */}

                        <Grid item xs={12} md={6}>

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

                        </Grid>

                        {/* ACTIVE */}

                        <Grid item xs={12} md={6}>

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

                        </Grid>

                        {/* BUTTONS */}

                        <Grid item xs={12}>

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
                                    onClick={() =>
                                        navigate(
                                            "/product-images"
                                        )
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        saving
                                            ? <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                            : <Save />
                                    }
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>
    );
};

export default ProductImageEdit;

