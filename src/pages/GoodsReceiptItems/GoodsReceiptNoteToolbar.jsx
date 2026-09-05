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


/* =========================================================
   GOODS RECEIPT NOTE TOOLBAR
========================================================= */

const GoodsReceiptNoteToolbar = ({
    onAdd,
    onRefresh
}) => {

    const handleAdd = () => {

        if (typeof onAdd === "function") {
            onAdd();
        }
    };


    const handleRefresh = () => {

        if (typeof onRefresh === "function") {
            onRefresh();
        }
    };


    return (
        <Box
            className="goods-receipt-note-toolbar"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3
            }}
        >

            {/* =================================================
                ADD GRN
            ================================================= */}

            <Tooltip title="Create New Goods Receipt Note">

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAdd}
                >
                    Add GRN
                </Button>

            </Tooltip>


            {/* =================================================
                REFRESH
            ================================================= */}

            <Tooltip title="Refresh Goods Receipt Notes">

                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                >
                    Refresh
                </Button>

            </Tooltip>

        </Box>
    );
};


export default GoodsReceiptNoteToolbar;
