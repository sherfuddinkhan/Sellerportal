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
    Paper,
    Switch,
    TextField,
    Typography
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
    ProductImageId: "",
    SellerId: "",
    CustomerId: "",
    ProductId: "",
    ImageSize: "",
    ImageUrl: "",
    DisplayOrder: 0,
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

    const [formData, setFormData] = useState(
        EMPTY_FORM
    );

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD PRODUCT IMAGE
    // =====================================================

    useEffect(() => {

        if (id) {
            loadProductImage();
        } else {

            setError(
                "Product Image ID is missing."
            );

            setLoading(false);
        }

    }, [id]);

    // =====================================================
    // LOAD PRODUCT IMAGE BY ID
    // =====================================================

    const loadProductImage = async () => {

        try {

            setLoading(true);

            setError("");

            setSuccess("");

            // -------------------------------------------------
            // Validate ID
            // -------------------------------------------------

            if (
                !id ||
                id === ":id"
            ) {
                throw new Error(
                    "Invalid Product Image ID."
                );
            }

            const productImageId = Number(id);

            if (
                !Number.isInteger(productImageId) ||
                productImageId <= 0
            ) {
                throw new Error(
                    `Invalid Product Image ID: ${id}`
                );
            }

            // -------------------------------------------------
            // GET API
            // -------------------------------------------------

            const url =
                `${SERVER_URL}/api/product-images/${productImageId}`;

            console.log(
                "========================================"
            );

            console.log(
                "GET PRODUCT IMAGE"
            );

            console.log(
                "Product Image ID:",
                productImageId
            );

            console.log(
                "Request URL:",
                url
            );

            console.log(
                "========================================"
            );

            const response = await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            // -------------------------------------------------
            // Read response
            // -------------------------------------------------

            const responseText =
                await response.text();

            let data = null;

            try {

                data = responseText
                    ? JSON.parse(responseText)
                    : null;

            } catch {

                data = responseText;

            }

            // -------------------------------------------------
            // Handle HTTP errors
            // -------------------------------------------------

            if (!response.ok) {

                let errorMessage =
                    `Failed to load product image. Status: ${response.status}`;

                if (data?.message) {

                    errorMessage =
                        data.message;

                } else if (data?.title) {

                    errorMessage =
                        data.title;

                }

                // ASP.NET validation errors
                if (data?.errors) {

                    const validationErrors =
                        Object.values(data.errors)
                            .flat()
                            .join(", ");

                    if (validationErrors) {

                        errorMessage +=
                            ` ${validationErrors}`;

                    }
                }

                throw new Error(
                    errorMessage
                );
            }

            // -------------------------------------------------
            // Support different response structures
            // -------------------------------------------------

            const image =
                data?.data ||
                data?.item ||
                data;

            if (!image) {

                throw new Error(
                    "Product image not found."
                );
            }

            // -------------------------------------------------
            // Read backend properties
            // -------------------------------------------------

            const productImageIdValue =
                image.ProductImageId ??
                image.productImageId ??
                productImageId;

            const sellerId =
                image.SellerId ??
                image.sellerId ??
                "";

            const customerId =
                image.CustomerId ??
                image.customerId ??
                "";

            const productId =
                image.ProductId ??
                image.productId ??
                "";

            const imageSize =
                image.ImageSize ??
                image.imageSize ??
                0;

            const imageUrl =
                image.ImageUrl ??
                image.imageUrl ??
                "";

            const displayOrder =
                image.DisplayOrder ??
                image.displayOrder ??
                0;

            const isPrimary =
                parseBoolean(
                    image.IsPrimary ??
                    image.isPrimary
                );

            const isActive =
                parseBoolean(
                    image.IsActive ??
                    image.isActive
                );

            // -------------------------------------------------
            // Set form
            // -------------------------------------------------

            setFormData({

                ProductImageId:
                    productImageIdValue,

                SellerId:
                    sellerId,

                CustomerId:
                    customerId,

                ProductId:
                    productId,

                ImageSize:
                    imageSize,

                ImageUrl:
                    imageUrl,

                DisplayOrder:
                    displayOrder,

                IsPrimary:
                    isPrimary,

                IsActive:
                    isActive
            });

            console.log(
                "Loaded Product Image:",
                image
            );

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

    // =====================================================
    // BOOLEAN PARSER
    // =====================================================

    const parseBoolean = (value) => {

        if (
            value === true ||
            value === "true" ||
            value === 1 ||
            value === "1"
        ) {
            return true;
        }

        return false;
    };

    // =====================================================
    // HANDLE TEXT / NUMBER INPUT
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );
    };

    // =====================================================
    // HANDLE SWITCH
    // =====================================================

    const handleSwitchChange = (event) => {

        const {
            name,
            checked
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: checked
            })
        );
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        // -------------------------------------------------
        // Product Image ID
        // -------------------------------------------------

        if (
            !formData.ProductImageId ||
            Number(formData.ProductImageId) <= 0
        ) {

            setError(
                "Product Image ID is required."
            );

            return false;
        }

        // -------------------------------------------------
        // Seller ID
        // -------------------------------------------------

        if (
            !formData.SellerId ||
            Number(formData.SellerId) <= 0
        ) {

            setError(
                "Seller ID is required."
            );

            return false;
        }

        // -------------------------------------------------
        // Customer ID
        // -------------------------------------------------

        if (
            !formData.CustomerId ||
            Number(formData.CustomerId) <= 0
        ) {

            setError(
                "Customer ID is required."
            );

            return false;
        }

        // -------------------------------------------------
        // Product ID
        // -------------------------------------------------

        if (
            !formData.ProductId ||
            Number(formData.ProductId) <= 0
        ) {

            setError(
                "Product ID is required."
            );

            return false;
        }

        // -------------------------------------------------
        // Image URL
        // -------------------------------------------------

        if (
            !formData.ImageUrl ||
            !formData.ImageUrl.trim()
        ) {

            setError(
                "Image URL is required."
            );

            return false;
        }

        // -------------------------------------------------
        // Image Size
        // -------------------------------------------------

        if (
            formData.ImageSize === "" ||
            Number(formData.ImageSize) < 0
        ) {

            setError(
                "Image size is required."
            );

            return false;
        }

        // -------------------------------------------------
        // Display Order
        // -------------------------------------------------

        if (
            formData.DisplayOrder === "" ||
            Number(formData.DisplayOrder) < 0
        ) {

            setError(
                "Display order cannot be negative."
            );

            return false;
        }

        return true;
    };

    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");

        // -------------------------------------------------
        // Validate
        // -------------------------------------------------

        if (!validateForm()) {
            return;
        }

        try {

            setSaving(true);

            // -------------------------------------------------
            // Product Image ID from URL
            // -------------------------------------------------

            const productImageId =
                Number(id);

            // -------------------------------------------------
            // Payload
            // -------------------------------------------------
            //
            // IMPORTANT:
            // We send the actual IDs loaded from the database.
            //
            // This prevents:
            //
            // productId = 0
            //
            // which previously caused:
            //
            // FK_ProductImage_Product
            //
            // -------------------------------------------------

            const payload = {

                productImageId:
                    productImageId,

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

            console.log(
                "========================================"
            );

            console.log(
                "UPDATE PRODUCT IMAGE"
            );

            console.log(
                "Product Image ID:",
                productImageId
            );

            console.log(
                "PUT URL:",
                `${SERVER_URL}/api/product-images/${productImageId}`
            );

            console.log(
                "Payload:",
                payload
            );

            console.log(
                "========================================"
            );

            // -------------------------------------------------
            // PUT API
            // -------------------------------------------------

            const response = await fetch(
                `${SERVER_URL}/api/product-images/${productImageId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    },

                    body:
                        JSON.stringify(payload)
                }
            );

            // -------------------------------------------------
            // Read response
            // -------------------------------------------------

            const responseText =
                await response.text();

            let responseData = null;

            try {

                responseData =
                    responseText
                        ? JSON.parse(responseText)
                        : null;

            } catch {

                responseData =
                    responseText;

            }

            console.log(
                "PUT Response Status:",
                response.status
            );

            console.log(
                "PUT Response:",
                responseData
            );

            // -------------------------------------------------
            // Handle error
            // -------------------------------------------------

            if (!response.ok) {

                let errorMessage =
                    "Failed to update product image.";

                if (
                    responseData?.message
                ) {

                    errorMessage =
                        responseData.message;

                } else if (
                    responseData?.title
                ) {

                    errorMessage =
                        responseData.title;

                }

                // ASP.NET validation errors
                if (
                    responseData?.errors
                ) {

                    const validationErrors =
                        Object.values(
                            responseData.errors
                        )
                            .flat()
                            .join(", ");

                    if (validationErrors) {

                        errorMessage +=
                            ` ${validationErrors}`;

                    }
                }

                throw new Error(
                    errorMessage
                );
            }

            // -------------------------------------------------
            // Success
            // -------------------------------------------------

            setSuccess(
                responseData?.message ||
                "Product image updated successfully."
            );

            // -------------------------------------------------
            // Redirect
            // -------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/product-images"
                );

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

    // =====================================================
    // LOADING
    // =====================================================

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

    // =====================================================
    // UI
    // =====================================================

    return (
        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================== */}

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
                    onClick={() =>
                        navigate(
                            "/product-images"
                        )
                    }
                >
                    Back
                </Button>

            </Box>

            {/* =================================================
                ALERTS
            ================================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setError("")
                    }
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
            ================================================== */}

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
                            PRODUCT IMAGE ID
                        ================================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Product Image ID"
                                value={
                                    formData.ProductImageId
                                }
                                disabled
                            />

                        </Grid>

                        {/* =================================================
                            SELLER ID
                        ================================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Seller ID"
                                value={
                                    formData.SellerId
                                }
                                disabled
                            />

                        </Grid>

                        {/* =================================================
                            CUSTOMER ID
                        ================================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Customer ID"
                                value={
                                    formData.CustomerId
                                }
                                disabled
                            />

                        </Grid>

                        {/* =================================================
                            PRODUCT ID
                        ================================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Product ID"
                                type="number"
                                value={
                                    formData.ProductId
                                }
                                disabled
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE SIZE
                        ================================================== */}

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
                                label="Image Size (bytes)"
                                value={
                                    formData.ImageSize
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0
                                }}
                            />

                        </Grid>

                        {/* =================================================
                            DISPLAY ORDER
                        ================================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                required
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
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE URL
                        ================================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                required
                                name="ImageUrl"
                                label="Image URL"
                                placeholder="https://example.com/image.jpg"
                                value={
                                    formData.ImageUrl
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>

                        {/* =================================================
                            IMAGE PREVIEW
                        ================================================== */}

                        {formData.ImageUrl && (

                            <Grid
                                item
                                xs={12}
                            >

                                <Box
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        border: "1px solid",
                                        borderColor:
                                            "divider",
                                        borderRadius: 2,
                                        textAlign:
                                            "center"
                                    }}
                                >

                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            mb: 1
                                        }}
                                    >
                                        Image Preview
                                    </Typography>

                                    <Box
                                        component="img"
                                        src={
                                            formData.ImageUrl
                                        }
                                        alt="Product"
                                        sx={{
                                            maxWidth:
                                                "100%",
                                            maxHeight:
                                                250,
                                            objectFit:
                                                "contain",
                                            borderRadius: 1
                                        }}
                                        onError={(
                                            event
                                        ) => {

                                            event
                                                .currentTarget
                                                .style
                                                .display =
                                                "none";

                                        }}
                                    />

                                </Box>

                            </Grid>
                        )}

                        {/* =================================================
                            PRIMARY IMAGE
                        ================================================== */}

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

                        </Grid>

                        {/* =================================================
                            ACTIVE
                        ================================================== */}

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

                        </Grid>

                        {/* =================================================
                            BUTTONS
                        ================================================== */}

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
                                    mt: 2
                                }}
                            >

                                {/* CANCEL */}

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        navigate(
                                            "/product-images"
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </Button>

                                {/* SAVE */}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        saving
                                            ? (
                                                <CircularProgress
                                                    size={20}
                                                    color="inherit"
                                                />
                                            )
                                            : (
                                                <Save />
                                            )
                                    }
                                    disabled={
                                        saving
                                    }
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

// =========================================================
// EXPORT
// =========================================================

export default ProductImageEdit;
