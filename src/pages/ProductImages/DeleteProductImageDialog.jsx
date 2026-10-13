// =========================================================
// DeleteProductImageDialog.jsx
// Supports standalone delete page + existing dialog
// React -> Node.js server.js -> ASP.NET Core API
// =========================================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    ArrowBack,
    Delete as DeleteIcon
} from "@mui/icons-material";

// =========================================================
// NODE.JS SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const DeleteProductImageDialog = ({
    open,
    image: selectedImage,
    onClose,
    onDeleted
}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // If URL contains an ID, render as a standalone page.
    const pageMode = Boolean(id);

    const [image, setImage] = useState(selectedImage || null);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // GET IMAGE ID
    // =====================================================

    const getImageId = (record) =>
        record?.id ??
        record?.Id ??
        record?.productImageId ??
        record?.ProductImageId ??
        record?.productImagesId ??
        record?.ProductImagesId ??
        null;

    // =====================================================
    // GET PROPERTY - PASCALCASE / CAMELCASE
    // =====================================================

    const getValue = (pascalCase, camelCase) =>
        image?.[pascalCase] ?? image?.[camelCase] ?? "-";

    const productImageId = pageMode
        ? Number(id)
        : getImageId(image);

    const productId = getValue("ProductId", "productId");
    const imageName = getValue("ImageName", "imageName");
    const imageType = getValue("ImageType", "imageType");
    const imageUrl = getValue("ImageUrl", "imageUrl");

    // =====================================================
    // LOAD IMAGE FOR STANDALONE PAGE
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
                    "Failed to load product image."
                );
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, [pageMode, id, selectedImage]);

    // =====================================================
    // DELETE IMAGE
    // DELETE /api/product-images/:id
    // =====================================================

    const handleDelete = async () => {
        if (!productImageId || deleting) {
            return;
        }

        try {
            setDeleting(true);
            setError("");
            setSuccess("");

            const response = await axios.delete(
                `${SERVER_URL}/api/product-images/${productImageId}`
            );

            setSuccess("Product image deleted successfully.");

            // Existing popup mode: notify parent list.
            if (!pageMode && typeof onDeleted === "function") {
                await onDeleted(productImageId);
                return;
            }

            // Standalone page: return to list.
            navigate("/product-images", {
                state: {
                    successMessage: "Product image deleted successfully."
                }
            });
        } catch (err) {
            console.error("Delete Product Image Error:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to delete product image."
            );
        } finally {
            setDeleting(false);
        }
    };

    // =====================================================
    // SHARED CONTENT
    // =====================================================

    const details = (
        <>
            <Typography>
                Are you sure you want to delete this product image?
            </Typography>

            <Box
                sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "action.hover"
                }}
            >
                <Typography fontWeight="bold">
                    Image ID: {productImageId ?? "-"}
                </Typography>

                <Typography>
                    Product ID: {productId}
                </Typography>

                <Typography>
                    Image Name: {imageName}
                </Typography>

                <Typography>
                    Image Type: {imageType}
                </Typography>

                <Typography sx={{ overflowWrap: "anywhere" }}>
                    Image URL: {imageUrl}
                </Typography>
            </Box>

            <Typography
                color="error"
                variant="body2"
                sx={{ mt: 2 }}
            >
                This action cannot be undone.
            </Typography>
        </>
    );

    const actions = (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
                justifyContent: "flex-end",
                mt: pageMode ? 3 : 0
            }}
        >
            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => {
                    if (pageMode) {
                        navigate("/product-images");
                    } else if (onClose) {
                        onClose();
                    }
                }}
                disabled={deleting}
            >
                Cancel
            </Button>

            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={!productImageId || deleting || loading}
            >
                {deleting ? "Deleting..." : "Delete"}
            </Button>
        </Stack>
    );

    // =====================================================
    // STANDALONE PAGE MODE
    // URL: /product-images/delete/:id
    // =====================================================

    if (pageMode) {
        return (
            <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
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
                            fontWeight="bold"
                            gutterBottom
                        >
                            Delete Product Image
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}

                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : image ? (
                            <>
                                {details}
                                {actions}
                            </>
                        ) : (
                            !error && (
                                <Alert severity="warning">
                                    Product image details were not found.
                                </Alert>
                            )
                        )}
                    </CardContent>
                </Card>
            </Box>
        );
    }

    // =====================================================
    // EXISTING POPUP DIALOG MODE
    // =====================================================

    if (!image) {
        return null;
    }

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Delete Product Image
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {details}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={deleting}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!productImageId || deleting}
                >
                    {deleting ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteProductImageDialog;
