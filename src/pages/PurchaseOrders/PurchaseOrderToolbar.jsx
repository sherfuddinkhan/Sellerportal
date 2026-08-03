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

const PurchaseOrderToolbar = ({

    onAdd,

    onRefresh

}) => {

    return (

        <Box
            className="purchase-order-toolbar"
            sx={{

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: 2,

                mb: 3

            }}
        >

            <Tooltip title="Create New Purchase Order">

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={onAdd}
                >

                    Add Purchase Order

                </Button>

            </Tooltip>

            <Tooltip title="Refresh Purchase Orders">

                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >

                    Refresh

                </Button>

            </Tooltip>

        </Box>

    );

};

export default PurchaseOrderToolbar;