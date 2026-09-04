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
    onRefresh,
    loading = false
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
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={2}
                width={{
                    xs: "100%",
                    sm: "auto"
                }}
            >

                {/* Add Sales Invoice */}

                <Tooltip title="Add Sales Invoice">

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={onAdd}
                        disabled={loading}
                        sx={{
                            minWidth: 180
                        }}
                    >
                        Add Sales Invoice
                    </Button>

                </Tooltip>


                {/* Refresh */}

                <Tooltip title="Refresh Sales Invoices">

                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                        disabled={loading}
                        sx={{
                            minWidth: 120
                        }}
                    >
                        Refresh
                    </Button>

                </Tooltip>

            </Stack>

        </Box>

    );
};


export default SalesInvoiceToolbar;