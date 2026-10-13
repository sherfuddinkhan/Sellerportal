// =========================================================
// ProductImageDetails.jsx
// Product Image Details - Separate Page
// Frontend -> Node.js server.js -> ASP.NET Core API
// NO apiService
// =========================================================

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Image as ImageIcon
} from "@mui/icons-material";

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// PRODUCT IMAGE DETAILS
// =========================================================

const ProductImageDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD PRODUCT IMAGE
    // GET /api/product-images/:id
    // =====================================================

    const loadProductImage = useCallback(async () => {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            setError("A valid Product Image ID is required.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const url = `${SERVER_URL}/api/product-images/${id}`;

            console.log("Loading Product Image:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            });

            const contentType = response.headers.get("content-type");
            let responseData;

            if (contentType?.includes("application/json")) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            if (!response.ok) {
                let message = `Failed to fetch product image. HTTP ${response.status}`;

                if (responseData && typeof responseData === "object") {
                    if (responseData.errors) {
                        message = Object.entries(responseData.errors)
                            .map(([field, messages]) =>
                                `${field}: ${
                                    Array.isArray(messages)
                                        ? messages.join(", ")
                                        : String(messages)
                                }`
                            )
                            .join(" | ");
                    } else {
                        message =
                            responseData.message ||
                            responseData.title ||
                            responseData.error ||
                            message;
                    }
                } else if (typeof responseData === "string" && responseData.trim()) {
                    message = responseData;
                }

                throw new Error(message);
            }

            const record =
                responseData?.data ??
                responseData?.item ??
                responseData;

            if (
                !record ||
                typeof record !== "object" ||
                Array.isArray(record)
            ) {
                throw new Error("Product image was not found.");
            }

            setImage(record);
        } catch (err) {
            console.error("Product Image Details Error:", err);

            setError(
                err?.message || "Failed to fetch product image."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProductImage();
    }, [loadProductImage]);

    // =====================================================
    // GET VALUE - PASCALCASE / CAMELCASE
    // =====================================================

    const getValue = (pascalCase, camelCase, fallback = "") =>
        image?.[pascalCase] ??
        image?.[camelCase] ??
        fallback;

    // =====================================================
    // IMAGE ID
    // =====================================================

    const productImageId =
        getValue("ProductImageId", "productImageId") ||
        getValue("Id", "id", id);

    // =====================================================
    // BOOLEAN HELPER
    // =====================================================

    const getBooleanValue = (pascalCase, camelCase) => {
        const value = getValue(pascalCase, camelCase, false);

        return (
            value === true ||
            value === 1 ||
            value === "1" ||
            String(value).toLowerCase() === "true"
        );
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? "—"
            : date.toLocaleString();
    };

    // =====================================================
    // IMAGE VALUES
    // =====================================================

    const productId = getValue("ProductId", "productId", "—");
    const sellerId = getValue("SellerId", "sellerId", "—");
    const customerId = getValue("CustomerId", "customerId", "—");

    const imageName = getValue("ImageName", "imageName", "—");
    const imageType = getValue("ImageType", "imageType", "—");
    const imageUrl = getValue("ImageUrl", "imageUrl", "");

    const imageSize = getValue("ImageSize", "imageSize", null);
    const displayOrder = getValue("DisplayOrder", "displayOrder", "—");

    const isPrimary = getBooleanValue("IsPrimary", "isPrimary");
    const isActive = getBooleanValue("IsActive", "isActive");

    const createdDate = getValue("CreatedDate", "createdDate");
    const updatedDate = getValue("UpdatedDate", "updatedDate");

    // =====================================================
    // FORMAT IMAGE SIZE
    // =====================================================

    const formatImageSize = (size) => {
        if (size === null || size === undefined || size === "") {
            return "—";
        }

        const number = Number(size);

        if (!Number.isFinite(number)) return String(size);
        if (number < 1024) return `${number} B`;
        if (number < 1024 * 1024) {
            return `${(number / 1024).toFixed(2)} KB`;
        }
        if (number < 1024 * 1024 * 1024) {
            return `${(number / (1024 * 1024)).toFixed(2)} MB`;
        }

        return `${(number / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleBack = () => {
        navigate("/product-images");
    };

    const handleEdit = () => {
        navigate(`/product-images/edit/${productImageId}`);
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error || !image) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || "Product image not found."}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Product Images
                </Button>

                <Button
                    sx={{ ml: 1 }}
                    onClick={loadProductImage}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    // =====================================================
    // REUSABLE INFORMATION FIELD
    // =====================================================

    const Field = ({ label, value }) => (
        <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={600}
                sx={{ overflowWrap: "anywhere" }}
            >
                {value !== null && value !== undefined && value !== ""
                    ? value
                    : "—"}
            </Typography>
        </Grid>
    );

    // =====================================================
    // UI
    // =====================================================

    return (
        <Box sx={{ p: 3 }}>
            {/* HEADER */}
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
                    <Typography variant="h5" fontWeight="bold">
                        Product Image Details
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        View product image information
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                </Box>
            </Box>

            {/* IMAGE PREVIEW */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Image Preview
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 2
                    }}
                >
                    {imageUrl ? (
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={imageName}
                            sx={{
                                maxWidth: "100%",
                                maxHeight: 350,
                                objectFit: "contain",
                                borderRadius: 1
                            }}
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                            <ImageIcon sx={{ fontSize: 70 }} />
                            <Typography>No image available</Typography>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* BASIC INFORMATION */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Basic Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Field label="Product Image ID" value={productImageId} />
                        <Field label="Product ID" value={productId} />
                        <Field label="Seller ID" value={sellerId} />
                        <Field label="Customer ID" value={customerId} />
                        <Field label="Image Name" value={imageName} />
                        <Field label="Image Type" value={imageType} />
                        <Field label="Image Size" value={formatImageSize(imageSize)} />
                        <Field label="Display Order" value={displayOrder} />

                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                                Image URL
                            </Typography>

                            <Typography sx={{ overflowWrap: "anywhere" }}>
                                {imageUrl || "—"}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* STATUS */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Status
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                                Primary Image
                            </Typography>

                            <Box sx={{ mt: 1 }}>
                                <Chip
                                    label={isPrimary ? "Primary" : "Not Primary"}
                                    color={isPrimary ? "success" : "default"}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="text.secondary">
                                Status
                            </Typography>

                            <Box sx={{ mt: 1 }}>
                                <Chip
                                    label={isActive ? "Active" : "Inactive"}
                                    color={isActive ? "success" : "default"}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* RECORD INFORMATION */}
            <Card>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Record Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Field
                            label="Created Date"
                            value={formatDate(createdDate)}
                        />

                        <Field
                            label="Updated Date"
                            value={formatDate(updatedDate)}
                        />
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProductImageDetails;
