// =========================================================
// ShipmentToolbar.jsx
// Shipment Toolbar
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

const ShipmentToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {

    // ---------------------------------------------------------
    // SAFE HANDLERS
    // ---------------------------------------------------------

    const handleAdd = () => {

        if (onAdd) {
            onAdd();
        }
    };

    const handleRefresh = () => {

        if (onRefresh) {
            onRefresh();
        }
    };

    const handleExport = () => {

        if (onExport) {
            onExport();
        }
    };

    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------

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
            sx={{
                mb: 3,
                flexWrap: "wrap",
                gap: 2
            }}
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <BoxTitle />

            {/* =================================================
                ACTIONS
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={2}
                flexWrap="wrap"
            >

                {/* ADD */}

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAdd}
                >
                    Add Shipment
                </Button>

                {/* REFRESH */}

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                >
                    Refresh
                </Button>

                {/* EXPORT */}

                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Download />}
                    onClick={handleExport}
                >
                    Export
                </Button>

            </Stack>

        </Stack>
    );
};

// =========================================================
// TITLE
// =========================================================

const BoxTitle = () => (

    <Typography
        variant="h5"
        fontWeight="bold"
    >
        Shipments
    </Typography>
);

// =========================================================
// EXPORT
// =========================================================

export default ShipmentToolbar;
