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

const DeliveryChallanItemToolbar = ({
    onAdd,
    onRefresh
}) => {

    return (

        <Box
            className="delivery-challan-item-toolbar"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                mb: 3,
                gap: 2
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
                    Delivery Challan Items
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Manage Delivery Challan Items
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

                <Tooltip title="Add Delivery Challan Item">

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={onAdd}
                    >
                        Add Delivery Challan Item
                    </Button>

                </Tooltip>

            </Stack>

        </Box>

    );

};

export default DeliveryChallanItemToolbar;