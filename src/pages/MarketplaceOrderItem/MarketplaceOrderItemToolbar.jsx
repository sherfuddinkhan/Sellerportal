import React from "react";

import {
    Box,
    Button,
    Stack,
    Typography,
    Tooltip
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

const MarketplaceOrderItemToolbar = ({
    onAdd,
    onRefresh
}) => {

    return (

        <Box
            className="marketplace-order-item-toolbar"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3
            }}
        >

            {/* ==========================================================
                Title
            ========================================================== */}

            <Box>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >

                    Marketplace Order Items

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Manage Marketplace Order Items

                </Typography>

            </Box>

            {/* ==========================================================
                Actions
            ========================================================== */}

            <Stack
                direction="row"
                spacing={2}
            >

                <Tooltip title="Refresh">

                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                    >

                        Refresh

                    </Button>

                </Tooltip>

                <Tooltip title="Add Marketplace Order Item">

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={onAdd}
                    >

                        Add Marketplace Order Item

                    </Button>

                </Tooltip>

            </Stack>

        </Box>

    );

};

export default MarketplaceOrderItemToolbar;