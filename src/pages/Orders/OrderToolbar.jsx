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

const OrderToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                mb: 3,
                flexWrap: "wrap",
                gap: 2
            }}
        >
            {/* Title */}
            <Typography
                variant="h5"
                fontWeight="bold"
            >
                Orders
            </Typography>

            {/* Actions */}
            <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
            >
                {/* Add Order */}
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                >
                    Add Order
                </Button>

                {/* Refresh */}
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>

                {/* Export */}
                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Download />}
                    onClick={onExport}
                >
                    Export
                </Button>
            </Stack>
        </Stack>
    );
};

export default OrderToolbar;
