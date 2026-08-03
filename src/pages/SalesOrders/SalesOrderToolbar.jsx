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

const SalesOrderToolbar = ({

    onAdd,

    onRefresh

}) => {

    return (

        <Box
            className="sales-orders-toolbar"
            sx={{

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                mb: 3,

                flexWrap: "wrap",

                gap: 2

            }}
        >

            <Tooltip title="Create New Sales Order">

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={onAdd}
                >

                    Add Sales Order

                </Button>

            </Tooltip>

            <Tooltip title="Reload Sales Orders">

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

export default SalesOrderToolbar;