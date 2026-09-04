import React from "react";

import {
    Box,
    Button,
    Tooltip
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

// =========================================================
// SALES ORDER ITEM TOOLBAR
// =========================================================

const SalesOrderItemToolbar = ({
    onAdd,
    onRefresh
}) => {

    // =====================================================
    // ADD HANDLER
    // =====================================================

    const handleAdd = () => {

        if (onAdd) {

            onAdd();

        }

    };

    // =====================================================
    // REFRESH HANDLER
    // =====================================================

    const handleRefresh = () => {

        if (onRefresh) {

            onRefresh();

        }

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            className="sales-order-items-toolbar"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
                width: "100%"
            }}
        >

            {/* =============================================
                ADD SALES ORDER ITEM
            ============================================= */}

            <Tooltip
                title="Create New Sales Order Item"
            >

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAdd}
                    size="medium"
                >

                    Add Sales Order Item

                </Button>

            </Tooltip>

            {/* =============================================
                REFRESH
            ============================================= */}

            <Tooltip
                title="Reload Sales Order Items"
            >

                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    size="medium"
                >

                    Refresh

                </Button>

            </Tooltip>

        </Box>

    );

};

export default SalesOrderItemToolbar;
