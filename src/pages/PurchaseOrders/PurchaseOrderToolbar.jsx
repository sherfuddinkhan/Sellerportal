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
   PURCHASE ORDER TOOLBAR
========================================================= */

const PurchaseOrderToolbar = ({

    onAdd,

    onRefresh

}) => {


    /* =====================================================
       HANDLE ADD
    ===================================================== */

    const handleAdd = () => {

        if (
            typeof onAdd === "function"
        ) {

            onAdd();

        }

    };


    /* =====================================================
       HANDLE REFRESH
    ===================================================== */

    const handleRefresh = () => {

        if (
            typeof onRefresh === "function"
        ) {

            onRefresh();

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box

            className="purchase-order-toolbar"

            sx={{

                display: "flex",

                justifyContent:
                    "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: 2,

                mb: 3

            }}

        >


            {/* =================================================
               ADD PURCHASE ORDER
            ================================================= */}

            <Tooltip
                title="Create New Purchase Order"
            >

                <Button

                    variant="contained"

                    color="primary"

                    startIcon={<Add />}

                    onClick={handleAdd}

                >

                    Add Purchase Order

                </Button>

            </Tooltip>


            {/* =================================================
               REFRESH
            ================================================= */}

            <Tooltip
                title="Refresh Purchase Orders"
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


export default PurchaseOrderToolbar;
