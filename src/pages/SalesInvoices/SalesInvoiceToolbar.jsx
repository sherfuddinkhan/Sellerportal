import React from "react";

import {
    Box,
    Button,
    Stack,
    Tooltip
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

const SalesInvoiceToolbar = ({

    onAdd,

    onRefresh

}) => {

    return (

        <Box
            className="sales-invoices-toolbar"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: "wrap",
                gap: 2
            }}
        >

            <Stack
                direction="row"
                spacing={2}
            >

                <Tooltip title="Add Sales Invoice">

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={onAdd}
                    >

                        Add Sales Invoice

                    </Button>

                </Tooltip>

                <Tooltip title="Refresh">

                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                    >

                        Refresh

                    </Button>

                </Tooltip>

            </Stack>

        </Box>

    );

};

export default SalesInvoiceToolbar;