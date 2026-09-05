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
   GOODS RECEIPT NOTE ITEM TOOLBAR
========================================================= */

const GoodsReceiptNoteItemToolbar = ({
    onAdd,
    onRefresh
}) => {


    /* =========================================================
       HANDLE ADD
    ========================================================= */

    const handleAdd = () => {

        if (typeof onAdd === "function") {
            onAdd();
        }
    };


    /* =========================================================
       HANDLE REFRESH
    ========================================================= */

    const handleRefresh = () => {

        if (typeof onRefresh === "function") {
            onRefresh();
        }
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <Box
            className="goods-receipt-note-item-toolbar"
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

            {/* =================================================
                ADD GRN ITEM
            ================================================= */}

            <Tooltip
                title="Create New Goods Receipt Note Item"
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAdd}
                >
                    Add GRN Item
                </Button>
            </Tooltip>


            {/* =================================================
                REFRESH
            ================================================= */}

            <Tooltip
                title="Refresh Goods Receipt Note Items"
            >
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


export default GoodsReceiptNoteItemToolbar;
