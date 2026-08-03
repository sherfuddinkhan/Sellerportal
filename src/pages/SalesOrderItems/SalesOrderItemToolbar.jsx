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

const SalesOrderItemToolbar = ({

    onAdd,

    onRefresh

}) => {

    return (

        <Box
            className="sales-order-items-toolbar"
            sx={{

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: 2,

                mb: 3

            }}
        >

            <Tooltip title="Create New Sales Order Item">

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={onAdd}
                >

                    Add Sales Order Item

                </Button>

            </Tooltip>

            <Tooltip title="Reload Sales Order Items">

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

export default SalesOrderItemToolbar;