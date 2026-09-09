// =========================================================
// ProductImageStatistics.jsx
// Product Image Statistics
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Image as ImageIcon,
    CheckCircle,
    Cancel,
    Star,
    StarBorder,
    Inventory2,
    Storage,
    PhotoSizeSelectActual
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// PRODUCT IMAGE STATISTICS
// =========================================================

const ProductImageStatistics = () => {

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [statistics, setStatistics] = useState({
        totalImages: 0,
        activeImages: 0,
        inactiveImages: 0,
        primaryImages: 0,
        secondaryImages: 0,
        productsWithImages: 0,
        totalSize: 0,
        totalImageSize: 0,
        averageSize: 0
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // -----------------------------------------------------
    // FETCH STATISTICS
    // -----------------------------------------------------

    useEffect(() => {

        const fetchStatistics = async () => {

            try {

                setLoading(true);

                setError("");

                const response = await fetch(
                    `${SERVER_URL}/api/product-images/stats`
                );

                if (!response.ok) {

                    throw new Error(
                        `Failed to load image statistics. HTTP ${response.status}`
                    );

                }

                const data = await response.json();

                setStatistics({
                    totalImages:
                        Number(data?.totalImages ?? 0),

                    activeImages:
                        Number(data?.activeImages ?? 0),

                    inactiveImages:
                        Number(data?.inactiveImages ?? 0),

                    primaryImages:
                        Number(data?.primaryImages ?? 0),

                    secondaryImages:
                        Number(data?.secondaryImages ?? 0),

                    productsWithImages:
                        Number(data?.productsWithImages ?? 0),

                    totalSize:
                        Number(data?.totalSize ?? 0),

                    totalImageSize:
                        Number(data?.totalImageSize ?? 0),

                    averageSize:
                        Number(data?.averageSize ?? 0)
                });

            } catch (err) {

                console.error(
                    "Product Image Statistics Error:",
                    err
                );

                setError(
                    err?.message ||
                    "Unable to load product image statistics."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchStatistics();

    }, []);

    // -----------------------------------------------------
    // FORMAT FILE SIZE
    // -----------------------------------------------------

    const formatSize = (bytes) => {

        const size = Number(bytes || 0);

        if (size === 0) {
            return "0 B";
        }

        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        }

        if (size < 1024 * 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        }

        return `${(
            size /
            (1024 * 1024 * 1024)
        ).toFixed(2)} GB`;

    };

    // -----------------------------------------------------
    // STATISTIC CARD
    // -----------------------------------------------------

    const StatisticCard = ({
        title,
        value,
        icon
    }) => {

        return (
            <Card
                elevation={2}
                sx={{
                    height: "100%"
                }}
            >

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2
                        }}
                    >

                        <Box>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mb: 0.5
                                }}
                            >
                                {title}
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="bold"
                            >
                                {value}
                            </Typography>

                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 50,
                                height: 50,
                                borderRadius: 2,
                                backgroundColor:
                                    "action.hover"
                            }}
                        >
                            {icon}
                        </Box>

                    </Box>

                </CardContent>

            </Card>
        );

    };

    // -----------------------------------------------------
    // LOADING
    // -----------------------------------------------------

    if (loading) {

        return (

            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 150
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

        <Box sx={{ mb: 3 }}>

            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2 }}
            >
                Product Image Statistics
            </Typography>

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

            )}

            <Grid
                container
                spacing={2}
            >

                {/* =================================================
                    TOTAL IMAGES
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Total Images"
                        value={statistics.totalImages}
                        icon={
                            <ImageIcon
                                fontSize="large"
                            />
                        }
                    />

                </Grid>

                {/* =================================================
                    ACTIVE IMAGES
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Active Images"
                        value={statistics.activeImages}
                        icon={
                            <CheckCircle
                                fontSize="large"
                            />
                        }
                    />

                </Grid>

                {/* =================================================
                    INACTIVE IMAGES
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Inactive Images"
                        value={statistics.inactiveImages}
                        icon={
                            <Cancel
                                fontSize="large"
                            />
                        }
                    />

                </Grid>

                {/* =================================================
                    PRIMARY IMAGES
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Primary Images"
                        value={statistics.primaryImages}
                        icon={
                            <Star
                                fontSize="large"
                            />
                        }
                    />

                </Grid>

                {/* =================================================
                    SECONDARY IMAGES
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Secondary Images"
                        value={statistics.secondaryImages}
                        icon={
                            <StarBorder
                                fontSize="large"
                            />
                        }
                    />

                </Grid>

                {/* =================================================
                    PRODUCTS WITH IMAGES
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Products With Images"
                        value={statistics.productsWithImages}
                        icon={
                            <Inventory2
                                fontSize="large"
                            />
                        }
                    />

                </Grid>

                {/* =================================================
                    TOTAL IMAGE SIZE
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Total Image Size"
                        value={formatSize(
                            statistics.totalImageSize ||
                            statistics.totalSize
                        )}
                        icon={
                            <Storage
                                fontSize="large"
                            />
                        }
                    />

                </Grid>

                {/* =================================================
                    AVERAGE IMAGE SIZE
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Average Image Size"
                        value={formatSize(
                            statistics.averageSize
                        )}
                        icon={
                            <PhotoSizeSelectActual
                                fontSize="large"
                            />
                        }
                    />

                </Grid>

            </Grid>

        </Box>

    );

};

export default ProductImageStatistics;
