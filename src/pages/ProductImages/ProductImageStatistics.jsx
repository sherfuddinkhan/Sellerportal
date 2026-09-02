// =========================================================
// ProductImageStatistics.jsx
// Product Image Statistics
// =========================================================

import React from "react";

import {
    Grid,
    Paper,
    Typography
} from "@mui/material";

// =========================================================
// ProductImageStatistics
// =========================================================

const ProductImageStatistics = ({
    images = []
}) => {

    // =====================================================
    // Ensure images is an array
    // =====================================================

    const imageList = Array.isArray(images)
        ? images
        : [];

    // =====================================================
    // Support PascalCase / camelCase
    // =====================================================

    const getValue = (
        item,
        pascalCase,
        camelCase
    ) => {
        return item?.[pascalCase] ??
               item?.[camelCase];
    };

    // =====================================================
    // Statistics
    // =====================================================

    const totalImages = imageList.length;

    const activeImages = imageList.filter(
        item =>
            Boolean(
                getValue(
                    item,
                    "IsActive",
                    "isActive"
                )
            )
    ).length;

    const inactiveImages =
        totalImages - activeImages;

    const primaryImages = imageList.filter(
        item =>
            Boolean(
                getValue(
                    item,
                    "IsPrimary",
                    "isPrimary"
                )
            )
    ).length;

    // =====================================================
    // Statistics Cards
    // =====================================================

    const cards = [
        {
            title: "Total Images",
            value: totalImages
        },
        {
            title: "Active",
            value: activeImages
        },
        {
            title: "Inactive",
            value: inactiveImages
        },
        {
            title: "Primary Images",
            value: primaryImages
        }
    ];

    // =====================================================
    // Render
    // =====================================================

    return (
        <Grid
            container
            spacing={2}
            sx={{
                mb: 3
            }}
        >

            {cards.map((card) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={card.title}
                >

                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            textAlign: "center",
                            borderRadius: 2,
                            height: "100%"
                        }}
                    >

                        {/* =====================================
                            TITLE
                        ===================================== */}

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {card.title}
                        </Typography>

                        {/* =====================================
                            VALUE
                        ===================================== */}

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{
                                mt: 1
                            }}
                        >
                            {card.value}
                        </Typography>

                    </Paper>

                </Grid>

            ))}

        </Grid>
    );
};

export default ProductImageStatistics;
