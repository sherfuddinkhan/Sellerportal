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


/* =========================================================
   ORDER STATUS HISTORY TOOLBAR
========================================================= */

const OrderStatusHistoryToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {

    /* =====================================================
       ADD HISTORY
    ===================================================== */

    const handleAdd = () => {

        if (typeof onAdd === "function") {
            onAdd();
        }

    };


    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = () => {

        if (typeof onRefresh === "function") {
            onRefresh();
        }

    };


    /* =====================================================
       EXPORT
    ===================================================== */

    const handleExport = () => {

        if (typeof onExport === "function") {
            onExport();
        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

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

            <Typography
                variant="h5"
                fontWeight="bold"
            >
                Order Status History
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

                sx={{
                    width: {
                        xs: "100%",
                        sm: "auto"
                    }
                }}
            >

                {/* =============================================
                    ADD HISTORY
                ============================================= */}

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAdd}
                    size="small"
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "auto"
                        }
                    }}
                >
                    Add History
                </Button>


                {/* =============================================
                    REFRESH
                ============================================= */}

                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    size="small"
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "auto"
                        }
                    }}
                >
                    Refresh
                </Button>


                {/* =============================================
                    EXPORT
                ============================================= */}

                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Download />}
                    onClick={handleExport}
                    size="small"
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "auto"
                        }
                    }}
                >
                    Export
                </Button>

            </Stack>

        </Stack>
    );
};


export default OrderStatusHistoryToolbar;

