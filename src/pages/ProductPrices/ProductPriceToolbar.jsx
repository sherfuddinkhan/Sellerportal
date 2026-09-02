// =========================================================
// ProductPriceToolbar.jsx
// =========================================================

import React from "react";

import {
    Box,
    Button,
    Typography,
    Stack,
} from "@mui/material";

import {
    Add,
    Refresh,
    Download,
} from "@mui/icons-material";

// =========================================================
// Product Price Toolbar
// =========================================================

const ProductPriceToolbar = ({
    onAdd,
    onRefresh,
    onExport,
}) => {

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                mb: 3,

                flexWrap: "wrap",

                gap: 2,
            }}
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
            >
                Product Prices
            </Typography>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
            >

                {/* =============================================
                    ADD PRICE
                ============================================= */}

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => onAdd?.()}
                >
                    Add Price
                </Button>


                {/* =============================================
                    REFRESH
                ============================================= */}

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => onRefresh?.()}
                >
                    Refresh
                </Button>


                {/* =============================================
                    EXPORT
                ============================================= */}

                <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => onExport?.()}
                >
                    Export
                </Button>

            </Stack>

        </Box>
    );
};

export default ProductPriceToolbar;
