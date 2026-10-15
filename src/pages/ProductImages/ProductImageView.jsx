// =========================================================
// ProductImageView.jsx
// View Product Image Details
// Supports standalone page + existing dialog
// =========================================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
    Link,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

import { ArrowBack } from "@mui/icons-material";

const SERVER_URL = "http://localhost:5000";

// =========================================================
// PRODUCT IMAGE VIEW
// =========================================================

const ProductImageView = ({
    open,
    image: selectedImage,
    onClose
}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // URL contains ID -> standalone page
    const pageMode = Boolean(id);

    const [image, setImage] = useState(selectedImage || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD IMAGE DETAILS FOR STANDALONE PAGE
    // GET /api/product-images/:id
    // =====================================================

    useEffect(() => {
        if (!pageMode) {
            setImage(selectedImage || null);
            return;
        }

        const loadImage = async () => {
            try {
                setLoading(true);
                setError("");

                if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                    throw new Error("Invalid product image ID.");
                }

                const response = await axios.get(
                    `${SERVER_URL}/api/product-images/${id}`
                );

                const data = response.data;

                const record =
                    data?.data ??
                    data?.item ??
                    data;

                if (
                    !record ||
                    typeof record !== "object" ||
                    Array.isArray(record)
                ) {
                    throw new Error("Product image was not found.");
                }

                setImage(record);
            } catch (err) {
                console.error("Load Product Image Error:", err);

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load product image details."
                );
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, [pageMode, id, selectedImage]);

    // =====================================================
    // FIELD VALUE HELPERS
    // =====================================================

    const getValue = (pascalCase, camelCase) =>
        image?.[pascalCase] ?? image?.[camelCase];

    const getBooleanValue = (value) =>
        value === true ||
        value === 1 ||
        value === "1" ||
        String(value).toLowerCase() === "true";

    const formatImageSize = (size) => {
        if (size === null || size === undefined || size === "") {
            return "-";
        }

        const numericSize = Number(size);

        if (Number.isNaN(numericSize)) {
            return size;
        }

        if (numericSize < 1024) {
            return `${numericSize} B`;
        }

        if (numericSize < 1024 * 1024) {
            return `${(numericSize / 1024).toFixed(2)} KB`;
        }

        if (numericSize < 1024 * 1024 * 1024) {
            return `${(numericSize / (1024 * 1024)).toFixed(2)} MB`;
        }

        return `${(numericSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate = new Date(date);

        return Number.isNaN(parsedDate.getTime())
            ? "-"
            : parsedDate.toLocaleString();
    };

    // =====================================================
    // IMAGE FIELDS
    // =====================================================

    const productImageId =
        getValue("ProductImageId", "productImageId") ??
        getValue("Id", "id") ??
        "-";

    const sellerId = getValue("SellerId", "sellerId");
    const customerId = getValue("CustomerId", "customerId");
    const productId = getValue("ProductId", "productId");
    const imageName = getValue("ImageName", "imageName");
    const imageType = getValue("ImageType", "imageType");
    const imageSize = getValue("ImageSize", "imageSize");
    const imageUrl = getValue("ImageUrl", "imageUrl");
    const displayOrder = getValue("DisplayOrder", "displayOrder");

    const isPrimary = getBooleanValue(
        getValue("IsPrimary", "isPrimary")
    );

    const isActive = getBooleanValue(
        getValue("IsActive", "isActive")
    );

    const createdDate = getValue("CreatedDate", "createdDate");
    const updatedDate = getValue("UpdatedDate", "updatedDate");

    // =====================================================
    // REUSABLE FIELD
    // =====================================================

    const Field = ({ label, value }) => (
        <Grid xs={12} md={6}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{ wordBreak: "break-word" }}
            >
                {value !== null && value !== undefined && value !== ""
                    ? value
                    : "-"}
            </Typography>
        </Grid>
    );

    // =====================================================
    // DETAILS CONTENT
    // =====================================================

    const detailsContent = image && (
        <Grid container spacing={3}>
            <Grid xs={12}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1 }}
                >
                    Image Preview
                </Typography>

                {imageUrl ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 250,
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            backgroundColor: "background.default"
                        }}
                    >
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={imageName || "Product Image"}
                            sx={{
                                maxWidth: "100%",
                                maxHeight: 300,
                                objectFit: "contain",
                                borderRadius: 2
                            }}
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            minHeight: 150,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2
                        }}
                    >
                        <Typography color="text.secondary">
                            No image preview available.
                        </Typography>
                    </Box>
                )}
            </Grid>

            <Field label="Product Image ID" value={productImageId} />
            <Field label="Seller ID" value={sellerId} />
            <Field label="Customer ID" value={customerId} />
            <Field label="Product ID" value={productId} />
            <Field label="Image Name" value={imageName} />
            <Field label="Image Type" value={imageType} />
            <Field label="Image Size" value={formatImageSize(imageSize)} />
            <Field label="Display Order" value={displayOrder} />

            <Grid xs={12}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                >
                    Image URL
                </Typography>

                {imageUrl ? (
                    <Link
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ wordBreak: "break-all" }}
                    >
                        {imageUrl}
                    </Link>
                ) : (
                    <Typography>-</Typography>
                )}
            </Grid>

            <Grid xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                    Primary Image
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Chip
                        label={isPrimary ? "Yes" : "No"}
                        color={isPrimary ? "success" : "default"}
                        size="small"
                    />
                </Box>
            </Grid>

            <Grid xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                    Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Chip
                        label={isActive ? "Active" : "Inactive"}
                        color={isActive ? "success" : "error"}
                        size="small"
                    />
                </Box>
            </Grid>

            <Field label="Created Date" value={formatDate(createdDate)} />
            <Field label="Updated Date" value={formatDate(updatedDate)} />
        </Grid>
    );

    // =====================================================
    // LOADING / ERROR
    // =====================================================

    if (pageMode) {
        return (
            <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/product-images")}
                    sx={{ mb: 2 }}
                >
                    Back to Product Images
                </Button>

                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography
                            variant="h5"
                            fontWeight={600}
                            gutterBottom
                        >
                            Product Image Details
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    p: 5
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : image ? (
                            detailsContent
                        ) : (
                            !error && (
                                <Alert severity="warning">
                                    No product image details were found.
                                </Alert>
                            )
                        )}
                    </CardContent>
                </Card>
            </Box>
        );
    }

    // =====================================================
    // EXISTING DIALOG MODE
    // =====================================================

    if (!image) return null;

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                Product Image Details
            </DialogTitle>

            <Divider />

            <DialogContent dividers>
                {detailsContent}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="contained" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductImageView;
