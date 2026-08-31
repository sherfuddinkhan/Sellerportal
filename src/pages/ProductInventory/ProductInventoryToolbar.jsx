
// =========================================================
// ProductInventoryToolbar.jsx
// Product Inventory Toolbar
// =========================================================

import React from "react";

import {
    Stack,
    Typography,
    Button,
} from "@mui/material";

import {
    Add,
    Refresh,
    Download,
} from "@mui/icons-material";

// =========================================================
// PRODUCT INVENTORY TOOLBAR
// =========================================================

const ProductInventoryToolbar = ({
    onAdd,
    onRefresh,
    onExport,
}) => {

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
        >

            {/* =====================================================
                TITLE
            ===================================================== */}

            <Typography
                variant="h5"
                fontWeight="bold"
            >
                Product Inventory
            </Typography>


            {/* =====================================================
                ACTION BUTTONS
            ===================================================== */}

            <Stack
                direction="row"
                spacing={2}
            >

                {/* ADD INVENTORY */}

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                >
                    Add Inventory
                </Button>


                {/* REFRESH */}

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>


                {/* EXPORT */}

                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Download />}
                    onClick={onExport}
                >
                    Export
                </Button>

            </Stack>

        </Stack>
    );
};

export default ProductInventoryToolbar;
