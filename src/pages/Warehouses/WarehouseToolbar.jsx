// =========================================================
// WarehouseToolbar.jsx
// Frontend Only
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
// WarehouseToolbar
// =========================================================

const WarehouseToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {

    return (

        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                mb: 3,
                flexWrap: "wrap",
                gap: 2
            }}
        >

            {/* =============================================
                TITLE
            ============================================= */}

            <Typography
                variant="h5"
                fontWeight="bold"
            >
                Warehouses
            </Typography>


            {/* =============================================
                ACTION BUTTONS
            ============================================= */}

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    flexWrap: "wrap",
                    gap: 1
                }}
            >

                {/* =========================================
                    ADD
                ========================================= */}

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                >
                    Add Warehouse
                </Button>


                {/* =========================================
                    REFRESH
                ========================================= */}

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>


                {/* =========================================
                    EXPORT
                ========================================= */}

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

export default WarehouseToolbar;