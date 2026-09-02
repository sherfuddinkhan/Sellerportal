// =========================================================
// ProductImageStatistics.jsx
// Product Image Statistics
// =========================================================

import React, { useMemo } from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

import {
    Image as ImageIcon,
    CheckCircle,
    Cancel,
    Star
} from "@mui/icons-material";

// =========================================================
// PRODUCT IMAGE STATISTICS
// =========================================================

const ProductImageStatistics = ({
    images = []
}) => {

    // -----------------------------------------------------
    // NORMALIZE DATA
    // -----------------------------------------------------

    const normalizedImages = useMemo(() => {

        if (!Array.isArray(images)) {
            return [];
        }

        return images;

    }, [images]);

    // -----------------------------------------------------
    // STATISTICS
    // -----------------------------------------------------

    const statistics = useMemo(() => {

        const totalImages =
            normalizedImages.length;

        const activeImages =
            normalizedImages.filter((image) =>
                Boolean(
                    image?.IsActive ??
                    image?.isActive ??
                    false
                )
            ).length;

        const inactiveImages =
            normalizedImages.filter((image) =>
                !Boolean(
                    image?.IsActive ??
                    image?.isActive ??
                    false
                )
            ).length;

        const primaryImages =
            normalizedImages.filter((image) =>
                Boolean(
                    image?.IsPrimary ??
                    image?.isPrimary ??
                    false
                )
            ).length;

        return {
            totalImages,
            activeImages,
            inactiveImages,
            primaryImages
        };

    }, [normalizedImages]);

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

            </Grid>

        </Box>
    );
};

export default ProductImageStatistics;
