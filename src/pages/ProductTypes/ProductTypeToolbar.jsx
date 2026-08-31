// =========================================================
// ProductTypeToolbar.jsx
// Product Type Management Toolbar
// =========================================================

import React from "react";

import {
    Button,
    Stack,
    Typography,
} from "@mui/material";

import {
    Add,
    Download,
    Refresh,
} from "@mui/icons-material";


// =========================================================
// PRODUCT TYPE TOOLBAR
// =========================================================

const ProductTypeToolbar = ({
    onAdd,
    onRefresh,
    onExport,
    loading = false,
}) => {

    // =====================================================
    // EXPORT
    // =====================================================

    const handleExport = () => {

        if (loading) {
            return;
        }

        if (onExport) {
            onExport();
        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Stack

            direction={{
                xs: "column",
                sm: "row",
            }}

            justifyContent="space-between"

            alignItems={{
                xs: "stretch",
                sm: "center",
            }}

            spacing={2}

            sx={{
                mb: 3,
            }}

        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography

                variant="h5"

                fontWeight="bold"

            >

                Product Types

            </Typography>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <Stack

                direction={{
                    xs: "column",
                    sm: "row",
                }}

                spacing={2}

            >

                {/* =============================================
                    ADD PRODUCT TYPE
                ============================================= */}

                <Button

                    variant="contained"

                    startIcon={
                        <Add />
                    }

                    onClick={onAdd}

                    disabled={loading}

                >

                    Add Product Type

                </Button>


                {/* =============================================
                    REFRESH
                ============================================= */}

                <Button

                    variant="outlined"

                    startIcon={
                        <Refresh />
                    }

                    onClick={onRefresh}

                    disabled={loading}

                >

                    Refresh

                </Button>


                {/* =============================================
                    EXPORT
                ============================================= */}

                <Button

                    variant="outlined"

                    color="success"

                    startIcon={
                        <Download />
                    }

                    onClick={handleExport}

                    disabled={
                        loading ||
                        !onExport
                    }

                >

                    Export

                </Button>

            </Stack>

        </Stack>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeToolbar;
