// =========================================================
// ProductImageDetails.jsx
// Product Image Details
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
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

import {
    useNavigate,
    useParams
} from "react-router-dom";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// PRODUCT IMAGE DETAILS
// =========================================================

const ProductImageDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // -----------------------------------------------------
    // LOAD PRODUCT IMAGE
    // -----------------------------------------------------

    useEffect(() => {

        if (!id) {

            setError(
                "Product Image ID is missing."
            );

            setLoading(false);

            return;
        }

        loadProductImage();

    }, [id]);

    // =====================================================
    // FETCH PRODUCT IMAGE
    // =====================================================

    const loadProductImage = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-images/${id}`
            );

            if (!response.ok) {

                let message =
                    "Failed to load product image.";

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

            // Supports:
            // direct object
            // { data: object }
            // { item: object }

            const productImage =
                data?.data ??
                data?.item ??
                data;

            if (!productImage) {

                throw new Error(
                    "Product image not found."
                );
            }

            setImage(productImage);

        } catch (err) {

            console.error(
                "Product Image Details Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load product image details."
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // GET VALUE
    // Supports PascalCase + camelCase
    // =====================================================

    const getValue = (
        pascalCase,
        camelCase,
        fallback = ""
    ) => {

        if (!image) {
            return fallback;
        }

        return (
            image[pascalCase] ??
            image[camelCase] ??
            fallback
        );
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleString();
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
    // EDIT
    // =====================================================

    const handleEdit = () => {

        const productImageId =
            getValue(
                "ProductImageId",
                "productImageId",
                id
            );

        navigate(
            `/product-images/edit/${productImageId}`
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "400px",
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

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error ||
                        "Product image not found."}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={handleBack}
                >
                    Back to Product Images
                </Button>

            </Box>
        );
    }

    // =====================================================
    // IMAGE VALUES
    // =====================================================

    const productImageId =
        getValue(
            "ProductImageId",
            "productImageId"
        );

    const productId =
        getValue(
            "ProductId",
            "productId"
        );

    const imageUrl =
        getValue(
            "ImageUrl",
            "imageUrl"
        );

    const imageName =
        getValue(
            "ImageName",
            "imageName"
        );

    const imageType =
        getValue(
            "ImageType",
            "imageType"
        );

    const isPrimary =
        Boolean(
            getValue(
                "IsPrimary",
                "isPrimary",
                false
            )
        );

    const isActive =
        Boolean(
            getValue(
                "IsActive",
                "isActive",
                false
            )
        );

    const createdDate =
        getValue(
            "CreatedDate",
            "createdDate"
        );

    const updatedDate =
        getValue(
            "UpdatedDate",
            "updatedDate"
        );

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
                        Product Image Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View product image information
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            <Edit />
                        }
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>

                </Box>

            </Box>

            {/* =================================================
                IMAGE PREVIEW
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Image Preview
                </Typography>

                <Divider
                    sx={{
                        mb: 3
                    }}
                />

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
                            alt={
                                imageName ||
                                "Product Image"
                            }
                            sx={{
                                maxWidth: "100%",
                                maxHeight: 350,
                                objectFit: "contain",
                                borderRadius: 1
                            }}
                            onError={(event) => {

                                event.currentTarget.style.display =
                                    "none";

                            }}
                        />

                    ) : (

                        <Box
                            sx={{
                                textAlign: "center",
                                color: "text.secondary"
                            }}
                        >

                            <ImageIcon
                                sx={{
                                    fontSize: 70
                                }}
                            />

                            <Typography>
                                No image available
                            </Typography>

                        </Box>

                    )}

                </Box>

            </Paper>

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Basic Information
                </Typography>

                <Divider
                    sx={{
                        mb: 3
                    }}
                />

                <Grid
                    container
                    spacing={3}
                >

                    {/* PRODUCT IMAGE ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product Image ID
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >
                            {productImageId || "—"}
                        </Typography>

                    </Grid>

                    {/* PRODUCT ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >
                            {productId || "—"}
                        </Typography>

                    </Grid>

                    {/* IMAGE NAME */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image Name
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight="600"
                        >
                            {imageName || "—"}
                        </Typography>

                    </Grid>

                    {/* IMAGE TYPE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image Type
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={
                                    imageType ||
                                    "Unknown"
                                }
                                variant="outlined"
                            />

                        </Box>

                    </Grid>

                    {/* IMAGE URL */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Image URL
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                wordBreak: "break-all"
                            }}
                        >
                            {imageUrl || "—"}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

            {/* =================================================
                STATUS
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Status
                </Typography>

                <Divider
                    sx={{
                        mb: 3
                    }}
                />

                <Grid
                    container
                    spacing={3}
                >

                    {/* PRIMARY */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Primary Image
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={
                                    isPrimary
                                        ? "Primary"
                                        : "Not Primary"
                                }
                                color={
                                    isPrimary
                                        ? "success"
                                        : "default"
                                }
                            />

                        </Box>

                    </Grid>

                    {/* ACTIVE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={
                                    isActive
                                        ? "Active"
                                        : "Inactive"
                                }
                                color={
                                    isActive
                                        ? "success"
                                        : "default"
                                }
                            />

                        </Box>

                    </Grid>

                </Grid>

            </Paper>

            {/* =================================================
                RECORD INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Record Information
                </Typography>

                <Divider
                    sx={{
                        mb: 3
                    }}
                />

                <Grid
                    container
                    spacing={3}
                >

                    {/* CREATED DATE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography variant="body1">
                            {formatDate(
                                createdDate
                            )}
                        </Typography>

                    </Grid>

                    {/* UPDATED DATE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>

                        <Typography variant="body1">
                            {formatDate(
                                updatedDate
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

        </Box>
    );
};

export default ProductImageDetails;

