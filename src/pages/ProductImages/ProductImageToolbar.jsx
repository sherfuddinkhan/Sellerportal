// =========================================================
// ProductImageToolbar.jsx
// Product Image Toolbar
// =========================================================

import React from "react";

import {
    Stack,
    Typography,
    Button
} from "@mui/material";

import {
    Add,
    Refresh,
    Download
} from "@mui/icons-material";

// =========================================================
// ProductImageToolbar
// =========================================================

const ProductImageToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {

    return (
        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            justifyContent="space-between"
            alignItems={{
                xs: "stretch",
                sm: "center"
            }}
            spacing={2}
            sx={{
                mb: 3
            }}
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h5"
                fontWeight="bold"
            >
                Product Images
            </Typography>

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={2}
            >

                {/* ADD IMAGE */}

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => onAdd?.()}
                >
                    Add Image
                </Button>

                {/* REFRESH */}

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => onRefresh?.()}
                >
                    Refresh
                </Button>

                {/* EXPORT */}

                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Download />}
                    onClick={() => onExport?.()}
                >
                    Export
                </Button>

            </Stack>

        </Stack>
    );
};

export default ProductImageToolbar;
