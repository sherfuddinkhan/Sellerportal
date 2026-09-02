// =========================================================
// ProductAttributeToolbar.jsx
// Product Attribute Toolbar
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
// COMPONENT
// =========================================================

const ProductAttributeToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {

    return (

        <Stack
            direction={{
                xs: "column",
                md: "row"
            }}
            justifyContent="space-between"
            alignItems={{
                xs: "stretch",
                md: "center"
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
                Product Attributes
            </Typography>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={1.5}
            >

                {/* ADD */}

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => onAdd?.()}
                >
                    Add Attribute
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


export default ProductAttributeToolbar;
